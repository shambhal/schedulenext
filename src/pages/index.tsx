"use client"
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import Link from 'next/link';
import Head from 'next/head';
import { site_details } from '@/config';
import { useTranslation } from 'next-i18next';
interface Banner {
  id: number;
  category_id: string;
  image: string;
  sort_order: number;
  category:object
}

interface HomeProps {
  banners: Banner[];
}


export default function Home({ banners }: HomeProps) {
const {t}=useTranslation(['common','home']);
  return (
    <>
    <head><title>{t("home:title_home")}</title></head>
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Welcome to MySite</h1>

      {/* Banner Section */}
      <div className="grid md:grid-cols-3 gap-4 mb-6">
        {banners.map((banner) => (
          <div key={banner.id} className="border rounded overflow-hidden">
          <img src={`${site_details.imurl}${banner.image}`} alt={`Banner ${banner.id}`} />
            <div className="p-2">
              <p className="font-bold text-center"> <Link href={`/category/${banner.category.slug}/${banner.category.id}`}>{banner.category.name}</Link></p>
            </div>
          </div>
        ))}
      </div>

      {/* Example Links */}
     
    </div>
    </>
  );
}

export async function getStaticProps({ locale }: { locale: string }) {
  let banners: Banner[] = [];

  try {
    const res = await fetch(site_details.url + 'banner/by_tag/?tag=home');
    //console.log(site_details.url + 'banners/by_tag/?tag=home');
    if (res.ok) {
      banners = await res.json();
     //. console.log(banners);
    } else {
      console.warn('Failed to fetch banners');
    }
  } catch (err) {
    console.error('Error fetching banners:', err);
  }

  return {
    props: {
      ...(await serverSideTranslations(locale, ['common','home'])),
      banners,
    },
    revalidate: 3600, // Optional ISR: regenerate every hour
  };
}
