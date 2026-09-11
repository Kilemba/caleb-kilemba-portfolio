"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { submitBooking } from "@/actions/public";

type Service = { id: string; title: string };

/**
 * Messages for the reasons /api/availability can return. Without these the time
 * dropdown just said "No times available" and a visitor picking a weekend had no way
 * to tell whether the site was broken or the day was simply closed.
 */
const REASONS: Record<string, string> = {
  "closed-day": "I take consultations Monday to Friday. Please choose a weekday.",
  "blocked-date": "That date is not available. Please choose another day.",
  "fully-booked": "Every slot that day is already booked. Please try another day.",
  "day-over": "Today's slots have already passed. Please choose a later date.",
  "past-date": "Please choose a date in the future.",
  "invalid-date": "That date could not be read. Please pick one from the calendar."
};

export function BookingForm({ services, initialServiceId = "" }: { services: Service[]; initialServiceId?: string }) {
  const [date, setDate] = useState("");
  const [slots, setSlots] = useState<string[]>([]);
  const [reason, setReason] = useState<string>("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!date) {
      setSlots([]);
      setReason("");
      return;
    }
    let cancelled = false;
    setLoading(true);
    setReason("");

    fetch(`/api/availability?date=${encodeURIComponent(date)}`)
      .then((r) => r.json())
      .then((data) => {
        if (cancelled) return;
        setSlots(data.slots || []);
        setReason(data.slots?.length ? "" : REASONS[data.reason] || "No times are available on that date.");
      })
      .catch(() => {
        if (!cancelled) {
          setSlots([]);
          setReason("Could not load available times. Please refresh and try again.");
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    // A slow response for an earlier date must not overwrite a newer one.
    return () => {
      cancelled = true;
    };
  }, [date]);

  const timeLabel = loading ? "Loading times..." : slots.length ? "Choose a time" : "No times available";

  return (
    <form action={submitBooking} className="grid gap-5">
      <div>
        <label className="label" htmlFor="serviceId">Service</label>
        <select className="field" id="serviceId" name="serviceId" required defaultValue={initialServiceId}>
          <option value="">Choose a service</option>
          {services.map((s) => <option key={s.id} value={s.id}>{s.title}</option>)}
        </select>
      </div>

      <div className="grid gap-5 md:grid-cols-2">
        <div>
          <label className="label" htmlFor="name">Name</label>
          <input className="field" id="name" name="name" required minLength={2} maxLength={100} />
        </div>
        <div>
          <label className="label" htmlFor="email">Email</label>
          <input className="field" id="email" name="email" type="email" required />
        </div>
      </div>

      <div>
        <label className="label" htmlFor="company">Company</label>
        <input className="field" id="company" name="company" required minLength={2} maxLength={150} />
      </div>

      <div>
        <label className="label" htmlFor="projectDescription">Describe your business/data problem</label>
        <textarea
          className="field min-h-36"
          id="projectDescription"
          name="projectDescription"
          required
          minLength={20}
          maxLength={5000}
          aria-describedby="projectDescription-hint"
          placeholder="What data do you have, where does it live, and what decision are you trying to make?"
        />
        <p id="projectDescription-hint" className="muted mt-2 text-xs">
          At least 20 characters — a sentence or two is plenty.
        </p>
      </div>

      <div className="grid gap-5 md:grid-cols-2">
        <div>
          <label className="label" htmlFor="bookingDate">Available date</label>
          <input
            className="field"
            id="bookingDate"
            name="bookingDate"
            type="date"
            required
            min={new Date().toISOString().slice(0, 10)}
            value={date}
            onChange={(e) => setDate(e.target.value)}
          />
          <p className="muted mt-2 text-xs">Weekdays, 09:00–17:00 East Africa Time (GMT+3).</p>
        </div>
        <div>
          <label className="label" htmlFor="startTime">Available time</label>
          <select
            className="field"
            id="startTime"
            name="startTime"
            required
            disabled={!date || loading || slots.length === 0}
            aria-describedby={reason ? "startTime-reason" : undefined}
          >
            <option value="">{timeLabel}</option>
            {slots.map((slot) => <option key={slot} value={slot}>{slot}</option>)}
          </select>
          {reason && (
            <p id="startTime-reason" className="alert-error mt-2 text-sm" role="status">
              {reason}
            </p>
          )}
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-4">
        <button className="btn btn-primary w-fit" type="submit">Request Consultation</button>
        <p className="muted text-sm">
          Prefer email? <Link href="/contact" className="font-bold text-[#12875a]">Send a message instead</Link>.
        </p>
      </div>
    </form>
  );
}
