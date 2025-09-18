import MainHeader from "./MainHeader";
import AppSidebar from "./sidebar";
import {
  SidebarProvider,
  SidebarInset,
} from "@/components/ui/sidebar";

export default function ContentLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="min-h-screen">
            {/* Fixed Header at top */}
            <div className="fixed top-0 left-0 right-0 z-50">
                <MainHeader />
            </div>
            
            {/* Sidebar and Content below header */}
            <div className="pt-8"> {/* pt-8 to account for header height (h-8) */}
                <SidebarProvider>
                    <AppSidebar />
                    <SidebarInset>
                        <main className="flex-1 p-4">
                            {children}
                        </main>
                    </SidebarInset>
                </SidebarProvider>
            </div>
        </div>
    );
}
