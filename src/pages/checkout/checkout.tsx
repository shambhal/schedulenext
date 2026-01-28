'use client'
import { site_details } from "@/config";
import Head from "next/head";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner"
import Appointee from "@/_components/Appointee";
import Cartdiv from "@/_components/cartdiv";
import { useCheckout } from "@/context/CheckoutContext";
import { useCart } from "@/context/CartContext";
import { Button } from "@/components/ui/button";
import PaymentMethod from "@/_components/pm";
import PaymentForm from "@/_components/pmform";
import { clearCart } from "@/utils/cartf";
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useTranslation } from "next-i18next";

export async function getStaticProps({ locale }: { locale: string }) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ['common'])),
    },
  };
}
export default function Checkout() {
  const { items } = useCart();
  const{ t }=useTranslation(['common','checkout']);
  const [appointee, setAppointee] = useState<any>(null);
  const [payment_method, setPaymentMethod] = useState<any>(null);
   const [pm, setpm] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const { orderId, setOrderId } = useCheckout();
  const [formlink ,setFormlink]=useState('');
  const router = useRouter();

  // Create order once when cart items are available and no order exists
  useEffect(() => {
    if (items?.length && !orderId) {
      createOrder();
    } else {
      setLoading(false);
    }
  }, [items, orderId]);

  // Update order when appointee is selected
  useEffect(() => {
    if (orderId && appointee) {
      updateOrder();
    }
  }, [orderId, appointee]);
  const processPayment=async(link:string)=>{
    
    
//console.log(appointee);
const res = await fetch(site_details.curl+link, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ order_id: orderId,appointee:appointee }),
    });
    if(res.ok)
    {
    const result = await res.json();
    if(result.success)
    {

clearCart();
router.replace('/checkout/result');
    }
    if(result.error)
    {
      clearCart();
router.replace('/checkout/result');
      
    }

  }
  else{
toast.error(t("error_occured"));
//alert("Error Occured");

  }
  }



  const createOrder = async () => {
 let  misc={'device_id':sessionStorage.getItem('UUID'),'items':items};
  
    try {
      const response = await fetch(`${site_details.curl}orders/create`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(misc),
      });

      const data = await response.json();
      console.log("data in createirder");
      console.log(data);
      if (data.order_id) {
        setOrderId(data.order_id);
        sessionStorage.setItem('order_id',data.order_id);
      }
    } catch (error) {
      console.error(t("create_order_failed"), error);
    } finally {
      setLoading(false);
    }
  };


const loadPM=async()=>{
  if(! orderId || !items || ! payment_method)
      return ;
    if(!appointee)
      return;
 try {
 
   const response=   await fetch(`${site_details.curl}orders/validate`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          order_id: orderId,
          payment_method:payment_method,
          items:items,
          appointee:appointee
        }),
      });
       if(response.ok)
       {

     var  json=await response.json();
       if(json['pmlink'])
       {

      setFormlink(json['pmlink']);

       }

       }
       else{


       }
    } catch (error) {
      console.error(t("update_order_failed"), error);
    }

};
useEffect(()=>{loadPM()},[appointee,orderId,payment_method])
  const updateOrder = async () => {
    try {

      
   var res=   await fetch(`${site_details.curl}orders/update`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          order_id: orderId,
          items,
          appointee,
        }),
      });
      if(res.ok)

{
  var json=await res.json();
  if(res['id'])    {setOrderId(res['id']);}

}      } catch (error) {
      console.error("Update order failed:", error);
      toast.error("Update Order Failed");
    }
  };

  if (loading) return <div>{t("loading")}</div>;

  return (<>
  <Head>
        <title>Checkout</title>
      </Head>
   
    <div className="p-6">
      <h2 className="text-xl font-bold mb-4">Checkout</h2>
     
      {!items?.length && <div>{t("empty_cart")}</div>}
     
     
<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
  <div className="bg-gray-100 p-4">
    <Appointee onChange={setAppointee} />
  </div>
  <div className="bg-gray-200 p-4">
 <Cartdiv />
  </div>
</div>

<div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
  <div className='md:flex-1 bg-gray-100'><PaymentMethod onSelect={setPaymentMethod}/></div>

  <div className='md:flex-1'>{formlink && (
        <div className="mt-4">
          <PaymentForm link={formlink} onProcess={processPayment} appointee={appointee} orderId={orderId} />
        </div>
      )}</div>

</div>


    </div>
   
    </>
  );
}
