import type {Metadata} from "next";
import {Inter, Space_Grotesk} from "next/font/google";
import "./globals.css";
import {ClerkProvider} from "@clerk/nextjs";
import {ThemeProvider} from "@/context/ThemeProvider";


const inter = Inter({
    subsets: ["latin"],
    weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
    variable: "--font-inter"
});
const spaceGrotesk = Space_Grotesk({
    subsets: ["latin"],
    weight: ["300", "400", "500", "600", "700"],
    variable: "--font-spaceGrotesk"
});

export const metadata: Metadata = {
    title: "DevFlow",
    description: "A community for developers to share their knowledge and experiences.",
    icons: {
        icon: "/assets/images/site-logo.svg",
    }
};

export default function RootLayout({
                                       children,
                                   }: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <ClerkProvider
            appearance={{
                elements: {
                    formButtonPrimary: 'primary-gradient',
                    footerActionLink: 'primary-text-gradient hover:text-primary-500',
                }
            }}>
            <ThemeProvider>
                <html lang="en">
                <body className={`${inter.className} `}>
                {children}
                </body>
                </html>
            </ThemeProvider>
        </ClerkProvider>
    );
}
