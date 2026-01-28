export default function MyButton({type='',title='Submit'})
{


return  <button  type={type} className="bg-green-500 text-white px-4 py-2 rounded cursor-pointer">
         {title}
        </button>;

}
