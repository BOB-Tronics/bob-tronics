import Link from "next/link";

type FooterLink = {label: string, href: string };
type FooterColumn = {title: string, links: FooterLink[]};

const COLUMNS: FooterColumn[] = [
    {
        title: "Shop",
        links: [
            {label: "Phones", href:"/phones"},
            {label: "Laptops", href:"/laptops"},
            {label: "Accessories", href:"/accessories"},
            {label: "Gaming", href:"/gaming"},

        ],

    },
    {
        title: "Support",
        links:[
            {label: "Track Order", href:"/track-order "},
            {label: "IT Services", href:"/services"},
            {label: "Returns & warranty", href:"/returns-warranty"},
            {label: "Contact", href:"/contact"}
        ]
    },
    {
        title:"company",
        links:[
            {label: "About us", href:"/about"},
            {label: "Privacy Policy", href:"/privacy-policy"},
            {label: "Terms of Service", href:"terms-of-service"},
            {label: "FAQs", href:"/faqs"},
        ]
    }
    

];
type FooterProps = {
    brand?: string;
    tagline?: string;
    note?: string;
    copyright?: string;
    payments?: string;
    columns?: FooterColumn[];
};



export default function Footer({
    brand = "BOB TRONICS",
    tagline = "Your next upgrade. Your trusted technology partner.",
    note = "",
    copyright = `© ${new Date().getFullYear()} BOB TRONICS. Demo design. `,
    payments = "Mabile Money· Visa · Mastercard · Secure checkout",
    columns = COLUMNS,
}: FooterProps){

    return (
        <footer className="mt-auto bg-[#080E28] text-[#aab1cc]">
            <div className="mx-auto max-w-[1200px] px-5 pb-7 pt-14 sm:px-6 sm:pb-6 sm:pb-8 sm:pt-20">
                <div className="grid grid-cols-2 gap-x-6 gap-y-10 md:grid-colos-3 lg:grid-cols-[1.2fr_repeat(3,1fr)] lg:gap-12 ">
                    <div className="col-span-full lg:col-span-1">
                        <p className="text-3xl font-bold leading-tight text-white">{brand}</p>
                        <p className="mt-6 max-w-[22ch] text-xl leading-relaxed">{tagline}</p>
                        <p className="mt-5 max-w-[34ch] text-sm leading-relaxed text-[#8f97b8]">{note}</p>
                    </div>

                    {columns.map((col) => (
                        <nav key={col.title} aria-label={col.title}>
                            <h3 className="mb-4 text-lg font-semibold text-white">{col.title}</h3>
                            <ul className="grid gap-4">
                                {col.links.map((link)=> (
                                    <li key={link.label}>
                                        <Link href={link.href} className="rounded-sm transition-colors haver:text-white focus-visible:text-white focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white">{link.label}</Link>

                                    </li>
                                ))}


                            </ul>

                        </nav>
                    ))}
                </div>

                <div className="mt-14 flex flex-col items-start justify-between gap-3 text-[0.95rem] text-[#8f97b8] sm:flex-row sm:items-center">
                    <p>{copyright}</p>
                    <p>{payments}</p>
                </div>

            </div>
        </footer>

    );
}