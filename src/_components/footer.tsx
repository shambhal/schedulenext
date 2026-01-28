"use client";
import { useTranslation } from 'next-i18next';
import Link from "next/link";
import { site_details } from "@/config";
import { useEffect, useState } from "react";

export default function Footer() {
  const [links, setLinks] = useState<{ seo_url: string; title: string }[]>([]);
   const [social, setSlinks] = useState<{ cname: string; cvalue: string }[]>([]);
const { t } = useTranslation('common');
  useEffect(() => {
    
    async function fetchLinks() {
      const res = await fetch(site_details.curl + "information/links", {
        cache: "no-store", // always fresh
      });
      if (res.ok) {
        setLinks(await res.json());
      }
    }
    fetchLinks();
  }, []); // ✅ run once on mount
 useEffect(() => {
    
    async function fetchSocial() {
      const res = await fetch(site_details.curl + "config/settings", {
        cache: "no-store", // always fresh
      });
      if (res.ok) {
        setSlinks(await res.json());
      }
    }
   fetchSocial();
  }, []); // ✅ run once on mount
const logo = social.find(obj => obj.cname === "logo");
const fb = social.find(obj => obj.cname === "fb_id");
  return (
    <footer className="footer bg-pink-600 text-white">
      <div className="container">
        <div className="md:flex  pt-5 p-5">
          <div className="p-5 md:w-1/2">
           
         
            <div>
     {fb && (<div> <a href={fb.cvalue} target="_blank" className='text-blue-600 hover:text-blue-700' rel="noopener noreferrer"> <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512"
       className="w-6 h-6 fill-current">
    <path d="M279.14 288l14.22-92.66h-88.91V127.41c0-25.35 12.42-50.06 52.24-50.06H295V6.26S259.36 0 225.36 0c-73.22 0-121.08 44.38-121.08 124.72v70.62H22.89V288h81.39v224h100.17V288z"/>
  </svg></a></div>)}   


     </div>    
            <p className="px-5 py-10">One of the finest agencies in the town</p>
          </div>
          <div className="border-l px-5 md:w-1/2">
            <h1>{t('quick')}</h1>
            <ul>
              {links.map((link) => (
                <li key={link.seo_url}>
                  <Link
                    href={`/info/${link.seo_url}`}
                    className="text-gray-200 hover:text-white transition"                  >
                    {link.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </footer>
  );
}
