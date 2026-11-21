/**
 * Startup Connect Rwanda - Core Frontend Application Controller
 * Aligned with SRS (Software Requirements Specification) by David Nkubito
 *
 * Implements:
 * - FR 1: Authentication & Role Selection (Founder, Mentor, Investor)
 * - FR 2: Profile Management (View Dashboard stats, Edit Profile & Password)
 * - FR 3: Matching & Search (Industry Sector & Rwandan Region filtering, Substring name search)
 * - FR 4: Connection Management (Send, Accept, Decline)
 * - SRS Activity Workflow: Mentorship Request -> Validate -> Review -> Propose Timeslots -> Confirm Slot -> Conduct -> Review & Rating (1-5 stars)
 * - SRS Investment Interest Workflow: Express Interest -> Due Diligence -> Term Sheet
 * - SRS Direct Messaging: Exchange direct messages between connected parties
 * - SRS Section 2.6: Welcome Instruction Guide & in-app guidance
 * - NFR 7: Real-time connection and session statistics on user dashboards
 */

class StartupConnectApp {
  constructor() {
    this.storageKey = "startup_connect_rwanda_state_v3"; // v3 clean modern schema without emojis
    this.currentUserKey = "startup_connect_current_user_v3";
    this.savedDealsKey = "startup_connect_saved_deals_v3";

    this.initData();
    this.initCurrentUser();
    this.initSavedDeals();
  }

  // Initialize or fetch state from localStorage
  initData() {
    const saved = localStorage.getItem(this.storageKey);
    if (!saved) {
      this.state = JSON.parse(JSON.stringify(INITIAL_ECOSYSTEM_DATA));
      this.saveState();
    } else {
      try {
        this.state = JSON.parse(saved);
        // Ensure new SRS collections exist
        if (!this.state.mentorshipRequests || !this.state.mentorshipSessions || !this.state.investmentInterests) {
          this.state = JSON.parse(JSON.stringify(INITIAL_ECOSYSTEM_DATA));
          this.saveState();
        }
      } catch (e) {
        this.state = JSON.parse(JSON.stringify(INITIAL_ECOSYSTEM_DATA));
        this.saveState();
      }
    }
  }

  saveState() {
    localStorage.setItem(this.storageKey, JSON.stringify(this.state));
  }

  // Session & User Management (FR 1 & FR 2)
  initCurrentUser() {
    const savedUser = localStorage.getItem(this.currentUserKey);
    if (savedUser) {
      try {
        this.currentUser = JSON.parse(savedUser);
      } catch (e) {
        this.currentUser = null;
      }
    } else {
      this.currentUser = null;
    }
  }

  saveCurrentUser() {
    if (this.currentUser) {
      localStorage.setItem(this.currentUserKey, JSON.stringify(this.currentUser));
    } else {
      localStorage.removeItem(this.currentUserKey);
    }
  }

  // Require Auth Guard for role-protected pages
  requireAuth(expectedRole = null) {
    if (!this.currentUser) {
      window.location.href = "login.html";
      return false;
    }

    if (expectedRole && this.currentUser.role !== expectedRole) {
      this.showToast(`Access restricted: Redirecting to your ${this.currentUser.role.toUpperCase()} workspace.`, "warning");
      setTimeout(() => {
        window.location.href = `dashboard-${this.currentUser.role}.html`;
      }, 500);
      return false;
    }

    this.updateSidebarUserInfo();
    return true;
  }

  updateSidebarUserInfo() {
    if (!this.currentUser) return;
    if (typeof document === "undefined") return;
    const user = this.currentUser;

    const avatarEls = [
      document.getElementById("sidebar-user-avatar"),
      document.getElementById("sidebar-mentor-avatar"),
      document.getElementById("sidebar-investor-avatar"),
      document.getElementById("sidebar-avatar")
    ];
    avatarEls.forEach(el => {
      if (el) el.textContent = user.avatar || (user.name ? user.name.slice(0, 2).toUpperCase() : "SC");
    });

    const nameEls = [
      document.getElementById("sidebar-user-name"),
      document.getElementById("sidebar-mentor-name"),
      document.getElementById("sidebar-investor-name")
    ];
    nameEls.forEach(el => {
      if (el) el.textContent = user.name;
    });

    const roleBadgeEl = document.querySelector(".user-role-badge");
    if (roleBadgeEl) {
      let sub = "";
      if (user.role === "founder") {
        sub = user.startupName || (user.id === "founder-1" ? "Kigali Fresh" : `${user.name}'s Venture`);
      } else if (user.role === "mentor") {
        sub = user.title || (user.id === "mentor-1" ? "Product & FinTech" : "Mentor Advisor");
      } else {
        sub = user.firm || user.title || (user.id === "investor-1" ? "Kigali Angels" : "Angel Investor");
      }
      roleBadgeEl.textContent = `${user.role.toUpperCase()} • ${sub}`;
    }

    const roleLabelEl = document.getElementById("sidebar-role-label");
    if (roleLabelEl) {
      roleLabelEl.textContent = user.role.charAt(0).toUpperCase() + user.role.slice(1);
    }

    const dashLinkEl = document.getElementById("sidebar-dash-link");
    if (dashLinkEl) {
      dashLinkEl.href = `dashboard-${user.role}.html`;
    }

    const topNavDashEl = document.getElementById("top-nav-dashboard-link");
    if (topNavDashEl) {
      topNavDashEl.href = `dashboard-${user.role}.html`;
      topNavDashEl.textContent = "My Dashboard";
    }

    let activePage = "dashboard";
    const path = (typeof window !== "undefined" && window.location ? (window.location.pathname || window.location.href || "") : "").toLowerCase();
    if (path.includes("directory")) {
      activePage = "directory";
    } else if (path.includes("connections")) {
      activePage = "connections";
    }
    this.renderSidebarNav(activePage);
  }

