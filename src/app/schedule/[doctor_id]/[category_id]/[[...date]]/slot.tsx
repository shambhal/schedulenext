"use client"

import { useTranslations } from 'next-intl';
import { useState, useEffect } from 'react';
import { toast } from "sonner"
import Image from "next/image";
import { getAvailableSlots } from '@/utils/getAvailableSlots';
import { useCart } from "@/context/CartContext"
import { addDays } from '@/utils/categories';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import { site_details ,generateUUID}  from "@/config"
import { fetchCart } from '@/utils/cartf';
import SlotList from "@/_components/slotlist"
import { convertTo24Hour ,convertDate, getCategoryName, getDSlots, setDSlots} from '@/utils/formatcurr';
import { config } from 'process';

export default function ScheduleInner({ doctorInfo, category_id, date: initialDate }) {

  const [selectedDate, setSelectedDate] = useState(new Date(initialDate));
  const doctor_id = doctorInfo?.id;
console.log(doctorInfo);

  const t = useTranslations();
  const { setCartCount ,setItems } = useCart();

  const [data, setData] = useState(null);
  const [isLoading, setLoading] = useState(true);
  const [slots, setSlots] = useState([]);
  const [cartSlots, setCartSlots] = useState([]);
console.log(`{doctor_id} is doctor_id`);
  // load existing cart slots
  useEffect(() => {
    const slots = getDSlots();
    setCartSlots(slots || []);
  }, []);

  // booking handler
  const handleBook = (slot: string) => {
    atc(slot, selectedDate, category_id);
  };

  // add to cart
  async function atc(slot, date, category_id) {
    try {
      if (!doctor_id) return;

      let device_id = sessionStorage.getItem('UUID');

      if (!device_id) {
        device_id = generateUUID();
        sessionStorage.setItem('UUID', device_id);
      }

      const dd = date.toISOString().split('T')[0];
      const category_name = getCategoryName(category_id);

      const payload = {
        device_id,
        dated: dd,
        slot: convertTo24Hour(slot),
        doctor_id: doctor_id,
        user_id: 0,
        category_id,
        category_name
      };

      const response = await fetch(site_details.curl + "cart/add", {
        headers: { 'Content-Type': 'application/json' },
        method: 'POST',
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        alert(t('error_saving'));
        return;
      }

      const result = await response.json();

      if (result) {
        const record = result.record;

        toast.success(t("appointment_created"), {
          description: convertDate(record?.dated),
        });

        const { count, items } = await fetchCart();

        if (count !== -1) {
          setCartCount(count);
          setItems(items);

          const key = `${doctor_id}_${slot}`;

          // prevent duplicates
          setCartSlots((prev) =>
            prev.includes(key) ? prev : [...prev, key]
          );

          setDSlots(key);
        }
      }

    } catch (err) {
      console.error(err);
    }
  }

  const min_date = new Date();
  const max_date = addDays(new Date(), 5);

  // fetch schedule
  useEffect(() => {
    if (!doctor_id) return;

    const pad = n => String(n).padStart(2, '0');
    const d = new Date(selectedDate);
    const formatted = `${d.getFullYear()}-${pad(d.getMonth()+1)}-${pad(d.getDate())}`;

    setLoading(true);

    const url = `${site_details.curl}doctor/schedule/${doctor_id}?dat=${formatted}`;

    fetch(url)
      .then((res) => {
        if (!res.ok) throw new Error("API error");
        return res.json();
      })
      .then((fetched) => {
        console.log(fetched);
        setData(fetched);
        setSlots(getAvailableSlots(fetched, formatted));
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });

  }, [doctor_id, selectedDate]);

  const handleDateChange = (value) => {
    setSelectedDate(value);
  };

  return (
    <main className="p-8">

      <h1 className="text-xl font-bold mb-2">
        Doctor ID: {doctor_id}
      </h1>

      <p className="mb-4">
        Selected Date: {selectedDate.toISOString().split('T')[0]}
      </p>

      <div className="flex gap-4 p-4">
        
        <div className="w-1/2">
          <Calendar
            value={selectedDate}
            minDate={min_date}
            maxDate={max_date}
            onChange={handleDateChange}
          />
        </div>

        <div className="w-1/2">
          {t('doctor.doctor_details')}

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
              className="rounded object-cover"
            />
          </p>
        </div>

      </div>

      {isLoading ? (
        <p className="mt-6">{t('common.loading')}</p>
      ) : (
        <div className="mt-6">
          <h2 className="text-lg font-semibold mb-2">
            {t('doctor.available_slots')}
          </h2>

          <SlotList
            slots={slots}
            onSlotSelect={handleBook}
            cartSlots={cartSlots}
          />
        </div>
      )}

    </main>
  );
}