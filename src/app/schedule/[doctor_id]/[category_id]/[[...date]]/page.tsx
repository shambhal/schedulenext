import { getTranslations } from 'next-intl/server';
import { site_details } from "@/config";
import ScheduleInner from './slot';

async function getDoctorDetails(doctor_id: number) {
  const url = site_details.curl;

  const response = await fetch(url + "doctor/doctorq/" + doctor_id, {
  
    next: { revalidate: 600 }
  });

  if (!response.ok) {
    console.log(response.status);
    console.log("response not ik");
    return {};
  }

  return await response.json();
}

export async function generateMetadata({ params }) {
 const { doctor_id, category_id } = params;

  const today = new Date();
  
const date = params.date?.[0] || new Date().toISOString().split("T")[0];

  const t = await getTranslations();



  const json = await getDoctorDetails(doctor_id);

  const name = json?.info
    ? `${json.info.first_name} ${json.info.last_name}`
    : 'Doctor';

  return {
    title: t('schedule.title', {
      doctor: name,
      date: date
      
    })
  };
}

export default async function Schedule({ params }) {
 const { doctor_id, category_id } = params;

  const today = new Date();
  
  console.log(params);
const date = params.date?.[0] || new Date().toISOString().split("T")[0];
  
  const json = await getDoctorDetails(doctor_id);

  return (
    <ScheduleInner
      doctorInfo={json?.info}
      category_id={category_id}
      date={date}
    />
  );
}