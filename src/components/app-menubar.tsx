import {
  Menubar,
  MenubarMenu,
  MenubarContent,
  MenubarItem,
  MenubarTrigger,
  MenubarSub,
  MenubarSubContent,
  MenubarSubTrigger,
} from "@/components/ui/menubar";
import { type Theme, useTheme } from "@/components/theme-provider.tsx";
import { dynamicActivate, locales } from "@/lib/i18n.ts";
import { useEffect, useState } from "react";
import { useLingui } from "@lingui/react/macro";
import MatrixLoadingDialog from "./matrix-upload-dialog";
import { useImportModals } from "@/store/importModals";

type Themes = {
  label: string;
  value: Theme;
}[];

const AppMenubar = () => {
  const importModal = useImportModals((state) => state.openedModal);
  const setImportModal = useImportModals((state) => state.setModal);
  const { theme, setTheme } = useTheme();
  const { t } = useLingui();
  const themes: Themes = [
    {
      label: t({
        id: "theme.system",
        message: "System",
      }),
      value: "system",
    },
    {
      label: t({
        id: "theme.light",
        message: "Light",
      }),
      value: "light",
    },
    {
      label: t({
        id: "theme.dark",
        message: "Dark",
      }),
      value: "dark",
    },
  ];

  const [language, setLanguage] = useState<string>("en");

  useEffect(() => {
    console.log(language);
    dynamicActivate(language);
  }, [language]);

  return (
    <>
      <Menubar>
        <MenubarMenu>
          <MenubarTrigger>File</MenubarTrigger>
          <MenubarContent>
            <MenubarSub>
              <MenubarSubTrigger>Import</MenubarSubTrigger>
              <MenubarSubContent>
                <MenubarItem onSelect={() => setImportModal("CSV")}>
                  CSV
                </MenubarItem>
                <MenubarItem onSelect={() => setImportModal("Excel")}>
                  Excel
                </MenubarItem>
                <MenubarItem onSelect={() => setImportModal("JSON")}>
                  JSON
                </MenubarItem>
                <MenubarItem onSelect={() => setImportModal("TXT")}>
                  TXT
                </MenubarItem>
              </MenubarSubContent>
            </MenubarSub>
            <MenubarItem>Export matrix</MenubarItem>
          </MenubarContent>
        </MenubarMenu>
        <MenubarMenu>
          <MenubarTrigger>Theme</MenubarTrigger>
          <MenubarContent>
            {themes.map(({ label, value }) => (
              <MenubarItem
                key={value}
                onSelect={() => setTheme(value)}
                className="flex items-center gap-2"
              >
                <span
                  className="w-2 h-2 rounded-full dark:bg-white"
                  style={{
                    backgroundColor: theme === value ? "black" : "transparent",
                  }}
                />
                {label}
              </MenubarItem>
            ))}
          </MenubarContent>
        </MenubarMenu>
        <MenubarMenu>
          <MenubarTrigger>Language</MenubarTrigger>
          <MenubarContent>
            {Object.entries(locales).map(([key, value]) => (
              <MenubarItem key={key} onSelect={() => setLanguage(key)}>
                {value}
              </MenubarItem>
            ))}
          </MenubarContent>
        </MenubarMenu>
      </Menubar>
      {importModal && <MatrixLoadingDialog type={importModal} />}
    </>
  );
};

export default AppMenubar;
