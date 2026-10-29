/**
 * Startup Connect Rwanda - Initial Mock Ecosystem Data
 * Aligned with SRS (Software Requirements Specification) by David Nkubito
 * Encompasses:
 * - Domain Classes: Users, Founders, Mentors, Investors, Startups,
 *   ConnectionRequests, MentorshipRequests, MentorshipSessions, InvestmentInterests, DirectMessages.
 * - East African Sectors: AgriTech, FinTech, GreenTech / CleanEnergy, HealthTech, EdTech, Mobility.
 * - Rwandan Administrative Regions: Kigali, Northern Province, Southern Province, Western Province, Eastern Province.
 */

const RWANDAN_REGIONS = [
  "Kigali",
  "Northern Province",
  "Southern Province",
  "Western Province",
  "Eastern Province"
];

const RWANDAN_SECTORS = [
  "AgriTech",
  "FinTech",
  "GreenTech / CleanEnergy",
  "HealthTech",
  "EdTech",
  "Mobility"
];

const INITIAL_ECOSYSTEM_DATA = {
  regions: RWANDAN_REGIONS,
  sectors: RWANDAN_SECTORS,

  startups: [
    {
      id: "startup-1",
      name: "Kigali Fresh Logistics",
      founderId: "founder-1",
      founderName: "Jean-Luc Mugisha",
      sector: "AgriTech",
      stage: "Seed",
      region: "Northern Province",
      location: "Musanze / Kigali",
      logo: "KF",
      tagline: "Solar-powered cold chain logistics connecting 1,200+ rural farmers to urban grocers.",
      description: "Kigali Fresh solves post-harvest losses in Rwanda's horticulture belt by deploying IoT-enabled cold storage hubs and mobile temperature-controlled delivery. We have reduced post-harvest spoilage by 38% for Musanze cooperative farmers.",
      capitalSeeking: 150000,
      capitalRaised: 45000,
      monthlyRevenue: 18500,
      youthJobsCreated: 42,
      teamSize: 14,
      pitchDeckUrl: "#",
      website: "https://kigalifresh.rw",
      tags: ["AgriTech", "ColdChain", "IoT", "YouthJobs"],
      rating: 4.9,
      isFeatured: true
    },
    {
      id: "startup-2",
      name: "IremboPay Solutions",
      founderId: "founder-2",
      founderName: "Keza Diane Uwase",
      sector: "FinTech",
      stage: "Seed",
      region: "Kigali",
      location: "Kigali (Kacyiru)",
      logo: "IP",
      tagline: "Interoperable QR and USSD payment orchestration for informal micro-merchants.",
      description: "Over 80% of informal traders in Rwanda still handle cash due to transaction fees and interoperability hurdles. IremboPay provides unified digital ledgering and multi-wallet acceptance with sub-1% fees.",
      capitalSeeking: 300000,
      capitalRaised: 120000,
      monthlyRevenue: 34000,
      youthJobsCreated: 26,
      teamSize: 11,
      pitchDeckUrl: "#",
      website: "https://irembopay.rw",
      tags: ["FinTech", "FinancialInclusion", "Payments", "MicroMerchants"],
      rating: 4.8,
      isFeatured: true
    },
    {
      id: "startup-3",
      name: "Nyungwe EcoPower",
      founderId: "founder-3",
      founderName: "Fabrice Hakizimana",
      sector: "GreenTech / CleanEnergy",
      stage: "Series A",
      region: "Western Province",
      location: "Western Province (Rusizi)",
      logo: "NE",
      tagline: "Decentralized mini-grids and clean biomass power for coffee washing stations.",
      description: "Powering rural agricultural processing through modular hydro-solar hybrid grids. Replaced diesel generators across 24 washing stations, slashing emissions and energy costs by 45%.",
      capitalSeeking: 650000,
      capitalRaised: 350000,
      monthlyRevenue: 52000,
      youthJobsCreated: 68,
      teamSize: 22,
      pitchDeckUrl: "#",
      website: "https://nyungwe-ecopower.rw",
      tags: ["GreenTech", "Renewables", "MiniGrids", "CarbonOffset"],
      rating: 5.0,
      isFeatured: true
    },
    {
      id: "startup-4",
      name: "Akagera Drones & AI",
      founderId: "founder-4",
      founderName: "Sonia Mukamana",
      sector: "HealthTech",
      stage: "Seed",
      region: "Eastern Province",
      location: "Kayonza & Kigali",
      logo: "AD",
      tagline: "Autonomous drone delivery for emergency vaccine and blood distribution.",
      description: "Combining autonomous lightweight UAVs with predictive inventory AI to ensure zero stockouts of critical snake antivenom, vaccines, and surgical supplies across 45 remote clinics.",
      capitalSeeking: 250000,
      capitalRaised: 90000,
      monthlyRevenue: 14200,
      youthJobsCreated: 19,
      teamSize: 8,
      pitchDeckUrl: "#",
      website: "https://akageradrones.rw",
      tags: ["HealthTech", "AI", "Drones", "EmergencyLogistics"],
      rating: 4.7,
      isFeatured: false
    },
    {
      id: "startup-5",
      name: "SmartHarvest Rwanda",
      founderId: "founder-5",
      founderName: "Cedric Niyonzima",
      sector: "AgriTech",
      stage: "Pre-seed",
      region: "Southern Province",
      location: "Huye / Southern Province",
      logo: "SH",
      tagline: "AI soil sensors and micro-climate advisories tailored for specialty coffee.",
      description: "Affordable sensor probes transmitting NPK and soil moisture telemetry via LoRaWAN to provide actionable harvest forecasting for over 3,000 smallholder coffee farmers.",
      capitalSeeking: 95000,
      capitalRaised: 25000,
      monthlyRevenue: 6800,
      youthJobsCreated: 15,
      teamSize: 6,
      pitchDeckUrl: "#",
      website: "https://smartharvest.rw",
      tags: ["AgriTech", "IoT", "Coffee", "PrecisionAgriculture"],
      rating: 4.6,
      isFeatured: false
    },
    {
      id: "startup-6",
      name: "Volta Moto Rwanda",
      founderId: "founder-6",
      founderName: "Aimable Rwagasore",
      sector: "Mobility",
      stage: "Series A",
      region: "Kigali",
      location: "Kigali (Remera & Nyarugenge)",
      logo: "VM",
      tagline: "Electric motorcycle conversions & solar battery swapping for taxi-moto operators.",
      description: "Rwanda has over 100,000 commercial moto taxis. Volta Moto offers conversion kits and a 90-second automated battery-swapping network, cutting driver operating expenses by 32%.",
      capitalSeeking: 1100000,
      capitalRaised: 600000,
      monthlyRevenue: 78000,
      youthJobsCreated: 115,
      teamSize: 34,
      pitchDeckUrl: "#",
      website: "https://voltamoto.rw",
      tags: ["Mobility", "CleanTech", "ElectricVehicles", "UrbanTransport"],
      rating: 4.9,
      isFeatured: true
    },
    {
      id: "startup-7",
      name: "K-EdTech Academy",
      founderId: "founder-7",
      founderName: "Nadine Ingabire",
      sector: "EdTech",
      stage: "Seed",
      region: "Western Province",
      location: "Rubavu & Kigali",
      logo: "KE",
      tagline: "Vocational AI, cloud engineering, and soft-skills bootcamps for Rwandan youth.",
      description: "Empowering university graduates and TVET students with enterprise software skills and guaranteed remote internship placements. 88% graduate placement rate within 90 days.",
      capitalSeeking: 140000,
      capitalRaised: 60000,
      monthlyRevenue: 22000,
      youthJobsCreated: 54,
      teamSize: 12,
      pitchDeckUrl: "#",
      website: "https://kedtech.rw",
      tags: ["EdTech", "YouthJobs", "SoftwareSkills", "TVET"],
      rating: 4.8,
      isFeatured: false
    }
  ],

  mentors: [
    {
      id: "mentor-1",
      name: "Dr. Aline Umutoni",
      roleTitle: "Former VP of Product @ Pan-African FinTech / Senior Advisor",
      expertise: ["Product Strategy", "FinTech Regulation", "Go-To-Market", "Fundraising"],
      region: "Kigali",
      location: "Kigali, Rwanda",
      avatar: "AU",
      bio: "14+ years scaling digital consumer banking and cross-border payment platforms across Rwanda, Kenya, and Ghana. Passionate about empowering young East African technical founders.",
      hoursMentored: 140,
      activeMentees: 6,
      availability: "4 hrs/month",
      linkedin: "https://linkedin.com",
      rating: 5.0,
      totalReviews: 12
    },
    {
      id: "mentor-2",
      name: "Eric Gasana",
      roleTitle: "Supply Chain Director & Co-founder, AgriExport EAC",
      expertise: ["AgriTech Operations", "Cold-chain Logistics", "EAC Cross-Border Trade", "Cooperative Governance"],
      region: "Northern Province",
      location: "Musanze / Kigali",
      avatar: "EG",
      bio: "Hands-on operator with deep experience linking agricultural cooperatives in Rwanda to European and Middle Eastern export markets. Specializes in unit economics and cold logistics.",
      hoursMentored: 95,
      activeMentees: 4,
      availability: "6 hrs/month",
      linkedin: "https://linkedin.com",
      rating: 4.9,
      totalReviews: 8
    },
    {
      id: "mentor-3",
      name: "Claire Mukamana",
      roleTitle: "Venture Partner & Corporate Governance Consultant",
      expertise: ["Cap Table Structuring", "Due Diligence Readiness", "B2B Sales", "Governance"],
      region: "Kigali",
      location: "Kigali, Rwanda",
      avatar: "CM",
      bio: "Has advised over 30 East African startups through seed and Series A rounds. Former legal counsel for international development finance institutions in Rwanda.",
      hoursMentored: 110,
      activeMentees: 5,
      availability: "3 hrs/month",
      linkedin: "https://linkedin.com",
      rating: 4.8,
      totalReviews: 15
    },
    {
      id: "mentor-4",
      name: "Patrick Habimana",
      roleTitle: "Staff Cloud Architect & Cyber Security Specialist",
      expertise: ["Cloud Architecture", "Data Security", "Microservices", "AI Deployment"],
      region: "Southern Province",
      location: "Huye / Kigali",
      avatar: "PH",
      bio: "Specializes in building bank-grade fault-tolerant cloud architectures and compliance with Rwanda's Data Protection Law (Law N° 058/2021).",
      hoursMentored: 75,
      activeMentees: 3,
      availability: "5 hrs/month",
      linkedin: "https://linkedin.com",
      rating: 4.9,
      totalReviews: 7
    }
  ],

  investors: [
    {
      id: "investor-1",
      name: "David Kwizera",
      firm: "Kigali Impact Angel Syndicate",
      roleTitle: "Managing General Partner",
      avatar: "DK",
      region: "Kigali",
      location: "Kigali, Rwanda",
      bio: "Early-stage angel syndicate backing high-traction tech startups addressing youth employment, financial accessibility, and green infrastructure in Rwanda.",
      targetSectors: ["FinTech", "GreenTech / CleanEnergy", "AgriTech"],
      ticketMin: 25000,
      ticketMax: 150000,
      portfolioCount: 14,
      dealsReviewed: 160,
      preferredStage: "Seed"
    },
    {
      id: "investor-2",
      name: "Elena Visser",
      firm: "East Africa Seed Horizons Fund",
      roleTitle: "Principal Investment Director",
      avatar: "EV",
      region: "Kigali",
      location: "Nairobi & Kigali",
      bio: "Pan-African early-stage VC fund with a $35M allocation for East African tech ecosystems. Focuses on scalable platforms with measurable job creation metrics.",
      targetSectors: ["AgriTech", "Mobility", "EdTech"],
      ticketMin: 100000,
      ticketMax: 500000,
      portfolioCount: 22,
      dealsReviewed: 280,
      preferredStage: "Seed / Series A"
    },
    {
      id: "investor-3",
      name: "Jean-Paul Ndayisaba",
      firm: "Rwanda Diaspora Investment Circle",
      roleTitle: "Syndicate Lead",
      avatar: "JN",
      region: "Eastern Province",
      location: "Brussels & Kigali",
      bio: "Connecting Rwandan diaspora professionals in Europe and North America to back vetted early-stage home-grown innovations with catalytic capital.",
      targetSectors: ["HealthTech", "EdTech", "AgriTech"],
      ticketMin: 15000,
      ticketMax: 80000,
      portfolioCount: 9,
      dealsReviewed: 90,
      preferredStage: "Pre-seed / Seed"
    }
  ],

  connections: [
    {
      id: "req-1",
      senderId: "founder-1",
      senderName: "Jean-Luc Mugisha (Kigali Fresh)",
      senderRole: "Founder",
      recipientId: "investor-1",
      recipientName: "David Kwizera (Kigali Impact Angels)",
      recipientRole: "Investor",
      type: "Pitch Deck Review & Seed Investment",
      pitchSummary: "Seeking $150k seed round to expand cold-storage hubs to Rubavu and increase farmer onboarding by 250%.",
      status: "Accepted",
      dateSent: "2026-11-10",
      notes: "Met at Kigali demo day. Deck reviewed, meeting scheduled for Friday 3:00 PM."
    },
    {
      id: "req-2",
      senderId: "founder-1",
      senderName: "Jean-Luc Mugisha (Kigali Fresh)",
      senderRole: "Founder",
      recipientId: "mentor-2",
      recipientName: "Eric Gasana",
      recipientRole: "Mentor",
      type: "Strategic Mentorship Request",
      pitchSummary: "Seeking guidance on optimizing cold-chain transport unit economics and cooperative supply contracts in Musanze.",
      status: "Accepted",
      dateSent: "2026-11-12",
      notes: "Bi-weekly advisory call initiated. Working on cooperative revenue share formula."
    },
    {
      id: "req-3",
      senderId: "founder-1",
      senderName: "Jean-Luc Mugisha (Kigali Fresh)",
      senderRole: "Founder",
      recipientId: "investor-2",
      recipientName: "Elena Visser (EA Seed Horizons)",
      recipientRole: "Investor",
      type: "Pitch Request",
      pitchSummary: "Requesting introduction call to present Series Seed metrics and 24-month regional expansion roadmap.",
      status: "Pending",
      dateSent: "2026-11-14",
      notes: "Awaiting investment team screening."
    },
    {
      id: "req-4",
      senderId: "founder-2",
      senderName: "Keza Diane Uwase (IremboPay)",
      senderRole: "Founder",
      recipientId: "mentor-1",
      recipientName: "Dr. Aline Umutoni",
      recipientRole: "Mentor",
      type: "Mentorship on Regulatory Compliance",
      pitchSummary: "Assistance with National Bank of Rwanda (BNR) sandbox guidelines for agent banking.",
      status: "Pending",
      dateSent: "2026-11-15",
      notes: "Needs review of compliance documentation."
    },
    {
      id: "req-5",
      senderId: "founder-3",
      senderName: "Fabrice Hakizimana (Nyungwe EcoPower)",
      senderRole: "Founder",
      recipientId: "investor-1",
      recipientName: "David Kwizera",
      recipientRole: "Investor",
      type: "Series A Co-Investment",
      pitchSummary: "Scaling rural hydro-solar grids to 50 additional coffee washing stations across Western Province.",
      status: "Accepted",
      dateSent: "2026-11-08",
      notes: "Term sheet drafting stage."
    }
  ],

  // SRS Mentorship Request Lifecycle (Swimlane Activity Diagram, Page 11)
  mentorshipRequests: [
    {
      id: "mreq-1",
      founderId: "founder-1",
      founderName: "Jean-Luc Mugisha",
      startupName: "Kigali Fresh Logistics",
      mentorId: "mentor-1",
      mentorName: "Dr. Aline Umutoni",
      goals: "Need guidance on product-led growth and BNR financial sandbox compliance for rural mobile money payments to farmers in Musanze.",
      status: "Timeslots Proposed", // Pending, Declined, Timeslots Proposed, Scheduled, Completed
      submittedAt: "2026-11-20",
      declineReason: null,
      proposedSlots: [
        "Friday, Nov 28 at 3:00 PM CAT",
        "Monday, Dec 1 at 10:00 AM CAT",
        "Tuesday, Dec 2 at 4:30 PM CAT"
      ]
    },
    {
      id: "mreq-2",
      founderId: "founder-2",
      founderName: "Keza Diane Uwase",
      startupName: "IremboPay Solutions",
      mentorId: "mentor-1",
      mentorName: "Dr. Aline Umutoni",
      goals: "Reviewing agent banking unit economics and compliance checklist for National Bank of Rwanda (BNR) sandbox.",
      status: "Pending",
      submittedAt: "2026-11-22",
      declineReason: null,
      proposedSlots: []
    },
    {
      id: "mreq-3",
      founderId: "founder-3",
      founderName: "Fabrice Hakizimana",
      startupName: "Nyungwe EcoPower",
      mentorId: "mentor-2",
      mentorName: "Eric Gasana",
      goals: "Evaluating off-grid commercial power purchase agreements (PPAs) with Western Province coffee washing stations.",
      status: "Declined",
      submittedAt: "2026-11-16",
      declineReason: "Currently fully committed to 4 active mentees this quarter. Please revise and reach out to Claire Mukamana for governance PPAs.",
      proposedSlots: []
    }
  ],

  // SRS Mentorship Sessions (Class Diagram & Activity Diagram, Page 11-12)
  mentorshipSessions: [
    {
      id: "sess-1",
      requestId: "mreq-prev-1",
      founderId: "founder-1",
      founderName: "Jean-Luc Mugisha",
      startupName: "Kigali Fresh Logistics",
      mentorId: "mentor-2",
      mentorName: "Eric Gasana",
      scheduledAt: "2026-11-18 14:00 CAT",
      status: "Completed", // Scheduled, Conducted, Completed
      outcome: "Optimized cold-chain route planning from Musanze to Kigali central markets; established a 22% cooperative cost-sharing benchmark.",
      rating: 5,
      review: "Eric's deep knowledge of Rwandan cooperative logistics saved us months of trial and error. Invaluable session!",
      completedAt: "2026-11-18"
    },
    {
      id: "sess-2",
      requestId: "mreq-prev-2",
      founderId: "founder-1",
      founderName: "Jean-Luc Mugisha",
      startupName: "Kigali Fresh Logistics",
      mentorId: "mentor-1",
      mentorName: "Dr. Aline Umutoni",
      scheduledAt: "2026-12-04 15:00 CAT",
      status: "Scheduled",
      outcome: "Pending session: Strategy sprint on consumer grocery app rollout in Kigali.",
      rating: null,
      review: null,
      completedAt: null
    }
  ],

  // SRS Investment Interest Records (Class Diagram & Use Case, Page 9-13)
  investmentInterests: [
    {
      id: "interest-1",
      investorId: "investor-1",
      investorName: "David Kwizera",
      firm: "Kigali Impact Angel Syndicate",
      startupId: "startup-1",
      startupName: "Kigali Fresh Logistics",
      founderId: "founder-1",
      founderName: "Jean-Luc Mugisha",
      amount: 50000,
      note: "We love your cold-chain traction and job creation metric in Musanze. Ready to co-lead the Seed round with $50k ticket pending due diligence.",
      status: "In Due Diligence", // Expressed, In Due Diligence, Term Sheet Offered, Completed, Passed
      dateSubmitted: "2026-11-21"
    },
    {
      id: "interest-2",
      investorId: "investor-2",
      investorName: "Elena Visser",
      firm: "East Africa Seed Horizons Fund",
      startupId: "startup-3",
      startupName: "Nyungwe EcoPower",
      founderId: "founder-3",
      founderName: "Fabrice Hakizimana",
      amount: 250000,
      note: "Evaluating Series A term sheet for rural coffee micro-grids. Slashing emissions and cooperative power costs fits our ESG mandate.",
      status: "Term Sheet Offered",
      dateSubmitted: "2026-11-19"
    },
    {
      id: "interest-3",
      investorId: "investor-1",
      investorName: "David Kwizera",
      firm: "Kigali Impact Angel Syndicate",
      startupId: "startup-2",
      startupName: "IremboPay Solutions",
      founderId: "founder-2",
      founderName: "Keza Diane Uwase",
      amount: 35000,
      note: "Interested in micro-merchant QR rails across Kigali markets. Requesting audited transaction logs.",
      status: "Expressed",
      dateSubmitted: "2026-11-23"
    }
  ],

  // Direct Messages (SRS Use Case: Exchange direct messages)
  directMessages: [
    {
      id: "msg-1",
      senderId: "investor-1",
      senderName: "David Kwizera",
      recipientId: "founder-1",
      text: "Hello Jean-Luc, we reviewed your data room. Could you share your Q3 unit economics breakdown?",
      timestamp: "2026-11-23 10:15"
    },
    {
      id: "msg-2",
      senderId: "founder-1",
      senderName: "Jean-Luc Mugisha",
      recipientId: "investor-1",
      text: "Muraho David! Absolutely. Uploading the latest Musanze hub operating model right now.",
      timestamp: "2026-11-23 10:30"
    }
  ],

  demoUsers: {
    founder: {
      id: "founder-1",
      name: "Jean-Luc Mugisha",
      email: "jeanluc@kigalifresh.rw",
      role: "founder",
      title: "Co-Founder & CEO, Kigali Fresh Logistics",
      region: "Northern Province",
      startupId: "startup-1",
      avatar: "JM",
      phone: "+250 788 123 456",
      bio: "Building climate-resilient horticulture cold chain solutions connecting Rwandan smallholder farmers directly to Kigali urban demand.",
      ventureStage: "Seed",
      primaryNeed: "Seed capital ($150k) and BNR-compliant agricultural micro-payment architecture."
    },
    mentor: {
      id: "mentor-1",
      name: "Dr. Aline Umutoni",
      email: "aline.umutoni@advisors.rw",
      role: "mentor",
      title: "FinTech & Growth Strategy Advisor",
      region: "Kigali",
      avatar: "AU",
      phone: "+250 788 654 321",
      bio: "Advising high-growth African founders on product market fit, BNR sandbox compliance, and investor readiness.",
      expertise: ["Product Strategy", "FinTech Regulation", "Go-To-Market", "Fundraising"],
      availability: "4 hrs/month"
    },
    investor: {
      id: "investor-1",
      name: "David Kwizera",
      email: "david@kigaliangels.rw",
      role: "investor",
      title: "Partner @ Kigali Impact Angel Syndicate",
      region: "Kigali",
      avatar: "DK",
      phone: "+250 788 987 654",
      bio: "Deploying catalytic early-stage checks into youth-led ventures in Rwanda that solve regional grand challenges in food security and clean tech.",
      targetSectors: ["FinTech", "GreenTech / CleanEnergy", "AgriTech"],
      ticketMin: 25000,
      ticketMax: 150000
    }
  }
};
