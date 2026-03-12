import { PrismaClient, AppCategory, EventType, PermissionLevel, LoginMethod, UserRole } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding database...");

  // Create 12 Manufacturing Sites
  const sites = await Promise.all([
    prisma.site.upsert({
      where: { code: "JAM" },
      update: {},
      create: { name: "Jamnagar", code: "JAM", is_active: true },
    }),
    prisma.site.upsert({
      where: { code: "BAR" },
      update: {},
      create: { name: "Barabanki", code: "BAR", is_active: true },
    }),
    prisma.site.upsert({
      where: { code: "DAH" },
      update: {},
      create: { name: "Dahej", code: "DAH", is_active: true },
    }),
    prisma.site.upsert({
      where: { code: "HAZ-P" },
      update: {},
      create: { name: "Hazira-PetChem", code: "HAZ-P", is_active: true },
    }),
    prisma.site.upsert({
      where: { code: "HAZ-PY" },
      update: {},
      create: { name: "Hazira-Polyester", code: "HAZ-PY", is_active: true },
    }),
    prisma.site.upsert({
      where: { code: "HOS" },
      update: {},
      create: { name: "Hoshiarpur", code: "HOS", is_active: true },
    }),
    prisma.site.upsert({
      where: { code: "NAG" },
      update: {},
      create: { name: "Nagothane", code: "NAG", is_active: true },
    }),
    prisma.site.upsert({
      where: { code: "NAR" },
      update: {},
      create: { name: "Naroda", code: "NAR", is_active: true },
    }),
    prisma.site.upsert({
      where: { code: "PAT-P" },
      update: {},
      create: { name: "Patalganga-PetChem", code: "PAT-P", is_active: true },
    }),
    prisma.site.upsert({
      where: { code: "PAT-PY" },
      update: {},
      create: { name: "Patalganga-Polyester", code: "PAT-PY", is_active: true },
    }),
    prisma.site.upsert({
      where: { code: "SIL" },
      update: {},
      create: { name: "Silvassa", code: "SIL", is_active: true },
    }),
    prisma.site.upsert({
      where: { code: "VAD" },
      update: {},
      create: { name: "Vadodara", code: "VAD", is_active: true },
    }),
  ]);

  console.log(`Created ${sites.length} sites`);

  const jamnagar = sites[0];
  const barabanki = sites[1];

  // Create Admin User
  const adminPasswordHash = await bcrypt.hash("admin123", 10);
  const adminUser = await prisma.user.upsert({
    where: { email: "admin@karyadwar.com" },
    update: {},
    create: {
      emp_no: "EMP001",
      domain_id: "admin",
      nick_name: "Admin",
      email: "admin@karyadwar.com",
      default_site: jamnagar.id,
      login_method: LoginMethod.EMAIL,
      password_hash: adminPasswordHash,
      role: UserRole.ADMIN,
    },
  });

  // Create Test User
  const userPasswordHash = await bcrypt.hash("user123", 10);
  const testUser = await prisma.user.upsert({
    where: { email: "user@karyadwar.com" },
    update: {},
    create: {
      emp_no: "EMP002",
      domain_id: "testuser",
      nick_name: "Test User",
      email: "user@karyadwar.com",
      default_site: jamnagar.id,
      login_method: LoginMethod.EMAIL,
      password_hash: userPasswordHash,
      role: UserRole.USER,
    },
  });

  console.log("Created admin and test users");

  // Create Admin Access
  await prisma.adminAccess.upsert({
    where: { id: 1 },
    update: {},
    create: {
      user_id: adminUser.id,
      permission_level: PermissionLevel.SUPER_ADMIN,
      site_id: null,
    },
  });

  // Create Enterprise Applications
  const enterpriseApps = [
    { name: "SAP ERP", url: "https://sap.internal", category: AppCategory.enterprise, letter_index: "S", description: "Enterprise Resource Planning", contact_func: "IT Helpdesk", contact_tech: "SAP Team", sort_order: 1 },
    { name: "HR Portal", url: "https://hr.internal", category: AppCategory.enterprise, letter_index: "H", description: "Human Resources Management", contact_func: "HR Department", contact_tech: "IT Team", sort_order: 2 },
    { name: "Finance Dashboard", url: "https://finance.internal", category: AppCategory.enterprise, letter_index: "F", description: "Financial reporting and analytics", contact_func: "Finance Dept", contact_tech: "IT Team", sort_order: 3 },
    { name: "Asset Management", url: "https://assets.internal", category: AppCategory.enterprise, letter_index: "A", description: "Fixed asset tracking", contact_func: "Maintenance", contact_tech: "IT Team", sort_order: 4 },
    { name: "Document Management", url: "https://dms.internal", category: AppCategory.enterprise, letter_index: "D", description: "Document storage and retrieval", contact_func: "All Departments", contact_tech: "IT Team", sort_order: 5 },
    { name: "Business Intelligence", url: "https://bi.internal", category: AppCategory.enterprise, letter_index: "B", description: "Data analytics and reporting", contact_func: "Management", contact_tech: "BI Team", sort_order: 6 },
    { name: "Quality Management", url: "https://qms.internal", category: AppCategory.enterprise, letter_index: "Q", description: "Quality control and compliance", contact_func: "QA Department", contact_tech: "IT Team", sort_order: 7 },
    { name: "Learning Management", url: "https://lms.internal", category: AppCategory.enterprise, letter_index: "L", description: "Training and development", contact_func: "HR Department", contact_tech: "IT Team", sort_order: 8 },
    { name: "Project Management", url: "https://pm.internal", category: AppCategory.enterprise, letter_index: "P", description: "Project tracking", contact_func: "PMO", contact_tech: "IT Team", sort_order: 9 },
    { name: "Maintenance System", url: "https://cmms.internal", category: AppCategory.enterprise, letter_index: "M", description: "Computerized maintenance management", contact_func: "Maintenance", contact_tech: "IT Team", sort_order: 10 },
  ];

  for (const app of enterpriseApps) {
    await prisma.application.upsert({
      where: { id: enterpriseApps.indexOf(app) + 1 },
      update: {},
      create: { ...app, is_active: true, site_id: null },
    });
  }

  // Create Local Applications for Jamnagar
  const localApps = [
    { name: "Attendance System", url: "https://att.jam.internal", category: AppCategory.local, letter_index: "A", description: "Employee attendance tracking", contact_func: "HR", contact_tech: "IT", sort_order: 1, site_id: jamnagar.id },
    { name: "Canteen Management", url: "https://canteen.jam.internal", category: AppCategory.local, letter_index: "C", description: "Canteen booking and management", contact_func: "Admin", contact_tech: "IT", sort_order: 2, site_id: jamnagar.id },
    { name: "Transport Booking", url: "https://transport.jam.internal", category: AppCategory.local, letter_index: "T", description: "Company transport booking", contact_func: "Admin", contact_tech: "IT", sort_order: 3, site_id: jamnagar.id },
    { name: "Visitor Management", url: "https://visitor.jam.internal", category: AppCategory.local, letter_index: "V", description: "Gate pass and visitor management", contact_func: "Security", contact_tech: "IT", sort_order: 4, site_id: jamnagar.id },
    { name: "Safety Training", url: "https://safety.jam.internal", category: AppCategory.local, letter_index: "S", description: "Safety training and compliance", contact_func: "EHS", contact_tech: "IT", sort_order: 5, site_id: jamnagar.id },
  ];

  for (const app of localApps) {
    await prisma.application.upsert({
      where: { id: enterpriseApps.length + localApps.indexOf(app) + 1 },
      update: {},
      create: { ...app, is_active: true },
    });
  }

  console.log("Created applications");

  // Create Announcements
  const announcements = [
    {
      title: "Annual Day Celebration",
      content: "We are pleased to announce the Annual Day celebration on March 25, 2025. All employees are invited to join us for a day filled with cultural programs and awards.",
      site_id: jamnagar.id,
      is_active: true,
      expires_at: new Date("2025-03-26"),
    },
    {
      title: "Safety Week 2025",
      content: "National Safety Week will be observed from March 4-10, 2025. Various programs and competitions have been planned. Your participation is mandatory.",
      site_id: null,
      is_active: true,
      expires_at: new Date("2025-03-11"),
    },
    {
      title: "System Maintenance Notice",
      content: "SAP system will be under maintenance on Saturday, March 15, 2025 from 10 PM to 6 AM Sunday. Please plan your work accordingly.",
      site_id: null,
      is_active: true,
      expires_at: new Date("2025-03-16"),
    },
    {
      title: "New Canteen Menu",
      content: "Effective April 1, 2025, the canteen will introduce a new menu with more healthy options. Feedback forms are available at the canteen counter.",
      site_id: jamnagar.id,
      is_active: true,
      expires_at: new Date("2025-04-30"),
    },
  ];

  for (const announcement of announcements) {
    await prisma.announcement.create({ data: announcement });
  }

  console.log("Created announcements");

  // Create Emergency Numbers for Jamnagar
  const emergencyNumbers = [
    { name: "Fire Station", landline_no: "0288-2345678", mobile_no: "9876543210", other_no: null, site_id: jamnagar.id, sort_order: 1 },
    { name: "Medical Center / Ambulance", landline_no: "0288-2345679", mobile_no: "9876543211", other_no: "108", site_id: jamnagar.id, sort_order: 2 },
    { name: "Security Control Room", landline_no: "0288-2345680", mobile_no: "9876543212", other_no: null, site_id: jamnagar.id, sort_order: 3 },
    { name: "IT Helpdesk", landline_no: "0288-2345681", mobile_no: "9876543213", other_no: null, site_id: jamnagar.id, sort_order: 4 },
    { name: "HR Helpdesk", landline_no: "0288-2345682", mobile_no: "9876543214", other_no: null, site_id: jamnagar.id, sort_order: 5 },
    { name: "Emergency Control Room", landline_no: "0288-2345683", mobile_no: "9876543215", other_no: "100", site_id: jamnagar.id, sort_order: 6 },
    { name: "Fire Station", landline_no: "0522-2345678", mobile_no: "9876543220", other_no: null, site_id: barabanki.id, sort_order: 1 },
    { name: "Medical Center", landline_no: "0522-2345679", mobile_no: "9876543221", other_no: "108", site_id: barabanki.id, sort_order: 2 },
  ];

  for (const num of emergencyNumbers) {
    await prisma.emergencyNumber.create({ data: num });
  }

  console.log("Created emergency numbers");

  // Create Carousel Images
  const carouselImages = [
    { image_url: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=1200&h=400&fit=crop", link_url: null, site_id: jamnagar.id, sort_order: 1, is_active: true },
    { image_url: "https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=1200&h=400&fit=crop", link_url: null, site_id: jamnagar.id, sort_order: 2, is_active: true },
    { image_url: "https://images.unsplash.com/photo-1565953554499-e6e7c7a56c42?w=1200&h=400&fit=crop", link_url: null, site_id: jamnagar.id, sort_order: 3, is_active: true },
  ];

  for (const img of carouselImages) {
    await prisma.carouselImage.create({ data: img });
  }

  // Create Ticker Items
  const tickerItems = [
    { content: "Welcome to Karyadwar - Your Manufacturing Intranet Portal", site_id: jamnagar.id, is_active: true },
    { content: "Safety First: Report all near-misses to the EHS department", site_id: jamnagar.id, is_active: true },
    { content: "Annual appraisal cycle starts from April 1, 2025", site_id: null, is_active: true },
  ];

  for (const ticker of tickerItems) {
    await prisma.tickerItem.create({ data: ticker });
  }

  console.log("Created carousel images and ticker items");

  // Create Employee Events
  const today = new Date();
  const employeeEvents = [
    { emp_no: "EMP101", event_type: EventType.birthday, event_date: new Date(today.getFullYear(), today.getMonth(), today.getDate()), department: "Engineering", email: "emp101@company.com", photo_url: null },
    { emp_no: "EMP102", event_type: EventType.birthday, event_date: new Date(today.getFullYear(), today.getMonth(), today.getDate()), department: "HR", email: "emp102@company.com", photo_url: null },
    { emp_no: "EMP103", event_type: EventType.long_service, event_date: new Date(today.getFullYear(), today.getMonth(), today.getDate()), department: "Finance", email: "emp103@company.com", photo_url: null },
    { emp_no: "EMP104", event_type: EventType.birthday, event_date: new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1), department: "IT", email: "emp104@company.com", photo_url: null },
    { emp_no: "EMP105", event_type: EventType.long_service, event_date: new Date(today.getFullYear(), today.getMonth(), today.getDate() + 2), department: "Operations", email: "emp105@company.com", photo_url: null },
  ];

  for (const event of employeeEvents) {
    await prisma.employeeEvent.create({ data: event });
  }

  console.log("Created employee events");

  // Add Favorites for test user
  const apps = await prisma.application.findMany({ take: 3 });
  for (const app of apps) {
    await prisma.favorite.create({
      data: {
        user_id: testUser.id,
        app_id: app.id,
      },
    });
  }

  console.log("Database seeded successfully!");
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