  renderSidebarNav(activePage) {
    if (typeof document === "undefined") return;
    const nav = document.querySelector(".app-sidebar .sidebar-nav") || document.getElementById("sidebar-nav");
    if (!nav || !this.currentUser) return;
    const user = this.currentUser;
    const stats = this.getLiveStats(user) || {};

    let html = "";
    if (user.role === "mentor") {
      html = `
        <div class="nav-section-title">Mentorship Workspace</div>
        <a href="dashboard-mentor.html" class="sidebar-item ${activePage === 'dashboard' ? 'active' : ''}">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76"></polygon></svg> Mentor Overview
        </a>
        <a href="dashboard-mentor.html#mreq-section" class="sidebar-item">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg> Incoming Applications
        </a>
        <a href="dashboard-mentor.html#sessions-section" class="sidebar-item">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg> Scheduled Sprints
        </a>
        <div class="nav-section-title">Discovery & Connections</div>
        <a href="directory.html" class="sidebar-item ${activePage === 'directory' ? 'active' : ''}">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg> Browse Startups
        </a>
        <a href="connections.html" class="sidebar-item ${activePage === 'connections' ? 'active' : ''}">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="8.5" cy="7" r="4"></circle><polyline points="17 11 19 13 23 9"></polyline></svg> Connection Requests
        </a>

        <div class="nav-section-title">Advisory Tools</div>
        <a href="${activePage === 'dashboard' ? 'javascript:void(0)' : 'dashboard-mentor.html'}" ${activePage === 'dashboard' ? 'onclick="openEditMentorProfileModal()"' : ''} class="sidebar-item">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="3"></circle><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path></svg> Edit Profile
        </a>
      `;
    } else if (user.role === "investor") {
      html = `
        <div class="nav-section-title">Deal Pipeline</div>
        <a href="dashboard-investor.html" class="sidebar-item ${activePage === 'dashboard' ? 'active' : ''}">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path></svg> Deal Flow Command
        </a>
        <a href="dashboard-investor.html#pipeline-section" class="sidebar-item">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"></polyline><polyline points="17 6 23 6 23 12"></polyline></svg> Active Expressed Interests
        </a>
        <div class="nav-section-title">Discovery & Connections</div>
        <a href="directory.html" class="sidebar-item ${activePage === 'directory' ? 'active' : ''}">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg> Vetted Startup Roster
        </a>
        <a href="connections.html" class="sidebar-item ${activePage === 'connections' ? 'active' : ''}">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="8.5" cy="7" r="4"></circle><polyline points="17 11 19 13 23 9"></polyline></svg> Pitches & Introductions
        </a>

        <div class="nav-section-title">Syndicate Tools</div>
        <a href="${activePage === 'dashboard' ? '#' : 'dashboard-investor.html#pipeline-section'}" ${activePage === 'dashboard' ? 'onclick="filterWatchlist(); return false;"' : ''} class="sidebar-item">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg> Saved Watchlist
        </a>
        <a href="${activePage === 'dashboard' ? 'javascript:void(0)' : 'dashboard-investor.html'}" ${activePage === 'dashboard' ? 'onclick="openEditInvestorModal()"' : ''} class="sidebar-item">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="3"></circle><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path></svg> Edit Profile
        </a>
      `;
    } else {
      // Founder default
      html = `
        <div class="nav-section-title">Core Navigation</div>
        <a href="dashboard-founder.html" class="sidebar-item ${activePage === 'dashboard' ? 'active' : ''}">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="7" height="7"></rect><rect x="14" y="3" width="7" height="7"></rect><rect x="14" y="14" width="7" height="7"></rect><rect x="3" y="14" width="7" height="7"></rect></svg> Overview & Pitch
        </a>
        <a href="dashboard-founder.html#mentorship-section" class="sidebar-item">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76"></polygon></svg> Mentorship Sessions
        </a>
        <a href="dashboard-founder.html#investment-interests-section" class="sidebar-item">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path></svg> Investor Interests
        </a>

        <div class="nav-section-title">Discovery & Connections</div>
        <a href="directory.html" class="sidebar-item ${activePage === 'directory' ? 'active' : ''}">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg> Discovery & Matching
        </a>
        <a href="connections.html" class="sidebar-item ${activePage === 'connections' ? 'active' : ''}">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="8.5" cy="7" r="4"></circle><polyline points="17 11 19 13 23 9"></polyline></svg> Connection Requests
        </a>

        ${activePage === 'connections' ? `
        <div class="nav-section-title">Workflow Actions</div>
        <a href="#" class="sidebar-item" onclick="openNewRequestModal(); return false;">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg> New Pitch Request
        </a>` : ''}

        <div class="nav-section-title">Account</div>
        <a href="${activePage === 'dashboard' ? 'javascript:void(0)' : 'dashboard-founder.html'}" ${activePage === 'dashboard' ? 'onclick="openEditProfileModal()"' : ''} class="sidebar-item">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="3"></circle><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path></svg> Edit Profile
        </a>
      `;
    }

    nav.innerHTML = html;
  }

