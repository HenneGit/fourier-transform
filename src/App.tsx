import './App.css'
import {SidebarProvider, SidebarTrigger} from "@/components/ui/sidebar.tsx";
import {MenuBar} from "@/components/menu/MenuBar.tsx";

function App() {

    return (
        <>
            <SidebarProvider>
                <MenuBar />
                <main>
                    <SidebarTrigger />
                </main>
            </SidebarProvider>
        </>
    );
}

export default App
