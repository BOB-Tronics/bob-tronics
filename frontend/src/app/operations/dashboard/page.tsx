import Link from "next/link";
const navigation = [
  ["▦", "Dashboard"],
  ["⬡", "Products"],
  ["▦", "Categories"],
  ["♧", "Inventory"],
  ["▣", "Orders"],
  ["♙", "Customers"],
  ["▤", "Payments"],
  ["▱", "Deliveries"],
  ["⚒", "IT Requests"],
  ["☆", "Reviews"],
  ["♧", "Notifications"],
  ["⌁", "Reports"],
  ["⚙", "Settings"],
];

const metrics = [
  { label: "Revenue", value: "RWF 248,600", note: "↑ 18.6% vs previous month", tone: "good" },
  { label: "Sales", value: "RWF 262,400", note: "↑ 14.2% gross sales", tone: "good" },
  { label: "Orders", value: "142", note: "↑ 12.7% vs previous month", tone: "good" },
  { label: "Customers", value: "89", note: "↑ 9.8% new customers", tone: "good" },
  { label: "Products", value: "190", note: "12 added this month", tone: "good" },
  { label: "Low Stock", value: "8", note: "Requires replenishment", tone: "warning" },
  { label: "Deliveries", value: "24", note: "6 ready to dispatch", tone: "good" },
  { label: "IT Requests", value: "18", note: "4 awaiting assignment", tone: "good" },
];

const orders = [
  ["BT-10482", "David Shema", "RWF 14,080", "Paid", "Packed"],
  ["BT-10481", "Kofi Asante", "RWF 7,280", "Paid", "Processing"],
  ["BT-10480", "Esi Boateng", "RWF 12,880", "Pending", "Confirmed"],
  ["BT-10479", "Kwame Owusu", "RWF 3,880", "Paid", "Delivered"],
];

const requests = [
  ["BT-SR-2041", "Network & Setup", "06 Oct · 10AM", "Scheduled"],
  ["BT-SR-2040", "Technical", "03 Oct · 2PM", "Pending"],
  ["BT-SR-2039", "Support", "04 Oct · 11AM", "Assigned"],
  ["", "IT Consulting", "", ""],
];

const activity = [
  ["14:32 · Today", "Payment received", "Ama Mensah · GHC 14,080"],
  ["14:20 · Today", "New IT request", "Network & Setup · BT-SR-2041"],
  ["13:50 · Today", "Stock updated", "MacBook Air M3 · +10 units"],
  ["13:15 · Today", "Delivery completed", "Order BT-10479 · Osu"],
];

function Panel({ title, children, className = "" }: { title: string; children: React.ReactNode; className?: string }) {
  return (
    <section className={`min-w-0 rounded-2xl border border-white/70 bg-white p-5 shadow-[0_8px_28px_rgba(29,45,99,.07)] sm:p-6 ${className}`}>
      <h2 className="mb-5 text-lg font-bold tracking-tight text-slate-800">{title}</h2>
      {children}
    </section>
  );
}

function RevenueChart() {
  return (
    <div className="mt-4">
      <div className="relative h-52 sm:h-60">
        <div className="absolute inset-y-0 left-0 flex flex-col justify-between pb-7 text-[10px] text-slate-400">
          <span>250k</span><span>200k</span><span>150k</span><span>100k</span><span>50k</span>
        </div>
        <svg viewBox="0 0 620 250" preserveAspectRatio="none" className="ml-8 h-full w-[calc(100%-2rem)]" role="img" aria-label="Revenue increased through September">
          {[20, 70, 120, 170, 220].map((y) => <line key={y} x1="0" y1={y} x2="620" y2={y} stroke="#e5eaf3" strokeWidth="1" />)}
          <path d="M8 190 C38 172 52 176 78 150 S115 105 145 119 S185 127 205 91 S244 116 275 99 S309 48 342 68 S380 86 402 45 S446 13 468 34 S504 65 526 25 S565 17 583 27 S605 31 616 16" fill="none" stroke="#10139a" strokeWidth="4" strokeLinecap="round" />
          <path d="M8 190 C38 172 52 176 78 150 S115 105 145 119 S185 127 205 91 S244 116 275 99 S309 48 342 68 S380 86 402 45 S446 13 468 34 S504 65 526 25 S565 17 583 27 S605 31 616 16 L616 220 L8 220 Z" fill="url(#revenueFill)" opacity=".08" />
          <defs><linearGradient id="revenueFill" x1="0" x2="0" y1="0" y2="1"><stop stopColor="#10139a" /><stop offset="1" stopColor="#10139a" stopOpacity="0" /></linearGradient></defs>
        </svg>
        <div className="absolute bottom-0 left-8 right-0 flex justify-between text-[10px] text-slate-400"><span>01 Sep</span><span>07 Sep</span><span>14 Sep</span><span>21 Sep</span><span>30 Sep</span></div>
      </div>
      <div className="mt-4 flex gap-2 pl-6 text-xs text-slate-500"><span className="text-indigo-800">━━</span> Revenue <span className="ml-3">Previous period · September 2026</span></div>
    </div>
  );
}

