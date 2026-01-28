import { GetServerSideProps } from "next";
import { site_details } from "@/config";
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useTranslation } from 'next-i18next';
import Head from "next/head";

interface InfoPageProps {
  data: {
    title: string;
    seo_url: string;
    content: string;
    status: boolean;
    sort_order: number;
  };
}
/*
export async function getStaticProps({ locale }: { locale: string }) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ['common','contact'])),
    },
  };
}
  */
export const getServerSideProps: GetServerSideProps = async ({ params,locale }) => {
  const slug = params?.slug as string;

  const url = site_details.url + "information/" + slug;
  const res = await fetch(url);

  if (!res.ok) {
    return { notFound: true }; // 🔥 show 404 if API fails
  }

  const json = await res.json();

  return {
    props: {  ...(await serverSideTranslations(locale ?? "en", ["common"])), data: json }, // ✅ must wrap in props
  };
};

export default function InfoPage({ data }: InfoPageProps) {
  const {t}=useTranslation(['common']);
  return (
    <>
    <Head><title>{data.title}</title></Head>
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">{data.title}</h1>
      <div
        className="prose max-w-none"
        dangerouslySetInnerHTML={{ __html: data.content }}
      />
    </div>
    </>
  );
}
