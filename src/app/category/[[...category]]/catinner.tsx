"use client"

import Catdoctors from "@/_components/catdoctors"
import { useEffect } from 'react'
import { useTranslations } from 'next-intl'
import { setCategoryMap } from "@/utils/formatcurr"

export default function Catinner({ info, data }) {
  const t = useTranslations()

  // ✅ Only browser-side logic
  useEffect(() => {
    if (data?.info?.[0]) {
      setCategoryMap(data.info[0]['id'], data.info[0]['name'])
    }
  }, [data])

  return (
    <main className="p-8">
      <h1 className="text-3xl font-bold">{info?.title}</h1>

      <div className="mt-5 p-2">
        <Catdoctors
          darray={data.doctors}
          category_id={data.info[0]['id']}
          catname={data.info[0]['name']}
        />
      </div>
    </main>
  )
}