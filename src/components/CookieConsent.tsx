"use client";

import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";

const CookieConsent = () => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem("cookieConsent");
    if (!consent) {
      setVisible(true);
    }
  }, []);

  const acceptAll = () => {
    localStorage.setItem("cookieConsent", "all");
    setVisible(false);
  };

  const acceptEssential = () => {
    localStorage.setItem("cookieConsent", "essential");
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div className="fixed bottom-0 left-0 w-full bg-white shadow-lg border-t border-gray-200 p-4 z-50">
      <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
        <p className="text-sm text-gray-700 text-center sm:text-left">
          Utilitzem cookies pròpies i de tercers per millorar l’experiència de navegació.
          Pots acceptar totes les cookies o només les essencials.{" "}

          <a href="/politica_de_cookies" className="underline text-red-500">
            Més informació
          </a>
        </p>
        <div className="flex space-x-2">
          <Button
            onClick={acceptEssential}
            variant="outline"
            className="rounded-full px-4 py-2 text-sm"
          >
            Només essencials
          </Button>
          <Button
            onClick={acceptAll}
            className="rounded-full px-4 py-2 text-sm bg-red-500 hover:bg-red-600 text-white"
          >
            Acceptar totes
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CookieConsent;
