import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/layout/Navbar";
import { AuthProvider } from "@/lib/auth-context";
import { UserProvider } from "@/lib/context";

export const metadata: Metadata = {
  title: "AyurGenix — AI-Powered Ayurvedic Health Companion",
  description: "Your personal Ayurvedic mentor powered by AI. Discover your Prakriti, balance your Doshas, and get personalized diet, yoga, and lifestyle recommendations rooted in ancient Ayurvedic wisdom.",
  keywords: "Ayurveda, AI, Health, Prakriti, Dosha, Vata, Pitta, Kapha, Wellness, Yoga, Diet",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800;900&family=Inter:wght@300;400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body style={{ fontFamily: 'Inter, sans-serif' }}>
        <AuthProvider>
          <UserProvider>
            <Navbar />
            <main style={{ position: 'relative', zIndex: 1 }}>
              {children}
            </main>
          </UserProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