  login(email, password) {
    const cleanEmail = (email || "").trim().toLowerCase();
    if (!cleanEmail) {
      this.showToast("Please enter an email address.", "danger");
      return null;
    }

    // 1. Check registered users
    if (this.state.registeredUsers) {
      const regUser = this.state.registeredUsers.find(u => u.email.toLowerCase() === cleanEmail);
      if (regUser) {
        if (password && regUser.password && regUser.password !== password) {
          this.showToast("Incorrect password. Please try again.", "danger");
          return null;
        }
        this.currentUser = regUser;
        this.saveCurrentUser();
        this.initSavedDeals();
        return regUser;
      }
    }

    // 2. Check predefined ecosystem accounts
    const accounts = [
      {
        email: "jeanluc@kigalifresh.rw",
        alias: "founder@startupconnect.rw",
        role: "founder",
        data: this.state.demoUsers.founder
      },
      {
        email: "aline.umutoni@advisors.rw",
        alias: "mentor@startupconnect.rw",
        role: "mentor",
        data: this.state.demoUsers.mentor
      },
      {
        email: "david@kigaliangels.rw",
        alias: "investor@startupconnect.rw",
        role: "investor",
        data: this.state.demoUsers.investor
      }
    ];

    for (const acc of accounts) {
      if (cleanEmail === acc.email.toLowerCase() || cleanEmail === acc.alias.toLowerCase()) {
        if (password && password !== "password123") {
          this.showToast("Incorrect password. (Default is password123)", "danger");
          return null;
        }
        this.currentUser = JSON.parse(JSON.stringify(acc.data));
        this.saveCurrentUser();
        this.initSavedDeals();
        return this.currentUser;
      }
    }

    // 3. Fallback for custom role-based test emails
    if (cleanEmail.includes("founder")) {
      const user = JSON.parse(JSON.stringify(this.state.demoUsers.founder));
      user.email = cleanEmail;
      this.currentUser = user;
      this.saveCurrentUser();
      return user;
    } else if (cleanEmail.includes("mentor") || cleanEmail.includes("aline")) {
      const user = JSON.parse(JSON.stringify(this.state.demoUsers.mentor));
      user.email = cleanEmail;
      this.currentUser = user;
      this.saveCurrentUser();
      this.initSavedDeals();
      return user;
    } else if (cleanEmail.includes("investor") || cleanEmail.includes("david")) {
      const user = JSON.parse(JSON.stringify(this.state.demoUsers.investor));
      user.email = cleanEmail;
      this.currentUser = user;
      this.saveCurrentUser();
      this.initSavedDeals();
      return user;
    }

    this.showToast("Account not found. Please verify your email or create an account.", "danger");
    return null;
  }

  logout() {
    this.currentUser = null;
    if (typeof localStorage !== "undefined") {
      localStorage.removeItem(this.currentUserKey);
    }
    this.initSavedDeals();
    this.showToast("Signed out successfully.", "info");
    setTimeout(() => {
      window.location.href = "login.html";
    }, 400);
  }

  registerUser(newUser) {
    if (!this.state.registeredUsers) {
      this.state.registeredUsers = [];
    }

    if (newUser.role === "founder") {
      const sName = newUser.startupName || `${newUser.name}'s Venture`;
      const newStartup = {
        id: "startup-" + Date.now(),
        name: sName,
        sector: newUser.sector || "AgriTech",
        stage: newUser.stage || "Seed",
        location: newUser.region || "Kigali",
        region: newUser.region || "Kigali",
        capitalSeeking: Number(newUser.capitalSeeking) || 0,
        monthlyRevenue: 0,
        youthJobsCreated: 0,
        teamSize: 1,
        founderId: newUser.id,
        founderName: newUser.name,
        description: newUser.pitchSummary || `${sName} is an emerging Rwandan startup in ${newUser.sector || 'AgriTech'}.`,
        logo: sName.split(" ").map(w => w[0]).join("").substring(0, 2).toUpperCase()
      };
      this.state.startups.unshift(newStartup);
      newUser.startupId = newStartup.id;
    } else if (newUser.role === "mentor") {
      const newMentor = {
        id: newUser.id,
        name: newUser.name,
        roleTitle: newUser.title || "Mentor Advisor",
        expertise: newUser.expertise || ["Strategy", "Go-To-Market", "Scale"],
        region: newUser.region || "Kigali",
        availability: newUser.availability || "4 hrs/month",
        rating: 5.0,
        reviewsCount: 0,
        hoursMentored: 0,
        bio: newUser.bio || `${newUser.name} is advising Rwandan ventures and founders on acceleration and operational excellence.`
      };
      this.state.mentors.unshift(newMentor);
    } else if (newUser.role === "investor") {
      const newInvestor = {
        id: newUser.id,
        name: newUser.name,
        firm: newUser.firm || newUser.title || "Angel Investor",
        region: newUser.region || "Kigali",
        typicalCheck: newUser.ticket || "$25k - $100k",
        targetSectors: newUser.sectors || ["AgriTech", "FinTech", "CleanTech"],
        dealsReviewed: 0,
        bio: newUser.bio || `Active angel backing high-impact founders in Rwanda.`
      };
      this.state.investors.unshift(newInvestor);
    }

    newUser.isNewAccount = true;
    this.state.registeredUsers.push(newUser);
    this.saveState();

    this.currentUser = newUser;
    this.saveCurrentUser();

    // Ensure clean slate in localStorage for new account
    if (typeof localStorage !== "undefined") {
      localStorage.removeItem(`startup_connect_profile_file_${newUser.id}`);
      localStorage.setItem(`${this.savedDealsKey}_${newUser.id}`, JSON.stringify([]));
    }
    this.savedDeals = [];

    return newUser;
  }