export default function OperationsDashboardPage() {
  return (
    <div className="operations-dashboard min-h-screen bg-[#e9edff] text-slate-900 lg:flex">
      <style>{`body:has(.operations-dashboard) > header, body:has(.operations-dashboard) > footer { display: none; }`}</style>
      <aside className="flex shrink-0 flex-col bg-[#080e29] px-5 py-5 text-white lg:sticky lg:top-0 lg:h-screen lg:w-[220px]">
        <Link href="/operations/dashboard" className="mb-7 text-xl font-extrabold tracking-tight">BOB TRONICS</Link>
        <p className="mb-4 text-[10px] font-semibold uppercase tracking-wide text-slate-500">Operations workspace</p>
        <nav aria-label="Operations" className="no-scrollbar -mx-1 flex gap-1 overflow-x-auto pb-2 lg:mx-0 lg:flex-col lg:min-h-0 lg:flex-1 lg:overflow-y-auto lg:overscroll-contain">
          {navigation.map(([icon, label], index) => (
            <Link key={label} href={index === 0 ? "/operations/dashboard" : label === "Products" ? "/operations/products" : label === "Categories" ? "/operations/categories" : label === "Inventory" ? "/operations/inventory" : label === "Orders" ? "/operations/orders" : label === "Customers" ? "/operations/customers" : label === "Payments" ? "/operations/payments" : label === "IT Requests" ? "/operations/it-requests" : label === "Reviews" ? "/operations/reviews" : label === "Notifications" ? "/operations/notifications" : label === "Reports" ? "/operations/reports" : label === "Deliveries" ? "/operations/deliveries" : label === "Settings" ? "/operations/settings" : "#"} aria-current={index === 0 ? "page" : undefined} className={`flex shrink-0 items-center gap-3 rounded-lg px-3 py-2.5 text-xs font-medium transition-colors ${index === 0 ? "bg-[#1013a6] text-white" : "text-slate-400 hover:bg-white/5 hover:text-white"}`}>
              <span aria-hidden="true" className="w-4 text-center text-base">{icon}</span>{label}
            </Link>
          ))}
        </nav>
        <div className="mt-auto hidden space-y-6 pt-8 lg:block">
          <div className="rounded-xl bg-[#efefff] p-4 text-[#10139a]">
            <p className="text-sm font-bold">All systems operational</p>
            <p className="mt-1 text-xs text-slate-500">Last sync · 1 minute ago</p>
          </div>
          <p className="text-[11px] leading-relaxed text-slate-500">Demo workspace · Kigali,<br />Rwanda</p>
        </div>
      </aside>

      <div className="min-w-0 flex-1">
        <header className="flex h-[70px] items-center justify-between border-b border-slate-100 bg-white px-5 sm:px-8">
          <p className="text-sm font-semibold text-slate-800">Workspace / Dashboard</p>
          <div className="flex items-center gap-4 text-indigo-800"><button aria-label="Notifications" className="text-lg">♧</button><span className="grid h-8 w-8 place-items-center rounded-full bg-indigo-50 text-xs font-bold">EK</span></div>
        </header>

        <main className="min-h-[calc(100vh-70px)] bg-[linear-gradient(135deg,#e0e5fa_0%,#edf0ff_45%,#dfe5fa_100%)] px-4 py-7 sm:px-7 lg:px-8">
          <div className="mx-auto max-w-[1500px]">
            <p className="text-[10px] font-bold uppercase text-indigo-800">Operations / Dashboard</p>
            <div className="mt-2 flex flex-wrap items-end justify-between gap-4">
              <div><h1 className="text-3xl font-extrabold tracking-tight text-slate-900 sm:text-[34px]">Your operations, at a glance.</h1><p className="mt-2 text-sm text-slate-500">Thursday, 01 October 2026 · Welcome back, Emmanuel.</p></div>
              <div className="flex flex-wrap gap-2.5">
                <select aria-label="Date range" defaultValue="01–30 Sep 2026" className="h-11 rounded-lg border-0 bg-white px-4 text-xs font-semibold text-indigo-900 shadow-sm"><option>01–30 Sep 2026</option><option>01–31 Aug 2026</option><option>01–31 Jul 2026</option></select>
                <button className="h-11 rounded-lg bg-white px-4 text-xs font-semibold text-indigo-900 shadow-sm hover:bg-indigo-50">Export report</button>
                <button className="h-11 rounded-lg bg-[#10139a] px-4 text-xs font-semibold text-white shadow-sm hover:bg-[#080c75]">＋ Add product</button>
              </div>
            </div>

            <div className="mt-6 rounded-lg border border-white/70 bg-[#f0efff] px-4 py-3.5">
              <p className="text-sm font-bold text-indigo-900">8 products are running low</p>
              <p className="mt-1 text-xs text-slate-500">Review inventory and restock before your next busy day.</p>
            </div>

            <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
              {metrics.map((item) => <article key={item.label} className="rounded-2xl border border-white/70 bg-white p-5 shadow-[0_8px_28px_rgba(29,45,99,.07)]"><p className="text-xs text-slate-500">{item.label}</p><p className="mt-4 text-[27px] font-extrabold tracking-tight text-slate-900">{item.value}</p><p className={`mt-3 text-[10px] font-medium ${item.tone === "warning" ? "text-amber-700" : "text-emerald-700"}`}>{item.note}</p></article>)}
            </div>

            <div className="mt-6 grid gap-5 xl:grid-cols-2">
              <Panel title="Revenue">
                <div className="flex items-center justify-between"><p className="text-[26px] font-extrabold tracking-tight">RWF 248,600</p><span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">↑ 18.6%</span></div>
                <RevenueChart />
              </Panel>
              <Panel title="Sales by category">
                <p className="text-[26px] font-extrabold tracking-tight">142 orders</p>
                <div className="mt-4 space-y-4">
                  {[["Laptops", "42%", "RWF 110,208", "55%"], ["Phones", "34%", "RWF 89,216", "44%"], ["Gaming", "15%", "RWF 39,360", "20%"], ["Accessories", "9%", "RWF 23,616", "12%"]].map(([name, percent, amount, width]) => <div key={name}><div className="mb-2 flex justify-between text-xs"><span>{name} · {percent}</span><strong>{amount}</strong></div><div className="h-2.5 rounded-full bg-slate-100"><div className="h-full rounded-full bg-[#10139a]" style={{ width }} /></div></div>)}
                </div>
                <p className="mt-5 text-[11px] text-slate-400">Gross sales · September 2026</p>
              </Panel>
            </div>

            <Panel title="Recent orders" className="mt-5">
              <div className="overflow-x-auto rounded-lg border border-slate-200">
                <table className="w-full min-w-[720px] text-left text-xs">
                  <thead className="bg-slate-50 text-[10px] text-slate-500"><tr>{["Order", "Customer", "Amount", "Payment", "Delivery", "Action"].map((head) => <th key={head} className="px-3 py-3 font-semibold">{head}</th>)}</tr></thead>
                  <tbody>{orders.map((row) => <tr key={row[0]} className="border-t border-slate-200"><th className="px-3 py-4 font-bold">{row[0]}</th>{row.slice(1).map((value, i) => <td key={i} className="px-3 py-4">{value}</td>)}<td className="px-3 py-4"><a href="#" className="font-semibold text-indigo-800">Manage →</a></td></tr>)}</tbody>
                </table>
              </div>
              <button className="mt-4 rounded-lg border border-slate-200 px-4 py-2.5 text-xs font-semibold text-indigo-900 hover:bg-indigo-50">View all orders</button>
            </Panel>

            <div className="mt-5 grid gap-5 xl:grid-cols-2">
              <Panel title="IT requests needing attention">
                <div className="overflow-x-auto rounded-lg border border-slate-200">
                  <table className="w-full min-w-[450px] text-left text-[11px]">
                    <thead className="bg-slate-50 text-[10px] text-slate-500"><tr>{["Request", "Service", "Appointment", "Status"].map((head) => <th key={head} className="px-3 py-3 font-semibold">{head}</th>)}</tr></thead>
                    <tbody>{requests.map((row, i) => <tr key={i} className="border-t border-slate-200">{row.map((value, j) => <td key={j} className="px-3 py-4">{j === 3 && value ? <span className="font-semibold text-indigo-700">{value}</span> : value || "—"}</td>)}</tr>)}</tbody>
                  </table>
                </div>
              </Panel>
              <Panel title="Recent activity">
                <ol className="space-y-4">{activity.map(([time, title, detail]) => <li key={title}><p className="text-[10px] text-slate-400">{time}</p><p className="mt-1 text-xs font-bold text-slate-800">{title}</p><p className="mt-1 text-xs text-slate-500">{detail}</p></li>)}</ol>
              </Panel>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}














