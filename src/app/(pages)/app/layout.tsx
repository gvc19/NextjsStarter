import ContentLayout from "@/components/layout/ContentLayout";


export default function AppLayout({ children }: { children: React.ReactNode }) {
    return (
        <ContentLayout>
            {children}
        </ContentLayout>
    );
}
