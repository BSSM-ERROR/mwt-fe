import type { Metadata } from "next";
import ReactQueryProvider from "@/lib/ReactQueryProvider";
import { theJamsil } from "@/styles/fonts";
import GlobalStyles from "@/styles/GlobalStyles";
import LayoutContainer from "@/components/layout/RootLayout";

export const metadata: Metadata = {
    title: "MyWaifuTeacher",
    description: "AI 여자친구와 대화하며 영어를 배워보세요!",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
            <body className={`${theJamsil.variable} ${theJamsil.className}`}>
                <ReactQueryProvider>
                    <GlobalStyles />
                    <LayoutContainer>
                        {children}
                    </LayoutContainer>
                </ReactQueryProvider>
            </body>
        </html>
    );
}
