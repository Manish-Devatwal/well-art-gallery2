"use client";
import {useEffect,useState} from "react";
import {createClient,hasSupabase} from "@/lib/supabase";

const fallback=`Privacy Policy

Well Art Gallery respects your privacy. We collect only the information needed to process enquiries, orders and customer support.

Information we may receive
• Name, phone number, email address and order/enquiry details you choose to provide.
• Website usage information needed to keep the site secure and functional.

How we use information
• To respond to enquiries and WhatsApp purchase requests.
• To process and support orders.
• To improve the website and prevent misuse.

Payments
Payment details should only be entered through the payment provider used by the store. Well Art Gallery does not intentionally store full card or UPI credentials on this website.

Third-party services
The website may use services such as Supabase for database/storage and WhatsApp/social platforms for communication. Their own privacy policies may also apply.

Data retention
Information is retained only as long as reasonably needed for business, legal and support purposes.

Contact
For privacy questions, please contact the store using the contact details shown in the footer.

Last updated: ${new Date().toLocaleDateString("en-IN")}`;

export default function PrivacyPage(){
 const [text,setText]=useState(fallback);
 useEffect(()=>{
   if(!hasSupabase()) return;
   const sb=createClient();
   sb.from("store_settings").select("footer_privacy").eq("id",true).maybeSingle()
    .then(({data})=>{if(data?.footer_privacy)setText(data.footer_privacy)});
 },[]);
 return <main className="page-top section"><div className="container"><div className="legal-card"><h1>Privacy Policy</h1><div className="legal-copy">{text}</div></div></div></main>;
}
