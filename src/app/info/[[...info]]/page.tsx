import { site_details } from "@/config";
import { getTranslations } from 'next-intl/server';

// 🔥 fetch function (reuse in both places)
async function getInfo(slug: string) {
  const url = site_details.url + "information/" + slug;

  const res = await fetch(url, {
    next: { revalidate: 600 }
  });

  if (!res.ok) return null;

  return res.json();
}

// ✅ metadata
export async function generateMetadata({ params }) {
  const slug = params?.slug;
  const data = await getInfo(slug);

  if (!data) {
    return {
      title: "Not Found"
    };
  }

  return {
    title: data.title
  };
}

// ✅ page
export default async function InfoPage({ params }) {
  const slug = params?.slug;
  const data = await getInfo(slug);

  if (!data) {
    return <div>Not Found</div>;
  }

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">{data.title}</h1>

      <div
        className="prose max-w-none"
        dangerouslySetInnerHTML={{ __html: data.content }}
      />
    </div>
  );
}