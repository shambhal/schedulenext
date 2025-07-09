'use client'
import { useState} from 'react';
import { useEffect } from 'react';
import {settings} from '../settings';
export default function Catnames()
  {
const r=settings.host+'cats/list';
console.log(r);
let [cats,setCats]=useState([])

useEffect(()=>{fetch(r).then((res)=>res.json()).then((d)=>{
console.log("what received from there")
  console.log(d);
  setCats(d);
}).catch(()=>{})


},[]);
/*
 useEffect(() => {
    fetch(r)
      .then((res) => res.json()) // ✅ Return and parse JSON
      .then((data) => {
        console.log(data);
        setCats(data); // ✅ Store data in state
      })
      .catch((err) => {
        console.error('Fetch error:', err);
      });
  }, []);
*/

return (<ul>       {cats.map((val:Object,key)=>(<li key={`k_${key}`}>{val.name}</li>))


                 }</ul>



                );
            }
