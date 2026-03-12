import { PrismaClient, AppCategory, EventType } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

// ─── Site Definitions ─────────────────────────────────────────────────────────

const SITES = [
  { name: 'Jamnagar', code: 'JAM' },
  { name: 'Barabanki', code: 'BBK' },
  { name: 'Dahej', code: 'DAH' },
  { name: 'Hazira PetChem', code: 'HPC' },
  { name: 'Hazira Polyester', code: 'HPY' },
  { name: 'Hoshiarpur', code: 'HSP' },
  { name: 'Nagothane', code: 'NGT' },
  { name: 'Naroda', code: 'NRD' },
  { name: 'Patalganga PetChem', code: 'PPC' },
  { name: 'Patalganga Polyester', code: 'PPY' },
  { name: 'Silvassa', code: 'SIL' },
  { name: 'Vadodara', code: 'VAD' },
]

// ─── Enterprise Applications (Global — no siteId) ────────────────────────────

const ENTERPRISE_APPS = [
  {
    name: 'Ariba',
    url: 'https://ariba.example.com',
    description: 'SAP Ariba Procurement Platform for sourcing and procurement management',
    letterIndex: 'A',
    contactFunc: 'Procurement Dept',
    contactTech: 'SAP Team',
    sortOrder: 1,
  },
  {
    name: 'CAT',
    url: 'https://cat.example.com',
    description: 'Computer Aided Testing — automated testing and quality assurance platform',
    letterIndex: 'C',
    contactFunc: 'Quality Assurance',
    contactTech: 'QA Systems Team',
    sortOrder: 2,
  },
  {
    name: 'Documentum',
    url: 'https://documentum.example.com',
    description: 'OpenText Documentum — enterprise document and content management',
    letterIndex: 'D',
    contactFunc: 'Document Control',
    contactTech: 'ECM Team',
    sortOrder: 3,
  },
  {
    name: 'EHS Management System',
    url: 'https://ehs.example.com',
    description: 'Environment, Health & Safety management and compliance tracking',
    letterIndex: 'E',
    contactFunc: 'EHS Department',
    contactTech: 'EHS IT Team',
    sortOrder: 4,
  },
  {
    name: 'Energy Management System',
    url: 'https://ems.example.com',
    description: 'Plant-wide energy consumption monitoring and ISO 50001 compliance',
    letterIndex: 'E',
    contactFunc: 'Utilities Department',
    contactTech: 'SCADA Team',
    sortOrder: 5,
  },
  {
    name: 'ESS',
    url: 'https://ess.example.com',
    description: 'Employee Self Service — leave, payslip, attendance, and personal data management',
    letterIndex: 'E',
    contactFunc: 'HR Department',
    contactTech: 'SAP HR Team',
    sortOrder: 6,
  },
  {
    name: 'Infra Helpdesk',
    url: 'https://helpdesk.example.com',
    description: 'IT Infrastructure Helpdesk for hardware, software, and network support tickets',
    letterIndex: 'I',
    contactFunc: 'All Employees',
    contactTech: 'IT Helpdesk Team',
    sortOrder: 7,
  },
  {
    name: 'Kronos',
    url: 'https://kronos.example.com',
    description: 'Workforce Management — shift scheduling, time and attendance tracking',
    letterIndex: 'K',
    contactFunc: 'HR / Operations',
    contactTech: 'Kronos Admin',
    sortOrder: 8,
  },
  {
    name: 'LIMS',
    url: 'https://lims.example.com',
    description: 'Laboratory Information Management System for sample tracking and test results',
    letterIndex: 'L',
    contactFunc: 'Laboratory',
    contactTech: 'LIMS Admin',
    sortOrder: 9,
  },
  {
    name: 'Maximo',
    url: 'https://maximo.example.com',
    description: 'IBM Maximo — enterprise asset management, maintenance planning and work orders',
    letterIndex: 'M',
    contactFunc: 'Maintenance Dept',
    contactTech: 'Maximo Team',
    sortOrder: 10,
  },
  {
    name: 'Office 365',
    url: 'https://portal.office.com',
    description: 'Microsoft Office 365 — email, Teams, SharePoint, and productivity applications',
    letterIndex: 'O',
    contactFunc: 'All Employees',
    contactTech: 'M365 Admin',
    sortOrder: 11,
  },
  {
    name: 'Oracle HR',
    url: 'https://oraclehr.example.com',
    description: 'Oracle Human Resources — employee records, compensation, and benefits management',
    letterIndex: 'O',
    contactFunc: 'HR Department',
    contactTech: 'Oracle DBA Team',
    sortOrder: 12,
  },
  {
    name: 'SAP ERP',
    url: 'https://sap.example.com',
    description: 'SAP Enterprise Resource Planning — core business processes and transactions',
    letterIndex: 'S',
    contactFunc: 'All Departments',
    contactTech: 'SAP Basis Team',
    sortOrder: 13,
  },
  {
    name: 'SAP FI',
    url: 'https://sapfi.example.com',
    description: 'SAP Financial Accounting — general ledger, accounts payable and receivable',
    letterIndex: 'S',
    contactFunc: 'Finance Dept',
    contactTech: 'SAP FI Team',
    sortOrder: 14,
  },
  {
    name: 'SAP MM',
    url: 'https://sapmm.example.com',
    description: 'SAP Materials Management — procurement, inventory, and warehouse management',
    letterIndex: 'S',
    contactFunc: 'Materials Dept',
    contactTech: 'SAP MM Team',
    sortOrder: 15,
  },
  {
    name: 'SAP PM',
    url: 'https://sappm.example.com',
    description: 'SAP Plant Maintenance — equipment master, preventive maintenance, and notifications',
    letterIndex: 'S',
    contactFunc: 'Maintenance Dept',
    contactTech: 'SAP PM Team',
    sortOrder: 16,
  },
  {
    name: 'ServiceNow',
    url: 'https://servicenow.example.com',
    description: 'IT Service Management — incident, change, and problem management platform',
    letterIndex: 'S',
    contactFunc: 'All Employees',
    contactTech: 'ServiceNow Admin',
    sortOrder: 17,
  },
  {
    name: 'SharePoint',
    url: 'https://sharepoint.example.com',
    description: 'Microsoft SharePoint — document collaboration, team sites, and intranet pages',
    letterIndex: 'S',
    contactFunc: 'All Departments',
    contactTech: 'SharePoint Admin',
    sortOrder: 18,
  },
  {
    name: 'SuccessFactors',
    url: 'https://successfactors.example.com',
    description: 'SAP SuccessFactors — performance management, goal setting, and talent management',
    letterIndex: 'S',
    contactFunc: 'HR Department',
    contactTech: 'SF Admin Team',
    sortOrder: 19,
  },
  {
    name: 'Tableau',
    url: 'https://tableau.example.com',
    description: 'Tableau Business Analytics — interactive dashboards and data visualization',
    letterIndex: 'T',
    contactFunc: 'Analytics Team',
    contactTech: 'BI Team',
    sortOrder: 20,
  },
  {
    name: 'Training Portal',
    url: 'https://lms.example.com',
    description: 'Learning Management System — e-learning courses, certifications, and training records',
    letterIndex: 'T',
    contactFunc: 'HR / Training',
    contactTech: 'LMS Admin',
    sortOrder: 21,
  },
  {
    name: 'Workday HCM',
    url: 'https://workday.example.com',
    description: 'Workday Human Capital Management — HR, payroll, and workforce planning',
    letterIndex: 'W',
    contactFunc: 'HR Department',
    contactTech: 'Workday Admin',
    sortOrder: 22,
  },
]

