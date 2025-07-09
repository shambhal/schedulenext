import { site_details } from "@/config";

export async function fetchCategories() {
let url=site_details.url+'cats/';
    const res = await fetch(`${site_details.url}cats/`);
   // console.log("fetching categories");
    const json = await res.json();
    //console.log(json);
    return json.categories || [];
 
}
export function addDays(date:string, days:number) {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
}
