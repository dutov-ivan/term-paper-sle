import {
  Menubar,
  MenubarMenu,
  MenubarContent,
  MenubarItem,
  MenubarTrigger,
} from "@/components/ui/menubar";
import { type Theme } from "@/components/theme-provider.tsx";
import { useTheme } from "@/hooks/use-theme";
import ImportDialog from "./uploads/import-dialog";
import { useModeStore } from "@/store/mode";
import { useState } from "react";
import { cn } from "@/lib/utils";
import ExportDialog from "./uploads/export-dialog";

type Themes = {
  label: string;
  value: Theme;
}[];

const AppMenubar = () => {
  const setAppMode = useModeStore((state) => state.setMode);
  const { theme, setTheme } = useTheme();
  const themes: Themes = [
    {
      label: "System",
      value: "system",
    },
    {
      label: "Light",
      value: "light",
    },
    {
      label: "Dark",
      value: "dark",
    },
  ];
  const [importOpen, setImportOpen] = useState(false);
  const [exportOpen, setExportOpen] = useState(false);

  return (
    <>
      <Menubar>
        <MenubarMenu>
          <MenubarTrigger>File</MenubarTrigger>
          <MenubarContent>
            <MenubarItem onClick={() => setImportOpen(true)}>
              Import Matrix
            </MenubarItem>
            <MenubarItem onClick={() => setExportOpen(true)}>
              Export matrix
            </MenubarItem>
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
                  className={cn(
                    "w-2 h-2 rounded-full",
                    value === theme && "bg-black dark:bg-white"
                  )}
                />
                {label}
              </MenubarItem>
            ))}
          </MenubarContent>
        </MenubarMenu>
        <MenubarMenu>
          <MenubarTrigger>Mode</MenubarTrigger>
          <MenubarContent>
            <MenubarItem onSelect={() => setAppMode("solution")}>
              Solution
            </MenubarItem>
            <MenubarItem onSelect={() => setAppMode("charts")}>
              Charts
            </MenubarItem>
          </MenubarContent>
        </MenubarMenu>
      </Menubar>
      <ImportDialog open={importOpen} setOpen={setImportOpen} />
      <ExportDialog open={exportOpen} setIsOpen={setExportOpen} />
    </>
  );
};

export default AppMenubar;