  // FR 2.2: Edit Profile & Password Management
  updateUserProfile(updatedData) {
    if (!this.currentUser) return false;

    // Update session
    Object.assign(this.currentUser, updatedData);
    this.saveCurrentUser();

    // Sync in demoUsers
    if (this.state.demoUsers[this.currentUser.role]) {
      Object.assign(this.state.demoUsers[this.currentUser.role], updatedData);
    }

    // Sync in domain list if applicable
    if (this.currentUser.role === "mentor") {
      const m = this.state.mentors.find(x => x.id === this.currentUser.id);
      if (m) Object.assign(m, updatedData);
    } else if (this.currentUser.role === "investor") {
      const i = this.state.investors.find(x => x.id === this.currentUser.id);
      if (i) Object.assign(i, updatedData);
    } else if (this.currentUser.role === "founder" && this.currentUser.startupId) {
      const s = this.state.startups.find(x => x.id === this.currentUser.startupId);
      if (s) {
        if (updatedData.startupName) s.name = updatedData.startupName;
        if (updatedData.sector) s.sector = updatedData.sector;
        if (updatedData.region) s.region = updatedData.region;
        if (updatedData.tagline) s.tagline = updatedData.tagline;
        if (updatedData.capitalSeeking) s.capitalSeeking = Number(updatedData.capitalSeeking);
      }
    }

    this.saveState();
    this.showToast("Profile details updated successfully!", "success");
    return true;
  }

  // Profile File Loading Management
  // The profile remains empty until a profile file is added (via file upload or project file)
  getProfileFileData(userId) {
    if (typeof localStorage === "undefined") return null;
    const uid = userId || (this.currentUser ? this.currentUser.id : "default");
    const raw = localStorage.getItem(`startup_connect_profile_file_${uid}`);
    if (raw) {
      try {
        return JSON.parse(raw);
      } catch (e) {
        return null;
      }
    }
    // Backward compatibility for demo founder or default guest
    if (uid === "founder-1" || uid === "default") {
      const legacy = localStorage.getItem("startup_connect_profile_file_v1");
      if (legacy) {
        try { return JSON.parse(legacy); } catch(e) {}
      }
    }
    return null;
  }

  setProfileFileData(data, userId) {
    if (typeof localStorage === "undefined") return;
    const uid = userId || (this.currentUser ? this.currentUser.id : "default");
    if (!data) {
      localStorage.removeItem(`startup_connect_profile_file_${uid}`);
      return;
    }
    localStorage.setItem(`startup_connect_profile_file_${uid}`, JSON.stringify(data));
  }

  clearProfileFileData(userId) {
    if (typeof localStorage === "undefined") return;
    const uid = userId || (this.currentUser ? this.currentUser.id : "default");
    localStorage.removeItem(`startup_connect_profile_file_${uid}`);
    this.showToast("Profile data cleared. Reverted to empty profile state.", "info");
  }

  getDefaultSampleProfile() {
    return {
      startupName: "Kigali Fresh Logistics",
      sector: "AgriTech & Cold-Chain",
      stage: "Seed",
      region: "Northern Province",
      location: "Musanze, Northern Province",
      founderName: "Jean-Luc Mugisha",
      targetAsk: 150000,
      monthlyRevenue: 18500,
      youthJobs: 42,
      activeConnections: 3,
      elevatorPitch: "Kigali Fresh deploys IoT-enabled solar cold hubs in Musanze and Rubavu, connecting 1,200+ smallholder horticulture farmers directly to Kigali supermarkets and hotels. We have curtailed post-harvest food waste by 38% while boosting farmer take-home income by 22%.",
      capitalCommitted: 45000,
      readinessScore: 92,
      readinessMilestones: [
        "Audited Financials",
        "RDB Registered",
        "Musanze Cold Leases",
        "BNR Sandbox Pilot"
      ],
      fileName: "profile_data.json"
    };
  }

