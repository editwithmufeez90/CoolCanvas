import NextTopLoader from 'nextjs-toploader';
import { Providers } from "@/components/Providers";
import { Header } from "@/components/Header";
import { CartDrawer } from "@/components/CartDrawer";
import "./globals.css";

export const metadata = {
  title: "The Cool Canvas | Premium Streetwear",
  description: "Ultra-fast custom streetwear e-commerce storefront.",
  icons: {
    icon: '/images/logo.png',
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="antialiased text-gray-900 bg-white">
        <NextTopLoader 
          color="#000000"
          initialPosition={0.08}
          crawlSpeed={200}
          height={3}
          crawl={true}
          showSpinner={false}
          easing="ease"
          speed={200}
          shadow="0 0 10px #000000,0 0 5px #000000"
        />
        <Providers>
          <Header />
          <main className="min-h-screen">
            {children}
          </main>
          <CartDrawer />
        </Providers>
      </body>
    </html>
  );
}
