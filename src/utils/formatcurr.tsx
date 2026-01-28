export function formatCur(num:number)
{

 return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 2,
  }).format(num);



}
 export function convertTo24Hour(timeRange:string) {
  const [start, end] = timeRange.split('-').map(t => t.trim());
//console.log(timeRange);
  const to24Hour = (timeStr:string) => {
    var splitter='';
    if(timeStr.indexOf('PM')>-1)
       splitter='PM'
    else
    splitter='AM'
    const [time, modifier] = timeStr.split(splitter);
    let [hours, minutes] = time.split(':').map(Number);

    if (splitter === 'PM' && hours !== 12) {
      hours += 12;
    } else if (splitter === 'AM' && hours === 12) {
      hours = 0;
    }

    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
  };

  return `${to24Hour(start)}-${to24Hour(end)}`;
}
export function convertDate(dt:string){

const date=new Date(dt);

const formatted = date.toLocaleDateString("en-IN", {
  weekday: "long",   // Sunday, Monday, ...
  month: "long",     // January, February, ...
  day: "numeric",
  year:"numeric"    // 1, 2, 3, ...
}).split(",").join(" ");

//return formatted.day +' '+formatted.month +' '+formatted.year+' ,'+ formatted.weekday
return formatted;

}
export function convertRangeToAmPm(range) {
  // Split the range into start and end
  let [start, end] = range.split("-");

  return `${convertToAmPm(start)} - ${convertToAmPm(end)}`;
}

export function convertToAmPm(time24) {
  let [hours, minutes] = time24.split(":").map(Number);

  let period = hours >= 12 ? "PM" : "AM";
  hours = hours % 12 || 12; // convert 0 -> 12

  return `${hours}:${minutes.toString().padStart(2, "0")} ${period}`;
}
export function getCategoryName(catid)
{

let cats: Map<number, string>;
const storedCats = sessionStorage.getItem("cats");

if (storedCats) {
  cats = new Map(JSON.parse(storedCats)); // Convert back to Map
} else {
  cats = new Map();
}
console.log(cats);
console.log(catid);
return cats.get(Number(catid))|| ''
}
export function setCategoryMap(catid:number,catname:string)
{
let cats: Map<number, string>;
const storedCats = sessionStorage.getItem("cats");
if (storedCats) {
  cats = new Map(JSON.parse(storedCats)); // Convert back to Map
} else {
  cats = new Map();
}
cats.set(catid,catname);
sessionStorage.setItem("cats", JSON.stringify(Array.from(cats.entries())));
}
export function setDSlots(dslot:string)
{//this is for 
// Key for your storage
const key = "cartSlots";

// Step 1: Get existing array or initialize empty
var slots=getDSlots();

// Step 2: Push new value (e.g., slot.stime)
slots.push(dslot);

// Step 3: Save back to sessionStorage
sessionStorage.setItem(key, JSON.stringify(slots));

}
export function getDSlots() {
  const key = "cartSlots";

  try {
    const data = sessionStorage.getItem(key);
    console.log("in getdslots");
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error("Error reading cartSlots from sessionStorage:", error);
    return [];
  }
}


// Example