// ─── Local Applications (Global templates, applicable to all sites) ───────────

const LOCAL_APPS = [
  {
    name: 'Calibration Management',
    url: '/apps/calibration',
    description: 'Equipment calibration scheduling, status tracking, and certificate management',
    letterIndex: 'C',
    contactFunc: 'Instrumentation',
    contactTech: 'Site IT',
    sortOrder: 1,
  },
  {
    name: 'Canteen Management',
    url: '/apps/canteen',
    description: 'Daily meal booking, menu management, and canteen billing system',
    letterIndex: 'C',
    contactFunc: 'Admin Dept',
    contactTech: 'Site IT',
    sortOrder: 2,
  },
  {
    name: 'Conference Room Booking',
    url: '/apps/conference',
    description: 'Meeting room reservation, AV equipment booking, and calendar management',
    letterIndex: 'C',
    contactFunc: 'Admin Dept',
    contactTech: 'Site IT',
    sortOrder: 3,
  },
  {
    name: 'Contract Labor Management',
    url: '/apps/contract-labor',
    description: 'Contractor workforce management, gate entry, and compliance tracking',
    letterIndex: 'C',
    contactFunc: 'HR / Security',
    contactTech: 'Site IT',
    sortOrder: 4,
  },
  {
    name: 'Dispatch Management',
    url: '/apps/dispatch',
    description: 'Material dispatch, delivery tracking, and transport coordination',
    letterIndex: 'D',
    contactFunc: 'Logistics Dept',
    contactTech: 'Site IT',
    sortOrder: 5,
  },
  {
    name: 'Employee Transport',
    url: '/apps/transport',
    description: 'Company shuttle booking, route management, and transport pass generation',
    letterIndex: 'E',
    contactFunc: 'Admin Dept',
    contactTech: 'Site IT',
    sortOrder: 6,
  },
  {
    name: 'Fire Emergency System',
    url: '/apps/fire-emergency',
    description: 'Fire alarm dashboard, evacuation routes, muster point management',
    letterIndex: 'F',
    contactFunc: 'Fire & Safety',
    contactTech: 'Site IT',
    sortOrder: 7,
  },
  {
    name: 'Gate Pass Management',
    url: '/apps/gate-pass',
    description: 'Vehicle gate pass, material inward/outward, and visitor vehicle tracking',
    letterIndex: 'G',
    contactFunc: 'Security Dept',
    contactTech: 'Site IT',
    sortOrder: 8,
  },
  {
    name: 'Housekeeping Management',
    url: '/apps/housekeeping',
    description: 'Facility housekeeping schedules, inspection checklists, and contractor tracking',
    letterIndex: 'H',
    contactFunc: 'Admin / Facilities',
    contactTech: 'Site IT',
    sortOrder: 9,
  },
  {
    name: 'Incident Reporting',
    url: '/apps/incident',
    description: 'Near-miss, safety incident, and accident reporting with investigation workflow',
    letterIndex: 'I',
    contactFunc: 'Safety Dept',
    contactTech: 'Site IT',
    sortOrder: 10,
  },
  {
    name: 'Medical Dispensary',
    url: '/apps/medical',
    description: 'Employee health records, dispensary visits, first aid, and OHC management',
    letterIndex: 'M',
    contactFunc: 'OHC / Medical',
    contactTech: 'Site IT',
    sortOrder: 11,
  },
  {
    name: 'Permit to Work',
    url: '/apps/permit-to-work',
    description: 'Electronic work permit system for hot work, confined space, height work, and LOTO',
    letterIndex: 'P',
    contactFunc: 'Safety Dept',
    contactTech: 'Site IT',
    sortOrder: 12,
  },
  {
    name: 'Production Reporting',
    url: '/apps/production',
    description: 'Daily, weekly, and monthly production reporting with KPI dashboards',
    letterIndex: 'P',
    contactFunc: 'Production Dept',
    contactTech: 'Site IT',
    sortOrder: 13,
  },
  {
    name: 'Quality Control',
    url: '/apps/quality',
    description: 'Quality inspection records, NC management, and product testing logs',
    letterIndex: 'Q',
    contactFunc: 'Quality Dept',
    contactTech: 'Site IT',
    sortOrder: 14,
  },
  {
    name: 'Safety Observation',
    url: '/apps/safety-obs',
    description: 'Safety observation reporting, behavior-based safety, and trend analysis',
    letterIndex: 'S',
    contactFunc: 'Safety Dept',
    contactTech: 'Site IT',
    sortOrder: 15,
  },
  {
    name: 'Security Management',
    url: '/apps/security',
    description: 'Access control, CCTV monitoring dashboard, and security patrol management',
    letterIndex: 'S',
    contactFunc: 'Security Dept',
    contactTech: 'Site IT',
    sortOrder: 16,
  },
  {
    name: 'Shift Roster',
    url: '/apps/shift-roster',
    description: 'Shift scheduling, operator roster management, and handover notes',
    letterIndex: 'S',
    contactFunc: 'Operations / HR',
    contactTech: 'Site IT',
    sortOrder: 17,
  },
  {
    name: 'Stationery Store',
    url: '/apps/stationery',
    description: 'Office stationery requisition, stock management, and distribution tracking',
    letterIndex: 'S',
    contactFunc: 'Admin Dept',
    contactTech: 'Site IT',
    sortOrder: 18,
  },
  {
    name: 'Visitor Management',
    url: '/apps/visitor',
    description: 'Visitor pre-registration, badge printing, and movement tracking',
    letterIndex: 'V',
    contactFunc: 'Security / Admin',
    contactTech: 'Site IT',
    sortOrder: 19,
  },
  {
    name: 'Waste Management',
    url: '/apps/waste',
    description: 'Hazardous and non-hazardous waste generation, disposal, and compliance tracking',
    letterIndex: 'W',
    contactFunc: 'Environment Dept',
    contactTech: 'Site IT',
    sortOrder: 20,
  },
  {
    name: 'Water Treatment Plant',
    url: '/apps/wtp',
    description: 'WTP operations monitoring, water quality parameters, and effluent tracking',
    letterIndex: 'W',
    contactFunc: 'Utilities Dept',
    contactTech: 'Site IT',
    sortOrder: 21,
  },
]

