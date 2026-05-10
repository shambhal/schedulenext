import { site_details } from "@/config";

export async function fetchCategoriesold() {
let url=site_details.url+'cats/';
console.log(url);
//return;
    const res = await fetch(`${site_details.url}cats/`); // refresh every 60s);
   // console.log("fetching categories");
    const json = await res.json();
    //console.log(json);
    return json.categories || [];
 
}
export async function fetchCategories() {
  const url = site_details.url + "cats/";

  const res = await fetch(url, {
    next: { revalidate: 60 },
  });

  if (!res.ok) {
    throw new Error("Failed to fetch categories");
  }

  const json = await res.json();
  return json.categories || [];
}
export function addDays(date:string, days:number) {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
}
