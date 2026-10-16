import Image from "next/image";
import Button from "@/components/ui/Button";
import { ArrowRightIcon } from "@/components/ui/Icons";

export default function Hero() {
  return (
    <section className="relative overflow-hidden bg-hero text-white">
      {/* Full-bleed background GIF */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/images/home.gif"
          alt="Laptops, phones, consoles and accessories sold by BOB TRONICS"
          fill
          priority
          className="object-cover opacity-60"
          sizes="100vw"
        />
      </div>

      {/* Decorative network lines and dots from the design */}
      <svg
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 h-full w-full opacity-60 z-10"
        viewBox="0 0 1280 660"
        preserveAspectRatio="xMidYMid slice"
      >
        <g stroke="#2f6fd6" strokeWidth="1.2" fill="none">
          <path d="M-20 120 L420 300 L760 40" />
          <path d="M100 660 L560 260 L1100 620" />
          <path d="M700 0 L980 420 L1300 300" />
          <path d="M240 0 L310 230" />
          <path d="M900 660 L1180 120" />
        </g>
        <g fill="#2f6fd6">
          <circle cx="420" cy="300" r="7" />
          <circle cx="560" cy="260" r="5" />
          <circle cx="980" cy="420" r="9" />
          <circle cx="310" cy="230" r="4" />
          <circle cx="1180" cy="120" r="6" />
          <circle cx="760" cy="40" r="5" />
        </g>
      </svg>

      <div className="page-container relative grid items-center gap-10 py-14 lg:grid-cols-[1.05fr_1fr] lg:py-20 z-20">
        <div>
          <h1 className="text-4xl font-bold leading-[1.1] tracking-tight sm:text-5xl lg:text-6xl">
            Technology That Moves You Forward.
          </h1>
          <p className="mt-6 max-w-xl text-lg text-white/80">
            Exceptional devices. Expert solutions. Discover technology built for the way you live, work and
            play.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Button href="/shop" size="lg">
              <ArrowRightIcon size={18} /> Shop Products
            </Button>
            <Button href="/it-services" size="lg" variant="white">
              Explore IT Services
            </Button>
          </div>
          <p className="mt-6 text-sm text-white/70">Apple · Samsung · Dell · Sony · HP</p>
        </div>
      </div>
    </section>
  );
}
