import { getTranslations } from 'next-intl/server';
import Link from 'next/link';
import { site_details } from '@/config';

interface Banner {
  id: number;
  category_id: string;
  image: string;
  sort_order: number;
  category: {
    id: number;
    slug: string;
    name: string;
  };
}

export default async function Home() {
  const t = await getTranslations('home');

  let banners: Banner[] = [];

  try {
    const res = await fetch(site_details.url + 'banner/by_tag/?tag=home', {
      cache: 'no-store', // or next: { revalidate: 3600 }
    });

    if (res.ok) {
      banners = await res.json();
    }
  } catch (err) {
    console.error('Error fetching banners:', err);
  }

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">
        {t('title_home')}
      </h1>

      <div className="grid md:grid-cols-3 gap-4 mb-6">
        {banners.map((banner) => (
          <div key={banner.id} className="border rounded overflow-hidden">
            <img
              src={`${site_details.imurl}${banner.image}`}
              alt={`Banner ${banner.id}`}
            />
            <div className="p-2">
              <p className="font-bold text-center">
                <Link href={`/category/${banner.category.slug}/${banner.category.id}`}>
                  {banner.category.name}
                </Link>
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}