// ─── Emergency Numbers by Site ────────────────────────────────────────────────

function getEmergencyNumbers(siteName: string) {
  return [
    { name: 'Fire Station', landlineNo: '100', mobileNo: '98765-00001', sortOrder: 1 },
    { name: 'Medical / OHC', landlineNo: '101', mobileNo: '98765-00002', sortOrder: 2 },
    { name: 'Security Control Room', landlineNo: '102', mobileNo: '98765-00003', sortOrder: 3 },
    { name: 'Site Head / GM', landlineNo: '2001', mobileNo: '98765-00004', sortOrder: 4 },
    { name: 'IT Helpdesk', landlineNo: '4000', mobileNo: '98765-00005', sortOrder: 5 },
    { name: 'Administration', landlineNo: '2100', mobileNo: '98765-00006', sortOrder: 6 },
  ]
}

// ─── Ticker Items by Site ─────────────────────────────────────────────────────

function getTickerItems(siteName: string, siteCode: string) {
  return [
    {
      content: `[${siteCode}] Safety First: Always wear PPE in designated hazardous areas. Zero Accident target for 2026.`,
    },
    {
      content: `[${siteCode}] Upcoming: Quarterly EHS audit scheduled for 20th March 2026. All departments to prepare documentation.`,
    },
    {
      content: `[${siteCode}] IT Maintenance: SAP system scheduled downtime on Saturday night 22nd March, 11 PM – 2 AM.`,
    },
    {
      content: `[${siteCode}] HR Notice: Annual Performance Appraisal cycle open in SuccessFactors until 31st March 2026.`,
    },
  ]
}

