import Image from "next/image";
import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowRight,
  faLeaf,
  faMagnifyingGlass,
  faShieldHeart,
  faUsers,
  faUtensils,
} from "@fortawesome/free-solid-svg-icons";

const values = [
  {
    icon: faMagnifyingGlass,
    title: "Strict Vetting",
    text: "Every chef completes our kitchen, food-safety, and authenticity review before joining the community.",
  },
  {
    icon: faUtensils,
    title: "Heritage Recipes",
    text: "We celebrate family recipes, local ingredients, and the traditions that make every dish personal.",
  },
  {
    icon: faShieldHeart,
    title: "Safety First",
    text: "Transparent profiles, verified cooks, and careful handling standards keep every order dependable.",
  },
];

export default function AboutPage() {
  return (
    <main className="bg-background text-text-primary">
      <section className="mx-auto grid max-w-6xl items-center gap-10 px-4 py-12 sm:px-6 lg:grid-cols-[0.95fr_1.05fr] lg:px-8 lg:py-16">
        <div>
          <p className="text-[11px] font-bold uppercase tracking-wide text-primary">
            Authentic & Community-led
          </p>
          <h1 className="mt-3 max-w-xl text-4xl font-extrabold leading-tight sm:text-5xl">
            Bringing the Soul of <span className="text-primary">Home Cooking</span> to Your Table.
          </h1>
          <p className="mt-5 max-w-lg text-sm leading-6 text-text-secondary">
            Sufra lets talented home chefs share their heritage through fresh, soulful meals. We bring neighbors together around food that feels personal, warm, and full of care.
          </p>
          <div className="mt-7 flex flex-wrap gap-3">
            <Link href="/chefs" className="inline-flex items-center gap-2 rounded-full bg-primary px-5 py-3 text-xs font-bold text-white transition hover:bg-primary-container">
              Meet Our Chefs
              <FontAwesomeIcon icon={faArrowRight} className="h-3 w-3" />
            </Link>
            <Link href="/register/chef" className="inline-flex items-center gap-2 rounded-full border border-primary px-5 py-3 text-xs font-bold text-primary transition hover:bg-primary hover:text-white">
              Join Our Mission
            </Link>
          </div>
        </div>
        <div className="relative mx-auto w-full max-w-md lg:max-w-lg">
          <div className="relative aspect-[1] overflow-hidden rounded-xl">
            <Image src="/About1.png" alt="Home chef preparing dough in a warm kitchen" fill className="w-full h-full object-cover" />
          </div>
          <div className="absolute -bottom-5 left-5 rounded-lg bg-white p-4 shadow-[0_14px_28px_rgba(27,28,28,0.16)] ring-1 ring-primary/10">
            <div className="flex items-center gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-full bg-teal-50 text-teal-700">
                <FontAwesomeIcon icon={faLeaf} className="h-4 w-4" />
              </span>
              <div>
                <p className="text-xs font-bold">Verified Home Kitchens</p>
                <p className="text-[10px] text-text-secondary">Cooked with care</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 pb-12 sm:px-6 lg:px-8">
        <div className="rounded-2xl bg-secondary-container px-5 py-8 sm:px-8 lg:px-10">
          <div className="text-center">
            <h2 className="text-2xl font-bold">The Sufra Story</h2>
            <p className="mx-auto mt-2 max-w-2xl text-sm text-text-secondary">
              From a small family table to a trusted local movement, our journey began with one simple idea: food made at home carries memory.
            </p>
          </div>

          <div className="mt-8 grid gap-6 lg:grid-cols-[1.05fr_0.95fr]">
            <div className="grid gap-5">
              <article className="rounded-lg bg-white p-6 shadow-sm">
                <h3 className="text-sm font-bold text-primary">The Spark</h3>
                <p className="mt-3 text-sm leading-6 text-text-secondary">
                  We started when our founders, realized how many gifted home cooks were preparing extraordinary meals without a platform to reach nearby food lovers. Sufra became that bridge.
                </p>
              </article>

              <div className="grid gap-4 sm:grid-cols-2">
                <article className="rounded-lg bg-teal-700 p-6 text-white">
                  <FontAwesomeIcon icon={faShieldHeart} className="h-5 w-5" />
                  <h3 className="mt-5 text-lg font-bold">Sustainable Impact</h3>
                  <p className="mt-2 text-xs leading-5 text-white/85">
                    Local sourcing and home-based kitchens reduce waste and support neighborhood economies.
                  </p>
                </article>
                <article className="rounded-lg bg-primary p-6 text-white">
                  <FontAwesomeIcon icon={faUsers} className="h-5 w-5" />
                  <h3 className="mt-5 text-lg font-bold">2,000+ Chefs</h3>
                  <p className="mt-2 text-xs leading-5 text-white/85">
                    Empowering passionate cooks to earn from the recipes they love most.
                  </p>
                </article>
              </div>
            </div>

            <article className="relative min-h-80 overflow-hidden rounded-lg">
              <Image src="/About2.jpg" alt="Shared plates of home-cooked meals" fill sizes="(max-width: 1024px) 90vw, 38vw" className="object-cover" />
              <div className="absolute inset-0 bg-linear-to-t from-black/65 via-black/10 to-transparent" />
              <div className="absolute bottom-5 left-5 right-5 text-white">
                <p className="text-xs font-bold uppercase tracking-wide">Community Over Everything</p>
                <p className="mt-2 text-sm leading-5 text-white/85">
                  Every order helps preserve culture, support cooks, and build local connection.
                </p>
              </div>
            </article>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-10 text-center sm:px-6 lg:px-8">
        <h2 className="text-2xl font-bold">Empowering Through Excellence</h2>
        <div className="mt-8 grid gap-6 md:grid-cols-3">
          {values.map((value) => (
            <article key={value.title} className="px-4">
              <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
                <FontAwesomeIcon icon={value.icon} className="h-5 w-5" />
              </span>
              <h3 className="mt-4 text-sm font-bold">{value.title}</h3>
              <p className="mt-2 text-xs leading-5 text-text-secondary">{value.text}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
        <article className="grid gap-6 rounded-xl bg-white p-5 shadow-[0_12px_35px_rgba(27,28,28,0.08)] ring-1 ring-primary/10 md:grid-cols-[180px_1fr] md:items-center md:p-6">
          <div className="relative aspect-square overflow-hidden rounded-lg">
            <Image src="/avatar.jpg" alt="Sufra founder portrait" fill sizes="180px" className="object-cover" />
          </div>
          <div>
            <blockquote className="text-xl font-bold leading-snug">
              &quot;We are building a world where every kitchen is a gateway to a different culture.&quot;
            </blockquote>
            <p className="mt-2 text-sm font-semibold text-primary">- Mustafa, Founder & CEO</p>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-text-secondary">
              Sufra was founded on the belief that the best meals are cooked by people who carry stories, tradition, and pride into every dish.
            </p>
            <div className="mt-5 flex flex-wrap gap-8">
              <span>
                <span className="block text-lg font-bold text-primary">150k+</span>
                <span className="text-xs text-text-secondary">Meals Served</span>
              </span>
              <span>
                <span className="block text-lg font-bold text-primary">$2.4M</span>
                <span className="text-xs text-text-secondary">Chef Earnings</span>
              </span>
            </div>
          </div>
        </article>
      </section>

      <section className="mx-auto max-w-6xl px-4 pb-14 pt-8 sm:px-6 lg:px-8">
        <div className="rounded-xl bg-primary px-6 py-10 text-center text-white">
          <h2 className="text-3xl font-bold">Taste the difference of home.</h2>
          <p className="mx-auto mt-3 max-w-xl text-sm text-white/85">
            Join our community of local chefs and neighbors discovering food made with heritage, care, and soul.
          </p>
          <Link href="/meals" className="mt-6 inline-flex rounded-full bg-white px-7 py-3 text-xs font-bold text-primary transition hover:bg-secondary-container">
            Start Browsing Today
          </Link>
        </div>
      </section>
    </main>
  );
}
