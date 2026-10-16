import Image from "next/image";
import Link from "next/link";
import { ArrowRightIcon, HeadsetIcon, HeartIcon, ShieldIcon } from "@/components/ui/Icons";
import Card from "@/components/ui/Card";
import PageHeader from "@/components/ui/PageHeader";

export const metadata = { title: "About · BOB TRONICS" };

const principles = [
  { title: "Integrity", text: "Genuine products. Transparent advice. Clear commitments.", Icon: ShieldIcon },
  { title: "Expertise", text: "Practical knowledge that turns questions into confident decisions.", Icon: HeadsetIcon },
  { title: "Care", text: "People-first support, long after the purchase.", Icon: HeartIcon },
];

export default function AboutPage() {
  return (
    <div className="auth-background text-ink">
      <div className="page-container pb-14">
        <PageHeader crumbs={[{ label: "Home", href: "/" }, { label: "About" }]} title="About BOB TRONICS" subtitle="Genuine tech. Expert support. Delivered." />
        <section className="grid overflow-hidden rounded-3xl bg-navy text-white shadow-card lg:min-h-[560px] lg:grid-cols-[0.8fr_1.2fr]">
          <div className="flex flex-col items-start justify-center p-8 sm:p-12 lg:p-14">
            <p className="text-sm font-bold uppercase tracking-wide text-white/70">Technology that moves you forward</p>
            <h2 className="mt-5 text-4xl font-bold leading-tight sm:text-5xl">Progress starts with the right partner.</h2>
            <p className="mt-6 max-w-lg text-lg leading-relaxed text-white/80">BOB TRONICS brings premium technology retail and thoughtful IT expertise together—so people and businesses can move forward with confidence.</p>
            <Link href="/shop" className="mt-8 inline-flex items-center gap-2 rounded-lg bg-primary px-5 py-3 font-semibold text-white hover:bg-primary-dark">Explore our products <ArrowRightIcon size={18} /></Link>
          </div>
          <div className="relative min-h-[320px] lg:min-h-full">
            <Image src="/images/hero-devices.png" alt="Technology devices ready for work and creativity" fill priority sizes="(min-width: 1024px) 60vw, 100vw" className="object-cover" />
            <div className="absolute inset-0 bg-gradient-to-r from-navy/30 via-transparent to-transparent" />
          </div>
        </section>

        <section className="mt-14 grid gap-8 md:grid-cols-[0.55fr_1fr] md:items-start">
          <div><p className="text-xs font-bold uppercase text-primary">Our story</p><h2 className="mt-3 text-3xl font-bold leading-tight sm:text-4xl">Better technology. A better experience.</h2></div>
          <div className="space-y-4 text-lg leading-relaxed text-ink/85"><p>Technology should make life simpler, not more complicated. Our vision is a store where genuine products, clear advice and dependable support come together.</p><p className="text-muted">From choosing your first laptop to connecting an entire office, we focus on what matters: understanding your needs, recommending the right solution and standing behind it after the sale.</p><div className="rounded-lg bg-accent p-4 text-sm"><p className="font-semibold text-primary">About this company profile</p><p className="mt-1 text-muted">This story and all business details are illustrative content for the BOB TRONICS demo application, not verified company facts.</p></div></div>
        </section>

        <section className="mt-14">
          <h2 className="mb-6 text-2xl font-bold">The principles behind every upgrade</h2>
          <div className="grid gap-5 md:grid-cols-3">{principles.map(({ title, text, Icon }) => <Card key={title}><Icon size={28} className="text-primary" /><h3 className="mt-4 text-2xl font-bold">{title}</h3><p className="mt-3 text-muted">{text}</p></Card>)}</div>
        </section>

        <Card className="mt-7"><h2 className="text-xl font-bold">Retail and expertise, under one roof</h2><p className="mt-4 text-lg">Phones, laptops, accessories and gaming technology—plus consulting, technical support, network setup and business IT care. One trusted destination for what comes next.</p><div className="mt-5 flex flex-wrap gap-3"><Link href="/shop" className="rounded-lg bg-primary px-5 py-3 font-semibold text-white hover:bg-primary-dark">Shop Products</Link><Link href="/it-services" className="rounded-lg border border-line px-5 py-3 font-semibold text-primary hover:bg-surface">Explore IT Services</Link><Link href="/contact" className="rounded-lg border border-line px-5 py-3 font-semibold text-primary hover:bg-surface">Talk to our team</Link></div></Card>
      </div>
    </div>
  );
}