// ─── Sample Employee Events ───────────────────────────────────────────────────

const EMPLOYEE_EVENTS = [
  { empNo: 'EMP001', name: 'Ramesh Kumar Sharma', eventType: EventType.BIRTHDAY, eventDate: new Date('2026-03-14'), department: 'Maintenance', email: 'ramesh.sharma@example.com' },
  { empNo: 'EMP002', name: 'Priya Nair', eventType: EventType.LONG_SERVICE, eventDate: new Date('2026-03-15'), department: 'Human Resources', email: 'priya.nair@example.com' },
  { empNo: 'EMP003', name: 'Sunil Patel', eventType: EventType.BIRTHDAY, eventDate: new Date('2026-03-16'), department: 'Production', email: 'sunil.patel@example.com' },
  { empNo: 'EMP004', name: 'Anita Joshi', eventType: EventType.LONG_SERVICE, eventDate: new Date('2026-03-18'), department: 'Quality Control', email: 'anita.joshi@example.com' },
  { empNo: 'EMP005', name: 'Rajesh Mehta', eventType: EventType.BIRTHDAY, eventDate: new Date('2026-03-20'), department: 'Finance', email: 'rajesh.mehta@example.com' },
  { empNo: 'EMP006', name: 'Sunita Yadav', eventType: EventType.LONG_SERVICE, eventDate: new Date('2026-03-22'), department: 'Safety', email: 'sunita.yadav@example.com' },
  { empNo: 'EMP007', name: 'Arun Krishnamurthy', eventType: EventType.BIRTHDAY, eventDate: new Date('2026-03-25'), department: 'Engineering', email: 'arun.k@example.com' },
  { empNo: 'EMP008', name: 'Kavita Singh', eventType: EventType.LONG_SERVICE, eventDate: new Date('2026-03-28'), department: 'Procurement', email: 'kavita.singh@example.com' },
  { empNo: 'EMP009', name: 'Mohan Das', eventType: EventType.BIRTHDAY, eventDate: new Date('2026-04-02'), department: 'Instrumentation', email: 'mohan.das@example.com' },
  { empNo: 'EMP010', name: 'Deepa Verma', eventType: EventType.LONG_SERVICE, eventDate: new Date('2026-04-05'), department: 'IT', email: 'deepa.verma@example.com' },
  { empNo: 'EMP011', name: 'Sanjay Gupta', eventType: EventType.BIRTHDAY, eventDate: new Date('2026-04-08'), department: 'Operations', email: 'sanjay.gupta@example.com' },
  { empNo: 'EMP012', name: 'Rekha Pillai', eventType: EventType.LONG_SERVICE, eventDate: new Date('2026-04-10'), department: 'Legal', email: 'rekha.pillai@example.com' },
  { empNo: 'EMP013', name: 'Vikram Rathore', eventType: EventType.BIRTHDAY, eventDate: new Date('2026-04-12'), department: 'Projects', email: 'vikram.rathore@example.com' },
  { empNo: 'EMP014', name: 'Meena Iyer', eventType: EventType.BIRTHDAY, eventDate: new Date('2026-04-15'), department: 'Laboratory', email: 'meena.iyer@example.com' },
  { empNo: 'EMP015', name: 'Dinesh Chaudhary', eventType: EventType.LONG_SERVICE, eventDate: new Date('2026-04-18'), department: 'Electrical', email: 'dinesh.chaudhary@example.com' },
  { empNo: 'EMP016', name: 'Shilpa Desai', eventType: EventType.BIRTHDAY, eventDate: new Date('2026-04-20'), department: 'Administration', email: 'shilpa.desai@example.com' },
  { empNo: 'EMP017', name: 'Prakash Nambiar', eventType: EventType.LONG_SERVICE, eventDate: new Date('2026-04-22'), department: 'Environment', email: 'prakash.nambiar@example.com' },
  { empNo: 'EMP018', name: 'Lalita Bhatt', eventType: EventType.BIRTHDAY, eventDate: new Date('2026-04-25'), department: 'Logistics', email: 'lalita.bhatt@example.com' },
  { empNo: 'EMP019', name: 'Harish Tiwari', eventType: EventType.LONG_SERVICE, eventDate: new Date('2026-04-28'), department: 'Civil', email: 'harish.tiwari@example.com' },
  { empNo: 'EMP020', name: 'Neha Kapoor', eventType: EventType.BIRTHDAY, eventDate: new Date('2026-05-01'), department: 'Marketing', email: 'neha.kapoor@example.com' },
  { empNo: 'EMP021', name: 'Ravi Shankar', eventType: EventType.LONG_SERVICE, eventDate: new Date('2026-05-05'), department: 'Corporate Planning', email: 'ravi.shankar@example.com' },
  { empNo: 'EMP022', name: 'Pooja Malhotra', eventType: EventType.BIRTHDAY, eventDate: new Date('2026-05-08'), department: 'Business Development', email: 'pooja.malhotra@example.com' },
]

