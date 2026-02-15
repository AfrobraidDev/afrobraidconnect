"use client";

import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import {
  useInfiniteQuery,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import { apiController } from "@/lib/apiController";

export interface ChatMessage {
  id: string | number;
  content: string;
  sender_name: string;
  sender_id?: string;
  timestamp: string;
  is_me: boolean;
  is_read: boolean;
  is_sending?: boolean;
}

export interface ChatHistoryResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: ChatMessage[];
}

export interface ChatHistoryAPIResponse extends Partial<ChatHistoryResponse> {
  status?: string;
  message?: string;
  data?: ChatHistoryResponse;
}

const getWebSocketUrl = (
  endpoint: string,
  params: Record<string, string> = {},
) => {
  const apiBase = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
  try {
    const url = new URL(apiBase);
    const protocol = url.protocol === "https:" ? "wss:" : "ws:";
    const host = url.host;
    const queryString = new URLSearchParams(params).toString();
    return `${protocol}//${host}${endpoint}?${queryString}`;
  } catch {
    let cleanHost = apiBase.replace(/^https?:\/\//, "");
    cleanHost = cleanHost.replace(/\/api\/?$/, "");
    const protocol = apiBase.startsWith("https") ? "wss:" : "ws:";
    const queryString = new URLSearchParams(params).toString();
    return `${protocol}//${cleanHost}${endpoint}?${queryString}`;
  }
};

export const useChat = (
  bookingId: string | null,
  token?: string,
  currentUserId?: string,
) => {
  const [socketMessages, setSocketMessages] = useState<ChatMessage[]>([]);
  const [isConnected, setIsConnected] = useState(false);
  const socketRef = useRef<WebSocket | null>(null);
  const queryClient = useQueryClient();

  const userIdRef = useRef(currentUserId);
  useEffect(() => {
    userIdRef.current = currentUserId;
  }, [currentUserId]);

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading: isHistoryLoading,
  } = useInfiniteQuery({
    queryKey: ["chatHistory", bookingId],
    initialPageParam: 1,
    queryFn: async ({ pageParam = 1 }) => {
      if (!token) throw new Error("No token provided");

      const res = await apiController<ChatHistoryAPIResponse>({
        method: "GET",
        url: `/chat/history/${bookingId}/`,
        params: { page: pageParam },
        requiresAuth: true,
        token: token,
      });

      if (res.data && res.data.results) {
        return res.data;
      }

      return res as ChatHistoryResponse;
    },
    getNextPageParam: (lastPage: ChatHistoryResponse) => {
      if (!lastPage?.next) return undefined;
      const url = new URL(lastPage.next);
      return Number(url.searchParams.get("page"));
    },
    enabled: !!bookingId && !!token,
    refetchOnWindowFocus: false,
  });

  const messages = useMemo(() => {
    const historyPages = data?.pages?.flatMap((page) => page.results) || [];
    const historyChronological = [...historyPages].reverse();
    const combined = [...historyChronological, ...socketMessages];

    const uniqueMap = new Map<string | number, ChatMessage>();
    combined.forEach((msg) => {
      uniqueMap.set(msg.id, msg);
    });

    return Array.from(uniqueMap.values());
  }, [data, socketMessages]);

  const markReadMutation = useMutation({
    mutationFn: async () => {
      if (!token) throw new Error("No token provided");
      return apiController({
        method: "POST",
        url: `/chat/mark-read/${bookingId}/`,
        requiresAuth: true,
        token: token,
      });
    },
  });

  useEffect(() => {
    if (!bookingId || !token) return;

    let isActive = true;
    let reconnectTimer: NodeJS.Timeout;

    const connect = () => {
      const wsUrl = getWebSocketUrl(`/ws/chat/${bookingId}/`, { token });
      const socket = new WebSocket(wsUrl);
      socketRef.current = socket;

      socket.onopen = () => {
        if (isActive) setIsConnected(true);
      };

      socket.onmessage = (event) => {
        if (!isActive) return;
        try {
          const data = JSON.parse(event.data);

          if (data.type === "read_receipt") {
            if (String(data.reader_id) !== String(userIdRef.current)) {
              setSocketMessages((prev) =>
                prev.map((msg) =>
                  msg.is_me ? { ...msg, is_read: true } : msg,
                ),
              );
              queryClient.invalidateQueries({
                queryKey: ["chatHistory", bookingId],
              });
            }
            return;
          }

          if (
            userIdRef.current &&
            String(data.sender_id) === String(userIdRef.current)
          ) {
            return;
          }

          const newMessage: ChatMessage = {
            id: data.id || Date.now(),
            content: data.message,
            sender_name: data.sender_name,
            sender_id: data.sender_id,
            timestamp: new Date().toISOString(),
            is_me: false,
            is_read: false,
          };

          setSocketMessages((prev) => [...prev, newMessage]);
        } catch (e) {
          console.error("WS Parse Error", e);
        }
      };

      socket.onclose = () => {
        if (isActive) {
          setIsConnected(false);
          reconnectTimer = setTimeout(connect, 3000);
        }
      };
    };

    connect();

    return () => {
      isActive = false;
      clearTimeout(reconnectTimer);
      if (socketRef.current) {
        socketRef.current.close();
      }
    };
  }, [bookingId, token, queryClient]);

  const sendMessage = useCallback((content: string) => {
    if (socketRef.current && socketRef.current.readyState === WebSocket.OPEN) {
      socketRef.current.send(JSON.stringify({ message: content }));

      const optimisticMsg: ChatMessage = {
        id: Date.now(),
        content: content,
        sender_name: "Me",
        timestamp: new Date().toISOString(),
        is_me: true,
        is_sending: true,
        is_read: false,
      };
      setSocketMessages((prev) => [...prev, optimisticMsg]);
    }
  }, []);

  return {
    messages,
    isLoading: isHistoryLoading,
    isConnected,
    sendMessage,
    markAsRead: markReadMutation.mutate,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  };
};
