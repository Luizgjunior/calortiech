import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Container } from "@/components/ui/Container";
import { Providers } from "@/components/Providers";
import { Sidebar } from "@/components/Sidebar";
import { MobileSidebar } from "@/components/MobileSidebar";
import { FoodBackground } from "@/components/FoodBackground";
import { ThemeClient } from "@/components/ThemeClient";

const geistSans = Geist({
	variable: "--font-geist-sans",
	subsets: ["latin"],
});

const geistMono = Geist_Mono({
	variable: "--font-geist-mono",
	subsets: ["latin"],
});

export const metadata: Metadata = {
	title: "NaLinha",
	description: "Controle de calorias e macros",
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="pt-BR">
			<body className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground`}>
				<Providers>
					<ThemeClient />
					<FoodBackground />
					<div className="flex">
						<Sidebar />
						<main className="flex-1">
							<div className="w-full px-4 md:px-6 py-6">{children}</div>
						</main>
					</div>
					<MobileSidebar />
				</Providers>
			</body>
		</html>
	);
}
