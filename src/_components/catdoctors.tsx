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
import Link from "next/link";
export default function Doctors({ darray }: DoctorsProps) {
  if (darray.length === 0) return null;

  return (
    <div className="columns md:columns-2">
      {darray.map((node, index) => (
        <div key={index} className="columns-1 p-2 border-b-gray-800 border-1">
          <strong>{node.first_name} {node.last_name}</strong> 
          <p> {node.qualification} </p>
          <p>{node.phone}</p>
          <p><Link href={`/schedule/${node.id}`}>Book Appointment</Link></p>
        </div>
      ))}
    </div>
  );
}
