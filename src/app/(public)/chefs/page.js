import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronDown, faMagnifyingGlass, faSliders } from "@fortawesome/free-solid-svg-icons";
import ChefsGrid from "@/components/public/ChefsGrid";
import { chefService } from "@/services";
import { normalizeChef } from "@/utils/chefUtils";

const CHEF_FILTERS = ["All Chefs", "Near Me", "Top Rated", "Available Today"];

async function getChefsPageData() {
  const state = {
    isLoading: false,
    error: null,
  };

  try {
    const response = await chefService.getVerifiedChefs();
    const chefs = (response.data || []).map(normalizeChef);

    return {
      ...state,
      data: {
        filters: CHEF_FILTERS,
        chefs,
      },
    };
  } catch (error) {
    return {
      ...state,
      error: error.response?.data?.message || error.message,
      data: { filters: CHEF_FILTERS, chefs: [] },
    };
  }
}

export default async function ChefsPage() {
  const { data, error } = await getChefsPageData();

  return (
    <main className="bg-background text-text-primary">
      <section className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="max-w-2xl">
          <p className="text-xs font-bold uppercase tracking-wide text-primary">Local Chefs</p>
          <h1 className="mt-3 text-4xl font-extrabold leading-tight sm:text-5xl">
            Meet Our Local Chefs
          </h1>
          <p className="mt-3 text-sm leading-6 text-text-secondary">
            Discover trusted home cooks sharing heritage recipes, everyday favorites, and beautiful food made nearby.
          </p>
        </div>

        <div className="mt-8 flex flex-col gap-3 rounded-lg bg-white p-3 shadow-sm ring-1 ring-primary/10 md:flex-row md:items-center">
          <label className="flex min-h-11 flex-1 items-center gap-3 rounded-md bg-background px-4">
            <FontAwesomeIcon icon={faMagnifyingGlass} className="h-4 w-4 text-outline" />
            <span className="sr-only">Search chefs</span>
            <input type="search" placeholder="Search by chef name or specialty..." className="min-w-0 flex-1 bg-transparent text-sm outline-none placeholder:text-outline" />
          </label>
          <button className="rounded-md border border-primary/15 px-4 py-3 text-xs font-bold text-text-secondary">
            Cuisine <FontAwesomeIcon icon={faChevronDown} className="ml-2 h-2.5 w-2.5" />
          </button>
          <button className="rounded-md border border-primary/15 px-4 py-3 text-xs font-bold text-text-secondary">
            Price Range <FontAwesomeIcon icon={faChevronDown} className="ml-2 h-2.5 w-2.5" />
          </button>
          <button className="rounded-md border border-primary/15 px-4 py-3 text-xs font-bold text-text-secondary">
            Rating <FontAwesomeIcon icon={faChevronDown} className="ml-2 h-2.5 w-2.5" />
          </button>
          <button className="rounded-md bg-primary px-5 py-3 text-xs font-bold text-white">
            <FontAwesomeIcon icon={faSliders} className="mr-2 h-3 w-3" />
            Filter
          </button>
        </div>

        <div className="mt-5 flex flex-wrap gap-2">
          {data.filters.map((filter, index) => (
            <button key={filter} className={`rounded-full px-4 py-2 text-xs font-bold ${index === 0 ? "bg-primary text-white" : "bg-white text-text-secondary ring-1 ring-primary/15"}`}>
              {filter}
            </button>
          ))}
        </div>

        {error ? (
          <div className="mt-8 rounded-lg bg-white p-8 text-center text-sm text-text-secondary ring-1 ring-primary/10">
            We could not load chefs right now.
          </div>
        ) : data.chefs.length === 0 ? (
          <div className="mt-8 rounded-lg bg-white p-8 text-center text-sm text-text-secondary ring-1 ring-primary/10">
            No chefs are available right now. Check back soon.
          </div>
        ) : (
          <div className="mt-8">
            <ChefsGrid chefs={data.chefs} />
          </div>
        )}
      </section>
    </main>
  );
}
