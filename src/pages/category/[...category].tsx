

import Head from 'next/head'
import { useState, useEffect } from 'react'
import { site_details } from '../../config'
import Catdoctors from "@/_components/catdoctors"
interface CategoryPageProps {
  info: {
    title: string
    description: string
    id: number
    slug: string
  }
}

export async function getServerSideProps({ params }) {
  const { category } = params
  const slug = category[0]
  const id = category[1] || null

  let url = site_details.url + 'cats/basic/' + slug
  if (id) {
    url += '/' + id
  }

  const res = await fetch(url)
  const json = await res.json()

  return {
    props: {
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

  useEffect(() => {
    const url = site_details.url + 'cats/' + info.slug + (info.id ? '/' + info.id : '')
    console.log("useffecturl");
    console.log(url);
    fetch(url)
      .then((res) => res.json())
      .then((data) => {
        setData(data);
        console.log(data);
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
        <p className="text-lg mt-2">ID: {info.id}</p>

        {isLoading ? (
          <p>Loading data...</p>
        ) : (
         
          <div className="mt-5 p-5">

       <Catdoctors darray={data.doctors} />

          </div>



        )}
      </main>
    </>
  )
}