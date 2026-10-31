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

window.app = new StartupConnectApp();
