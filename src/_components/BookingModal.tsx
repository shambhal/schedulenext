// components/BookingModal.tsx
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";
function formatDate(dd1:string)
{ let dd=new Date(dd1);
const formatted = dd.toLocaleDateString('en-GB', {
  day: '2-digit',
  month: 'short',
  year: 'numeric',
});
return formatted;

}
export default function BookingModal({ open, onClose, onConfirm, slot, date }: any) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  const handleConfirm = () => {
    onConfirm({ name, email, slot, date });
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Book Slot: {slot} {formatDate(`${date}`)}</DialogTitle>
        </DialogHeader>

        <div className="space-y-3">
          <Input placeholder="Your Name" value={name} onChange={(e) => setName(e.target.value)} />
          <Input placeholder="Email Address" value={email} onChange={(e) => setEmail(e.target.value)} />
        </div>

        <DialogFooter>
          <Button variant="ghost" onClick={onClose}>Cancel</Button>
          <Button onClick={handleConfirm}>Confirm Booking</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
