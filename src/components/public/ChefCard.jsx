import Image from "next/image";
import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLocationDot, faStar } from "@fortawesome/free-solid-svg-icons";

export default function ChefCard({ chef }) {
  return (
    <article className="overflow-hidden rounded-lg bg-white shadow-sm ring-1 ring-primary/10 transition hover:-translate-y-1 hover:shadow-xl">
      <Link href={`/chefs/${chef.id}`} className="block focus:outline-none focus:ring-2 focus:ring-primary">
        <div className="relative aspect-[1.55] overflow-hidden">
          <Image src={chef.coverImage} alt={`${chef.brandName} kitchen`} fill sizes="(max-width: 768px) 100vw, 24vw" className="object-cover" />
          <span className="absolute right-3 top-3 rounded-full bg-white px-2.5 py-1 text-xs font-bold text-primary">
            {chef.rating}
          </span>
        </div>
      </Link>
      <div className="relative p-4 pt-10">
        <div className="absolute -top-9 left-4 h-16 w-16 overflow-hidden rounded-full border-4 border-white bg-white shadow-md">
          <Image src={chef.image} alt={chef.chefName} fill sizes="64px" className="object-cover" />
        </div>
        <Link href={`/chefs/${chef.id}`} className="text-base font-bold text-text-primary hover:text-primary">
          {chef.brandName}
        </Link>
        <p className="mt-1 text-xs font-semibold text-text-secondary">{chef.chefName}</p>
        <p className="mt-2 text-sm font-bold text-primary">{chef.specialty}</p>
        <p className="mt-2 line-clamp-2 text-xs leading-5 text-text-secondary">{chef.bio}</p>
        <div className="mt-4 flex items-center justify-between gap-3 text-[11px] text-text-secondary">
          <span>
            <FontAwesomeIcon icon={faStar} className="mr-1 h-3 w-3 text-primary" />
            {chef.rating} ({chef.reviews})
          </span>
          <span>
            <FontAwesomeIcon icon={faLocationDot} className="mr-1 h-3 w-3 text-primary" />
            {chef.distance}
          </span>
        </div>
      </div>
    </article>
  );
}
