import {
  PrismaClient,
  AppCategory,
  EventType,
  PermissionLevel,
  LoginMethod,
  UserRole,
} from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding database…");

  // ── 1. Sites ───────────────────────────────────────────────────────────────
  const siteData = [
    { name: "Jamnagar", code: "JAM" },
    { name: "Barabanki", code: "BAR" },
    { name: "Dahej", code: "DAH" },
    { name: "Hazira-PetChem", code: "HAZ-P" },
    { name: "Hazira-Polyester", code: "HAZ-PY" },
    { name: "Hoshiarpur", code: "HOS" },
    { name: "Nagothane", code: "NAG" },
    { name: "Naroda", code: "NAR" },
    { name: "Patalganga-PetChem", code: "PAT-P" },
    { name: "Patalganga-Polyester", code: "PAT-PY" },
    { name: "Silvassa", code: "SIL" },
    { name: "Vadodara", code: "VAD" },
  ];

  for (const s of siteData) {
    await prisma.site.upsert({
      where: { code: s.code },
      update: { name: s.name, is_active: true },
      create: { name: s.name, code: s.code, is_active: true },
    });
  }
  console.log(`✅ ${siteData.length} sites`);

  const jamnagar = await prisma.site.findUniqueOrThrow({ where: { code: "JAM" } });
  const barabanki = await prisma.site.findUniqueOrThrow({ where: { code: "BAR" } });

  // ── 2. Users ───────────────────────────────────────────────────────────────
  const adminHash = await bcrypt.hash("admin123", 10);
  const userHash  = await bcrypt.hash("user123",  10);

  const adminUser = await prisma.user.upsert({
    where: { email: "admin@karyadwar.com" },
    update: { password_hash: adminHash, role: UserRole.ADMIN, nick_name: "Admin User" },
    create: {
      emp_no:        "EMP001",
      domain_id:     "admin",
      nick_name:     "Admin User",
      email:         "admin@karyadwar.com",
      default_site:  jamnagar.id,
      login_method:  LoginMethod.EMAIL,
      password_hash: adminHash,
      role:          UserRole.ADMIN,
    },
  });

  const testUser = await prisma.user.upsert({
    where: { email: "user@karyadwar.com" },
    update: { password_hash: userHash, nick_name: "Test User" },
    create: {
      emp_no:        "EMP002",
      domain_id:     "testuser",
      nick_name:     "Test User",
      email:         "user@karyadwar.com",
      default_site:  jamnagar.id,
      login_method:  LoginMethod.EMAIL,
      password_hash: userHash,
      role:          UserRole.USER,
    },
  });
  console.log("✅ 2 users (admin@karyadwar.com / admin123, user@karyadwar.com / user123)");

  // ── 3. Admin Access ────────────────────────────────────────────────────────
  await prisma.adminAccess.upsert({
    where: { id: 1 },
    update: {},
    create: {
      user_id:          adminUser.id,
      permission_level: PermissionLevel.SUPER_ADMIN,
      site_id:          null,
    },
  });

  // ── 4. Enterprise Applications ─────────────────────────────────────────────
  const enterpriseApps = [
    { name: "SAP ERP",             url: "https://sap.internal",      letter_index: "S", description: "Enterprise Resource Planning",     contact_func: "All Departments", contact_tech: "SAP Team",  sort_order: 1 },
    { name: "HR Portal",           url: "https://hr.internal",       letter_index: "H", description: "Human Resources Management",       contact_func: "HR Department",   contact_tech: "IT Team",   sort_order: 2 },
    { name: "Finance Dashboard",   url: "https://finance.internal",  letter_index: "F", description: "Financial reporting and analytics", contact_func: "Finance Dept",    contact_tech: "IT Team",   sort_order: 3 },
    { name: "Asset Management",    url: "https://assets.internal",   letter_index: "A", description: "Fixed asset tracking",             contact_func: "Maintenance",     contact_tech: "IT Team",   sort_order: 4 },
    { name: "Document Management", url: "https://dms.internal",      letter_index: "D", description: "Document storage and retrieval",   contact_func: "All Departments", contact_tech: "IT Team",   sort_order: 5 },
    { name: "Business Intelligence",url:"https://bi.internal",       letter_index: "B", description: "Data analytics and reporting",     contact_func: "Management",      contact_tech: "BI Team",   sort_order: 6 },
    { name: "Quality Management",  url: "https://qms.internal",      letter_index: "Q", description: "Quality control and compliance",   contact_func: "QA Department",   contact_tech: "IT Team",   sort_order: 7 },
    { name: "Learning Management", url: "https://lms.internal",      letter_index: "L", description: "Training and development",         contact_func: "HR Department",   contact_tech: "IT Team",   sort_order: 8 },
    { name: "Project Management",  url: "https://pm.internal",       letter_index: "P", description: "Project tracking",                 contact_func: "PMO",             contact_tech: "IT Team",   sort_order: 9 },
    { name: "Maintenance System",  url: "https://cmms.internal",     letter_index: "M", description: "Computerised maintenance mgmt",    contact_func: "Maintenance",     contact_tech: "IT Team",   sort_order: 10 },
  ];

  for (const app of enterpriseApps) {
    await prisma.application.upsert({
      where: { id: enterpriseApps.indexOf(app) + 1 },
      update: {},
      create: { ...app, category: AppCategory.enterprise, is_active: true, site_id: null },
    });
  }

  // ── 5. Local Applications (Jamnagar) ──────────────────────────────────────
  const localApps = [
    { name: "Attendance System",  url: "https://att.jam.internal",     letter_index: "A", description: "Employee attendance tracking",  sort_order: 1 },
    { name: "Canteen Management", url: "https://canteen.jam.internal",  letter_index: "C", description: "Canteen booking and mgmt",      sort_order: 2 },
    { name: "Transport Booking",  url: "https://transport.jam.internal",letter_index: "T", description: "Company transport booking",     sort_order: 3 },
    { name: "Visitor Management", url: "https://visitor.jam.internal",  letter_index: "V", description: "Gate pass and visitor mgmt",    sort_order: 4 },
    { name: "Safety Training",    url: "https://safety.jam.internal",   letter_index: "S", description: "Safety training and compliance",sort_order: 5 },
  ];

  const eLen = enterpriseApps.length;
  for (const app of localApps) {
    await prisma.application.upsert({
      where: { id: eLen + localApps.indexOf(app) + 1 },
      update: {},
      create: {
        ...app,
        category:     AppCategory.local,
        is_active:    true,
        site_id:      jamnagar.id,
        contact_func: "HR",
        contact_tech: "IT",
      },
    });
  }
  console.log(`✅ ${enterpriseApps.length} enterprise + ${localApps.length} local applications`);

  // ── 6. Announcements ──────────────────────────────────────────────────────
  // Delete stale ones then recreate (idempotent via deleteMany + createMany)
  await prisma.announcement.deleteMany({
    where: { title: { in: [
      "Annual Day Celebration",
      "National Safety Week 2025",
      "SAP System Maintenance",
    ]}},
  });

  await prisma.announcement.createMany({
    data: [
      {
        title:     "Annual Day Celebration",
        content:   "We are pleased to announce the Annual Day celebration on March 25, 2025. All employees are invited to join us for a day filled with cultural programs and awards ceremony.",
        site_id:   jamnagar.id,
        is_active: true,
        expires_at: new Date("2026-03-30"),
      },
      {
        title:     "National Safety Week 2025",
        content:   "National Safety Week is observed from March 4–10 every year. Various awareness programs, mock drills, and competitions have been planned at all sites. Your participation is mandatory.",
        site_id:   null,
        is_active: true,
        expires_at: new Date("2026-12-31"),
      },
      {
        title:     "SAP System Maintenance",
        content:   "SAP system will be under scheduled maintenance on the first Saturday of every month from 10 PM to 6 AM Sunday. Please plan your work accordingly and raise urgent issues via the helpdesk.",
        site_id:   null,
        is_active: true,
        expires_at: new Date("2026-12-31"),
      },
    ],
    skipDuplicates: true,
  });
  console.log("✅ 3 announcements");

  // ── 7. Emergency Numbers ──────────────────────────────────────────────────
  await prisma.emergencyNumber.deleteMany({ where: { site_id: { in: [jamnagar.id, barabanki.id] } } });

  await prisma.emergencyNumber.createMany({
    data: [
      { name: "Fire Station",              landline_no: "0288-2345678", mobile_no: "9876543210", other_no: null, site_id: jamnagar.id,  sort_order: 1 },
      { name: "Medical Centre / Ambulance",landline_no: "0288-2345679", mobile_no: "9876543211", other_no: "108",site_id: jamnagar.id,  sort_order: 2 },
      { name: "Security Control Room",     landline_no: "0288-2345680", mobile_no: "9876543212", other_no: null, site_id: jamnagar.id,  sort_order: 3 },
      { name: "IT Helpdesk",               landline_no: "0288-2345681", mobile_no: "9876543213", other_no: null, site_id: jamnagar.id,  sort_order: 4 },
      { name: "Emergency Control Room",    landline_no: "0288-2345682", mobile_no: "9876543214", other_no: "100",site_id: jamnagar.id,  sort_order: 5 },
      { name: "Fire Station",              landline_no: "0522-2345678", mobile_no: "9876543220", other_no: null, site_id: barabanki.id, sort_order: 1 },
      { name: "Medical Centre",            landline_no: "0522-2345679", mobile_no: "9876543221", other_no: "108",site_id: barabanki.id, sort_order: 2 },
    ],
  });
  console.log("✅ 7 emergency numbers (5 Jamnagar, 2 Barabanki)");

  // ── 8. Carousel Images ────────────────────────────────────────────────────
  await prisma.carouselImage.deleteMany({ where: { site_id: jamnagar.id } });

  await prisma.carouselImage.createMany({
    data: [
      { image_url: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=1200&h=400&fit=crop", link_url: null, site_id: jamnagar.id, sort_order: 1, is_active: true },
      { image_url: "https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=1200&h=400&fit=crop", link_url: null, site_id: jamnagar.id, sort_order: 2, is_active: true },
      { image_url: "https://images.unsplash.com/photo-1565953554499-e6e7c7a56c42?w=1200&h=400&fit=crop", link_url: null, site_id: jamnagar.id, sort_order: 3, is_active: true },
    ],
  });
  console.log("✅ 3 carousel images");

  // ── 9. Ticker Items ───────────────────────────────────────────────────────
  await prisma.tickerItem.deleteMany({});
  await prisma.tickerItem.createMany({
    data: [
      { content: "Welcome to Karyadwar — Your Manufacturing Intranet Portal", site_id: null,        is_active: true },
      { content: "Safety First: Report all near-misses to the EHS department immediately", site_id: null, is_active: true },
      { content: "Annual appraisal cycle starts from April 1 — log in to HR Portal to submit self-assessment", site_id: null, is_active: true },
      { content: "Canteen menu updated for Q2 2025 — new healthy options available daily", site_id: jamnagar.id, is_active: true },
    ],
  });

  // ── 10. Employee Events ───────────────────────────────────────────────────
  await prisma.employeeEvent.deleteMany({});
  const today = new Date();
  const d = (offset: number) => {
    const dt = new Date(today);
    dt.setDate(dt.getDate() + offset);
    // keep only date part
    return new Date(dt.getFullYear(), dt.getMonth(), dt.getDate());
  };

  await prisma.employeeEvent.createMany({
    data: [
      { emp_no: "EMP101", event_type: EventType.birthday,     event_date: d(0), department: "Engineering", email: "emp101@company.com", photo_url: null },
      { emp_no: "EMP102", event_type: EventType.birthday,     event_date: d(0), department: "HR",          email: "emp102@company.com", photo_url: null },
      { emp_no: "EMP103", event_type: EventType.long_service, event_date: d(0), department: "Finance",     email: "emp103@company.com", photo_url: null },
      { emp_no: "EMP104", event_type: EventType.birthday,     event_date: d(1), department: "IT",          email: "emp104@company.com", photo_url: null },
      { emp_no: "EMP105", event_type: EventType.long_service, event_date: d(2), department: "Operations",  email: "emp105@company.com", photo_url: null },
    ],
  });
  console.log("✅ 2 employee events (today) + 3 upcoming");

  // ── 11. Sample Favorites (for test user) ──────────────────────────────────
  await prisma.favorite.deleteMany({ where: { user_id: testUser.id } });
  const firstApps = await prisma.application.findMany({ take: 3, orderBy: { id: "asc" } });
  await prisma.favorite.createMany({
    data: firstApps.map((app) => ({ user_id: testUser.id, app_id: app.id })),
  });
  console.log("✅ 3 sample favourites for test user");

  console.log("\n🎉 Seed complete!");
  console.log("   Login: admin@karyadwar.com / admin123");
  console.log("   Login: user@karyadwar.com  / user123");
}

main()
  .then(() => prisma.$disconnect())
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
