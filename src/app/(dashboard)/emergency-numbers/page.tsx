export const dynamic = "force-dynamic";

import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export default async function EmergencyNumbersPage() {
  const session = await getServerSession(authOptions);
  const user = session!.user as any;
  const userSiteId = user.defaultSite as number | null;

  // Get all sites and their emergency numbers
  const sites = await prisma.site.findMany({
    where: { is_active: true },
    include: {
      emergency_numbers: {
        orderBy: { sort_order: "asc" },
      },
    },
    orderBy: { name: "asc" },
  });

  // Prioritize user's site
  const sortedSites = userSiteId
    ? [
        ...sites.filter((s) => s.id === userSiteId),
        ...sites.filter((s) => s.id !== userSiteId),
      ]
    : sites;

  return (
    <div className="max-w-screen-lg mx-auto px-4 py-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Emergency Numbers</h1>
        <p className="text-gray-500 text-sm mt-1">
          Important contact numbers for all manufacturing sites
        </p>
      </div>

      {/* Emergency Banner */}
      <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6 flex items-center gap-3">
        <span className="text-2xl">🚨</span>
        <div>
          <p className="font-semibold text-red-800">In case of emergency</p>
          <p className="text-sm text-red-600">
            Call the relevant numbers below immediately. For life-threatening emergencies, call 112.
          </p>
        </div>
      </div>

      {sortedSites.map((site) => (
        <div key={site.id} className="mb-6">
          <div className="flex items-center gap-2 mb-3">
            <div className={`w-3 h-3 rounded-full ${site.id === userSiteId ? "bg-green-500" : "bg-gray-300"}`} />
            <h2 className="text-lg font-semibold text-gray-700">
              {site.name}
              {site.id === userSiteId && (
                <span className="ml-2 text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full font-normal">
                  Your Site
                </span>
              )}
            </h2>
          </div>

          {site.emergency_numbers.length === 0 ? (
            <div className="bg-gray-50 rounded-lg p-4 text-sm text-gray-400">
              No emergency numbers listed for this site.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {site.emergency_numbers.map((num) => (
                <div
                  key={num.id}
                  className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow"
                >
                  <h3 className="font-semibold text-gray-800 text-sm mb-2">
                    {num.name}
                  </h3>
                  <div className="space-y-1">
                    {num.landline_no && (
                      <div className="flex items-center gap-2">
                        <span className="text-gray-400 text-xs w-16">Landline</span>
                        <a
                          href={`tel:${num.landline_no}`}
                          className="text-blue-600 text-sm font-mono hover:underline"
                        >
                          {num.landline_no}
                        </a>
                      </div>
                    )}
                    {num.mobile_no && (
                      <div className="flex items-center gap-2">
                        <span className="text-gray-400 text-xs w-16">Mobile</span>
                        <a
                          href={`tel:${num.mobile_no}`}
                          className="text-blue-600 text-sm font-mono hover:underline"
                        >
                          {num.mobile_no}
                        </a>
                      </div>
                    )}
                    {num.other_no && (
                      <div className="flex items-center gap-2">
                        <span className="text-gray-400 text-xs w-16">Other</span>
                        <a
                          href={`tel:${num.other_no}`}
                          className="text-blue-600 text-sm font-mono hover:underline"
                        >
                          {num.other_no}
                        </a>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
