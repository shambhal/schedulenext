import { Label } from "flowbite-react";
export default function Mylabel({title='',forf=''})
{


return <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white" htmlFor={forf !='' ?forf :''}>{title}</label>;

}
