"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRight, faStar } from "@fortawesome/free-solid-svg-icons";
import { chefService } from "@/services";
import { normalizeFeaturedChef } from "@/utils/chefUtils";

export default function LandingFeaturedChefsSection() {
  const [chefs, setChefs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let isMounted = true;

    async function loadChefs() {
      try {
        setIsLoading(true);
        setError("");
        const response = await chefService.getVerifiedChefs();
        const nextChefs = (response.data || [])
          .slice(0, 3)
          .map(normalizeFeaturedChef);

        if (isMounted) {
          setChefs(nextChefs);
        }
      } catch (err) {
        if (isMounted) {
          setError(err.response?.data?.message || "Featured chefs are unavailable right now.");
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    loadChefs();

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <section className="py-20 bg-surface-low">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="flex justify-between items-center mb-12">
          <h2 className="text-3xl lg:text-4xl font-bold">
            Meet Our Featured Chefs
          </h2>
          <Link href="/chefs" className="text-primary flex items-center gap-2">
            See All
            <FontAwesomeIcon icon={faArrowRight} />
          </Link>
        </div>

        {isLoading ? (
          <p className="text-text-secondary">Loading featured chefs...</p>
        ) : error ? (
          <p className="text-text-secondary">{error}</p>
        ) : (
          <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-8">
            {chefs.map((chef) => (
              <Link
                key={chef.id}
                href={`/chefs/${chef.id}`}
                className="bg-white p-6 rounded-3xl flex items-center gap-5 shadow transition hover:shadow-lg"
              >
                <Image
                  src={chef.image}
                  alt={chef.name}
                  width={90}
                  height={90}
                  className="rounded-full object-cover"
                />

                <div>
                  <h3 className="font-bold text-lg">{chef.name}</h3>
                  <p className="text-primary mb-2">{chef.specialty}</p>
                  <div className="flex items-center gap-2 text-sm">
                    <FontAwesomeIcon icon={faStar} className="text-yellow-500" />
                    {chef.rating}
                    <span>({chef.reviews} Reviews)</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
