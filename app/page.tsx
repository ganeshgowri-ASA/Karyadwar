import Link from 'next/link'

const featuredEnterpriseApps = [
  { name: 'SAP ERP', description: 'Enterprise Resource Planning', letter: 'S', url: '#' },
  { name: 'ESS', description: 'Employee Self Service', letter: 'E', url: '#' },
  { name: 'LIMS', description: 'Lab Information Management', letter: 'L', url: '#' },
  { name: 'CAT', description: 'Computer Aided Testing', letter: 'C', url: '#' },
  { name: 'Maximo', description: 'Asset Management', letter: 'M', url: '#' },
  { name: 'ServiceNow', description: 'IT Service Management', letter: 'S', url: '#' },
]

const featuredLocalApps = [
  { name: 'Permit to Work', description: 'Work permit management', letter: 'P', url: '#' },
  { name: 'Visitor Mgmt', description: 'Visitor registration', letter: 'V', url: '#' },
  { name: 'Incident Report', description: 'Safety incident reporting', letter: 'I', url: '#' },
  { name: 'Gate Pass', description: 'Vehicle gate management', letter: 'G', url: '#' },
  { name: 'Shift Roster', description: 'Shift scheduling', letter: 'S', url: '#' },
  { name: 'Canteen Mgmt', description: 'Meal booking system', letter: 'C', url: '#' },
]

const sites = [
  'Jamnagar', 'Barabanki', 'Dahej', 'Hazira PetChem',
  'Hazira Polyester', 'Hoshiarpur', 'Nagothane', 'Naroda',
  'Patalganga PetChem', 'Patalganga Polyester', 'Silvassa', 'Vadodara',
]

const announcements = [
  {
    title: 'Annual Safety Day - March 2026',
    content: 'The National Safety Day celebration will be held on 4th March. All sites to conduct safety awareness programs.',
    date: '2026-03-01',
  },
  {
    title: 'ESS System Maintenance',
    content: 'ESS portal will be unavailable on Sunday 15th March from 10 PM to 2 AM for scheduled maintenance.',
    date: '2026-03-10',
  },
  {
    title: 'New Canteen Menu Rollout',
    content: 'Updated canteen menus with healthier options will be introduced across all sites from April 2026.',
    date: '2026-03-08',
  },
]

