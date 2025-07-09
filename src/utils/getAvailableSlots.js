// utils/getAvailableSlots.js
export function getAvailableSlots(data, targetDateStr) {
  data.booked=data.booked||[]
  const bookedSlots = new Set(
    data.booked
      .filter((b) => b.dated === targetDateStr)
      .map((b) => b.slot)
  );

  const weekDays = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
  const dateObj = new Date(targetDateStr);
  const wdKey = weekDays[dateObj.getDay()];

  let timeRange = '00:00-00:00';

  if (data.sp && data.sp.sdate === targetDateStr && data.sp.off !== '1') {
    timeRange = data.sp.hours;
  } else if (data.hours && data.hours[wdKey]) {
    const regular = data.hours[wdKey];
    timeRange = regular.split('#')[0];
  }

  if (timeRange === '00:00-00:00') return [];

  const [startStr, endStr] = timeRange.split('-');
  const [startHour, startMin] = startStr.split(':').map(Number);
  const [endHour, endMin] = endStr.split(':').map(Number);

  const start = new Date(dateObj.setHours(startHour, startMin, 0, 0));
  const end = new Date(dateObj.setHours(endHour, endMin, 0, 0));

  const slots = [];
  const slotDuration = 30 * 60 * 1000;

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
    const slotStr = `${formatsuffix(slotStart)}-${formatsuffix(slotEnd)}`;
    if (!bookedSlots.has(slotStr)) {
      slots.push({'stime':slotStr,'av':1});
    }
    else{

      slots.push({'stime':slotStr,'av':0} )
    }
  }

  return slots;
}
