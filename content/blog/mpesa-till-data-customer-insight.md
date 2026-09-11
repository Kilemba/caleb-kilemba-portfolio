---
draft: false
title: "Your M-Pesa till is a goldmine you're ignoring"
slug: "mpesa-till-data-customer-insight"
date: "2026-09-11"
description: "Your till statement records every sale to the second. Read it properly and it tells you when to staff up, what to stock, and which hours are quietly costing you money."
tags:
  - M-Pesa
  - Small Business
  - Analytics
featured: true
---

A butchery in Kahawa West opens at six and closes at nine, seven days a week. The owner
keeps three people on through the whole day because that is what he has always done. Ask
him when his busiest hour is and he will tell you evening, around seven. He is right. Ask
him what his second busiest hour is and he goes quiet — because nobody knows that off the
top of their head.

He does know, though. It is sitting in his M-Pesa statement, and it has been there since
the day he got the till.

## The decision you are actually stuck on

Most owner-operators are not short of effort. They are short of a reason to choose one
thing over another:

- Do I need a third person on Saturday, or am I paying for someone to stand around?
- Should I restock on Thursday evening or Friday morning?
- Is it worth opening an hour earlier?
- Which day do I run the promo on?

These are all the same question in different clothes: **when does money actually come
through my door?** Guessing costs you twice — once when you overstaff a quiet afternoon,
and again when you run out of stock during a rush you did not see coming.

## The data you already have

Every Lipa Na M-Pesa transaction is recorded with a timestamp. Not "Tuesday" — the actual
second it completed. Your statement, downloadable from the M-Pesa Business portal, gives
you roughly this per row:

| Field | What it gives you |
| --- | --- |
| Receipt number | A unique ID per transaction |
| Completion time | Date and time, to the second |
| Details | The paying customer (partially masked) |
| Paid in | The amount |

That is enough. Two columns — **completion time** and **paid in** — answer every question
above. You do not need a new system, a consultant, or a subscription. You need an export
and about forty minutes.

A caveat worth stating early, because it is the thing that makes people distrust the
numbers: **this only covers what came through the till.** If a meaningful share of your
sales are cash in hand, your M-Pesa data shows you a *slice* of the business, not the
whole of it. That slice is still enormously useful, because patterns hold — the hour that
is busy on M-Pesa is almost always the busy hour overall. Just do not read the totals as
your revenue.

## How to read it, simply

Export the last three months. Three months, not one — one month can be distorted by a
single holiday, a road closure, or a week of rain.

Open it in Excel or Google Sheets. Add two columns next to the completion time:

```
=HOUR(B2)              →  the hour of day, 0-23
=TEXT(B2,"ddd")        →  the day name, Mon/Tue/Wed...
```

Now insert a PivotTable. Put **day name** in rows, **hour** in columns, and **paid in** as
the value — set it to Sum, then look at it again set to Count.

Those two views answer different questions, and the difference between them is where the
insight hides:

- **Sum** tells you when the money arrives.
- **Count** tells you when the *people* arrive.

An hour with high count and low sum is a rush of small baskets — that is a staffing
problem, because you need hands on the counter. An hour with low count and high sum is a
few large purchases — that is a stock problem, because you must have the expensive items
actually on the shelf.

### An illustrative example

Suppose a hardware shop's pivot came back looking like this — these are made-up figures to
show the shape of the thing, not a real client:

| | 8am | 10am | 1pm | 4pm | 6pm |
| --- | --- | --- | --- | --- | --- |
| Sum (KES) | 42,000 | 18,000 | 9,000 | 15,000 | 61,000 |
| Count | 6 | 31 | 22 | 27 | 19 |

Read it. The 8am hour is six transactions worth forty-two thousand — that is fundis buying
for a job, early, before site. The 10am hour is thirty-one transactions worth eighteen
thousand — walk-in retail, small items. Those two hours need completely different things
from you. At 8am you need stock depth and someone who knows the products. At 10am you need
a second person on the till and change in the drawer.

The owner who only knows "mornings are busy" cannot see that distinction. The pivot makes
it obvious in a single glance.

## What this actually unlocks

Once you can see the shape of your week, the decisions stop being arguments:

**Staffing.** Roster against the count curve, not against the clock. If Wednesday
afternoon is consistently your thinnest four hours across three months, that is not a
hunch any more — that is the schedule.

**Restocking.** Order so that stock lands *before* the sum peak, not during it. A delivery
that arrives at 6pm on your best hour costs you the hour.

**Opening hours.** If the first ninety minutes of the day account for a rounding error of
your weekly takings, you are paying rent, power and wages for them. Either change what you
do in that window or stop opening for it.

**Promotions.** Run the offer on the day that is *nearly* good rather than the day that is
already your best. Discounting your busiest day mostly gives money away to people who were
coming anyway.

**Payday effects.** Sort by date and look at month-end versus mid-month. In most Kenyan
retail the last week of the month and the first few days of the next behave differently
from the middle. If your purchasing cycle ignores that, you are carrying stock through the
lean fortnight.

## If you have outgrown the pivot

Once you are doing this monthly and it matters, the spreadsheet becomes the bottleneck —
someone has to remember to export, and the file grows. At that point the same logic moves
into a query that runs itself:

```sql
select
  format_date('%a', completion_time)      as day_name,
  extract(hour from completion_time)      as hour_of_day,
  count(*)                                as transactions,
  sum(amount)                             as total_kes,
  round(avg(amount))                      as average_basket
from till_transactions
where completion_time >= date_sub(current_date(), interval 90 day)
group by day_name, hour_of_day
order by total_kes desc;
```

Same three months, same two questions, no manual export. But do not start here. Start with
the pivot, prove to yourself that the answer changes a decision, and only then automate it.

## One thing to do this week

Download the last ninety days of your M-Pesa statement. Build the one pivot: day name
down, hour across, amount in the middle. Look at it once with Sum and once with Count.

Then ask yourself a single question: **does my current staff roster match that grid?** If
it does not, you have just found money — either wages you are spending in dead hours, or
sales you are losing in busy ones.

That is a forty-minute job and it costs nothing. Most businesses never do it, which is
precisely why doing it is worth so much.

---

If the export is messy, the cash side is muddying the picture, or you want this running
automatically every month instead of by hand, that is the kind of thing I set up.
[Book a consultation](/book) and bring your statement — we will read it together.