export default function Home() {
  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="bg-blue-900 text-white shadow-lg">
        <div className="max-w-screen-xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-700 rounded-lg flex items-center justify-center font-bold text-xl">
              K
            </div>
            <div>
              <h1 className="text-xl font-bold tracking-wide">Karyadwar</h1>
              <p className="text-blue-300 text-xs">Manufacturing Intranet Portal</p>
            </div>
          </div>
          <nav className="hidden md:flex items-center gap-6 text-sm">
            <a href="#apps" className="text-blue-200 hover:text-white transition-colors">Applications</a>
            <a href="#announcements" className="text-blue-200 hover:text-white transition-colors">Announcements</a>
            <a href="#sites" className="text-blue-200 hover:text-white transition-colors">Sites</a>
            <button className="bg-blue-700 hover:bg-blue-600 px-4 py-1.5 rounded-md text-sm transition-colors">
              Sign In
            </button>
          </nav>
        </div>
      </header>

      {/* Ticker */}
      <div className="bg-blue-800 text-blue-100 text-xs py-1.5 overflow-hidden">
        <div className="ticker-animate whitespace-nowrap">
          &nbsp;&nbsp;&nbsp;
          Safety First: Wear PPE at all times in designated areas &nbsp;|&nbsp;
          SAP Upgrade scheduled for 20th March 2026 &nbsp;|&nbsp;
          New Emergency Contact Directory available at all site admin offices &nbsp;|&nbsp;
          Long Service Awards ceremony on 25th March at Jamnagar &nbsp;|&nbsp;
          ISO 45001 Recertification audit at Dahej site on 18th March &nbsp;|&nbsp;
          Quarterly Environment Report submissions due by 31st March &nbsp;|&nbsp;
        </div>
      </div>

      <main className="max-w-screen-xl mx-auto px-4 py-6">
        {/* Welcome Banner */}
        <div className="bg-gradient-to-r from-blue-900 to-blue-700 text-white rounded-xl p-6 mb-6 shadow-md">
          <h2 className="text-2xl font-bold mb-1">Welcome to Karyadwar</h2>
          <p className="text-blue-200 text-sm max-w-2xl">
            Your unified work gateway — access enterprise applications, site resources,
            emergency contacts, and employee services across all 12 manufacturing locations.
          </p>
          <div className="mt-4 flex flex-wrap gap-3">
            <span className="bg-blue-800 bg-opacity-60 px-3 py-1 rounded-full text-xs">
              12 Manufacturing Sites
            </span>
            <span className="bg-blue-800 bg-opacity-60 px-3 py-1 rounded-full text-xs">
              40+ Applications
            </span>
            <span className="bg-blue-800 bg-opacity-60 px-3 py-1 rounded-full text-xs">
              Real-time Updates
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Enterprise Apps */}
            <section id="apps">
              <h3 className="section-title">Enterprise Applications</h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {featuredEnterpriseApps.map((app) => (
                  <a
                    key={app.name}
                    href={app.url}
                    className="app-tile group"
                  >
                    <div className="w-12 h-12 bg-blue-100 text-blue-800 rounded-lg flex items-center justify-center font-bold text-lg mb-2 group-hover:bg-blue-800 group-hover:text-white transition-colors duration-200">
                      {app.letter}
                    </div>
                    <span className="text-sm font-semibold text-gray-800">{app.name}</span>
                    <span className="text-xs text-gray-500 mt-0.5">{app.description}</span>
                  </a>
                ))}
              </div>
              <button className="mt-3 text-sm text-blue-700 hover:text-blue-900 font-medium">
                View all enterprise apps →
              </button>
            </section>

            {/* Local Apps */}
            <section>
              <h3 className="section-title">Site Applications</h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {featuredLocalApps.map((app) => (
                  <a
                    key={app.name}
                    href={app.url}
                    className="app-tile group"
                  >
                    <div className="w-12 h-12 bg-green-100 text-green-800 rounded-lg flex items-center justify-center font-bold text-lg mb-2 group-hover:bg-green-700 group-hover:text-white transition-colors duration-200">
                      {app.letter}
                    </div>
                    <span className="text-sm font-semibold text-gray-800">{app.name}</span>
                    <span className="text-xs text-gray-500 mt-0.5">{app.description}</span>
                  </a>
                ))}
              </div>
              <button className="mt-3 text-sm text-blue-700 hover:text-blue-900 font-medium">
                View all site apps →
              </button>
            </section>

            {/* Announcements */}
            <section id="announcements">
              <h3 className="section-title">Announcements</h3>
              <div className="space-y-3">
                {announcements.map((ann) => (
                  <div key={ann.title} className="card hover:border-blue-300 transition-colors cursor-pointer">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <h4 className="text-sm font-semibold text-gray-800">{ann.title}</h4>
                        <p className="text-xs text-gray-600 mt-1">{ann.content}</p>
                      </div>
                      <span className="text-xs text-gray-400 whitespace-nowrap">
                        {new Date(ann.date).toLocaleDateString('en-IN', {
                          day: '2-digit',
                          month: 'short',
                        })}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Links */}
            <section>
              <h3 className="section-title">Quick Links</h3>
              <div className="space-y-2">
                {[
                  { label: 'My Favorites', icon: '★' },
                  { label: 'IT Helpdesk', icon: '⚙' },
                  { label: 'HR Portal', icon: '👤' },
                  { label: 'Training Portal', icon: '📚' },
                  { label: 'Safety Dashboard', icon: '🛡' },
                  { label: 'Emergency Contacts', icon: '📞' },
                ].map((link) => (
                  <a
                    key={link.label}
                    href="#"
                    className="flex items-center gap-3 p-2.5 bg-white rounded-md border border-gray-200 hover:border-blue-400 hover:bg-blue-50 transition-colors text-sm text-gray-700"
                  >
                    <span className="text-base">{link.icon}</span>
                    {link.label}
                  </a>
                ))}
              </div>
            </section>

            {/* Employee Events */}
            <section>
              <h3 className="section-title">Employee Events</h3>
              <div className="space-y-2">
                {[
                  { name: 'Ramesh Kumar', event: 'Birthday', date: 'Mar 14', dept: 'Maintenance' },
                  { name: 'Priya Sharma', event: '10 Year Award', date: 'Mar 15', dept: 'HR' },
                  { name: 'Sunil Patel', event: 'Birthday', date: 'Mar 16', dept: 'Production' },
                  { name: 'Anita Joshi', event: '25 Year Award', date: 'Mar 18', dept: 'Quality' },
                ].map((ev) => (
                  <div
                    key={`${ev.name}-${ev.date}`}
                    className="flex items-center gap-3 p-2.5 bg-white rounded-md border border-gray-200 text-sm"
                  >
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 ${ev.event === 'Birthday' ? 'bg-pink-100 text-pink-700' : 'bg-amber-100 text-amber-700'}`}>
                      {ev.event === 'Birthday' ? '🎂' : '🏆'}
                    </div>
                    <div className="min-w-0">
                      <p className="font-medium text-gray-800 truncate">{ev.name}</p>
                      <p className="text-xs text-gray-500">{ev.dept} · {ev.date}</p>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Sites */}
            <section id="sites">
              <h3 className="section-title">Manufacturing Sites</h3>
              <div className="grid grid-cols-2 gap-1.5">
                {sites.map((site) => (
                  <button
                    key={site}
                    className="text-xs py-1.5 px-2 bg-white border border-gray-200 rounded hover:border-blue-400 hover:bg-blue-50 text-gray-700 text-left transition-colors truncate"
                  >
                    {site}
                  </button>
                ))}
              </div>
            </section>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-blue-900 text-blue-300 text-xs text-center py-4 mt-8">
        <p>© 2026 Karyadwar — Manufacturing Intranet Portal. All rights reserved.</p>
        <p className="mt-1">For IT support, contact: helpdesk@company.com</p>
      </footer>
    </div>
  )
}
