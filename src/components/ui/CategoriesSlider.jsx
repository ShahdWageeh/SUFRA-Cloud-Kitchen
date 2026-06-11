"use client";

import Image from "next/image";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import {
  faChevronLeft,
  faChevronRight,
} from "@fortawesome/free-solid-svg-icons";
import Link from "next/link";

export default function CategoriesSlider({ categories }) {
  return (
    <div className="flex items-center gap-4">
      <div className="custom-prev text-3xl pb-7 text-primary cursor-pointer">
        <FontAwesomeIcon icon={faChevronLeft} />
      </div>
      <Swiper
        modules={[Navigation]}
        navigation={{ prevEl: ".custom-prev", nextEl: ".custom-next" }}
        spaceBetween={24}
        breakpoints={{
          320: {
            slidesPerView: 2,
            spaceBetween: 16,
          },
          640: {
            slidesPerView: 3,
            spaceBetween: 20,
          },
          1024: {
            slidesPerView: 5,
            spaceBetween: 24,
          },
        }}
        className="categoriesSwiper"
      >
        {categories.map((category) => (
          <SwiperSlide key={category.id}>
            <Link
              href={`/meals/categories/${category.slug || category.id}`}
              className="text-center group cursor-pointer"
            >
              <div className="relative w-24 h-24 lg:w-32 lg:h-32 rounded-full bg-surface-low flex items-center justify-center mx-auto mb-4 transition group-hover:bg-primary overflow-hidden">
                {category.image ? (
                  <Image
                    src={category.image}
                    alt={category.title}
                    fill
                    sizes="(max-width: 1024px) 96px, 128px"
                    className="object-cover"
                    unoptimized
                  />
                ) : (
                  <FontAwesomeIcon
                    icon={category.icon}
                    className="text-3xl text-primary group-hover:text-white"
                  />
                )}
              </div>
              <h3>{category.title}</h3>
            </Link>
          </SwiperSlide>
        ))}
        <style jsx>{`
          :global(.swiper-pagination-bullet) {
            background: var(--primary-color, #d97706);
            opacity: 0.5;
          }
          :global(.swiper-pagination-bullet-active) {
            opacity: 1;
          }
        `}</style>
      </Swiper>
      <div className="custom-next text-3xl pb-7 text-primary cursor-pointer">
        <FontAwesomeIcon icon={faChevronRight} />
      </div>
    </div>
  );
}
