import { deleteExperience, saveExperience } from "@/actions/admin";
import { prisma } from "@/lib/prisma";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";

type ExperienceRecord = Awaited<ReturnType<typeof prisma.experience.findMany>>[number];

/** Date input of type="month" expects "YYYY-MM". */
function monthValue(value: Date | null) {
  return value ? value.toISOString().slice(0, 7) : "";
}

function Form({ item }: { item?: ExperienceRecord }) {
  return (
    <form action={saveExperience} className="card grid gap-4 p-5">
      <input type="hidden" name="id" value={item?.id || ""} />

      <div className="grid gap-4 md:grid-cols-3">
        <div>
          <label className="label">Role</label>
          <input className="field" name="role" defaultValue={item?.role} required placeholder="Data Engineer — R&D & Data" />
        </div>
        <div>
          <label className="label">Company</label>
          <input className="field" name="company" defaultValue={item?.company} required />
        </div>
        <div>
          <label className="label">Location</label>
          <input className="field" name="location" defaultValue={item?.location ?? ""} placeholder="Nairobi, Kenya" />
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div>
          <label className="label">Start month</label>
          <input className="field" name="startDate" type="month" defaultValue={monthValue(item?.startDate ?? null)} required />
        </div>
        <div>
          <label className="label">End month</label>
          <input className="field" name="endDate" type="month" defaultValue={monthValue(item?.endDate ?? null)} />
          <p className="muted mt-2 text-xs">Leave blank if this is your current role.</p>
        </div>
      </div>

      <div>
        <label className="label">Summary</label>
        <input className="field" name="summary" defaultValue={item?.summary ?? ""} placeholder="One line describing the role." />
      </div>

      <div>
        <label className="label">Highlights</label>
        <textarea
          className="field min-h-40"
          name="highlights"
          defaultValue={item?.highlights.join("\n")}
          placeholder="One achievement per line."
        />
        <p className="muted mt-2 text-xs">One achievement per line. Blank lines are ignored.</p>
      </div>

      <div className="flex flex-wrap items-end gap-5">
        <div>
          <label className="label">Order</label>
          <input className="field w-28" name="sortOrder" type="number" min="0" defaultValue={item?.sortOrder ?? 0} />
        </div>
        <label className="mb-3 flex items-center gap-2 font-semibold">
          <input type="checkbox" name="published" defaultChecked={item?.published ?? true} /> Published
        </label>
        <button className="btn btn-primary">{item ? "Update" : "Add"} Role</button>
      </div>
    </form>
  );
}

export default async function AdminExperiencePage({
  searchParams
}: {
  searchParams: Promise<{ saved?: string; error?: string }>;
}) {
  const [items, query] = await Promise.all([
    prisma.experience.findMany({ orderBy: [{ sortOrder: "asc" }, { startDate: "desc" }] }),
    searchParams
  ]);

  return (
    <>
      <AdminPageHeader
        title="Experience"
        description="Your career history, shown on the About page. Lowest order number appears first."
      />
      {query.saved && <div className="alert-success mb-5">Experience saved.</div>}
      {query.error && <div className="alert-error mb-5">{query.error}</div>}

      <Form />

      <div className="mt-7 grid gap-5">
        {items.map((item) => (
          <div key={item.id}>
            <Form item={item} />
            <form action={deleteExperience} className="-mt-2 flex justify-end px-5 pb-3">
              <input type="hidden" name="id" value={item.id} />
              <button className="text-sm font-bold text-red-700">Delete</button>
            </form>
          </div>
        ))}
        {items.length === 0 && <p className="muted">No roles added yet.</p>}
      </div>
    </>
  );
}
