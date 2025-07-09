import { useState, useEffect } from 'react';
import Head from 'next/head';
import Calendar from 'react-calendar';
import { site_details } from '../../config';
import { addDays } from '@/utils/categories'; // Make sure this works with Date
import 'react-calendar/dist/Calendar.css';
import { getAvailableSlots } from '@/utils/getAvailableSlots';
import SlotList  from "@/_components/slotlist"
import BookingModal from "@/_components/BookingModal";

export async function getServerSideProps({ params }) {
  const today = new Date();
  const formattedDate = today.toISOString().split('T')[0];

  const { qs = [] } = params;
  const doctor_id = qs[0] || null;
  const date = qs[1] || formattedDate;

  return {
    props: {
      doctor_id,
      date,
    },
  };
}

export default function Schedule({ doctor_id, date: initialDate }) {
  const [selectedDate, setSelectedDate] = useState(new Date(initialDate));
  const [data, setData] = useState(null);
  const [isLoading, setLoading] = useState(true);
  const [slots, setSlots] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
const [selectedSlot, setSelectedSlot] = useState('');
 const handleBook = (slot: string) => {
  setSelectedSlot(slot);
  setModalOpen(true);
};

const handleConfirmBooking = ({ name, email, slot, date }: any) => {
  console.log("Booking submitted:", { name, email, slot, date });

  // You can call your POST API here like:
  // fetch('/api/book', { method: 'POST', body: JSON.stringify(...) })
};

  const min_date = new Date();
  const max_date = addDays(new Date(), 5);

  useEffect(() => {
    const formatted = selectedDate.toISOString().split('T')[0];
    setLoading(true);
    const url = `${site_details.url}doctorschedule/${doctor_id}?dat=${formatted}`;
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
<div className='w-1/2'>Doctor Details</div>

</div>
      

        {isLoading ? (
          <p className="mt-6">Loading schedule...</p>
        ) : (
          <div className="mt-6">
            <h2 className="text-lg font-semibold mb-2">Available Slots</h2>
            <SlotList slots={slots} onBook={(slot) => alert(`Book slot: ${slot}`)} />

            {/* For debug */}
            <details className="mt-6 text-sm bg-gray-100 p-3 rounded">
              <summary className="cursor-pointer">Raw Data</summary>
              <pre>{JSON.stringify(data, null, 2)}</pre>
            </details>
          </div>
        )}
      </main>
    </>
  );
}
