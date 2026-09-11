---
draft: false
title: "When Excel starts costing you money"
slug: "when-excel-starts-costing-you-money"
date: "2026-09-11"
description: "Spreadsheets run a huge share of Kenyan business, and for a long time that is the right call. Here are the specific signs you have crossed the line — and what to do before the file corrupts."
tags:
  - Digital Transformation
  - Small Business
  - Data Engineering
featured: true
---

Let me say the unpopular thing first: **Excel is not the problem.** A salon in Kilimani
tracking stock in a spreadsheet is not doing anything wrong. Spreadsheets are free,
everyone can read one, and they let you change your mind on a Tuesday without calling a
developer. Most businesses that "upgraded" too early ended up with an expensive system
that does less than the sheet did.

So this is not an article about why you should buy software. It is about how to tell when
the sheet has quietly stopped being free — because it always does, and the cost shows up
long before the crash.

## The decision you are actually stuck on

Somebody has told you that you need a system. They may have been a vendor. The quote was
six figures and the demo looked impressive, and you have no way of judging whether you
genuinely need it or are being sold to.

Meanwhile the sheet is still working. Mostly.

What you need is not an opinion. It is a set of signs specific enough that you can check
them this afternoon and get an honest answer either way.

## Sign one: two people have overwritten each other

This is the clearest line in the sand. The moment more than one person needs to edit the
same file, a spreadsheet stops being a record and becomes a negotiation.

You will recognise it by the filenames. `Stock.xlsx` becomes `Stock_final.xlsx`, then
`Stock_final_v2.xlsx`, then `Stock_final_USE_THIS_ONE.xlsx`. Somebody works an afternoon
on the wrong copy. Nobody can say which file is true.

Shared cloud sheets soften this, and if you have moved to Google Sheets with proper
sharing you have bought yourself real time. But they do not fix it — they just make the
overwrite silent instead of obvious.

**The cost:** an afternoon of rework, plus every future decision made from a file nobody
fully trusts.

## Sign two: you cannot answer a question without rebuilding something

A healthy sheet answers questions. An unhealthy one requires a project.

Try this: how much did you spend with your third-largest supplier last quarter? If the
answer is "give me until tomorrow", the sheet has stopped being a tool and become an
archive. The data is in there. You just cannot get at it without manual work, which means
in practice you stop asking — and a business that stops asking questions stops noticing
things.

**The cost:** not the hours. The questions you no longer bother to ask.

## Sign three: the same number lives in three places

Your stock sheet says one thing. Your M-Pesa records say another. The book under the
counter says a third. Each is maintained by a different person, and reconciling them is a
monthly ritual involving an evening and a calculator.

This is the expensive one, because reconciliation work scales with the business while
adding nothing to it. Every new product line and every new branch makes that evening
longer.

**The cost:** compounding. It grows exactly as fast as you do.

## Sign four: one person is the system

There is somebody who knows how the sheet works. They built the formulas. They know which
tab to update on Fridays and why column P is hidden.

Ask yourself plainly what happens if that person resigns, travels, or is unwell for two
weeks. If the honest answer is that the business slows down, you do not have a
spreadsheet — you have a dependency with a human attached.

**The cost:** invisible until the day it is the only thing that matters.

## Sign five: it has already broken once

File corrupted. Laptop stolen. Someone sorted one column without the others and the rows
no longer line up — that one is nastier than corruption, because nothing looks wrong.

If you have had a genuine data-loss scare and your response was to keep going, you did not
solve the problem. You survived it.

**The cost:** the next one.

## What the honest answer usually is

Here is what a vendor will not tell you: **you probably do not need a full system.** For
most businesses at this stage, the right move is one step, not ten.

In rough order of how much value they return per shilling spent:

**1. Put the file somewhere it cannot be lost.** Google Sheets or a synced drive, with
history turned on. This is free and takes an afternoon. It solves signs one and five
almost entirely. If you do nothing else, do this.

**2. Separate the record from the report.** Keep one clean sheet where rows are only ever
added, never edited or re-sorted — one row per sale, per delivery, per expense, with the
date in a proper date column. Do your charts and summaries on a *different* tab that reads
from it. Most spreadsheet pain comes from people formatting the thing that is also the
record.

**3. Stop typing in what you can export.** Your M-Pesa statement, your POS export and your
bank statement are already digital. Re-keying them by hand is both the biggest time cost
and the biggest source of error in a typical setup.

**4. Only now consider a database.** When the sheet is clean, shared and fed by exports,
you will know precisely what you need — because you will have hit a specific wall, and be
able to describe it. That is a far better position to buy from than "somebody said we need
a system".

That fourth step is where a warehouse starts to earn its keep: multiple people writing at
once without collisions, history that cannot be overwritten, and questions answered in
seconds rather than rebuilt. But arriving there from a tidy sheet costs a fraction of
arriving there from chaos, because the hard part — agreeing what a "sale" actually is —
was done in step two.

## What it looks like on the other side

The practical difference is not dashboards. It is that the question you could not answer
in sign two becomes:

```sql
select
  supplier_name,
  sum(amount) as total_kes
from purchases
where purchase_date >= '2026-07-01'
  and purchase_date <  '2026-10-01'
group by supplier_name
order by total_kes desc;
```

Seconds, not tomorrow. And critically, the same question asked by two different people
returns the same answer — which is the actual point. Not speed. Agreement.

## One thing to do this week

Count your signs. Be honest — one to five, how many do you actually have?

**Zero or one:** your sheet is fine. Turn on version history and get on with running the
business. Anyone selling you a system today is selling you something you do not need.

**Two or three:** do steps one and two above. It is an afternoon of work and it will buy
you a year or more.

**Four or five:** you are past the point where tidying helps, and you are carrying real
risk — not theoretical risk, risk that has already shown up once. Start planning the move,
but start it from a clean sheet rather than from a vendor's demo.

---

If you are somewhere in the middle and want a straight answer about which of those steps
you actually need, that is exactly what a first call is for. I will tell you if the answer
is "your spreadsheet is fine" — that happens more often than you would think.
[Book a consultation](/book).
