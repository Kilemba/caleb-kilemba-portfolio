---
draft: false
title: "The money leaking from your counter"
slug: "pos-voids-discounts-margin-leakage"
date: "2026-09-11"
description: "Voids, manual discounts and no-sale drawer opens rarely look like theft in the moment. Here is how to find the pattern in your POS data before it eats a year of margin."
tags:
  - POS
  - Small Business
  - Analytics
featured: false
---

A Nairobi eatery does about four hundred transactions a day. Nobody steals a whole meal —
that would be noticed. What happens instead is quieter: a void here because "the customer
changed their mind", a staff discount there, a drawer opened without a sale to give
somebody change. Each one is defensible on its own. Two hundred of them a month is a
salary.

The problem is not that owners are careless. It is that leakage never arrives as one
obvious event. It arrives as a rate, and rates are invisible unless you count them.

## The decision you are actually stuck on

You suspect something is off. Stock does not quite reconcile, or margin is a few points
below where it should be, and you cannot point at anything specific. So you are left
choosing between two bad options:

- Accuse someone on a hunch, poison the team, and possibly be wrong.
- Do nothing and absorb it.

There is a third option, and it is boring: **count the exceptions and compare people to
each other.** You are not trying to catch anyone. You are trying to find out whether the
numbers are normal.

## The data you already have

Every POS worth the name logs more than sales. Somewhere in the back office export there
are records of:

- **Voids** — a line or a whole sale removed before payment
- **Refunds and returns** — money going back out after the fact
- **Manual discounts** — a price overridden at the till
- **No-sale / drawer opens** — the cash drawer opened without a transaction
- **Price overrides** — an item rung at something other than its set price
- **Reprints** — a receipt printed again

Each of those rows usually carries a **timestamp**, a **till or terminal ID**, and a
**cashier or user ID**. Those three fields are the whole method. You do not need the
transaction detail; you need who, when, and how often.

If your POS does not export these, that is itself the finding — and it is a good reason to
change system, because you are running a cash business with no exception trail.

## How to read it, simply

The single most useful number is not a total. It is a **rate per cashier**.

Totals mislead you, because the person who works the most shifts will always have the most
voids. What you want is voids *as a share of their own transactions*, so that everyone is
compared on equal footing.

In a spreadsheet, per cashier over a full month:

```
void_rate      = voids ÷ total transactions
discount_rate  = discounted sales ÷ total transactions
discount_value = total KES discounted ÷ total KES sold
```

Then put every cashier in one table and look down the column. You are not looking for a
number that is "bad" — there is no universal threshold. You are looking for someone who is
**a long way from everyone else doing the same job**.

### An illustrative example

Made-up figures, to show what the pattern looks like rather than to describe a real case:

| Cashier | Transactions | Voids | Void rate | Discount value |
| --- | --- | --- | --- | --- |
| A | 1,840 | 22 | 1.2% | 0.9% |
| B | 1,610 | 19 | 1.2% | 1.1% |
| C | 1,950 | 141 | **7.2%** | 1.0% |
| D | 1,720 | 24 | 1.4% | 0.8% |

Cashier C is not slightly higher. C is six times the rest of the team, and the discount
column is normal — which makes it harder to explain as "they work the difficult shift".
That is the signal. It is still not proof of anything, and it should not be treated as
proof. It is the point at which you go and look properly.

## The second cut: when

Take the same exception records and pivot them by **hour of day**. Leakage clusters, and
where it clusters tells you what kind of problem you have.

- **Concentrated in the last hour before closing** — reconciliation pressure. Sales get
  voided so the drawer matches at cash-up.
- **Concentrated at the quietest hours** — opportunity. Fewer eyes, fewer customers
  watching the screen.
- **Concentrated during the rush** — probably genuine. Mistakes rise when the queue is
  long, and voids are how you correct them.

That third case matters, because it is the one where the honest answer is "this is fine".
A high void rate during a 1pm rush in a busy eatery is a training and screen-layout issue,
not a trust issue. Reading the hour saves you from accusing a good cashier of theft when
the real problem is that two menu buttons sit next to each other.

## The third cut: pairs

If the exception log records both the cashier and the person who authorised the override —
many systems require a supervisor PIN for voids above a threshold — count the **pairs**.

A cashier whose voids are spread across every supervisor is behaving differently from one
whose voids are almost always approved by the same person. The second pattern is the one
that warrants a conversation, and it is completely invisible unless you count the
combination rather than each name separately.

```sql
select
  cashier_id,
  approver_id,
  count(*)                                              as voids,
  round(sum(amount))                                    as void_value_kes
from pos_exceptions
where exception_type = 'VOID'
  and occurred_at >= date_sub(current_date(), interval 30 day)
group by cashier_id, approver_id
having count(*) > 5
order by void_value_kes desc;
```

## What this actually unlocks

**A threshold you can defend.** Once you know your team's normal void rate, you can set a
policy — anything above it needs a supervisor PIN — and it is based on your own data rather
than a number from the internet.

**A conversation instead of an accusation.** "Your void rate is six times the team's, talk
me through it" is a management conversation. "I think you are stealing" is a fight you may
lose and cannot take back.

**A fix that is sometimes not about people at all.** Plenty of leakage turns out to be a
badly laid out screen, an item priced wrong in the system, or a policy nobody understands.
Counting first tells you which kind of problem you have.

**A number you can watch.** Once the rate is calculated, it takes minutes each month.
Leakage that is being measured tends to stop, which is most of the value.

## A word on how you use this

Exception data tells you where to *look*. It does not tell you what happened, and it is
not evidence of dishonesty on its own. People have bad weeks, difficult shifts and
genuinely broken buttons. Treat an outlier as the start of an enquiry, follow your own
disciplinary process, and be prepared to find that the answer is boring.

Used that way it protects good staff as much as it catches bad practice — because right
now, if your margin is soft and you have no data, suspicion falls on everybody.

## One thing to do this week

Export last month's exception log from your POS. Build one table: every cashier, their
transaction count, their void count, and voids as a percentage of their own transactions.

Sort by that last column. If the top row is close to the others, you have just bought
yourself certainty for an hour's work. If it is not, you now know exactly where to look.

---

If your POS will not export this cleanly, or you want the rate tracked automatically each
month rather than rebuilt by hand, that is straightforward to set up.
[Book a consultation](/book) and we will look at what your system can actually give you.