// ─── Sample Announcements ─────────────────────────────────────────────────────

const ANNOUNCEMENTS = [
  {
    title: 'Annual Safety Day Celebrations — 4th March 2026',
    content: 'All sites are requested to conduct National Safety Day celebrations on 4th March. Activities include safety quiz, fire mock drill, and awareness programs. Please submit participation reports to EHS HQ by 10th March.',
    siteCode: 'JAM',
    expiresAt: new Date('2026-03-15'),
  },
  {
    title: 'SAP System Upgrade — Version 2026 Rollout',
    content: 'SAP will be upgraded to version S/4HANA 2026 during the weekend of 22nd-23rd March. All users should complete pending transactions before 10 PM on Friday 21st March. System will be available from 6 AM on Monday 24th March.',
    siteCode: 'JAM',
    expiresAt: new Date('2026-03-25'),
  },
  {
    title: 'New Canteen Menu — April 2026',
    content: 'Enhanced canteen menus with healthier options including salad bars, low-calorie meals, and increased vegetarian choices will be introduced from 1st April 2026 at all sites.',
    siteCode: 'BBK',
    expiresAt: new Date('2026-04-15'),
  },
  {
    title: 'ISO 45001 Recertification Audit',
    content: 'The ISO 45001:2018 Occupational Health & Safety recertification audit is scheduled for 18th-19th March at Dahej site. All department heads to ensure compliance documentation is up to date.',
    siteCode: 'DAH',
    expiresAt: new Date('2026-03-20'),
  },
  {
    title: 'Annual Performance Appraisal 2025-26',
    content: 'Annual performance appraisal for FY 2025-26 is now open in SuccessFactors. All employees to complete self-appraisal by 25th March. Managers to complete reviews by 31st March.',
    siteCode: 'VAD',
    expiresAt: new Date('2026-03-31'),
  },
]

