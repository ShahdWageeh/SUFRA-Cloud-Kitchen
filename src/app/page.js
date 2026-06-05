import Image from "next/image";
import { categories, meals, chefs, testimonials } from "@/data/landingData";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import CategoriesSlider from "@/components/ui/CategoriesSlider";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faLocationDot,
  faArrowRight,
  faCartShopping,
  faStar,
  faMagnifyingGlass,
  faHandPointer,
  faUtensils,
  faWandMagicSparkles,
  faMessage,
  faQuoteRight,
} from "@fortawesome/free-solid-svg-icons";
import Link from "next/link";

export default function HomePage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main>
        {/* HERO SECTION */}

        <section className="relative min-h-[90vh] flex items-center">
          <div className="absolute inset-0">
            <Image
              src="/heroEnhance.jpeg"
              alt="Hero"
              fill
              priority
              className="object-cover"
            />

            <div className="absolute inset-0 bg-black/50" />
          </div>

          <div className="container mx-auto px-4 lg:px-8 relative z-10">
            <div className="max-w-3xl text-white">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
                Taste The Love Of Home
              </h1>

              <p className="text-lg lg:text-2xl mb-8 text-gray-200">
                Discover authentic home-cooked meals prepared by talented local
                chefs and delivered fresh to your door.
              </p>

              <div className="bg-white p-2 rounded-3xl flex flex-col md:flex-row gap-2 max-w-2xl">
                <div className="flex items-center flex-1 px-4">
                  <FontAwesomeIcon
                    icon={faLocationDot}
                    className="text-primary text-2xl"
                  />

                  <input
                    type="text"
                    placeholder="Enter your delivery location"
                    className="w-full ml-3 outline-none text-black"
                  />
                </div>

                <button className="bg-primary text-white px-28 py-3 rounded-3xl hover:opacity-90 transition">
                  Find Food
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* CATEGORIES */}

        <section className="py-20">
          <div className="container mx-auto px-4 lg:px-8">
            <div className="flex justify-between items-center mb-10">
              <h2 className="text-3xl lg:text-4xl font-bold">
                Explore Categories
              </h2>
            </div>

            <CategoriesSlider categories={categories} />
          </div>
        </section>

        {/* MOST LOVED MEALS */}

        <section className="py-20 bg-secondary-container">
          <div className="container mx-auto px-4 lg:px-8">
            <div className="flex justify-between items-center mb-12">
              <h2 className="text-3xl lg:text-4xl font-bold">
                Most Loved Meals
              </h2>
              <Link
                href="/meals"
                className="text-primary flex items-center gap-2"
              >
                See All
                <FontAwesomeIcon icon={faArrowRight} />
              </Link>
            </div>

            <div className="grid sm:grid-cols-2 xl:grid-cols-4 gap-8">
              {meals.map((meal) => (
                <div
                  key={meal.id}
                  className="bg-white rounded-3xl overflow-hidden shadow hover:shadow-xl transition flex flex-col"
                >
                  <div className="relative h-60">
                    <Image
                      src={meal.image}
                      alt={meal.title}
                      fill
                      className="object-cover"
                    />

                    <span className="absolute top-4 right-4 bg-secondary-container px-3 py-1 rounded-full font-semibold">
                      ${meal.price}
                    </span>
                  </div>

                  <div className="p-5 flex flex-col flex-1">
                    <div className="flex justify-between mb-3">
                      <h3 className="font-bold text-lg">{meal.title}</h3>

                      <span className="flex items-center gap-1">
                        <FontAwesomeIcon
                          icon={faStar}
                          className="text-yellow-500"
                        />
                        {meal.rating}
                      </span>
                    </div>

                    {/* الجزء ده هيتمدد */}
                    <div className="flex-1 border-b border-primary-container pb-5 mb-5">
                      <p className="text-text-secondary">{meal.description}</p>
                    </div>

                    <div className="flex justify-between items-center">
                      <span className="font-medium">{meal.chef}</span>

                      <button className="bg-primary text-white p-3 rounded-full">
                        <FontAwesomeIcon icon={faCartShopping} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* HOW IT WORKS */}

        <section className="py-20">
          <div className="container mx-auto px-4 lg:px-8">
            <h2 className="text-3xl lg:text-4xl font-bold text-center mb-16">
              How Sufra Works
            </h2>

            <div className="grid md:grid-cols-3 gap-10">
              <div className="text-center">
                <div className="w-24 h-24 rounded-3xl bg-primary/10 flex items-center justify-center mx-auto mb-5">
                  <FontAwesomeIcon
                    icon={faMagnifyingGlass}
                    className="text-3xl text-primary"
                  />
                </div>

                <h3 className="text-xl font-semibold mb-3">Browse</h3>

                <p className="text-text-secondary">
                  Explore hundreds of home-cooked dishes from local chefs.
                </p>
              </div>

              <div className="text-center">
                <div className="w-24 h-24 rounded-3xl bg-primary/10 flex items-center justify-center mx-auto mb-5">
                  <FontAwesomeIcon
                    icon={faHandPointer}
                    className="text-3xl text-primary"
                  />
                </div>

                <h3 className="text-xl font-semibold mb-3">Order</h3>

                <p className="text-text-secondary">
                  Securely place your order and choose delivery or pickup.
                </p>
              </div>

              <div className="text-center">
                <div className="w-24 h-24 rounded-3xl bg-primary/10 flex items-center justify-center mx-auto mb-5">
                  <FontAwesomeIcon
                    icon={faUtensils}
                    className="text-3xl text-primary"
                  />
                </div>

                <h3 className="text-xl font-semibold mb-3">Enjoy</h3>

                <p className="text-text-secondary">
                  Experience authentic homemade meals with every bite.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* FEATURED CHEFS */}

        <section className="py-20 bg-surface-low">
          <div className="container mx-auto px-4 lg:px-8">
            <div className="flex justify-between items-center mb-12">
              <h2 className="text-3xl lg:text-4xl font-bold">
                Meet Our Featured Chefs
              </h2>
              <Link
                href="/chefs"
                className="text-primary flex items-center gap-2"
              >
                See All
                <FontAwesomeIcon icon={faArrowRight} />
              </Link>
            </div>

            <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-8">
              {chefs.map((chef) => (
                <div
                  key={chef.id}
                  className="bg-white p-6 rounded-3xl flex items-center gap-5 shadow"
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
                      <FontAwesomeIcon
                        icon={faStar}
                        className="text-yellow-500"
                      />

                      {chef.rating}

                      <span>({chef.reviews} Reviews)</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* AI SECTION */}

        <section className="py-20">
          <div className="container mx-auto px-4 lg:px-8">
            <div className="bg-primary text-white rounded-4xl p-8 lg:p-16">
              <div className="grid lg:grid-cols-2 gap-10 items-center">
                <div>
                  <div className="inline-flex items-center gap-2 bg-white/10 px-4 py-2 rounded-full mb-6">
                    <FontAwesomeIcon icon={faWandMagicSparkles} />
                    Powered by Matbakhna AI
                  </div>

                  <h2 className="text-3xl font-bold mb-6">
                    Your Smart Culinary Assistant
                  </h2>

                  <p className="text-lg text-gray-200">
                    Our AI Meal Planner learns your tastes and suggests perfect
                    home-cooked meals based on your dietary needs and history.
                    Get smart recommendations that feel like they were made just
                    for you.
                  </p>
                  <div className="mt-8 flex flex-col md:flex-row gap-4">
                    <Link href="customer/meal-planner" className="bg-white/10 backdrop-blur-sm p-6 rounded-xl">
                      <h4 className="text-left text-xl font-semibold">
                        Meal Planner
                      </h4>
                      <p>Weekly menus tailored for you.</p>
                    </Link>
                    <button className="bg-white/10 backdrop-blur-sm p-6 rounded-xl">
                      <h4 className="text-left text-xl font-semibold">
                        Smart Picks
                      </h4>
                      <p>Discover your next favorite dish.</p>
                    </button>
                  </div>
                </div>

                <div className="bg-white text-black rounded-3xl p-6">
                  <h2 className="mb-4 flex items-center gap-2 border-b border-primary pb-5">
                    <FontAwesomeIcon
                      icon={faMessage}
                      className="text-2xl text-primary"
                    />
                    AI Recommendation
                  </h2>

                  <p className="mb-5 p-6 rounded-card bg-secondary-container">
                    &quot;Based on your love for spicy dishes, I recommend Chef
                    Karim’s Spicy Miso Ramen for dinner tonight.&quot;
                  </p>

                  <button className="bg-primary ml-auto block text-white px-5 py-3 rounded-full">
                    Add To Cart
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* TESTIMONIALS */}

        <section className="py-20 bg-secondary-container">
          <div className="container mx-auto px-4 lg:px-8">
            <h2 className="text-3xl lg:text-4xl font-bold text-center mb-12">
              From Our Community
            </h2>

            <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-8">
              {testimonials.map((testimonial) => (
                <div
                  key={testimonial.id}
                  className="bg-white p-14 pb-8 rounded-3xl shadow relative flex flex-col"
                >
                  <FontAwesomeIcon
                    icon={faQuoteRight}
                    className="text-4xl text-primary absolute top-5 left-5"
                  />

                  <p className="italic mb-6 flex-1">{testimonial.text}</p>

                  <div>
                    <h3 className="font-semibold">{testimonial.name}</h3>
                    <p className="text-text-secondary">{testimonial.role}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}

        <section className="py-20">
          <div className="container mx-auto px-4 lg:px-8">
            <div className="bg-[#E7E2D9] rounded-4xl p-10 lg:p-16 text-center">
              <h2 className="text-3xl text-text-tertiary font-bold mb-6">
                Ready To Experience Real Food?
              </h2>

              <div className="flex flex-col sm:flex-row justify-center gap-4">
                <Link
                  href="/register/customer"
                  className="bg-primary text-white px-20 py-4 rounded-full"
                >
                  Start Your Journey
                </Link>
                <Link
                  href="/register/chef"
                  className="border-2 border-primary text-primary px-20 py-4 rounded-full"
                >
                  Become A Chef
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
