"use client";

import { useState, useTransition } from "react";
import { ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useLocale } from "next-intl";
import { usePathname, useRouter } from "@/navigation";

import { GB, DE, FR, ES, HR, IT } from "country-flag-icons/react/3x2";

const SUPPORTED_LOCALES = ["en", "de", "fr"];

const languages = [
  { code: "en", name: "English", Flag: GB },
  { code: "de", name: "Deutsch", Flag: DE },
  { code: "fr", name: "Français", Flag: FR },
  { code: "es", name: "Spanish", Flag: ES },
  { code: "hr", name: "Croatian", Flag: HR },
  { code: "it", name: "Italian", Flag: IT },
];

export function LanguageSelector() {
  const [isOpen, setIsOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();

  const currentLanguage =
    languages.find((l) => l.code === locale) || languages[0];
  const CurrentFlag = currentLanguage.Flag;

  const handleLanguageSelect = (languageCode: string) => {
    if (!SUPPORTED_LOCALES.includes(languageCode)) return;

    startTransition(() => {
      router.replace(pathname, { locale: languageCode });
      setIsOpen(false);
    });
  };

  return (
    <>
      <Button
        variant="ghost"
        size="sm"
        className="flex items-center gap-2 text-black hover:bg-gray-100 cursor-pointer"
        onClick={() => setIsOpen(true)}
      >
        <CurrentFlag className="w-5 h-auto rounded-[2px] object-cover" />
        <span className="hidden sm:inline text-sm font-medium uppercase">
          {currentLanguage.code}
        </span>
        <ChevronDown className="h-4 w-4 opacity-50" />
      </Button>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="sm:max-w-md bg-white">
          <DialogHeader>
            <DialogTitle>Select Language</DialogTitle>
          </DialogHeader>

          <div className="space-y-2 py-4">
            {languages.map((language) => {
              const isSupported = SUPPORTED_LOCALES.includes(language.code);
              const isSelected = currentLanguage.code === language.code;
              const FlagComponent = language.Flag;

              return (
                <button
                  key={language.code}
                  disabled={!isSupported || isPending}
                  className={`
                    w-full flex items-center gap-3 p-3 rounded-lg text-left transition-all
                    ${
                      isSelected
                        ? "bg-[#D0865A]/10 border border-[#D0865A]/30"
                        : "border border-transparent hover:bg-gray-50"
                    }
                    ${
                      !isSupported
                        ? "opacity-40 cursor-not-allowed grayscale"
                        : "cursor-pointer"
                    }
                  `}
                  onClick={() =>
                    isSupported && handleLanguageSelect(language.code)
                  }
                >
                  <FlagComponent className="w-6 h-auto rounded-[3px] shadow-sm shrink-0" />

                  <div className="flex-1">
                    <div
                      className={`font-medium text-sm ${
                        isSelected ? "text-[#D0865A]" : "text-gray-900"
                      }`}
                    >
                      {language.name}
                    </div>
                    <div className="text-xs text-gray-500 uppercase">
                      {language.code}
                    </div>
                  </div>

                  {isSelected && (
                    <div className="w-2.5 h-2.5 bg-[#D0865A] rounded-full animate-in zoom-in" />
                  )}

                  {!isSupported && (
                    <span className="text-[10px] bg-gray-100 text-gray-500 px-2 py-1 rounded-md border border-gray-200">
                      Coming Soon
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
