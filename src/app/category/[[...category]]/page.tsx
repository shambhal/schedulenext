import { site_details } from '../../../config'
import { getTranslations } from "next-intl/server"
import Catinner from "./catinner"
export async function generateMetadata({ params }) {
   const { category } = await params;

  const slug = category[0]
  const id = category[1] || null

  let url = site_details.url + 'cats/basic/' + slug
  if (id) {
    url += '/' + id
  }

  // ✅ Proper async fetch
  const res = await fetch(url);
 let data= await res.json();


  return {
    title: data?.info?.name,
    description: data?.info?.description,
  };
}
export default async function CategoryPage({ params }) {
  const { category } = await params

  const slug = category[0]
  const id = category[1] || null
let data={};
  let url = site_details.url + 'cats/basic/' + slug
  if (id) {
    url += '/' + id
  }

  // ✅ Proper async fetch
  const res = await fetch(url,  {
  next: { revalidate: 60 }});
  const json = await res.json();
   if(json.info){
   ;
 let url2 = site_details.curl + 'cats/' + json.info.slug + (json.info.id ? '/' + json.info.id : '')
  if (id) {
  
  }
 
  let res2=await fetch(url2, {
  next: { revalidate: 60 }
   });
   //console.log("res2 down");

  // console.log(res2);
   data=await res2.json();


  // ✅ Proper translation usage
  const t = await getTranslations()

  const info = {
    title: json.info.name || '',
    description: json.info.description || '',
    id: json.info.id,
    slug: json.info.slug,
  }
  console.log(data);
 // console.log("99999");
  //console.log(info);
  //console.log("data upwards");
//return <mar>jjj</mar>;
  // ✅ Pass props corre;ctly
  return (
    <Catinner   data={data} info={info} />
  )
}
}