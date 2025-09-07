'use client';
import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

// Import flag-icons CSS
import 'flag-icons/css/flag-icons.min.css';

const languages = [
  { code: 'de', name: 'German', flagCode: 'de' },
  { code: 'en', name: 'English', flagCode: 'gb' }, // Note: 'gb' for UK flag
  { code: 'fr', name: 'French', flagCode: 'fr' },
  { code: 'es', name: 'Spanish', flagCode: 'es' },
  { code: 'hr', name: 'Croatian', flagCode: 'hr' },
];

export function LanguageSelector() {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState(languages[0]);

  const handleLanguageSelect = (language: typeof languages[0]) => {
    setSelectedLanguage(language);
    setIsOpen(false);
    // Here you would typically update the app's language context
    console.log(`Language changed to: ${language.name}`);
  };

  return (
    <>
      <Button
        variant="ghost"
        size="sm"
        className="flex items-center gap-2 text-black hover:bg-gray-100 cursor-pointer"
        onClick={() => setIsOpen(true)}
      >
        <span 
          className={`fi fi-${selectedLanguage.flagCode} w-5 h-4 rounded-sm`}
          style={{ 
            backgroundSize: 'cover',
            display: 'inline-block'
          }}
        />
        <span className="hidden sm:inline text-sm font-medium">
          {selectedLanguage.code.toUpperCase()}
        </span>
        <ChevronDown className="h-4 w-4 opacity-50" />
      </Button>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Select Language</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-2 py-4">
            {languages.map((language) => (
              <button
                key={language.code}
                className={`w-full flex items-center gap-3 p-3 rounded-lg text-left hover:bg-gray-100 transition-colors cursor-pointer ${
                  selectedLanguage.code === language.code ? 'bg-[#D0865A]/50 border border-[#D0865A]/200' : ''
                }`}
                onClick={() => handleLanguageSelect(language)}
              >
                <span 
                  className={`fi fi-${language.flagCode} w-6 h-4.5 rounded-sm`}
                  style={{ 
                    backgroundSize: 'cover',
                    display: 'inline-block'
                  }}
                />
                <div className="flex-1">
                  <div className="font-medium text-sm">{language.name}</div>
                  <div className="text-xs text-gray-500">{language.code.toUpperCase()}</div>
                </div>
                {selectedLanguage.code === language.code && (
                  <div className="w-2 h-2 bg-[#D0865A] rounded-full" />
                )}
              </button>
            ))}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}