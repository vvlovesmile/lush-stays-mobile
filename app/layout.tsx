import type { Metadata } from "next";
import { Cormorant_Garamond, Jost } from "next/font/google";
import "./globals.css";

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  variable: "--font-cormorant",
  weight: ["400", "500", "600"],
});

const jost = Jost({
  subsets: ["latin"],
  variable: "--font-jost",
  weight: ["300", "400", "500", "600"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://lush-stays.com"),
  title: {
    default: "Lush Stays | 清迈精品旅居",
    template: "%s | Lush Stays",
  },
  description:
    "精选清迈独特旅居空间，适合慢旅行、数字游民与想要住进本地生活的人。",
  openGraph: {
    title: "Lush Stays | 清迈精品旅居",
    description:
      "精选清迈独特旅居空间，适合慢旅行、数字游民与想要住进本地生活的人。",
    url: "https://lush-stays.com",
    siteName: "Lush Stays",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Lush Stays 清迈精品旅居",
      },
    ],
    locale: "zh_CN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Lush Stays | 清迈精品旅居",
    description:
      "精选清迈独特旅居空间，适合慢旅行、数字游民与想要住进本地生活的人。",
    images: ["/og-image.jpg"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN">
      <body className={`${cormorant.variable} ${jost.variable}`}>
        {children}
      </body>
    </html>
  );
}
