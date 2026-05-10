import Navbar from "@/_components/navbar";

import './styles/globals.scss';
import { NextIntlClientProvider } from 'next-intl';
import Footer from "@/_components/footer";
import { Toaster } from 'sonner';
import { CartProvider } from "@/context/CartContext";
import { fetchCategories } from "@/utils/categories"; // adjust path
import { site_details } from "@/config";
import { CheckoutProvider } from "@/context/CheckoutContext";
import { getMessages } from 'next-intl/server';
interface SiteSettings
{
cname:string,
cvalue:string


}
export const metadata = {
  title: {
    default: "Appoint",
  
  },
  description: "Schedule appointments",
};
export default async function RootLayout({
  children
}) {
  const categories = await fetchCategories();
  let settings:SiteSettings[]=[];
  const messages = await getMessages();

const res = await fetch(site_details.curl + "config/settings", {
     next:{  revalidate:60} // always fresh
      });
       if (res.ok) {
        console.log("res found in config/settings");
        settings=await res.json();
       }
       else
       {
console.log("nothing found in config settings");

       }
  return (
    <html lang="en">
      <body>
        <NextIntlClientProvider messages={messages}>
        <CartProvider>
          <CheckoutProvider>
        <Navbar categories={categories} ssettings={settings} />
         <Toaster richColors position="top-right" />
        <main className="p-4">{children}</main>
        <Footer />
        </CheckoutProvider>
        </CartProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
