# Startup Connect Rwanda

A unified entrepreneurship platform designed to connect Rwandan startup founders, certified mentors, and institutional investors in Kigali and across Rwanda's five provinces. The platform streamlines ecosystem discovery, verified traction reporting, advisory mentorship sprints, and investment deal flow management.

---

## Table of Contents

- [Overview](#overview)
- [Prerequisites](#prerequisites)
- [Step-by-Step Setup Guide](#step-by-step-setup-guide)
  - [Step 1: Clone the Repository](#step-1-clone-the-repository)
  - [Step 2: Navigate into the Project Directory](#step-2-navigate-into-the-project-directory)
  - [Step 3: Choose an Execution Method](#step-3-choose-an-execution-method)
    - [Method A: Full-Stack Flask Backend (Recommended)](#method-a-full-stack-flask-backend-recommended)
    - [Method B: Instant Static Server (Zero External Dependencies)](#method-b-instant-static-server-zero-external-dependencies)
  - [Step 4: Open the Application in Your Browser](#step-4-open-the-application-in-your-browser)
- [Demo Credentials](#demo-credentials)
- [Platform Features](#platform-features)
- [Project Directory Structure](#project-directory-structure)
- [REST API Endpoints](#rest-api-endpoints)
- [Environment Variables (Optional)](#environment-variables-optional)
- [Troubleshooting & FAQs](#troubleshooting--faqs)

---

## Overview

Startup Connect Rwanda bridges the gap between emerging Rwandan ventures, experienced industry mentors, and capital allocators. It provides:
- Founder Command Center: Traction tracking (MRR, youth jobs generated, team size, funding raised).
- Mentor Advisory Workspace: Sprint availability management, session calendar, application reviews, and revision loops.
- Investor Deal Hub: Deal pipeline tracking, check size expressions, and due diligence workflow.
- Ecosystem Discovery Directory: Multi-criteria filtering by sector (FinTech, AgriTech, HealthTech, EduTech, CleanTech, Logistics) and province (Kigali, Northern, Southern, Eastern, Western).
- Multi-Role Networking: Connection request tracking with dedicated tabs for sent, received, and accepted connections.

---

## Prerequisites

Before setting up the project, ensure you have the following installed on your machine:

1. Python 3.8 or Higher:
   - macOS / Linux: Verify with `python3 --version`
   - Windows: Verify with `python --version`
2. Git:
   - Verify with `git --version`
3. A Modern Web Browser:
   - Google Chrome, Mozilla Firefox, Safari, Microsoft Edge, or Brave.

---

## Step-by-Step Setup Guide

Follow these steps in order to get the project up and running locally.

### Step 1: Clone the Repository

Open your terminal (macOS/Linux) or Command Prompt / PowerShell (Windows) and clone the repository:

```bash
git clone https://github.com/MagyeraND/startup_connect.git
```

### Step 2: Navigate into the Project Directory

```bash
cd startup_connect
```

### Step 3: Choose an Execution Method

You can run Startup Connect Rwanda in one of two modes:
- Method A (Full-Stack Flask): Runs the Python Flask web server with SQLAlchemy models, REST API endpoints, and automatic SQLite database creation.
- Method B (Instant Static Server): Uses Python's built-in web server with no pip dependencies needed.

---

### Method A: Full-Stack Flask Backend (Recommended)

This method runs the full Flask application with API routing, server-rendered templates, and local SQLite persistence.

#### 1. Create a Python Virtual Environment

- On macOS and Linux:
  ```bash
  python3 -m venv venv
  ```
- On Windows:
  ```cmd
  python -m venv venv
  ```

#### 2. Activate the Virtual Environment

- On macOS and Linux:
  ```bash
  source venv/bin/activate
  ```
- On Windows (PowerShell):
  ```powershell
  venv\Scripts\Activate.ps1
  ```
- On Windows (Command Prompt):
  ```cmd
  venv\Scripts\activate.bat
  ```

#### 3. Install Backend Dependencies

Install the packages listed in `requirements.txt`:

```bash
pip install -r requirements.txt
```

#### 4. Start the Application

```bash
python app.py
```
*(Or `python3 app.py` on macOS/Linux).*

You will see output confirming that the database tables have been initialized and the server is running:

```text
Starting Startup Connect Rwanda SRS backend on http://127.0.0.1:5000
 * Serving Flask app 'app'
 * Debug mode: on
 * Running on all addresses (0.0.0.0)
 * Running on http://127.0.0.1:5000
```

#### 5. Open Your Browser

Visit: **http://localhost:5000** or **http://127.0.0.1:5000**

---

### Method B: Instant Static Server (Zero External Dependencies)

If you do not wish to install pip dependencies and want to run the front-end application with client-side state management right away:

#### 1. Run the Static Server Launcher

```bash
python3 serve.py
```

*(Alternatively, run Python's built-in module directly: `python3 -m http.server 8000`)*

#### 2. Open Your Browser

Visit: **http://localhost:8000** or **http://127.0.0.1:8000**

---

## Step 4: Open the Application in Your Browser

Once the server is running, navigate to the local URL in your web browser:
- If using Method A: `http://localhost:5000`
- If using Method B: `http://localhost:8000`

You will see the Startup Connect Rwanda landing page featuring platform traction statistics, ecosystem highlights, and navigation links.

---

## Demo Credentials

The platform includes pre-configured demo user accounts for exploring each role's customized dashboard. You can also click **Sign Up** on the top navigation bar to register a brand-new account with a fresh slate.

| Role | Email Address | Password | Workspace & Capabilities |
| :--- | :--- | :--- | :--- |
| **Founder** | `david@agritech.rw` | `password123` | Founder Command Center, MRR traction graphs, youth employment counters, mentor requests, term sheet tracking |
| **Mentor** | `mentor@kigali.rw` | `password123` | Mentor Advisory Workspace, incoming sprint applications, timeslot proposal, decline/revise feedback loops |
| **Investor** | `investor@ventures.rw` | `password123` | Investor Deal Pipeline, check size expression ($25k-$500k), due diligence stage tracking, sector allocation |

> **Note:** To create a new account, go to `signup.html` (or click "Sign Up" on the header). Newly registered accounts start with an empty slate (0 MRR, 0 mentees, 0 deals reviewed, 0 active connections).

---

## Platform Features

- **Role-Based Routing**: Distinct dashboard interfaces tailored to Founders, Mentors, and Investors.
- **Searchable Ecosystem Registry**: Search by startup name or filter by domain (FinTech, AgriTech, HealthTech, etc.) and region (Kigali, Northern, Southern, Eastern, Western).
- **Mentorship Sprint Workflow**: Full advisory loop supporting initial requests, mentor counter-proposals with available slots, decline loops with guidance feedback, and session ratings (1-5 stars).
- **Investment Pipeline Management**: Express check sizes, track progress through Due Diligence, Term Sheet Offered, and Funded milestones.
- **Unified Networking Hub**: Centralized connection management with dedicated tabs for sent requests, incoming inquiries, and active partnerships.
- **Adaptive Persistence**: Client-side state automatically saved in browser `localStorage`, with SQLite database support when running via Flask.

---

## Project Directory Structure

```text
startup_connect/
├── README.md                  # Comprehensive setup instructions and project documentation
├── requirements.txt           # Python backend dependencies
├── app.py                     # Flask backend application, domain models, and API routes
├── serve.py                   # Lightweight static HTTP server launcher (port 8000)
├── index.html                 # Ecosystem landing page
├── login.html                 # Authentication and role sign-in portal
├── signup.html                # Multi-role adaptive onboarding form
├── directory.html             # Searchable ecosystem registry with filters
├── dashboard-founder.html     # Founder command center and traction metrics
├── dashboard-mentor.html      # Mentor advisory workspace and calendar
├── dashboard-investor.html    # Investor deal flow pipeline and review hub
├── connections.html           # Multi-role connection request and networking hub
├── profile_data_sample.json   # Sample startup profile data schema
├── static/
│   ├── css/
│   │   └── style.css          # Design system tokens, responsive grid, and UI components
│   └── js/
│       ├── data.js            # Initial ecosystem seed datasets
│       └── app.js             # Client state management, session lifecycle, and workflows
└── templates/                 # Jinja2 server templates for Flask rendering
    ├── base.html              # Shared layout template
    ├── index.html             # Server-rendered landing page
    ├── login.html             # Server-rendered login portal
    ├── signup.html            # Server-rendered registration page
    ├── directory.html         # Server-rendered directory
    ├── dashboard-founder.html # Server-rendered founder dashboard
    ├── dashboard-mentor.html  # Server-rendered mentor dashboard
    ├── dashboard-investor.html# Server-rendered investor dashboard
    └── connections.html       # Server-rendered connections hub
```

---

## REST API Endpoints

When running through the Flask backend (`python app.py`), the following REST endpoints are available:

### Authentication
- `POST /api/auth/register` - Create a new user account with role-specific attributes.
- `POST /api/auth/login` - Authenticate with email and password.
- `POST /api/auth/logout` - Clear active session.
- `GET /api/auth/me` - Fetch profile data of currently authenticated user.

### Discovery & Ecosystem
- `GET /api/startups` - Fetch startup listings with sector and region filtering.
- `GET /api/mentors` - Fetch certified mentors filterable by domain expertise.
- `GET /api/investors` - Fetch accredited investor profiles and ticket sizes.

### Networking & Connections
- `POST /api/connections/request` - Send a connection request to an ecosystem member.
- `POST /api/connections/respond` - Accept or decline an incoming connection request.
- `GET /api/connections` - Fetch connection status by user ID.

### Mentorship Advisory Workflow
- `POST /api/mentorship/request` - Submit an advisory sprint application.
- `POST /api/mentorship/propose-slots` - Propose available mentorship session slots.
- `POST /api/mentorship/decline` - Decline with guidance feedback, triggering revision loop.
- `POST /api/mentorship/revise` - Resubmit revised mentorship application.
- `POST /api/mentorship/confirm-slot` - Confirm timeslot and lock session into calendar.
- `POST /api/mentorship/session/review` - Complete session and submit 1-5 star review.

### Investment Management
- `POST /api/investment/express` - Express check size interest and strategic notes.
- `PUT /api/investment/status` - Transition deal stage (Expressed, Due Diligence, Term Sheet Offered, Funded).

### Statistics
- `GET /api/stats` - Platform-wide metrics (verified startups, youth jobs, capital facilitated).

---

## Environment Variables (Optional)

You can customize runtime configuration using environment variables or a `.env` file:

| Variable | Default Value | Description |
| :--- | :--- | :--- |
| `PORT` | `5000` | Port on which the application server listens |
| `DATABASE_URL` | `sqlite:///startup_connect.db` | SQLAlchemy database URI (SQLite default, supports MySQL/PostgreSQL) |
| `SECRET_KEY` | *(Built-in development key)* | Secret key used to sign Flask session cookies |

---

## Troubleshooting & FAQs

### Issue: "Address already in use" Error
If port 5000 or 8000 is occupied by another process:
- **macOS / Linux**:
  ```bash
  # Check which process is using port 5000
  lsof -i :5000
  # Or run on an alternative port:
  PORT=5001 python app.py
  ```
- **Windows**:
  ```cmd
  set PORT=5001
  python app.py
  ```

### Issue: PowerShell execution policy blocks activating `venv` on Windows
If PowerShell displays `running scripts is disabled on this system`:
Run PowerShell as Administrator and execute:
```powershell
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```
Then run `venv\Scripts\Activate.ps1` again.

### Issue: "No module named flask"
Ensure your virtual environment is activated before running `python app.py`. You should see `(venv)` at the beginning of your terminal prompt. If still missing, run `pip install -r requirements.txt`.

### Issue: Changes not appearing in the browser
Hard-refresh your browser cache:
- Chrome / Firefox / Edge: `Ctrl + Shift + R` (Windows/Linux) or `Cmd + Shift + R` (macOS).
