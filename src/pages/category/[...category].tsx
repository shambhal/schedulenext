
"use client"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import Head from 'next/head'
import { useState, useEffect } from 'react'
import { site_details } from '../../config'
import Catdoctors from "@/_components/catdoctors"
import { setCategoryMap } from "@/utils/formatcurr"
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useTranslation } from "next-i18next"
interface CategoryPageProps {
  info: {
    title: string
    description: string
    id: number
    slug: string
  }
}

export async function getServerSideProps(context:any) {
  const { params, locale } = context;
 
  const { category } = params;
  const slug = category[0]
  const id = category[1] || null
//const t=serverSideTranslations0
  let url = site_details.url + 'cats/basic/' + slug
  if (id) {
    url += '/' + id
  }

  const res = await fetch(url)
  const json = await res.json()

  return {
    props: {
        ...(await serverSideTranslations(locale, [
        "common",
        "checkout",   // header + footer
        "contact",  // page specific
      ])),
      info: {
        title: json.info.name || '',
        description: json.info.description || '',
        id: json.info.id,
        slug: json.info.slug,
      },
    },
  }
}

export default function CategoryPage({ info }: CategoryPageProps) {
  const [data, setData] = useState<any>(null)
  const [isLoading, setLoading] = useState(true)
 let {t}=useTranslation();
// Add a new entry
//setCategoryMap(info.id, info.title);

// Save updated Map back to sessionStorage

  useEffect(() => {
    const url = site_details.curl + 'cats/' + info.slug + (info.id ? '/' + info.id : '')
    //console.log("useffecturl");
    //console.log(url);
    fetch(url)
      .then((res) => res.json())
      .then((data) => {
        setData(data);
        console.log(data);
        console.log(data.info[0]['id']);
        console.log(data.info[0]['name']);
        setCategoryMap(data.info[0]['id'], data.info[0]['name']);
        setLoading(false);
      })
  }, [info.slug, info.id])

  return (
    <>
      <Head>
        <title>{info.title || 'Welcome'}</title>
        <meta name="description" content={info.description || ''} />
      </Head>

      <main className="p-8">
        <h1 className="text-3xl font-bold">{info.title}</h1>
    

        {isLoading ? (
          <p>Loading data...</p>
        ) : (
         
          <div className="mt-5 p-2">

       <Catdoctors darray={data.doctors} category_id={data.info[0]['id']} catname={data.info[0]['name']}/>
  

    </div>

        )}
      </main>
    </>
  )
}