import OperationsShell from "@/components/operations/OperationsShell";

export default function OperationsContactPage() {
  return (
    <OperationsShell active="Contact">
      <p className="text-[10px] font-bold uppercase text-indigo-800">Operations / Contact</p>
      <div className="mt-2 flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="text-3xl font-extrabold">Contact messages</h1>
          <p className="mt-2 text-sm text-slate-500">Review messages sent through the contact page.</p>
        </div>
        <span className="rounded-lg bg-white px-4 py-2.5 text-xs font-semibold text-indigo-900">0 messages</span>
      </div>

      <section className="mt-6 overflow-hidden rounded-2xl bg-white p-5 shadow-card sm:p-6">
        <div className="overflow-x-auto rounded-lg border border-slate-200">
          <table className="w-full min-w-[720px] text-left text-xs">
            <thead className="bg-slate-50 text-[10px] text-slate-500">
              <tr>
                {["Sender", "Email", "Subject", "Received", "Status", "Actions"].map((label) => (
                  <th key={label} className="px-3 py-3.5 font-semibold">{label}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              <tr>
                <td colSpan={6} className="px-4 py-12 text-center">
                  <p className="text-sm font-semibold text-slate-800">No contact messages yet</p>
                  <p className="mt-2 text-xs text-slate-500">Contact message delivery will be available when the backend is connected.</p>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>
    </OperationsShell>
  );
}
