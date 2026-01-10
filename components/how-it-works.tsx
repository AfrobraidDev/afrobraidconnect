// app/components/HowItWorksSection.tsx
"use client";

import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";

type StepCardProps = {
    title: string;
    description: string;
};

const StepCard: React.FC<StepCardProps> = ({ title, description }) => {
    return (
        <Card className="flex flex-col overflow-hidden p-0 w-[380px] h-[531px]"> {/* fixed width and height */}
            {/* Image area */}
            <div className="w-full h-90 bg-gray-200"></div>

            {/* Text area */}
            <div className="flex-1 bg-white p-6 flex flex-col justify-center">
                <h3 className="text-2xl md:text-3xl font-semibold mb-3">{title}</h3>
                <p className="text-gray-700 text-base md:text-lg">{description}</p>
            </div>
        </Card>
    );
};

const HowItWorksSection = () => {
    return (
        <section className="bg-[#170D07] py-20 px-4">
            <div className="max-w-3xl mx-auto text-center mb-12">
                <Link href="/how-it-works">
                    <Badge className="mb-4 px-6 py-3 text-lg md:text-xl bg-white text-black font-bold rounded-full">
                        How it works
                    </Badge>
                </Link>
                <h2 className="text-3xl md:text-4xl font-bold text-white">
                    3 steps on how to get connected with a braider on AfroBraids
                </h2>
            </div>

            <div className="max-w-6xl mx-auto flex flex-wrap lg:flex-nowrap justify-center gap-8 mb-12">
                {/* changed grid to flex for fixed width */}
                <StepCard
                    title="Browse Braiders"
                    description="Search for braiders in your city. Use our filters to find the perfect style, price range, or star rating."
                />
                <StepCard
                    title="Book Appointment"
                    description="Select a date and time, and confirm your appointment with the braider you like."
                />
                <StepCard
                    title="Connect"
                    description="Communicate directly with the braider to discuss your style, ask questions, and finalize details."
                />
            </div>

            {/* Centered button below cards */}

            <div className="text-center">
                <Link href="/braiders">
                    <button className="bg-[#D0865A] text-white font-bold py-4 px-8 rounded-full text-lg hover:opacity-90 transition cursor-pointer">
                        Find a Braider
                    </button>
                </Link>
            </div>
        </section>
    );
};

export default HowItWorksSection;
