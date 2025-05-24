import { type ReactNode, useEffect } from "react";
import { I18nProvider } from "@lingui/react";
import { i18n } from "@lingui/core";
import { defaultLocale, dynamicActivate } from "@/lib/i18n.ts";
import { ThemeProvider } from "./components/theme-provider";

function RootLayout({ children }: { children: ReactNode }) {
  useEffect(() => {
    dynamicActivate(defaultLocale);
  }, []);
  return (
    <I18nProvider i18n={i18n}>
      <ThemeProvider>{children}</ThemeProvider>
    </I18nProvider>
  );
}

export default RootLayout;
