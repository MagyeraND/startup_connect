# Startup Connect Rwanda

A digital ecosystem platform bridging Rwandan startup founders, certified mentors, and institutional investors in Kigali and across Rwanda.

Live Deployment: https://startupc0nnect.netlify.app

---

## Quick Start (Run Locally)

Follow these simple steps to get the project running on your computer:

### 1. Clone the repository
```bash
git clone https://github.com/MagyeraND/startup_connect.git
cd startup_connect
```

### 2. Start the local server
Run Python's built-in web server:
```bash
python3 -m http.server 8000
```
*(Or run: `python3 serve.py`)*

### 3. Open in your browser
Open your browser and navigate to:
**http://localhost:8000**

---

## Running with Flask Backend (Optional)

If you want to run the full-stack Flask backend with SQLite database models:

1. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```
2. Start the Flask application:
   ```bash
   python3 app.py
   ```
3. Open in your browser:
   **http://localhost:5000**

---

## Demo Accounts

You can sign in with any of these pre-configured demo accounts to test each role's dashboard, or click "Sign Up" to register a new account:

- Founder Account:
  - Email: `david@agritech.rw`
  - Password: `password123`
- Mentor Account:
  - Email: `mentor@kigali.rw`
  - Password: `password123`
- Investor Account:
  - Email: `investor@ventures.rw`
  - Password: `password123`

---

## Core Pages and Structure

- Home (`index.html`): Ecosystem landing page with platform traction statistics.
- Directory (`directory.html`): Searchable startups, mentors, and investors with sector/province filters.
- Founder Dashboard (`dashboard-founder.html`): Traction metrics, revenue, team size, and mentor requests.
- Mentor Dashboard (`dashboard-mentor.html`): Advisory session calendar and incoming application reviews.
- Investor Dashboard (`dashboard-investor.html`): Deal flow pipeline and due diligence tracking.
- Connections Hub (`connections.html`): Multi-role networking and connection request management.
- Authentication (`login.html` / `signup.html`): Multi-role login and adaptive registration forms.

---

## Built With

- Frontend: HTML5, CSS3, JavaScript (Vanilla ES6)
- Backend: Python, Flask, SQLAlchemy, SQLite
- Deployment: Netlify (Frontend)
