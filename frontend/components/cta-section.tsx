import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function CtaComponent() {
    return (
        <section className="py-16 px-[5rem] bg-purple-500 text-white">
            <div className="container mx-auto text-center">
                <h2 className="text-3xl font-bold mb-4">Ready to grow your business?</h2>
                <p className="text-purple-100 mb-8 max-w-2xl mx-auto">
                    Join thousands of African entrepreneurs reaching new customers every day
                </p>
                <Button variant="secondary" size="lg" asChild>
                    <Link href="/for-business">Get Started Today</Link>
                </Button>
            </div>
        </section>
    )
}