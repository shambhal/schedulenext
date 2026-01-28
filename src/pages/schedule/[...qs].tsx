
"use client"
import { useState, useEffect } from 'react';
import { toast } from "sonner"
import Head from 'next/head';
import Image from "next/image";
import { useCart } from "@/context/CartContext"
import Calendar from 'react-calendar';
import { site_details ,generateUUID} from '../../config';
import { addDays } from '@/utils/categories'; // Make sure this works with Date
import 'react-calendar/dist/Calendar.css';
import { getAvailableSlots } from '@/utils/getAvailableSlots';
import { convertTo24Hour ,convertDate, getCategoryName, getDSlots, setDSlots} from '@/utils/formatcurr';
import { useTranslation } from "next-i18next"
import SlotList  from "@/_components/slotlist"
import BookingModal from "@/_components/BookingModal";
import { fetchCart } from '@/utils/cartf';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';

//import { Notif } from '@/_components/toast';

export async function getServerSideProps(context:any) {
  const today = new Date();
  const formattedDate = today.toISOString().split('T')[0];
const {locale,params}=context;
  const { qs = [] } = params;
  const doctor_id = qs[0] || null;
  const category_id=qs[1]||0;
  const date = qs[2] || formattedDate;

  return {
    props: {
       ...(await serverSideTranslations(locale ?? 'en', [
        'common',
        'doctor'
      ])),
      doctor_id,
      category_id,
      date,
     
    },
  };
}

export default function Schedule({  doctor_id,category_id, date: initialDate, }) {

  const [selectedDate, setSelectedDate] = useState(new Date(initialDate));
 


   const {t}   =useTranslation(['common','doctor']);
  const { setCartCount ,setItems} = useCart();
  const [data, setData] = useState(null);

  const [isToast,setToast]=useState(false);
  const [isLoading, setLoading] = useState(true);
  const [slots, setSlots] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
const [selectedSlot, setSelectedSlot] = useState('');

const [cartSlots, setCartSlots] = useState(() => getDSlots());
const [doctorInfo,setDoctorInfo]=useState({bio:null,image:null});
console.log(cartSlots);
 const handleBook = (slot: string) => {
  setSelectedSlot(slot);
 // alert(slot);
  //setModalOpen(true);

  atc(slot,selectedDate,category_id);
};
const closetoast=()=>{

setToast(false);
 category_id
}
async function getDoctorDetails()
{

var url1=site_details.curl;
   const response=await fetch(url1+"doctor/doctorq/"+doctor_id, { headers: {
    'Content-Type': 'application/json'
              } })
   if(!response.ok)
   {
//alert("Error Occured while saving");
console.log(response.status);
return;

   }
   let result=await response.json();
   console.log(result);
  
  setDoctorInfo(result.info);
}
async function atc(slot,date,category_id)
{
 var device_id;

  if(!sessionStorage.getItem('UUID'))
  {

device_id=generateUUID();
sessionStorage.setItem('UUID',device_id);

  }
  else
  {
device_id=sessionStorage.getItem('UUID');

  }
var dd=date.toISOString().split('T')[0];
let category_name=getCategoryName(category_id);
console.log("category name is "+category_name);
  var data={"device_id":device_id,"dated":dd,"slot":convertTo24Hour(slot),"doctor_id":parseInt(doctor_id),"user_id":0,'category_id':category_id,'category_name':category_name};
 // console.log(data);
//console.log("Booking submitted:", { name, email, slot, date });

  // You can call your POST API here like:
  var url1=site_details.curl;
   const response=await fetch(url1+"cart/add", { headers: {
    'Content-Type': 'application/json'
              }, method: 'POST', body: JSON.stringify(data) })
   if(!response.ok)
   {
alert(t('error_saving'));
console.log(response.status);
return;

   }
   let result=await response.json();
   console.log(result);
 
   if(result)
   {
    var record=result['record'];
 toast.success(t("appointment_created"), {
          description:convertDate( record['dated']),
        
        
        });
const { count ,items} = await fetchCart();
console.log("result from the fetch ,cart ");

    if(count!=-1)
    {

      setCartCount(count);0
      setItems(items);
      var k=doctor_id+'_'+slot;
   
       setCartSlots((prev) =>
     [...prev, k] // add if not exists
  );
        setDSlots(k);
    }
    else{


    }
   }


}


  const min_date = new Date();
  const max_date = addDays(new Date(), 5);
 //const fd=(locale, date) => formatDate(date, 'dd MMM YYYY');
  useEffect(() => {
    //console.log("selectedDate");
    getDoctorDetails();
    var d=new Date(selectedDate);
    const pad = n => String(n).padStart(2, '0');
    const localDateStr = `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;

    //const formatted = selectedDate.toISOString().split('T')[0];
    const formatted=localDateStr;
    console.log(formatted);
    setLoading(true);
    const url = `${site_details.curl}doctorschedule/${doctor_id}?dat=${formatted}`;
    fetch(url)
      .then((res) => res.json())
      .then((fetched) => {
        setData(fetched);
        console.log(fetched);
        setSlots(getAvailableSlots(fetched, formatted)); // 🧠 use our logic
        setLoading(false);
      });
  }, [doctor_id, selectedDate]);

  const handleDateChange = (value) => {
   
    setSelectedDate(value);
  };

  return (
    <>
      <Head>
        <title>Schedule your Appointment</title>
      </Head>

      <main className="p-8">
        <h1 className="text-xl font-bold mb-2">Doctor ID: {doctor_id}</h1>
        <p className="mb-4">Selected Date: {selectedDate.toISOString().split('T')[0]}</p>
       
        
<div  className="flex gap-4 p-4">
<div className='w-1/2'>  <Calendar
          value={selectedDate}
       
          minDate={min_date}
          maxDate={max_date}
          onChange={handleDateChange}
        /></div>
<div className='w-1/2'>
{t('doctor:doctor_details')}
{doctorInfo?.bio && <div>{doctorInfo.bio}</div>}
 <p className="text-center">
                <Image
          alt="Thumbnail"
          src={
            doctorInfo?.image
              ? `${site_details.imurl}${doctorInfo.image}`
              : "/images/placeholder.png"
          }
          width={250}
          height={250}
          className="rounded object-cover text-center"
        />
        </p>
</div>
</div>
      

        {isLoading ? (
          <p className="mt-6">{t('loading_schedule')}</p>
        ) : (
          <div className="mt-6">
            <h2 className="text-lg font-semibold mb-2">{t('doctor:available_slots')}</h2>
            <SlotList slots={slots} onSlotSelect={handleBook}    cartSlots={cartSlots}/>


            {/* For debug */}
            
          </div>
        )}
       {modalOpen && (
  <BookingModal
  open={modalOpen}
  onClose={() => setModalOpen(false)}
  onConfirm={handleConfirmBooking}
  slot={selectedSlot}
  date={selectedDate.toISOString().split('T')[0]}
/>


)}


      </main>
    </>
  );
}