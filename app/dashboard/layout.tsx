import SideNavbar from "@/components/SideBar";
import { Manrope } from "next/font/google";

const inter = Manrope({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <div className="flex-row flex">
          <SideNavbar />
          <main className="w-screen bg-gray-100">
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}
