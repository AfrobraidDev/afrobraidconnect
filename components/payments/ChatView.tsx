"use client";

import React, { useState, useEffect, useRef, useLayoutEffect } from "react";
import { useSession } from "next-auth/react";
import {
  Send,
  Loader2,
  CheckCheck,
  X,
  Minus,
  MessageCircle,
} from "lucide-react";
import { format } from "date-fns";
import { useChat } from "./useChat";

interface ChatViewProps {
  bookingId: string;
  braiderName?: string;
  onClose: () => void;
}

const getInitials = (name: string) =>
  name
    ? name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .substring(0, 2)
        .toUpperCase()
    : "??";

export default function ChatView({
  bookingId,
  braiderName = "Braider",
  onClose,
}: ChatViewProps) {
  const { data: session } = useSession();

  const bottomRef = useRef<HTMLDivElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const topObserverRef = useRef<HTMLDivElement>(null);

  const [isMinimized, setIsMinimized] = useState(false);
  const [input, setInput] = useState("");
  const [isMobile, setIsMobile] = useState(false);

  const {
    messages,
    isLoading,
    isConnected,
    sendMessage,
    markAsRead,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useChat(bookingId, session?.accessToken, session?.user?.id);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const previousMessagesLength = useRef(messages.length);

  useLayoutEffect(() => {
    const container = scrollContainerRef.current;
    if (!container) return;

    const isNewMessage = messages.length > previousMessagesLength.current;

    if (
      (isNewMessage && !isFetchingNextPage) ||
      (messages.length > 0 && previousMessagesLength.current === 0)
    ) {
      if (!isMinimized) {
        bottomRef.current?.scrollIntoView({ behavior: "auto" });
      }
    }

    previousMessagesLength.current = messages.length;
  }, [messages, isMinimized, isFetchingNextPage]);

  const previousScrollHeight = useRef(0);

  useEffect(() => {
    if (isFetchingNextPage && scrollContainerRef.current) {
      previousScrollHeight.current = scrollContainerRef.current.scrollHeight;
    }
  }, [isFetchingNextPage]);

  useLayoutEffect(() => {
    if (
      !isFetchingNextPage &&
      previousScrollHeight.current > 0 &&
      scrollContainerRef.current
    ) {
      const newScrollHeight = scrollContainerRef.current.scrollHeight;
      const diff = newScrollHeight - previousScrollHeight.current;

      if (diff > 0) {
        scrollContainerRef.current.scrollTop += diff;
        previousScrollHeight.current = 0;
      }
    }
  }, [messages, isFetchingNextPage]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasNextPage && !isFetchingNextPage) {
          fetchNextPage();
        }
      },
      { threshold: 0.5 },
    );

    const currentTopObserver = topObserverRef.current;

    if (currentTopObserver) {
      observer.observe(currentTopObserver);
    }

    return () => {
      if (currentTopObserver) {
        observer.unobserve(currentTopObserver);
      }
    };
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  useEffect(() => {
    if (!messages.length || !isConnected || isMinimized) return;
    const lastMessage = messages[messages.length - 1];
    if (!lastMessage.is_me) markAsRead();
  }, [messages, isConnected, markAsRead, isMinimized]);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || !isConnected) return;
    sendMessage(input);
    setInput("");
  };

  if (isMinimized) {
    return (
      <button
        onClick={() => setIsMinimized(false)}
        className="fixed bottom-6 right-6 z-[9999] p-4 bg-[#b5734c] hover:bg-[#a06543] text-white rounded-full shadow-2xl transition-all transform hover:scale-110 active:scale-95 flex items-center justify-center group animate-in zoom-in duration-200"
      >
        <span className="absolute -top-1 -right-1 flex h-4 w-4">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-4 w-4 bg-green-500 border-2 border-white"></span>
        </span>
        <MessageCircle size={28} />
        <div className="absolute right-full mr-3 top-1/2 -translate-y-1/2 bg-gray-900 text-white text-xs py-1.5 px-3 rounded shadow-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
          Chat with {braiderName}
          <div className="absolute top-1/2 -right-1 -translate-y-1/2 border-8 border-transparent border-l-gray-900"></div>
        </div>
        <div
          onClick={(e) => {
            e.stopPropagation();
            onClose();
          }}
          className="absolute -top-2 -left-2 bg-gray-200 text-gray-600 rounded-full p-1 hover:bg-red-500 hover:text-white transition-colors"
          title="Close Chat"
        >
          <X size={12} />
        </div>
      </button>
    );
  }

  return (
    <div
      className={`
        fixed z-[9999] transition-all duration-300 ease-in-out shadow-2xl overflow-hidden bg-white font-sans flex flex-col
        ${
          isMobile
            ? "inset-0 rounded-none"
            : "bottom-0 right-16 w-80 h-[500px] rounded-t-xl border border-gray-200"
        }
        animate-in slide-in-from-bottom-10
      `}
    >
      <div
        className={`
          flex justify-between items-center px-3 py-2 cursor-pointer select-none shadow-sm relative shrink-0
          ${
            isMobile
              ? "bg-white border-b border-gray-100 pt-safe-top"
              : "bg-[#b5734c]"
          }
        `}
        onClick={() => !isMobile && setIsMinimized(true)}
      >
        <div className="flex items-center gap-2.5 overflow-hidden">
          <div className="relative shrink-0">
            <div
              className={`flex items-center justify-center w-9 h-9 rounded-full shadow-inner font-bold text-sm ${
                isMobile
                  ? "bg-orange-50 text-[#b5734c]"
                  : "bg-white text-[#b5734c]"
              }`}
            >
              {getInitials(braiderName)}
            </div>
            <span
              className={`absolute bottom-0 right-0 block h-2.5 w-2.5 rounded-full ring-2 ring-white ${
                isConnected ? "bg-green-500" : "bg-gray-400"
              }`}
            />
          </div>
          <div className="min-w-0">
            <h3
              className={`font-bold text-sm leading-tight truncate ${
                isMobile ? "text-gray-900" : "text-white"
              }`}
            >
              {braiderName}
            </h3>
            <p
              className={`text-[11px] truncate ${
                isMobile ? "text-gray-500" : "text-white/90"
              }`}
            >
              {isLoading
                ? "Loading..."
                : isConnected
                  ? "Active now"
                  : "Connecting..."}
            </p>
          </div>
        </div>

        <div
          className="flex items-center gap-1 shrink-0"
          onClick={(e) => e.stopPropagation()}
        >
          {!isMobile && (
            <button
              onClick={() => setIsMinimized(true)}
              className="p-1.5 rounded-full hover:bg-white/20 text-white transition-colors focus:outline-none"
              title="Minimize"
            >
              <Minus size={18} />
            </button>
          )}
          <button
            onClick={onClose}
            className={`p-1.5 rounded-full transition-colors focus:outline-none ${
              isMobile
                ? "text-gray-400 hover:bg-gray-100"
                : "text-white hover:bg-white/20"
            }`}
            title="Close Chat"
          >
            <X size={20} />
          </button>
        </div>
      </div>

      <div className="flex flex-col flex-1 min-h-0 bg-white">
        <div
          ref={scrollContainerRef}
          className="flex-1 overflow-y-auto p-3 space-y-3 bg-[#f0f2f5] scrollbar-thin scrollbar-thumb-gray-300"
        >
          <div
            ref={topObserverRef}
            className="h-4 flex items-center justify-center w-full"
          >
            {isFetchingNextPage && (
              <Loader2 className="w-4 h-4 animate-spin text-gray-400" />
            )}
          </div>

          {isLoading ? (
            <div className="h-full flex flex-col items-center justify-center text-gray-400 space-y-2">
              <Loader2 className="w-6 h-6 animate-spin text-[#b5734c]" />
              <span className="text-xs font-medium">Loading history...</span>
            </div>
          ) : (
            <>
              {messages.map((msg, index) => {
                const showDate =
                  index === 0 ||
                  new Date(msg.timestamp).toDateString() !==
                    new Date(messages[index - 1].timestamp).toDateString();

                return (
                  <React.Fragment key={msg.id || index}>
                    {showDate && (
                      <div className="text-center my-4">
                        <span className="text-[10px] font-medium text-gray-500 bg-gray-200 px-2 py-1 rounded-full">
                          {format(new Date(msg.timestamp), "MMM d, yyyy")}
                        </span>
                      </div>
                    )}
                    <div
                      className={`flex w-full ${
                        msg.is_me ? "justify-end" : "justify-start"
                      }`}
                    >
                      <div
                        className={`flex flex-col max-w-[75%] ${
                          msg.is_me ? "items-end" : "items-start"
                        }`}
                      >
                        <div
                          className={`px-3 py-2 text-[14px] shadow-sm relative group break-words ${
                            msg.is_me
                              ? "bg-[#b5734c] text-white rounded-2xl rounded-tr-sm"
                              : "bg-white text-gray-900 border border-gray-200 rounded-2xl rounded-tl-sm"
                          }`}
                        >
                          {msg.content}
                        </div>
                        <div className="flex items-center gap-1 mt-0.5 px-1">
                          <span className="text-[9px] text-gray-400">
                            {msg.timestamp
                              ? format(new Date(msg.timestamp), "h:mm a")
                              : ""}
                          </span>
                          {msg.is_me && (
                            <span
                              className={
                                msg.is_read ? "text-blue-500" : "text-gray-300"
                              }
                            >
                              <CheckCheck size={12} />
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </React.Fragment>
                );
              })}
              <div ref={bottomRef} />
            </>
          )}
        </div>

        <div
          className={`p-2 bg-white border-t border-gray-100 ${
            isMobile ? "pb-safe-bottom" : ""
          }`}
        >
          <form
            onSubmit={handleSend}
            className="flex items-end gap-1.5 bg-gray-100 p-1.5 rounded-[20px] focus-within:ring-2 focus-within:ring-[#b5734c]/20 transition-all"
          >
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Message your braider..."
              disabled={!isConnected}
              className="flex-1 bg-transparent border-none focus:border-none focus:outline-none focus:ring-0 text-sm py-2 px-1 placeholder:text-gray-500 min-w-0"
            />
            <button
              type="submit"
              disabled={!input.trim() || !isConnected}
              className={`p-2 rounded-full transition-all duration-200 flex items-center justify-center ${
                input.trim()
                  ? "text-[#b5734c] hover:bg-gray-200"
                  : "text-gray-300 cursor-not-allowed"
              }`}
            >
              <Send size={20} className={input.trim() ? "ml-0.5" : ""} />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
