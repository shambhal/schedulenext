'use client'
import { useState } from 'react';
export default function Revbutton()
{
 let [name,setName ]  = useState("siddharth");
 function handle()
 {
   let name1=name.split("").reverse().join("");
 
   setName(name1)
 }
 return (<div className="flex flex-justify p-4">
    <input type='text' value={name}  readOnly/>
  <button onClick={handle}>Update</button>
    </div>)


}