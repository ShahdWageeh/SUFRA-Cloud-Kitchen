import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faChevronDown,
  faMagnifyingGlass,
  faSliders,
} from "@fortawesome/free-solid-svg-icons";
import ChefsGrid from "@/components/public/ChefsGrid";
import { chefService } from "@/services";
import { normalizeChef } from "@/utils/chefUtils";
import { SearchInput } from "@/components/ui";

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

export default async function ChefsPage({ searchParams }) {
  const { q = "" } = (await searchParams) || {};
  const { data, error } = await getChefsPageData();
  
  const filteredChefs = q 
    ? data.chefs.filter(chef => 
        chef.brandName?.toLowerCase().includes(q.toLowerCase()) || 
        chef.chefName?.toLowerCase().includes(q.toLowerCase()) || 
        chef.specialty?.toLowerCase().includes(q.toLowerCase())
      )
    : data.chefs;

  return (
    <main className="bg-background text-text-primary">
      <section className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="max-w-2xl">
          <p className="text-xs font-bold uppercase tracking-wide text-primary">
            Local Chefs
          </p>
          <h1 className="mt-3 text-4xl font-extrabold leading-tight sm:text-5xl">
            Meet Our Local Chefs
          </h1>
          <p className="mt-3 text-sm leading-6 text-text-secondary">
            Discover trusted home cooks sharing heritage recipes, everyday
            favorites, and beautiful food made nearby.
          </p>
        </div>

        <SearchInput
          placeholder="Search by chef name or specialty..."
          className="mt-8 rounded-lg bg-white p-3 shadow-sm ring-1 ring-primary/10"
          inputClassName="bg-background rounded-md"
          showButton={true}
          basePath="/chefs"
        />

        {/* ... */}

        {error ? (
          <div className="mt-8 rounded-lg bg-white p-8 text-center text-sm text-text-secondary ring-1 ring-primary/10">
            We could not load chefs right now.
          </div>
        ) : filteredChefs.length === 0 ? (
          <div className="mt-8 rounded-lg bg-white p-8 text-center text-sm text-text-secondary ring-1 ring-primary/10">
            {q ? `No chefs found matching "${q}"` : "No chefs are available right now. Check back soon."}
          </div>
        ) : (
          <div className="mt-8">
            <ChefsGrid chefs={filteredChefs} />
          </div>
        )}
      </section>
    </main>
  );
}