// ─── Main Seed Function ───────────────────────────────────────────────────────

async function main() {
  console.log('🌱 Starting Karyadwar database seed...')

  // Step 1: Upsert Sites
  console.log('\n📍 Seeding sites...')
  const siteMap: Record<string, string> = {}

  for (const site of SITES) {
    const created = await prisma.site.upsert({
      where: { code: site.code },
      update: { name: site.name, isActive: true },
      create: { name: site.name, code: site.code, isActive: true },
    })
    siteMap[site.code] = created.id
    console.log(`  ✓ Site: ${site.name} (${site.code})`)
  }

  // Step 2: Seed Users
  console.log('\n👤 Seeding users...')
  const adminPassword = await bcrypt.hash('Admin@1234', 12)
  const userPassword = await bcrypt.hash('User@1234', 12)

  const usersData = [
    {
      empNo: 'ADM001',
      domainId: 'admin',
      nickName: 'Admin',
      email: 'admin@karyadwar.example.com',
      password: adminPassword,
      defaultSiteId: siteMap['JAM'],
      loginMethod: 'email',
      role: 'superadmin',
    },
    {
      empNo: 'EMP10001',
      domainId: 'rk.sharma',
      nickName: 'Ramesh',
      email: 'rk.sharma@example.com',
      password: userPassword,
      defaultSiteId: siteMap['JAM'],
      loginMethod: 'domain',
      role: 'user',
    },
    {
      empNo: 'EMP10002',
      domainId: 'priya.nair',
      nickName: 'Priya',
      email: 'priya.nair@example.com',
      password: userPassword,
      defaultSiteId: siteMap['BBK'],
      loginMethod: 'domain',
      role: 'user',
    },
    {
      empNo: 'EMP10003',
      domainId: 'sunil.patel',
      nickName: 'Sunil',
      email: 'sunil.patel@example.com',
      password: userPassword,
      defaultSiteId: siteMap['DAH'],
      loginMethod: 'domain',
      role: 'user',
    },
    {
      empNo: 'EMP10004',
      domainId: 'anita.joshi',
      nickName: 'Anita',
      email: 'anita.joshi@example.com',
      password: userPassword,
      defaultSiteId: siteMap['VAD'],
      loginMethod: 'domain',
      role: 'admin',
    },
    {
      empNo: 'EMP10005',
      domainId: 'rajesh.mehta',
      nickName: 'Rajesh',
      email: 'rajesh.mehta@example.com',
      password: userPassword,
      defaultSiteId: siteMap['HPC'],
      loginMethod: 'domain',
      role: 'user',
    },
  ]

  for (const userData of usersData) {
    await prisma.user.upsert({
      where: { empNo: userData.empNo },
      update: {},
      create: userData,
    })
    console.log(`  ✓ User: ${userData.domainId} (${userData.role})`)
  }

  // Step 3: Seed Enterprise Applications
  console.log('\n🏢 Seeding enterprise applications...')
  const appCount = await prisma.application.count({ where: { category: AppCategory.ENTERPRISE } })

  if (appCount === 0) {
    for (const app of ENTERPRISE_APPS) {
      await prisma.application.create({
        data: {
          ...app,
          category: AppCategory.ENTERPRISE,
          siteId: null,
          isActive: true,
        },
      })
      console.log(`  ✓ Enterprise App: ${app.name}`)
    }
  } else {
    console.log(`  ℹ Enterprise apps already seeded (${appCount} found), skipping.`)
  }

  // Step 4: Seed Local Applications
  console.log('\n🏭 Seeding local applications...')
  const localAppCount = await prisma.application.count({ where: { category: AppCategory.LOCAL } })

  if (localAppCount === 0) {
    for (const app of LOCAL_APPS) {
      await prisma.application.create({
        data: {
          ...app,
          category: AppCategory.LOCAL,
          siteId: null,
          isActive: true,
        },
      })
      console.log(`  ✓ Local App: ${app.name}`)
    }
  } else {
    console.log(`  ℹ Local apps already seeded (${localAppCount} found), skipping.`)
  }

  // Step 5: Seed Emergency Numbers
  console.log('\n🚨 Seeding emergency numbers...')
  const emergencyCount = await prisma.emergencyNumber.count()

  if (emergencyCount === 0) {
    for (const [siteCode, siteId] of Object.entries(siteMap)) {
      const siteName = SITES.find((s) => s.code === siteCode)?.name ?? siteCode
      const numbers = getEmergencyNumbers(siteName)

      for (const num of numbers) {
        await prisma.emergencyNumber.create({
          data: { ...num, siteId },
        })
      }
      console.log(`  ✓ Emergency numbers for: ${siteName}`)
    }
  } else {
    console.log(`  ℹ Emergency numbers already seeded (${emergencyCount} found), skipping.`)
  }

  // Step 6: Seed Ticker Items
  console.log('\n📢 Seeding ticker items...')
  const tickerCount = await prisma.tickerItem.count()

  if (tickerCount === 0) {
    for (const [siteCode, siteId] of Object.entries(siteMap)) {
      const siteName = SITES.find((s) => s.code === siteCode)?.name ?? siteCode
      const items = getTickerItems(siteName, siteCode)

      for (const item of items) {
        await prisma.tickerItem.create({
          data: { ...item, siteId, isActive: true },
        })
      }
      console.log(`  ✓ Ticker items for: ${siteName}`)
    }
  } else {
    console.log(`  ℹ Ticker items already seeded (${tickerCount} found), skipping.`)
  }

  // Step 7: Seed Employee Events
  console.log('\n🎂 Seeding employee events...')
  const eventCount = await prisma.employeeEvent.count()

  if (eventCount === 0) {
    for (const event of EMPLOYEE_EVENTS) {
      await prisma.employeeEvent.create({ data: event })
    }
    console.log(`  ✓ Created ${EMPLOYEE_EVENTS.length} employee events`)
  } else {
    console.log(`  ℹ Employee events already seeded (${eventCount} found), skipping.`)
  }

  // Step 8: Seed Announcements
  console.log('\n📋 Seeding announcements...')
  const announcementCount = await prisma.announcement.count()

  if (announcementCount === 0) {
    for (const ann of ANNOUNCEMENTS) {
      const siteId = siteMap[ann.siteCode]
      if (!siteId) continue

      await prisma.announcement.create({
        data: {
          title: ann.title,
          content: ann.content,
          siteId,
          isActive: true,
          expiresAt: ann.expiresAt,
        },
      })
      console.log(`  ✓ Announcement: ${ann.title.substring(0, 50)}...`)
    }
  } else {
    console.log(`  ℹ Announcements already seeded (${announcementCount} found), skipping.`)
  }

  // Step 9: Seed Admin Access for admin user
  console.log('\n🔐 Seeding admin access...')
  const adminUser = await prisma.user.findUnique({ where: { empNo: 'ADM001' } })

  if (adminUser) {
    const accessCount = await prisma.adminAccess.count({ where: { userId: adminUser.id } })

    if (accessCount === 0) {
      for (const siteId of Object.values(siteMap)) {
        await prisma.adminAccess.create({
          data: {
            userId: adminUser.id,
            siteId,
            permissionLevel: 'admin',
          },
        })
      }
      console.log(`  ✓ Admin access granted to all ${Object.keys(siteMap).length} sites for ADM001`)
    } else {
      console.log(`  ℹ Admin access already seeded, skipping.`)
    }
  }

  console.log('\n✅ Seed completed successfully!')
  console.log('\n📊 Summary:')
  console.log(`  Sites:              ${SITES.length}`)
  console.log(`  Enterprise Apps:    ${ENTERPRISE_APPS.length}`)
  console.log(`  Local Apps:         ${LOCAL_APPS.length}`)
  console.log(`  Users:              ${usersData.length}`)
  console.log(`  Employee Events:    ${EMPLOYEE_EVENTS.length}`)
  console.log(`  Announcements:      ${ANNOUNCEMENTS.length}`)
  console.log(`\n  Default credentials:`)
  console.log(`  Admin:  admin@karyadwar.example.com / Admin@1234`)
  console.log(`  User:   rk.sharma@example.com / User@1234`)
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
