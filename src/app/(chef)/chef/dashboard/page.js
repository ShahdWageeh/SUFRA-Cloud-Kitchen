import Image from "next/image";
import {
  dashboardMetrics,
  popularMeals,
  recentOrders,
} from "@/data/chefDashboardData";

function formatCurrency(value) {
  return `$${value.toFixed(2)}`;
}

function statusClassName(status) {
  if (status === "Preparing") return "bg-[#FFF1DF] text-[#C47520]";
  if (status === "Ready") return "bg-[#DCF5E8] text-[#1E8059]";
  if (status === "Delivering") return "bg-[#DCE9FF] text-[#2558BF]";
  return "bg-[#EDEDED] text-[#5A5A5A]";
}

export default function DashboardPage() {
  return (
    <div className="space-y-6 md:space-y-8">
      {/* Welcome Section */}

      <section>
        <h1 className="text-3xl font-extrabold leading-tight tracking-tight text-[#1E1410] sm:text-4xl lg:text-[42px]">
          Welcome back, Chef Mariam!
        </h1>

        <p className="mt-2 text-sm text-[#7A6560] sm:text-[15px]">
          Here&apos;s what&apos;s happening with your kitchen today.
        </p>
      </section>

      {/* Stats Cards */}

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {dashboardMetrics.map((metric) => {
          const Icon = metric.icon;

          return (
            <article
              key={metric.id}
              className="rounded-[20px] border border-[#EDE6E3] bg-white px-5 py-5 shadow-sm transition hover:shadow-md"
            >
              <div className="flex items-center justify-between">
                <span
                  className="flex h-11 w-11 items-center justify-center rounded-xl"
                  style={{
                    backgroundColor: metric.iconBg,
                  }}
                >
                  <Icon size={20} strokeWidth={2} className="text-[#2D201B]" />
                </span>
                {metric.trend && (
                  <span className="text-[13px] font-bold text-[#2E8D71]">
                    ↑ {metric.trend}
                  </span>
                )}
              </div>

              <p className="mt-4 text-[13.5px] font-medium text-[#7A6560]">
                {metric.label}
              </p>

              <p className="mt-1 text-[30px] font-extrabold leading-none tracking-tight text-[#1E1410] md:text-[36px]">
                {metric.value}

                {metric.suffix && (
                  <span className="ml-1.5 text-[13px] font-medium text-[#9E8880]">
                    {metric.suffix}
                  </span>
                )}
              </p>
            </article>
          );
        })}
      </section>

      {/* Main Content */}

      <section className="grid gap-6 xl:grid-cols-[2.2fr_1fr]">
        {/* Recent Orders */}

        <div className="min-w-0">
          <div className="mb-3.5 flex items-center justify-between">
            <h2 className="text-2xl font-extrabold tracking-tight text-[#1E1410] md:text-[28px]">
              Recent Orders
            </h2>

            <button
              type="button"
              className="flex items-center gap-1 text-sm font-semibold text-[#A0431E] transition hover:opacity-75"
            >
              View All →
            </button>
          </div>

          <div className="overflow-hidden rounded-[22px] border border-[#EDE6E3] bg-white">
            <div className="overflow-x-auto">
              <table className="min-w-[700px] w-full">
                <thead>
                  <tr className="border-b border-[#F2E9E5]">
                    {["Order ID", "Customer", "Meal", "Status", "Total"].map(
                      (heading) => (
                        <th
                          key={heading}
                          className="px-5 py-4 text-left text-[13.5px] font-semibold text-[#7A6560]"
                        >
                          {heading}
                        </th>
                      ),
                    )}
                  </tr>
                </thead>

                <tbody>
                  {recentOrders.map((order, index) => (
                    <tr
                      key={order.id}
                      className={
                        index !== recentOrders.length - 1
                          ? "border-b border-[#F5EFEC]"
                          : ""
                      }
                    >
                      <td className="px-5 py-5 text-[14px] font-bold text-[#2E1F1A]">
                        {order.id}
                      </td>

                      <td className="px-5 py-5 text-[14px] text-[#3F3531]">
                        {order.customer}
                      </td>

                      <td className="px-5 py-5 text-[14px] text-[#3F3531]">
                        {order.meal}
                      </td>

                      <td className="px-5 py-5">
                        <span
                          className={`inline-flex rounded-full px-3.5 py-1.5 text-[12px] font-bold ${statusClassName(
                            order.status,
                          )}`}
                        >
                          {order.status}
                        </span>
                      </td>

                      <td className="px-5 py-5 text-[14px] font-bold text-[#1E1410]">
                        {formatCurrency(order.total)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Popular Meals */}

        <aside>
          <h2 className="mb-3.5 text-2xl font-extrabold tracking-tight text-[#1E1410] md:text-[28px]">
            Popular Meals
          </h2>

          <div className="flex flex-col gap-4">
            {popularMeals.map((meal) => (
              <article
                key={meal.id}
                className="overflow-hidden rounded-[20px] border border-[#EDE6E3] bg-white shadow-sm transition hover:shadow-md"
              >
                <div className="relative h-[180px] md:h-[160px]">
                  <Image
                    src={meal.image}
                    alt={meal.name}
                    fill
                    className="object-cover"
                  />

                  {meal.tag && (
                    <span className="absolute right-2.5 top-2.5 rounded-full bg-[#FFF4EB] px-2.5 py-1 text-[11px] font-bold text-[#A0431E]">
                      {meal.tag}
                    </span>
                  )}
                </div>

                <div className="px-4 py-3.5">
                  <h3 className="text-[15px] font-bold text-[#1E1410]">
                    {meal.name}
                  </h3>

                  <div className="mt-1.5 flex items-center justify-between">
                    <p className="text-[12.5px] text-[#7A6560]">
                      {meal.ordersThisMonth} orders this month
                    </p>

                    <p className="text-[15.5px] font-extrabold text-[#A0431E]">
                      {formatCurrency(meal.price)}
                    </p>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </aside>
      </section>
    </div>
  );
}
