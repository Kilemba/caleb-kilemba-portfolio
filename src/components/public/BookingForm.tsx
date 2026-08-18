"use client";

import { useEffect, useState } from "react";
import { submitBooking } from "@/actions/public";

type Service = { id: string; title: string };

export function BookingForm({ services, initialServiceId = "" }: { services: Service[]; initialServiceId?: string }) {
  const [date, setDate] = useState("");
  const [slots, setSlots] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!date) { setSlots([]); return; }
    setLoading(true);
    fetch(`/api/availability?date=${encodeURIComponent(date)}`)
      .then((r) => r.ok ? r.json() : { slots: [] })
      .then((data) => setSlots(data.slots || []))
      .finally(() => setLoading(false));
  }, [date]);

  return (
    <form action={submitBooking} className="grid gap-5">
      <div><label className="label" htmlFor="serviceId">Service</label><select className="field" id="serviceId" name="serviceId" required defaultValue={initialServiceId}><option value="">Choose a service</option>{services.map((s) => <option key={s.id} value={s.id}>{s.title}</option>)}</select></div>
      <div className="grid gap-5 md:grid-cols-2">
        <div><label className="label" htmlFor="name">Name</label><input className="field" id="name" name="name" required /></div>
        <div><label className="label" htmlFor="email">Email</label><input className="field" id="email" name="email" type="email" required /></div>
      </div>
      <div><label className="label" htmlFor="company">Company</label><input className="field" id="company" name="company" required /></div>
      <div><label className="label" htmlFor="projectDescription">Describe your business/data problem</label><textarea className="field min-h-36" id="projectDescription" name="projectDescription" required /></div>
      <div className="grid gap-5 md:grid-cols-2">
        <div><label className="label" htmlFor="bookingDate">Available date</label><input className="field" id="bookingDate" name="bookingDate" type="date" required min={new Date().toISOString().slice(0, 10)} value={date} onChange={(e) => setDate(e.target.value)} /></div>
        <div><label className="label" htmlFor="startTime">Available time</label><select className="field" id="startTime" name="startTime" required disabled={!date || loading}><option value="">{loading ? "Loading times..." : slots.length ? "Choose a time" : "No times available"}</option>{slots.map((slot) => <option key={slot} value={slot}>{slot}</option>)}</select></div>
      </div>
      <button className="btn btn-primary w-fit" type="submit">Request Consultation</button>
    </form>
  );
}
