---
# ---------------------------------------------------------------------------
# POST TEMPLATE — copy this file, rename it, and replace everything marked TODO.
# The filename becomes the URL when `slug` is omitted: /blog/<filename>
#
# Set `draft: false` to publish. While draft is true the post is invisible
# everywhere: the blog index, the sitemap, the RSS feed and its own URL.
# ---------------------------------------------------------------------------
draft: true

# TODO: Write the title as the search phrase a client would actually type.
# Good:  "Why your BigQuery bill tripled after one dbt change"
# Weak:  "Thoughts on data warehousing"
title: "TODO: The problem, stated the way a client would search for it"

# Optional. Omit to use the filename. Keep it short, lowercase, hyphenated.
slug: "example-post-template"

# Publication date, YYYY-MM-DD. Controls ordering on the index.
date: "2026-08-19"

# Optional. Set when you substantially revise a published post.
# updated: "2026-09-01"

# TODO: 1-2 sentences. This becomes the meta description, the og:description
# and the excerpt on the index. Write it to earn the click from search results.
description: "TODO: One or two sentences describing the problem this post solves and who it is for."

# TODO: First tag is used as the category badge. Keep tags consistent across posts.
tags:
  - BigQuery
  - Data Engineering

# Optional. Path under /public, or a full URL. Used as the og:image for this post.
# cover: "/uploads/my-post-cover.png"

# Optional. Pins the post to the top of the index.
featured: false
---

TODO: Open with the reader's situation in one short paragraph — no preamble, no
"in today's data-driven world". State the symptom they would recognise from
their own systems, so they know within two lines that this post is about them.

## The problem

TODO: Describe the concrete problem. What broke, what was slow, what cost too
much, or what nobody could agree on. Be specific about the conditions that
caused it — volume, frequency, tooling, team size.

Write only what you have actually seen. If you are describing a client system,
keep it anonymous ("a logistics company running daily reconciliations") rather
than naming them without permission.

## The wrong way most people do it

TODO: Describe the common approach and why it fails. This is the section that
earns trust, because it shows you have hit the wall yourself.

Be fair to the wrong approach — explain why it is tempting and where it does
work. A strawman convinces nobody.

## How I solved it

TODO: Walk through your actual approach, in the order you did it. Show the
reasoning, not just the final answer.

Code blocks are syntax highlighted. Name the language after the opening fence:

```sql
-- TODO: replace with a real query from the work you are describing
select
  date_trunc(order_date, month) as month,
  count(*)                      as orders
from `project.dataset.orders`
where order_date >= date_sub(current_date(), interval 12 month)
group by month
order by month;
```

```python
# TODO: replace with the actual transformation or pipeline step
def load_daily_orders(client, table: str) -> int:
    job = client.query(f"select count(*) as n from `{table}`")
    return next(job.result()).n
```

If a diagram would explain it faster than prose, add a cover image or an inline
image under /public and reference it with `![alt text](/uploads/diagram.png)`.

## Result

TODO: State what changed. Use real numbers only — a runtime, a cost, a headcount
hour saved, a report that now lands before the morning meeting. If you do not
have a measured figure, describe the outcome qualitatively instead of inventing
one. A vague honest result beats a precise invented one, and invented numbers
are the fastest way to lose a technical reader.

## What I would do differently

TODO: Optional but valuable. One honest limitation, tradeoff, or thing you would
change next time. This section converts better than any amount of confidence,
because it reads like someone who has actually shipped the work.
