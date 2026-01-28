'use client';
import { useTranslation } from 'next-i18next';
import { useEffect, useState } from 'react';
import Link from "next/link";
import { generateUUID, site_details } from "@/config";
import { CartSheet } from "@/_components/cartsheet"

import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import { useCart } from '@/context/CartContext';
import { fetchCart } from '@/utils/cartf';

interface Category {
  name: string;
  slug: string;
  id: number;
}

interface NavbarProps {
  categories: Category[];
  error?: string;
}
type SocialConfig = {
  cname: string;
  cvalue: string;
};
export default function Navbar({ categories, error }: NavbarProps) {
  const { t } = useTranslation('common');
const { CartCount, setCartCount,setItems } = useCart();
   const [logo, setLogo] = useState<{ cname: string; cvalue: string }>();
    useEffect(() => {
    
    async function fetchSocial() {
      const res = await fetch(site_details.curl + "config/settings", {
        cache: "no-store", // always fresh
      });
      if (res.ok) {
        let social:SocialConfig[]=await res.json();
        const logo = social.find(obj => obj.cname === "logo");
        setLogo(logo);
      }
    }
   fetchSocial();
  }, []); // ✅ run once on mount
useEffect(() => {
    fetchCart().then(({ count ,items}) => {
      if (count >= 0) { setCartCount(count); setItems(items);}
    
      
    });
  }, [setCartCount]);

  return (
    <div className="flex justify-between p-2 bg-red-600 text-white">
      <div className="text-md font-bold">
       {logo &&( <a href="index.html"><img
  src={`${site_details.imurl}${logo.cvalue}`}
  alt="Logo"
/></a>)}
      </div>

      <div className="w-2/3">
        <NavigationMenu viewport={false}>
          <NavigationMenuList>
            <NavigationMenuItem>
              <NavigationMenuLink asChild>
                <Link href="/">{t("common:menu_home")}</Link>
              </NavigationMenuLink>
            </NavigationMenuItem>

            <NavigationMenuItem>
              <NavigationMenuLink asChild>
                <Link href="/contact">{t('Contact')}</Link>
              </NavigationMenuLink>
            </NavigationMenuItem>

            <NavigationMenuItem>
              <NavigationMenuTrigger className="bg-amber">{t('cat')}</NavigationMenuTrigger>
              <NavigationMenuContent className="bg-red-800 border-0 rounded-none">
                <ul className="grid w-[200px] gap-4 rounded-none">
                  {categories.map((cat) => (
                    <li key={cat.id} className="  border-b border-white">
                      <NavigationMenuLink asChild>
                        <Link href={`/category/${cat.slug}/${cat.id}`}>
                          {cat.name}
                        </Link>
                      </NavigationMenuLink>
                    </li>
                  ))}
                </ul>
              </NavigationMenuContent>
            </NavigationMenuItem>
             <NavigationMenuItem className='rounded-none'>
                 <NavigationMenuTrigger className="bg-amber">{t("common:menu_account")}</NavigationMenuTrigger>
                 
                 <NavigationMenuContent className="bg-red-800 border-0 rounded-none">
                   <NavigationMenuLink asChild>
                <Link href="/account/dashboard
                
                
                
                " className="border-b border-r-0 border-white">{t("common:menu_my_account")}</Link>
              </NavigationMenuLink>
                   <NavigationMenuLink asChild>
                <Link href="/checkout/register" className="border-b border-r-0 border-white">{t("common:menu_register")}</Link>
              </NavigationMenuLink>
               <NavigationMenuLink asChild>
                <Link href="/checkout/checkout" className="border-b border-white">{t("menu_checkout")}</Link>
              </NavigationMenuLink>


                 </NavigationMenuContent>
              
             </NavigationMenuItem>
            <NavigationMenuItem>
              <NavigationMenuLink asChild>
           <CartSheet />
              </NavigationMenuLink>
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>
      </div>
    </div>
  );
}
