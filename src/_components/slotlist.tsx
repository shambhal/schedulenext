// components/SlotList.js
export default function SlotList({ slots, onSlotSelect }) {
  if (slots.length === 0) {
    return <p className="text-red-600">No available slots for this date.</p>;
  }

  return (
    <ul className="space-y-2">
      {slots.map((slot, i) => (
        <li
          key={i}
          onClick={() => {
            if (slot.av === 1) {
              onSlotSelect(slot); // Call parent callback if slot is available
            }
          }}
          className={`px-4 py-2 rounded cursor-pointer transition
            ${
              slot.av === 1
                ? 'bg-green-100 hover:bg-green-200'
                : 'bg-gray-300 text-gray-600 cursor-not-allowed'
            }`}
        >
        <div className="flex gap-4">
          <div className="w-1/3">{slot.stime} </div>
          <div className="w-1/3"> {slot.av === 1 ? 'Book' : 'Booked'}</div>
          <div className="w-1/3"></div>
          </div>  
        </li>
      ))}
    </ul>
  );
}
