import { Menubar, MenubarMenu, MenubarContent, MenubarItem, MenubarTrigger } from '@/components/ui/menubar'

const AppMenubar = () => {
    return (
        <Menubar>
            <MenubarMenu>
                <MenubarTrigger>File</MenubarTrigger>
                <MenubarContent>
                    <MenubarItem>Import matrix</MenubarItem>
                    <MenubarItem>Export matrix</MenubarItem>
                </MenubarContent>
            </MenubarMenu>
            <MenubarMenu>
                <MenubarTrigger>Settings</MenubarTrigger>
                <MenubarContent>
                    <MenubarItem>Theme</MenubarItem>
                    <MenubarItem>Language</MenubarItem>
                </MenubarContent>
            </MenubarMenu>
        </Menubar>
    )
}

export default AppMenubar