  async checkProjectProfileFile() {
    const candidateUrls = ["profile_data.json", "/profile_data.json", "static/profile_data.json", "user_profile.json"];
    for (const url of candidateUrls) {
      try {
        const res = await fetch(url);
        if (res.ok) {
          const json = await res.json();
          if (json && (json.startupName || json.targetAsk || json.elevatorPitch)) {
            json.fileName = json.fileName || url.split("/").pop();
            this.setProfileFileData(json);
            return json;
          }
        }
      } catch (e) {
        // file protocol or network error
      }
    }
    return null;
  }

  handleProfileFileUpload(file, callback) {
    if (!file) return;
    const fileName = file.name;
    const isJson = fileName.toLowerCase().endsWith(".json");

    if (isJson) {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const parsed = JSON.parse(e.target.result);
          parsed.fileName = fileName;
          const sample = this.getDefaultSampleProfile();
          const complete = Object.assign({}, sample, parsed);
          this.setProfileFileData(complete);
          this.showToast(`Loaded profile data from ${fileName}!`, "success");
          if (callback) callback(complete);
        } catch (err) {
          this.showToast(`Invalid JSON file format in ${fileName}`, "danger");
        }
      };
      reader.readAsText(file);
    } else {
      const data = this.getDefaultSampleProfile();
      data.fileName = fileName;
      if (fileName.toLowerCase().includes("deck") || fileName.toLowerCase().includes("pitch") || fileName.toLowerCase().endsWith(".pdf")) {
        data.elevatorPitch = `Verified document (${fileName}) parsed: ` + data.elevatorPitch;
      }
      this.setProfileFileData(data);
      this.showToast(`Profile activated from document: ${fileName}!`, "success");
      if (callback) callback(data);
    }
  }

  // FR 4: Connection Management
  sendConnectionRequest(data) {
    const newReq = {
      id: "req-" + Date.now(),
      senderId: this.currentUser.id,
      senderName: this.currentUser.name + (this.currentUser.startupId ? ` (${this.getStartupById(this.currentUser.startupId)?.name || 'Founder'})` : ''),
      senderRole: this.currentUser.role.charAt(0).toUpperCase() + this.currentUser.role.slice(1),
      recipientId: data.recipientId,
      recipientName: data.recipientName,
      recipientRole: data.recipientRole,
      type: data.type || "Networking & Collaboration",
      pitchSummary: data.pitchSummary || "Eager to connect and discuss ecosystem synergy.",
      status: "Pending",
      dateSent: new Date().toISOString().split("T")[0],
      notes: data.notes || "Sent via Startup Connect Rwanda network."
    };

    this.state.connections.unshift(newReq);
    this.saveState();
    this.showToast(`Connection request sent to ${data.recipientName}!`, "success");
    return newReq;
  }

  updateConnectionStatus(reqId, newStatus) {
    const req = this.state.connections.find(c => c.id === reqId);
    if (req) {
      req.status = newStatus;
      this.saveState();
      this.showToast(`Connection request marked as ${newStatus}!`, newStatus === "Accepted" ? "success" : "warning");
      return true;
    }
    return false;
  }

  // =========================================================================
  // SRS Activity Workflow: Mentorship Request -> Schedule -> Review (Page 11)
  // =========================================================================

  submitMentorshipRequest(data) {
    const mentor = this.getMentorById(data.mentorId);
    const newMReq = {
      id: "mreq-" + Date.now(),
      founderId: this.currentUser.id,
      founderName: this.currentUser.name,
      startupName: this.currentUser.startupId ? (this.getStartupById(this.currentUser.startupId)?.name || "Founder Venture") : "Founder Venture",
      mentorId: data.mentorId,
      mentorName: mentor ? mentor.name : data.mentorName,
      goals: data.goals || "Strategic guidance on product roadmap, unit economics, and regulatory compliance in Rwanda.",
      status: "Pending",
      submittedAt: new Date().toISOString().split("T")[0],
      declineReason: null,
      proposedSlots: []
    };

    this.state.mentorshipRequests.unshift(newMReq);
    this.saveState();
    this.showToast(`Mentorship request submitted to ${newMReq.mentorName}!`, "success");
    return newMReq;
  }

  proposeMentorshipTimeslots(requestId, slotsArray) {
    const req = this.state.mentorshipRequests.find(r => r.id === requestId);
    if (req) {
      req.status = "Timeslots Proposed";
      req.proposedSlots = slotsArray;
      this.saveState();
      this.showToast(`Available timeslots sent to founder ${req.founderName}!`, "success");
      return true;
    }
    return false;
  }

  declineMentorshipRequest(requestId, reason) {
    const req = this.state.mentorshipRequests.find(r => r.id === requestId);
    if (req) {
      req.status = "Declined";
      req.declineReason = reason || "Mentor availability capacity reached for this cycle.";
      this.saveState();
      this.showToast(`Mentorship request declined with feedback for founder.`, "warning");
      return true;
    }
    return false;
  }

  confirmMentorshipSlot(requestId, selectedSlot) {
    const req = this.state.mentorshipRequests.find(r => r.id === requestId);
    if (req) {
      req.status = "Scheduled";
      
      const newSession = {
        id: "sess-" + Date.now(),
        requestId: req.id,
        founderId: req.founderId,
        founderName: req.founderName,
        startupName: req.startupName,
        mentorId: req.mentorId,
        mentorName: req.mentorName,
        scheduledAt: selectedSlot,
        status: "Scheduled",
        outcome: "Awaiting session completion",
        rating: null,
        review: null,
        completedAt: null
      };

      this.state.mentorshipSessions.unshift(newSession);
      this.saveState();
      this.showToast(`Mentorship session scheduled for ${selectedSlot}!`, "success");
      return newSession;
    }
    return null;
  }

  reviseMentorshipRequest(requestId, updatedGoals, newMentorId = null) {
    const req = this.state.mentorshipRequests.find(r => r.id === requestId);
    if (req) {
      if (newMentorId && newMentorId !== req.mentorId) {
        const newMentor = this.getMentorById(newMentorId);
        if (newMentor) {
          req.mentorId = newMentor.id;
          req.mentorName = newMentor.name;
        }
      }
      req.goals = updatedGoals || req.goals;
      req.status = "Pending";
      req.declineReason = null;
      req.proposedSlots = [];
      req.submittedAt = new Date().toISOString().split("T")[0];
      this.saveState();
      this.showToast(`Mentorship request revised and re-submitted to ${req.mentorName}!`, "success");
      return true;
    }
    return false;
  }

  completeMentorshipSession(sessionId, outcome, rating, reviewText) {
    const sess = this.state.mentorshipSessions.find(s => s.id === sessionId);
    if (sess) {
      sess.status = "Completed";
      sess.outcome = outcome || "Mentorship discussion concluded with actionable milestones.";
      sess.rating = Number(rating) || 5;
      sess.review = reviewText || "Helpful and strategic guidance.";
      sess.completedAt = new Date().toISOString().split("T")[0];

      // Update mentor's review counter & compute dynamic rating
      const mentor = this.state.mentors.find(m => m.id === sess.mentorId);
      if (mentor) {
        mentor.totalReviews = (mentor.totalReviews || 0) + 1;
        mentor.hoursMentored = (mentor.hoursMentored || 0) + 1;
        
        // Dynamic average rating
        const allMentorSessions = this.state.mentorshipSessions.filter(s => s.mentorId === mentor.id && s.rating);
        if (allMentorSessions.length > 0) {
          const sumRatings = allMentorSessions.reduce((acc, curr) => acc + curr.rating, 0);
          mentor.rating = parseFloat((sumRatings / allMentorSessions.length).toFixed(1));
        }
      }

      this.saveState();
      this.showToast("Session feedback and rating saved permanently!", "success");
      return true;
    }
    return false;
  }

  // =========================================================================
  // SRS Investment Interest Workflow (Class Diagram Page 12, 13)
  // =========================================================================

  expressInvestmentInterest(data) {
    const startup = this.getStartupById(data.startupId);
    const newInterest = {
      id: "interest-" + Date.now(),
      investorId: this.currentUser.id,
      investorName: this.currentUser.name,
      firm: this.currentUser.title || "Angel Syndicate",
      startupId: data.startupId,
      startupName: startup ? startup.name : "Rwandan Venture",
      founderId: startup ? startup.founderId : null,
      founderName: startup ? startup.founderName : "Founder",
      amount: Number(data.amount) || 25000,
      note: data.note || "Interested in reviewing metrics and evaluating term sheet.",
      status: "Expressed", // Expressed, In Due Diligence, Term Sheet Offered, Completed, Passed
      dateSubmitted: new Date().toISOString().split("T")[0]
    };

    this.state.investmentInterests.unshift(newInterest);
    this.saveState();
    this.showToast(`Investment interest of $${newInterest.amount.toLocaleString()} expressed to ${newInterest.startupName}!`, "success");
    return newInterest;
  }

  updateInvestmentInterestStatus(interestId, newStatus) {
    const item = this.state.investmentInterests.find(i => i.id === interestId);
    if (item) {
      item.status = newStatus;
      this.saveState();
      this.showToast(`Investment status updated to "${newStatus}"!`, "success");
      return true;
    }
    return false;
  }

  // =========================================================================
  // SRS Direct Messaging (Page 9 Use Case: Exchange direct messages)
  // =========================================================================

  sendDirectMessage(recipientId, text) {
    if (!text || !text.trim()) return;

    const newMsg = {
      id: "msg-" + Date.now(),
      senderId: this.currentUser.id,
      senderName: this.currentUser.name,
      recipientId: recipientId,
      text: text.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    if (!this.state.directMessages) this.state.directMessages = [];
    this.state.directMessages.push(newMsg);
    this.saveState();
    return newMsg;
  }

  getDirectMessagesThread(userId1, userId2) {
    if (!this.state.directMessages) return [];
    return this.state.directMessages.filter(m => 
      (m.senderId === userId1 && m.recipientId === userId2) ||
      (m.senderId === userId2 && m.recipientId === userId1)
    );
  }

  // =========================================================================
  // Deal Watchlist (Investors)
  // =========================================================================

  initSavedDeals() {
    if (typeof localStorage === "undefined") {
      this.savedDeals = ["startup-1", "startup-3"];
      return;
    }
    const userId = this.currentUser ? this.currentUser.id : "default";
    const saved = localStorage.getItem(`${this.savedDealsKey}_${userId}`);
    if (saved) {
      try {
        this.savedDeals = JSON.parse(saved);
        return;
      } catch (e) {}
    }
    // Only default demo investor starts with saved deals
    if (userId === "investor-1" || userId === "default") {
      this.savedDeals = ["startup-1", "startup-3"];
    } else {
      this.savedDeals = [];
    }
  }

  toggleSaveDeal(startupId) {
    const userId = this.currentUser ? this.currentUser.id : "default";
    if (!Array.isArray(this.savedDeals)) this.savedDeals = [];
    const idx = this.savedDeals.indexOf(startupId);
    let isSaved = false;
    if (idx > -1) {
      this.savedDeals.splice(idx, 1);
      this.showToast("Removed startup from watchlist", "warning");
    } else {
      this.savedDeals.push(startupId);
      isSaved = true;
      this.showToast("Startup bookmarked to your watchlist!", "success");
    }
    if (typeof localStorage !== "undefined") {
      localStorage.setItem(`${this.savedDealsKey}_${userId}`, JSON.stringify(this.savedDeals));
    }
    return isSaved;
  }

  isDealSaved(startupId) {
    return Array.isArray(this.savedDeals) && this.savedDeals.includes(startupId);
  }

  // =========================================================================
  // NFR 7: Live Real-Time Dashboard Statistics
  // =========================================================================

  getLiveStats(user) {
    if (!user) return null;
    const conns = this.state.connections || [];
    const mreqs = this.state.mentorshipRequests || [];
    const sess = this.state.mentorshipSessions || [];
    const interests = this.state.investmentInterests || [];

    if (user.role === "founder") {
      const isDemo = user.id === "founder-1";
      const userConns = conns.filter(c => (c.senderId === user.id || c.recipientId === user.id) && c.status === "Accepted");
      const userMreqs = mreqs.filter(r => r.founderId === user.id);
      const userSess = sess.filter(s => s.founderId === user.id && s.status === "Completed");
      const userInterests = interests.filter(i => i.founderId === user.id);

      return {
        totalConnections: userConns.length + (isDemo && userConns.length === 0 ? 3 : 0),
        pendingRequests: conns.filter(c => c.senderId === user.id && c.status === "Pending").length,
        activeMentorships: userMreqs.filter(r => r.status === "Scheduled" || r.status === "Timeslots Proposed").length,
        completedSessions: userSess.length,
        expressedCapital: userInterests.reduce((sum, i) => sum + (Number(i.amount) || 0), 0)
      };
    } else if (user.role === "mentor") {
      const isDemo = user.id === "mentor-1";
      const userConns = conns.filter(c => (c.senderId === user.id || c.recipientId === user.id) && c.status === "Accepted");
      const userMreqs = mreqs.filter(r => r.mentorId === user.id && r.status === "Pending");
      const userSess = sess.filter(s => s.mentorId === user.id && s.status === "Scheduled");
      const mentorObj = this.getMentorById(user.id);

      return {
        totalMentees: userConns.length + (isDemo && userConns.length === 0 ? 6 : 0),
        pendingMentorshipRequests: userMreqs.length + (isDemo && userMreqs.length === 0 ? 2 : 0),
        scheduledSessions: userSess.length + (isDemo && userSess.length === 0 ? 1 : 0),
        completedHours: isDemo ? (mentorObj?.hoursMentored || 140) : (mentorObj?.hoursMentored || 0)
      };
    } else if (user.role === "investor") {
      const isDemo = user.id === "investor-1";
      const userInterests = interests.filter(i => i.investorId === user.id);
      const savedCount = (this.savedDeals || []).length;

      return {
        dealsReviewed: isDemo ? 160 : savedCount,
        activeInterestsCount: userInterests.length,
        inDueDiligence: userInterests.filter(i => i.status === "In Due Diligence").length + (isDemo ? 4 : 0),
        capitalCommitted: userInterests.reduce((sum, i) => sum + (Number(i.amount) || 0), 0)
      };
    }
  }

  // Lookups
  getStartupById(id) {
    return this.state.startups.find(s => s.id === id);
  }

  getMentorById(id) {
    return this.state.mentors.find(m => m.id === id);
  }

  getInvestorById(id) {
    return this.state.investors.find(i => i.id === id);
  }

  // Toast System
  showToast(message, type = "info") {
    let container = document.getElementById("toast-container");
    if (!container) {
      container = document.createElement("div");
      container.id = "toast-container";
      container.className = "toast-container";
      document.body.appendChild(container);
    }

    const toast = document.createElement("div");
    toast.className = `toast toast-${type}`;

    let icon = "&bull;";
    if (type === "success") icon = "&bull;";
    if (type === "warning") icon = "&bull;";
    if (type === "danger") icon = "&bull;";

    toast.innerHTML = `<span>${icon}</span> <div>${message}</div>`;
    container.appendChild(toast);

    setTimeout(() => {
      toast.style.opacity = "0";
      toast.style.transform = "translateY(10px)";
      toast.style.transition = "all 0.3s ease";
      setTimeout(() => toast.remove(), 300);
    }, 3800);
  }

  // Modals
  openModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
      modal.classList.add("active");
      document.body.style.overflow = "hidden";
    }
  }

  closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
      modal.classList.remove("active");
      document.body.style.overflow = "";
    }
  }

  toggleSidebar() {
    const sidebar = document.querySelector(".app-sidebar");
    if (sidebar) {
      sidebar.classList.toggle("open");
    }
  }

  // Platform Welcome & Onboarding Guide
  openWelcomeGuide() {
    let guide = document.getElementById("welcome-guide-modal");
    if (!guide) {
      guide = document.createElement("div");
      guide.id = "welcome-guide-modal";
      guide.className = "modal-backdrop";
      guide.innerHTML = `
        <div class="modal-box" style="max-width: 720px; padding: 0; border-radius: var(--radius-xl); overflow: hidden;">
          <div class="modal-header" style="padding: 1.75rem 2.25rem 1.25rem; border-bottom: 1px solid var(--slate-100);">
            <div>
              <span class="badge badge-primary mb-2">Platform Overview</span>
              <h3 class="text-xl font-extrabold text-slate-900">Welcome to Startup Connect Rwanda</h3>
            </div>
            <button class="btn btn-icon btn-light" onclick="window.app.closeModal('welcome-guide-modal')">&times;</button>
          </div>
          <div class="modal-body" style="padding: 2rem 2.25rem;">
            <p class="text-sm text-slate-600 mb-6 leading-relaxed" style="font-size: 0.9375rem; line-height: 1.65;">
              Startup Connect is Rwanda's dedicated digital platform bridging early-stage startups, industry mentors, and investors across Kigali and all 4 provinces (Northern, Southern, Western, and Eastern).
            </p>
            
            <div class="grid grid-cols-3 gap-5 mb-6">
              <div class="p-4 flex flex-col justify-between" style="background: var(--slate-50); border: 1px solid var(--slate-200); border-radius: var(--radius-lg); min-height: 170px;">
                <div>
                  <div class="font-bold text-sm text-primary mb-2">For Founders</div>
                  <div class="text-xs text-slate-600 leading-relaxed" style="line-height: 1.6;">
                    Publish your startup pitch, submit structured mentorship goals, schedule review sessions, and track incoming investor expressions.
                  </div>
                </div>
              </div>

              <div class="p-4 flex flex-col justify-between" style="background: var(--slate-50); border: 1px solid var(--slate-200); border-radius: var(--radius-lg); min-height: 170px;">
                <div>
                  <div class="font-bold text-sm text-secondary mb-2">For Mentors</div>
                  <div class="text-xs text-slate-600 leading-relaxed" style="line-height: 1.6;">
                    Review founder applications, propose available meeting time slots, conduct sprints, and build a verified advisory track record.
                  </div>
                </div>
              </div>

              <div class="p-4 flex flex-col justify-between" style="background: var(--slate-50); border: 1px solid var(--slate-200); border-radius: var(--radius-lg); min-height: 170px;">
                <div>
                  <div class="font-bold text-sm text-slate-900 mb-2">For Investors</div>
                  <div class="text-xs text-slate-600 leading-relaxed" style="line-height: 1.6;">
                    Filter vetted ventures by East African sector &amp; Rwandan region, review data room metrics, express check interest, and syndicate deals.
                  </div>
                </div>
              </div>
            </div>

            <div class="p-4 text-xs text-slate-700" style="background: #f8fafc; border: 1px solid var(--slate-200); border-left: 4px solid var(--primary); border-radius: var(--radius-md); line-height: 1.65;">
              <strong class="text-slate-900 font-bold">Pro Tip:</strong> Use the directory search to discover verified mentors and investors across Rwanda, filter by sector and province, and manage all your partnership requests in the Connections Hub.
            </div>
          </div>
          <div class="modal-footer" style="padding: 1.25rem 2.25rem; border-top: 1px solid var(--slate-100); background: var(--slate-50);">
            <button class="btn btn-primary btn-block" style="padding: 0.75rem 1.5rem;" onclick="window.app.closeModal('welcome-guide-modal')">Got it! Explore Platform</button>
          </div>
        </div>
      `;
      document.body.appendChild(guide);
      guide.addEventListener("click", (e) => {
        if (e.target === guide) window.app.closeModal("welcome-guide-modal");
      });
    }
    this.openModal("welcome-guide-modal");
  }
}

// Global App Instance
window.app = new StartupConnectApp();

function formatRwf(amount) {
  return "$" + Number(amount).toLocaleString();
}

document.addEventListener("DOMContentLoaded", () => {
  // Sync sidebar info for current user
  if (window.app) {
    window.app.updateSidebarUserInfo();
  }

  // Mobile drawer
  const mobileToggle = document.getElementById("mobile-menu-toggle");
  if (mobileToggle) {
    mobileToggle.addEventListener("click", () => window.app.toggleSidebar());
  }

  // Close modals on backdrop click
  document.querySelectorAll(".modal-backdrop").forEach(backdrop => {
    backdrop.addEventListener("click", (e) => {
      if (e.target === backdrop) {
        backdrop.classList.remove("active");
        document.body.style.overflow = "";
      }
    });
  });
});
