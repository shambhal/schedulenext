// types.ts or in the same file
interface Doctor {
  first_name: string;
  last_name:string;
  qualification: string;
  phone:string;
  id:number;
}

interface DoctorsProps {
  darray: Doctor[];
}
interface CatProps extends DoctorsProps {


category_id:number;
catname:string;

}
import { site_details } from "@/config";
import Link from "next/link";
import Image from "next/image";

import { useTranslation } from "next-i18next";
export default function Doctors({ darray ,category_id,catname}: CatProps) {
  const {t}=useTranslation('checkout');
  if (darray.length === 0) return null;

  return (
    <div className="grid md:grid-cols-3">
      {darray.map((node, index) => (
      <div
      key={index}
      className={`p-2 ml-2 border-1 border-gray-800 text-center ${
        index % 2 === 0 ? 'bg-gray-100' : 'bg-gray-200'
      }`}
    >
          <strong>{node.first_name} {node.last_name}</strong> 
          <p> {node.qualification} </p>
          <p>{node.phone}</p>
          <div className="text-center flex items-center justify-center">
       <Link href={`/schedule/${node.id}/${category_id}`}> <Image
  alt={`${node.first_name}${node.last_name}`}
  src={
    node?.image
      ? `${site_details.imurl}${node.image}`
      : "/images/placeholder.png"
  }
  width={150}
  height={150}
  className="rounded object-cover text-center"
/></Link>
</div>

        
          <p><Link href={`/schedule/${node.id}/${category_id}`}>{t("button_book")}</Link></p>
        </div>
      ))}
    </div>
  );
}
