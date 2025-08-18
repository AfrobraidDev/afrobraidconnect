// app/auth/selection/page.tsx
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export default function AuthSelectionPage() {
  const options = [
    {
      title: "Afro-connect for customers",
      subtitle: "Sign up to book salons and spas near you",
      href: "/auth/signup?user_type=customer",
      icon: <ArrowRight className="h-5 w-5 text-purple-600" />
    },
    {
      title: "Afro-connect for professionals",
      subtitle: "Sign up to manage and grow your business",
      href: "/auth/signup?user_type=braider",
      icon: <ArrowRight className="h-5 w-5 text-purple-600" />
    }
  ]

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Welcome to Afro-connect
          </h1>
          <p className="mt-2 text-lg text-gray-600 dark:text-gray-300">
            Choose your account type to continue
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {options.map((option, index) => (
            <Link
              key={index}
              href={option.href}
              className="group block p-6 bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 hover:border-purple-500 dark:hover:border-purple-500 transition-all duration-200"
            >
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    {option.title}
                  </h3>
                  <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                    {option.subtitle}
                  </p>
                </div>
                <div className="ml-4 group-hover:translate-x-1 transition-transform duration-200">
                  {option.icon}
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}