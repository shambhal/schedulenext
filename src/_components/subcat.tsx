// types.ts or in the same file
interface Subcategory {
  name: string;
  description:string;
  id: number;
}

interface DoctorsProps {
  darray: Subcategory[];
}

export default function Doctors({ darray }: DoctorsProps) {
  if (darray.length === 0) return null;

  return (
    <div className="columns md:columns-3">
      {darray.map((node, index) => (
        <div key={index} className="columns-1 p-2">
          <strong>{node.first_name} {node.last_name}</strong> 
          <p> {node.qualification} </p>
        </div>
      ))}
    </div>
  );
}
