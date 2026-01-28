export default function SlotList({ slots, onSlotSelect, docid=0,cartSlots = [] }) {
  if (slots.length === 0) {
    return <p className="text-red-600">No available slots for this date.</p>;
  }

  return (
    <ul className="space-y-2">
      {slots.map((slot) => {
        const isInCart = cartSlots.includes(`${docid}+'_'+${slot.stime}`);
        const isAvailable = slot.av === 1;

        return (
          <li
            key={docid+'_'+slot.stime}
            onClick={() => {
              if (isAvailable) {
                onSlotSelect(slot.stime);
              }
            }}
            className={`px-4 py-2 rounded cursor-pointer transition
              ${
                isInCart
                  ? 'bg-blue-300 border border-blue-500' // Highlight if in cart
                  : isAvailable
                  ? 'bg-green-100 hover:bg-green-200'
                  : 'bg-gray-300 text-gray-600 cursor-not-allowed'
              }`}
          >
            <div className="flex gap-4">
              <div className="w-1/4">{slot.stime}</div>
              <div className="w-1/3">{isAvailable ? 'Book' : 'Booked'}</div>
              <div className="w-1/4">{slot.fees ?? '-'}</div>
            </div>
          </li>
        );
      })}
    </ul>
  );
}
