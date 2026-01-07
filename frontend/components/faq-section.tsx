"use client";

import { useState } from "react";
import { IoAdd, IoRemove } from "react-icons/io5";

type FAQ = {
  question: string;
  answer: string;
  type: "Customer" | "Braider";
};

const faqsData: FAQ[] = [
  {
    question: "What is AfroBraid Connect?",
    answer:
      "A platform that connects customers with professional braiders, making it easy to browse styles, read reviews, and book appointments.",
    type: "Customer",
  },
  {
    question: "How do I book a braider?",
    answer:
      "Simply browse braiders in your city, choose your style, and book directly through our platform.",
    type: "Customer",
  },
  {
    question: "How do I become a listed braider?",
    answer:
      "Sign up as a braider and complete your profile to start receiving bookings from clients.",
    type: "Braider",
  },
  {
    question: "Is there a fee to join AfroBraid?",
    answer:
      "Joining is free! We only take a small service fee per completed booking.",
    type: "Customer",
  },
  {
    question: "How do I manage my bookings?",
    answer:
      "Use our dashboard to view, accept, or reschedule bookings, and track your earnings.",
    type: "Braider",
  },
  {
    question: "Can I cancel a booking?",
    answer:
      "Yes, but it&rsquo;s best to communicate with the client as early as possible to avoid penalties.",
    type: "Customer",
  },
  {
    question: "What styles can I book?",
    answer:
      "You can search for a variety of braid styles including box braids, cornrows, twists, and more.",
    type: "Customer",
  },
  {
    question: "How do I get paid as a braider?",
    answer:
      "Payments are processed automatically through the platform after a completed booking.",
    type: "Braider",
  },
  {
    question: "Can I manage multiple clients at once?",
    answer:
      "Yes! Our dashboard allows braiders to efficiently manage multiple appointments and schedules.",
    type: "Braider",
  },
  {
    question: "Are there customer reviews?",
    answer:
      "Absolutely! You can read reviews and ratings for each braider before booking.",
    type: "Customer",
  },
  {
    question: "Is my information secure?",
    answer:
      "Yes, we use encryption and secure protocols to protect your personal and payment information.",
    type: "Customer",
  },
  {
    question: "How do I update my profile as a braider?",
    answer:
      "Go to your profile settings and update your availability, pricing, and portfolio images.",
    type: "Braider",
  },
  {
    question: "Can I book more than one braider for the same day?",
    answer:
      "Yes, you can schedule multiple bookings as long as the time slots do not overlap.",
    type: "Customer",
  },
  {
    question: "How are disputes handled between customers and braiders?",
    answer:
      "We mediate disputes through our support team to ensure fair resolution for both parties.",
    type: "Customer",
  },
  {
    question: "Can I offer discounts as a braider?",
    answer:
      "Yes, you can create special promotions or discount codes within your braider dashboard.",
    type: "Braider",
  },
  {
    question: "Do you have customer support?",
    answer:
      "Yes! We provide support via email and live chat to assist both customers and braiders.",
    type: "Customer",
  },
];

export default function FAQsSection() {
  const [selectedTab, setSelectedTab] = useState<
    "All" | "Customer" | "Braider"
  >("All");
  const [openIndexes, setOpenIndexes] = useState<number[]>([]);

  const filteredFAQs =
    selectedTab === "All"
      ? faqsData
      : faqsData.filter((faq) => faq.type === selectedTab);

  const toggleFAQ = (index: number) => {
    if (openIndexes.includes(index)) {
      setOpenIndexes(openIndexes.filter((i) => i !== index));
    } else {
      setOpenIndexes([...openIndexes, index]);
    }
  };

  return (
    <section className="py-20 px-4">
      <div className="max-w-3xl mb-12 text-left ml-0 lg:ml-80">
        <span className="inline-block bg-[#FAF3EF] text-[#D0865A] border border-[#D0865A] font-bold px-6 py-2 rounded-full mb-4">
          FAQs
        </span>
        <h2 className="text-3xl md:text-4xl font-bold mb-2 w-full">
          Got Questions? We&apos;ve Got Answers!
        </h2>
        <p className="text-gray-600 text-lg md:text-xl">
          Find answers to your questions.
        </p>
      </div>

      <div className="max-w-4xl mx-auto flex gap-4 mb-8 ml-0 lg:ml-80">
        {["All", "Customer", "Braider"].map((tab) => (
          <button
            key={tab}
            onClick={() =>
              setSelectedTab(tab as "All" | "Customer" | "Braider")
            }
            className={`px-6 py-2 rounded-full font-semibold transition cursor-pointer ${
              selectedTab === tab
                ? "bg-[#D0865A] text-white"
                : "bg-gray-100 text-gray-800 hover:bg-gray-200"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      <div className="max-w-7xl mx-auto flex flex-col gap-4 ml-0 lg:ml-80">
        {filteredFAQs.map((faq, idx) => (
          <div
            key={idx}
            className="border rounded-xl p-4 bg-white shadow-sm overflow-hidden transition-all duration-300"
          >
            <div
              className="flex justify-between items-center cursor-pointer"
              onClick={() => toggleFAQ(idx)}
            >
              <h3 className="font-semibold text-lg w-full">{faq.question}</h3>
              <span className="text-2xl">
                {openIndexes.includes(idx) ? <IoRemove /> : <IoAdd />}
              </span>
            </div>
            <div
              className={`mt-2 text-gray-600 transition-all duration-300 ${
                openIndexes.includes(idx)
                  ? "max-h-96 opacity-100"
                  : "max-h-0 opacity-0"
              }`}
            >
              <p>{faq.answer}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
