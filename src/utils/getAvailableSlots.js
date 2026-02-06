// utils/getAvailableSlots.js
import { formatCur } from "./formatcurr";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import { serverDateTime, serverWeekday, serverNow } from "@/lib/time";
import isSameOrBefore from "dayjs/plugin/isSameOrBefore";
dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.extend(isSameOrBefore);
function getOffSlabs(rangeStr, intervalMinutes = 30) {
 
 if(rangeStr==undefined)
 {

  return []
 }
  // Helper to convert "HH:MM" to total minutes
  const toMinutes = (time) => {
    const [h, m] = time.split(":").map(Number);
    return h * 60 + m;
  };

  // Helper to convert minutes to "HH:MM"
  const toHHMM = (minutes) => {
    const h = Math.floor(minutes / 60).toString().padStart(2, '0');
    const m = (minutes % 60).toString().padStart(2, '0');
    return `${h}:${m}`;
  };

  // Parse the time ranges
  if(rangeStr=='' || rangeStr==undefined)
    return []

  const ranges = rangeStr.split(";").map(range => {
    const [start, end] = range.split("-");
    return {
      label: range,
      startMin: toMinutes(start),
      endMin: toMinutes(end)
    };
  });

  const result = [];
  for (let min = 0; min < 24 * 60; min += intervalMinutes) {
    const startMin = min;
    const endMin = min + intervalMinutes;
    const slab = `${toHHMM(startMin)}-${toHHMM(endMin)}`;

    // Check if slab is within any active range
    const matchingRange = ranges.find(r => startMin >= r.startMin && endMin <= r.endMin);
    const label = matchingRange ? matchingRange.label : "other";

    result.push( slab);
  }

  return result;
}
export function getAvailableSlotsorg(data, targetDateStr) {
  data.booked=data.booked||[]
  const bookedSlots = new Set(
    data.booked
      .filter((b) => b.dated === targetDateStr)
      .map((b) => b.slot)
  );

  const weekDays = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
  const dateObj = new Date(targetDateStr);
  const wdKey = weekDays[dateObj.getDay()];
  /*

start from some off no 

  */
 var today=new Date()
 const dateString = today.toISOString().split('T')[0];
 
  var fees=1000
  let timeRange = '00:00-00:00';
var slotfees;
var off='';
  if (data.sp && data.sp.sdate === targetDateStr ) {
   var sparr=data.sp.hours.split('#');
   var slotfees;
    timeRange = sparr[0];
    if(sparr.length>1) 
    {
    slotfees=sparr[1];
    }
    else
    {
    slotfees=fees;
    }
    fees=slotfees;
    off=data.sp.off
  } else if (data.hours && data.hours[wdKey]) {
    const regular = data.hours[wdKey];
    timeRange = regular.split('#')[0];
    fees=regular.split('#')[1]
    off=data.off
  }

  if (timeRange === '00:00-00:00') return [];

  const [startStr, endStr] = timeRange.split('-');
  const [startHour, startMin] = startStr.split(':').map(Number);
  const [endHour, endMin] = endStr.split(':').map(Number);
  let start;
 if(data.sthour!=undefined)
 {//console.log("sthour not undefined");
start = new Date(dateObj.setHours(data.sthour, data.stmin, 0, 0));

 }
 else{  start = new Date(dateObj.setHours(startHour, startMin, 0, 0));}
  const end = new Date(dateObj.setHours(endHour, endMin, 0, 0));

  const slots = [];
  const slotDuration = 30 * 60 * 1000;
  console.log("before start");
console.log(start);
  for (let t = start.getTime(); t + slotDuration <= end.getTime(); t += slotDuration) {
    const slotStart = new Date(t);
    const slotEnd = new Date(t + slotDuration);

    const format = (d) => d.toTimeString().slice(0, 5) ;
    const formatsuffix=(d)=>{var ff=d.toTimeString().slice(0,2);
     var hh=ff*1;
     var suffix="AM";
     var mins=d.toTimeString().slice(3,5);
       if(hh>12)
       {
        hh=hh-12;
        suffix="PM"

       }
       else{ if(hh==12)
       {
        suffix="PM"
       }
      
       }
    return hh+':'+mins+' '+suffix
    }
    var unmod=slotStart+"-"+slotEnd;
    
    let offArray=[];
    if(off!=undefined)
    {
    offArray=getOffSlabs(off);
    }
 
    const slotStr = `${formatsuffix(slotStart)}-${formatsuffix(slotEnd)}`;
    if (!bookedSlots.has(slotStr)) {

       if(offArray.includes(unmod))
       {

        slots.push({'stime':slotStr,'av':0,'fees':''});
       }

        else{
      slots.push({'stime':slotStr,'av':1,'fees':formatCur(fees)});

        }
    }
    else{

      slots.push({'stime':slotStr,'av':0,'fees':formatCur(fees)} )
    }
  }

  return slots;
}


export function getAvailableSlots(data, targetDateStr) {
  data.booked = data.booked || [];

  const bookedSlots = new Set(
    data.booked
      .filter(b => b.dated === targetDateStr)
      .map(b => b.slot)
  );

  const wdKey = serverWeekday(targetDateStr);
  const now = serverNow();

  let fees = 1000;
  let timeRange = "00:00-00:00";
  let off = "";

  /* ---------- special date override ---------- */
  if (data.sp && data.sp.sdate === targetDateStr) {
    const parts = data.sp.hours.split("#");
    timeRange = parts[0];
    fees = parts[1] || fees;
    off = data.sp.off;
  }

  /* ---------- regular weekday hours ---------- */
  else if (data.hours && data.hours[wdKey]) {
    const parts = data.hours[wdKey].split("#");
    timeRange = parts[0];
    fees = parts[1] || fees;
    off = data.off;
  }

  if (timeRange === "00:00-00:00") return [];

  const [startStr, endStr] = timeRange.split("-");

  /* ---------- build start & end in SERVER TZ ---------- */
  let start = serverDateTime(targetDateStr, startStr);

  if (data.sthour !== undefined) {
    start = start.hour(data.sthour).minute(data.stmin || 0);
  }

  const end = serverDateTime(targetDateStr, endStr);

  const slotDurationMin = 30;
  const slots = [];

  const offArray = off ? getOffSlabs(off) : [];

  /* ---------- slot loop ---------- */
  while (start.add(slotDurationMin, "minute").isSameOrBefore(end)) {
    const slotStart = start;
    const slotEnd = start.add(slotDurationMin, "minute");

    const slotLabel =
      `${slotStart.format("hh:mm A")}-${slotEnd.format("hh:mm A")}`;

    const isPast = slotStart.isBefore(now);
    const isBooked = bookedSlots.has(slotLabel);

    const unmod =
      `${slotStart.toISOString()}-${slotEnd.toISOString()}`;

    if (isPast || isBooked) {
      slots.push({
        stime: slotLabel,
        av: 0,
        fees: formatCur(fees),
      });
    } else if (offArray.includes(unmod)) {
      slots.push({
        stime: slotLabel,
        av: 0,
        fees: "",
      });
    } else {
      slots.push({
        stime: slotLabel,
        av: 1,
        fees: formatCur(fees),
      });
    }

    start = slotEnd;
  }

  return slots;
}
