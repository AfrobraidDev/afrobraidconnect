import HeroComponent from "./hero-component";
import { SearchBar } from "./search-bar";

export default function HeroSection() {
    return (
        <section className="relative py-20 px-4 sm:px-6 lg:px-8 bg-[#FAF3EF] dark:bg-[#0a0503]">
            {/* Subtle gradient overlay */}
            <div className="absolute inset-0 overflow-hidden opacity-20 dark:opacity-30">
                <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-purple-400/20 via-transparent to-blue-300/20"></div>
            </div>

            <div className="container mx-auto flex flex-col items-center gap-12 relative z-10">
                <div className="flex flex-col space-y-6 justify-center items-center w-full max-w-4xl">
                    <h1 className="text-4xl md:text-5xl lg:text-6xl font-semibold leading-tight text-center font-changa">
                        Book your next braid style <br></br><span className="mt-2">with ease.</span>
                    </h1>
                    <p className="text-lg md:text-xl text-gray-600 dark:text-gray-300 max-w-2xl text-center line-clamp-2">
                        AfroBraid Connect is the easiest way to find, book and review top-rated braiders in your city. Explore styles you love, and book your next look in just a few clicks.
                    </p>

                    {/* SearchBar Component */}
                    <div className="w-full mt-8">
                        <SearchBar />
                    </div>
                </div>
            </div>
            <div className="w-full mt-8">
                <HeroComponent />
            </div>
        </section>
    )
}