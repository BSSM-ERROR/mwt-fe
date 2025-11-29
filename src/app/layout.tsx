import type { Metadata } from "next";
import ReactQueryProvider from "@/lib/ReactQueryProvider";
import { theJamsil } from "@/styles/fonts";

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
            <body className={theJamsil.className}>
                <ReactQueryProvider>
                    {children}
                </ReactQueryProvider>
            </body>
        </html>
    );
}
