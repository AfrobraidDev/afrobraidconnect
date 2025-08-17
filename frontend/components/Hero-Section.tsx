import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function HeroSection() {
    return (
        <section className="relative py-32 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-purple-50 via-blue-50 to-purple-100 dark:from-purple-900/20 dark:via-blue-900/10 dark:to-purple-900/30">
            {/* Subtle gradient overlay */}
            <div className="absolute inset-0 overflow-hidden opacity-20 dark:opacity-30">
                <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-purple-400/20 via-transparent to-blue-300/20"></div>
            </div>

            <div className="container mx-auto flex flex-col md:flex-row items-center gap-12 relative z-10">
                <div className="flex-1 space-y-6">
                    <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
                        Connect with African <span className="text-purple-600 dark:text-purple-400">Businesses</span> Near You
                    </h1>
                    <p className="text-lg md:text-xl text-gray-600 dark:text-gray-300 max-w-2xl">
                        Discover and support local entrepreneurs across the continent
                    </p>
                    <div className="flex flex-wrap gap-4">
                        <Button asChild className="bg-purple-600 hover:bg-purple-700 text-white">
                            <Link
                                href="/search"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center"
                            >
                                Explore Businesses
                                {/* Optional: Add an external link icon */}
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="h-4 w-4 ml-1"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                                    />
                                </svg>
                            </Link>
                        </Button>
                        <Button variant="outline" asChild className="border-purple-300 dark:border-purple-700">
                            <Link href="/for-business">
                                List Your Business
                            </Link>
                        </Button>
                    </div>
                </div>
                <div className="flex-1">
                    <div className="relative rounded-xl overflow-hidden aspect-video w-full max-w-2xl mx-auto border border-purple-200/50 dark:border-purple-900/50 shadow-lg">
                        <div className="absolute inset-0 bg-gradient-to-tr from-purple-500/10 to-blue-400/10"></div>
                        <div className="absolute inset-0 flex items-center justify-center">
                            <div className="text-center p-8">
                                <div className="inline-block p-6 rounded-full bg-purple-100/30 dark:bg-purple-900/30 backdrop-blur-sm">
                                    <svg
                                        className="w-20 h-20 text-purple-600 dark:text-purple-400"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth="2"
                                            d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9"
                                        ></path>
                                    </svg>
                                </div>
                                <p className="mt-4 text-lg text-purple-800 dark:text-purple-200 font-medium">
                                    African Business Network
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}