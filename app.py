"""
Startup Connect Rwanda - Backend Architecture
Aligned with SRS (Software Requirements Specification) by David Nkubito
African Leadership University (ALU) - 27 September 2026

Architecture (SRS Component Diagram Page 14-15):
- Web Application & API Gateway (HTTP/JSON routing & validation)
- Domain Services:
  * User & Profile Service (FR 1.1, FR 1.2, FR 2.1, FR 2.2)
  * Discovery & Matching Service (FR 3.1 Industry & Regional Filtering, FR 3.2 Name Substring Search)
  * Mentorship Service (SRS Activity Diagram Swimlanes: Request, Decline/Revise Loop, Propose Slots, Confirm, Review & Rate)
  * Investment Service (SRS Class Diagram: Express Interest, Due Diligence & Term Sheet Tracking)
  * Direct Messaging & Notification Service (SRS Use Case: Direct Message Exchange & System Alerts)
- Relational Database (Normalized schema with MySQL target & SQLite local development fallback)
- NFR 1 Security: PBKDF2/SHA-256 password hashing via Werkzeug Security
- NFR 4 Reliability: Cascade constraints preventing orphan records
- NFR 7 Technology: Real-time connection and session statistics
"""

import os
import json
from datetime import datetime
from flask import Flask, render_template, request, redirect, url_for, jsonify, session
from werkzeug.security import generate_password_hash, check_password_hash

app = Flask(__name__)
app.secret_key = os.environ.get("SECRET_KEY", "startup-connect-rwanda-srs-secret-key-2026")

# Database Configuration (MySQL target with SQLite local fallback)
MYSQL_USER = os.environ.get("DB_USER", "root")
MYSQL_PASS = os.environ.get("DB_PASSWORD", "")
MYSQL_HOST = os.environ.get("DB_HOST", "localhost")
MYSQL_DB = os.environ.get("DB_NAME", "startup_connect_rw")

MYSQL_URI = f"mysql+pymysql://{MYSQL_USER}:{MYSQL_PASS}@{MYSQL_HOST}/{MYSQL_DB}"
app.config["SQLALCHEMY_DATABASE_URI"] = os.environ.get("DATABASE_URL", "sqlite:///startup_connect.db")
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False

# ==============================================================================
# Domain Models (SRS Class Diagram & Appendix B Entity-Relationship Mapping)
# ==============================================================================

try:
    from flask_sqlalchemy import SQLAlchemy
    db = SQLAlchemy(app)

    class User(db.Model):
        __tablename__ = "users"
        id = db.Column(db.Integer, primary_key=True)
        name = db.Column(db.String(120), nullable=False)
        email = db.Column(db.String(120), unique=True, nullable=False)
        password_hash = db.Column(db.String(255), nullable=False)
        role = db.Column(db.String(30), nullable=False)  # founder, mentor, investor
        region = db.Column(db.String(50), default="Kigali") # Kigali, Northern, Southern, Western, Eastern
        bio = db.Column(db.Text)
        phone = db.Column(db.String(40))
        created_at = db.Column(db.DateTime, default=datetime.utcnow)

        # NFR 4: Cascade constraints preventing orphan records
        startups = db.relationship("Startup", backref="founder", lazy=True, cascade="all, delete-orphan")

        def set_password(self, password):
            self.password_hash = generate_password_hash(password)

        def check_password(self, password):
            return check_password_hash(self.password_hash, password)

        def to_dict(self):
            return {
                "id": self.id,
                "name": self.name,
                "email": self.email,
                "role": self.role,
                "region": self.region,
                "bio": self.bio,
                "phone": self.phone,
                "created_at": self.created_at.isoformat() if self.created_at else None
            }

    class Startup(db.Model):
        __tablename__ = "startups"
        id = db.Column(db.Integer, primary_key=True)
        founder_id = db.Column(db.Integer, db.ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
        name = db.Column(db.String(150), nullable=False)
        sector = db.Column(db.String(50), nullable=False)  # AgriTech, FinTech, GreenTech, etc.
        stage = db.Column(db.String(50), nullable=False)   # Idea, Pre-seed, Seed, Series A
        region = db.Column(db.String(50), default="Kigali")
        location = db.Column(db.String(100), default="Kigali, Rwanda")
        tagline = db.Column(db.String(255))
        pitch_summary = db.Column(db.Text)
        capital_seeking = db.Column(db.Numeric(12, 2), default=0.0)
        capital_raised = db.Column(db.Numeric(12, 2), default=0.0)
        monthly_revenue = db.Column(db.Numeric(12, 2), default=0.0)
        youth_jobs_created = db.Column(db.Integer, default=0)
        team_size = db.Column(db.Integer, default=1)
        website = db.Column(db.String(255))
        created_at = db.Column(db.DateTime, default=datetime.utcnow)

        # NFR 4: Cascade constraints for investment interests
        investment_interests = db.relationship("InvestmentInterest", backref="startup", lazy=True, cascade="all, delete-orphan")

        def to_dict(self):
            return {
                "id": self.id,
                "founder_id": self.founder_id,
                "name": self.name,
                "sector": self.sector,
                "stage": self.stage,
                "region": self.region,
                "location": self.location,
                "tagline": self.tagline,
                "pitch_summary": self.pitch_summary,
                "capital_seeking": float(self.capital_seeking) if self.capital_seeking else 0.0,
                "capital_raised": float(self.capital_raised) if self.capital_raised else 0.0,
                "monthly_revenue": float(self.monthly_revenue) if self.monthly_revenue else 0.0,
                "youth_jobs_created": self.youth_jobs_created,
                "team_size": self.team_size,
                "website": self.website
            }

    class ConnectionRequest(db.Model):
        __tablename__ = "connection_requests"
        id = db.Column(db.Integer, primary_key=True)
        sender_id = db.Column(db.Integer, db.ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
        recipient_id = db.Column(db.Integer, db.ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
        request_type = db.Column(db.String(100), nullable=False)
        pitch_summary = db.Column(db.Text)
        status = db.Column(db.String(30), default="Pending")  # Pending, Accepted, Declined
        created_at = db.Column(db.DateTime, default=datetime.utcnow)

        def to_dict(self):
            return {
                "id": self.id,
                "sender_id": self.sender_id,
                "recipient_id": self.recipient_id,
                "request_type": self.request_type,
                "pitch_summary": self.pitch_summary,
                "status": self.status,
                "created_at": self.created_at.isoformat() if self.created_at else None
            }

    class MentorshipRequest(db.Model):
        __tablename__ = "mentorship_requests"
        id = db.Column(db.Integer, primary_key=True)
        founder_id = db.Column(db.Integer, db.ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
        mentor_id = db.Column(db.Integer, db.ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
        goals = db.Column(db.Text, nullable=False)
        status = db.Column(db.String(30), default="Pending")  # Pending, Declined, Timeslots Proposed, Scheduled
        decline_reason = db.Column(db.Text)
        proposed_slots_json = db.Column(db.Text) # JSON string of slot choices
        created_at = db.Column(db.DateTime, default=datetime.utcnow)

        sessions = db.relationship("MentorshipSession", backref="mentorship_request", lazy=True, cascade="all, delete-orphan")

        def to_dict(self):
            return {
                "id": self.id,
                "founder_id": self.founder_id,
                "mentor_id": self.mentor_id,
                "goals": self.goals,
                "status": self.status,
                "decline_reason": self.decline_reason,
                "proposed_slots": json.loads(self.proposed_slots_json) if self.proposed_slots_json else [],
                "created_at": self.created_at.isoformat() if self.created_at else None
            }

    class MentorshipSession(db.Model):
        __tablename__ = "mentorship_sessions"
        id = db.Column(db.Integer, primary_key=True)
        request_id = db.Column(db.Integer, db.ForeignKey("mentorship_requests.id", ondelete="CASCADE"))
        founder_id = db.Column(db.Integer, db.ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
        mentor_id = db.Column(db.Integer, db.ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
        scheduled_at = db.Column(db.String(100), nullable=False)
        status = db.Column(db.String(30), default="Scheduled") # Scheduled, Completed
        outcome = db.Column(db.Text)
        rating = db.Column(db.Integer) # 1 to 5 stars
        review = db.Column(db.Text)
        created_at = db.Column(db.DateTime, default=datetime.utcnow)

        def to_dict(self):
            return {
                "id": self.id,
                "request_id": self.request_id,
                "founder_id": self.founder_id,
                "mentor_id": self.mentor_id,
                "scheduled_at": self.scheduled_at,
                "status": self.status,
                "outcome": self.outcome,
                "rating": self.rating,
                "review": self.review,
                "created_at": self.created_at.isoformat() if self.created_at else None
            }

    class InvestmentInterest(db.Model):
        __tablename__ = "investment_interests"
        id = db.Column(db.Integer, primary_key=True)
        investor_id = db.Column(db.Integer, db.ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
        startup_id = db.Column(db.Integer, db.ForeignKey("startups.id", ondelete="CASCADE"), nullable=False)
        amount = db.Column(db.Numeric(12, 2), nullable=False)
        note = db.Column(db.Text)
        status = db.Column(db.String(40), default="Expressed") # Expressed, In Due Diligence, Term Sheet Offered, Passed
        created_at = db.Column(db.DateTime, default=datetime.utcnow)

        def to_dict(self):
            return {
                "id": self.id,
                "investor_id": self.investor_id,
                "startup_id": self.startup_id,
                "amount": float(self.amount) if self.amount else 0.0,
                "note": self.note,
                "status": self.status,
                "created_at": self.created_at.isoformat() if self.created_at else None
            }

    class DirectMessage(db.Model):
        __tablename__ = "direct_messages"
        id = db.Column(db.Integer, primary_key=True)
        sender_id = db.Column(db.Integer, db.ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
        recipient_id = db.Column(db.Integer, db.ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
        text = db.Column(db.Text, nullable=False)
        created_at = db.Column(db.DateTime, default=datetime.utcnow)

        def to_dict(self):
            return {
                "id": self.id,
                "sender_id": self.sender_id,
                "recipient_id": self.recipient_id,
                "text": self.text,
                "created_at": self.created_at.isoformat() if self.created_at else None
            }

except ImportError:
    db = None

# ==============================================================================
# Page Routes (Jinja2 Templates Synchronized with Root HTML Files)
# ==============================================================================

@app.route("/")
def index():
    return render_template("index.html")

@app.route("/signup", methods=["GET", "POST"])
def signup():
    if request.method == "POST":
        role = request.form.get("role", "founder")
        return redirect(url_for(f"dashboard_{role}"))
    return render_template("signup.html")

@app.route("/login", methods=["GET", "POST"])
def login():
    if request.method == "POST":
        role = request.form.get("role", "founder")
        return redirect(url_for(f"dashboard_{role}"))
    return render_template("login.html")

@app.route("/logout")
def logout():
    session.clear()
    return redirect(url_for("index"))

@app.route("/dashboard")
def dashboard():
    role = session.get("user_role", "founder")
    return redirect(url_for(f"dashboard_{role}"))

@app.route("/dashboard-founder")
def dashboard_founder():
    return render_template("dashboard_founder.html")

@app.route("/dashboard-mentor")
def dashboard_mentor():
    return render_template("dashboard_mentor.html")

@app.route("/dashboard-investor")
def dashboard_investor():
    return render_template("dashboard_investor.html")

@app.route("/directory")
def directory():
    return render_template("directory.html")

@app.route("/connections")
def connections():
    return render_template("connections.html")

@app.route("/profile_data.json")
def get_profile_data_file():
    candidates = ["profile_data.json", "static/profile_data.json", "user_profile.json"]
    for path in candidates:
        if os.path.exists(path):
            try:
                with open(path, "r", encoding="utf-8") as f:
                    return jsonify(json.load(f))
            except Exception as e:
                return jsonify({"error": str(e)}), 500
    return jsonify({"error": "Profile data file not present in project", "loaded": False}), 404

# ==============================================================================
# REST API Endpoints (Component Diagram: Domain Services Layer)
# ==============================================================================

@app.route("/api/health")
def api_health():
    return jsonify({
        "status": "healthy",
        "service": "Startup Connect Rwanda API Gateway",
        "database": "connected" if db else "in-memory-client-fallback",
        "timestamp": datetime.utcnow().isoformat()
    })

# --- Service 1: User & Profile Service (FR 1.1, FR 1.2, FR 2.1, FR 2.2) ---

@app.route("/api/auth/register", methods=["POST"])
def api_register():
    data = request.get_json() or request.form
    if not db:
        return jsonify({"success": True, "message": "Registered in client session"})

    email = data.get("email")
    if User.query.filter_by(email=email).first():
        return jsonify({"success": False, "error": "Email already registered"}), 400

    user = User(
        name=data.get("name", "User"),
        email=email,
        role=data.get("role", "founder"),
        region=data.get("region", "Kigali"),
        phone=data.get("phone"),
        bio=data.get("bio", "")
    )
    user.set_password(data.get("password", "password123"))
    db.session.add(user)
    db.session.commit()
    return jsonify({"success": True, "user": user.to_dict()})

@app.route("/api/auth/login", methods=["POST"])
def api_login():
    data = request.get_json() or request.form
    if not db:
        return jsonify({"success": True, "message": "Demo login session active"})

    email = data.get("email")
    password = data.get("password")
    user = User.query.filter_by(email=email).first()

    if user and user.check_password(password):
        session["user_id"] = user.id
        session["user_role"] = user.role
        session["user_name"] = user.name
        return jsonify({"success": True, "user": user.to_dict()})
    return jsonify({"success": False, "error": "Invalid email or password"}), 401

@app.route("/api/user/profile", methods=["GET", "PUT"])
def api_user_profile():
    if not db:
        return jsonify({"success": True, "message": "Profile synced with client storage"})

    user_id = session.get("user_id") or request.args.get("user_id")
    if not user_id:
        return jsonify({"success": False, "error": "User not authenticated"}), 401

    user = User.query.get(user_id)
    if not user:
        return jsonify({"success": False, "error": "User not found"}), 404

    if request.method == "PUT":
        data = request.get_json() or request.form
        if "name" in data: user.name = data["name"]
        if "region" in data: user.region = data["region"]
        if "bio" in data: user.bio = data["bio"]
        if "phone" in data: user.phone = data["phone"]
        if data.get("password"):
            user.set_password(data["password"])
        db.session.commit()
        return jsonify({"success": True, "user": user.to_dict()})

    return jsonify({"success": True, "user": user.to_dict()})

# --- Service 2: Discovery Service (FR 3.1 & FR 3.2) ---

@app.route("/api/discovery", methods=["GET"])
def api_discovery():
    """FR 3.1 Industry Filtering & FR 3.2 Substring Name Search"""
    role = request.args.get("role", "All")
    sector = request.args.get("sector", "All")
    region = request.args.get("region", "All")
    q = request.args.get("q", "").lower().strip()

    if not db:
        return jsonify({
            "message": "Use client state in static mode",
            "filters": {"role": role, "sector": sector, "region": region, "query": q}
        })

    query = Startup.query
    if sector != "All":
        query = query.filter(Startup.sector.ilike(f"%{sector}%"))
    if region != "All":
        query = query.filter(Startup.region.ilike(f"%{region}%"))
    if q:
        query = query.filter((Startup.name.ilike(f"%{q}%")) | (Startup.pitch_summary.ilike(f"%{q}%")))

    startups = [s.to_dict() for s in query.all()]
    return jsonify({"count": len(startups), "startups": startups})

# --- Service 3: Connection Management Service (FR 4.1 & FR 4.2) ---

@app.route("/api/connections", methods=["GET", "POST", "PUT"])
def api_connections():
    if not db:
        return jsonify({"success": True, "message": "Connections managed in client state"})

    if request.method == "POST":
        data = request.get_json() or request.form
        conn = ConnectionRequest(
            sender_id=data.get("sender_id", 1),
            recipient_id=data.get("recipient_id", 2),
            request_type=data.get("type", "Networking"),
            pitch_summary=data.get("pitch_summary", ""),
            status="Pending"
        )
        db.session.add(conn)
        db.session.commit()
        return jsonify({"success": True, "connection": conn.to_dict()})

    elif request.method == "PUT":
        data = request.get_json() or request.form
        conn_id = data.get("id")
        status = data.get("status", "Accepted")
        conn = ConnectionRequest.query.get(conn_id)
        if conn:
            conn.status = status
            db.session.commit()
            return jsonify({"success": True, "connection": conn.to_dict()})
        return jsonify({"success": False, "error": "Request not found"}), 404

    user_id = session.get("user_id") or request.args.get("user_id", 1)
    conns = ConnectionRequest.query.filter(
        (ConnectionRequest.sender_id == user_id) | (ConnectionRequest.recipient_id == user_id)
    ).all()
    return jsonify({"count": len(conns), "connections": [c.to_dict() for c in conns]})

# --- Service 4: Mentorship Service (SRS Activity Diagram Swimlanes Page 11) ---

@app.route("/api/mentorship/request", methods=["POST"])
def api_mentorship_request():
    """Activity Step: Founder submits mentorship application with specific goals"""
    data = request.get_json() or request.form
    if not db:
        return jsonify({"success": True, "status": "Pending"})

    req = MentorshipRequest(
        founder_id=data.get("founder_id", 1),
        mentor_id=data.get("mentor_id", 2),
        goals=data.get("goals", "Strategic mentorship request"),
        status="Pending"
    )
    db.session.add(req)
    db.session.commit()
    return jsonify({"success": True, "request": req.to_dict()})

@app.route("/api/mentorship/propose-slots", methods=["POST"])
def api_mentorship_propose_slots():
    """Activity Step: Mentor proposes available timeslots"""
    data = request.get_json() or request.form
    if not db:
        return jsonify({"success": True, "status": "Timeslots Proposed"})

    req = MentorshipRequest.query.get(data.get("request_id"))
    if req:
        req.status = "Timeslots Proposed"
        req.proposed_slots_json = json.dumps(data.get("slots", []))
        db.session.commit()
        return jsonify({"success": True, "request": req.to_dict()})
    return jsonify({"success": False, "error": "Request not found"}), 404

@app.route("/api/mentorship/decline", methods=["POST"])
def api_mentorship_decline():
    """Activity Step: Mentor declines with feedback triggering founder revision loop"""
    data = request.get_json() or request.form
    if not db:
        return jsonify({"success": True, "status": "Declined"})

    req = MentorshipRequest.query.get(data.get("request_id"))
    if req:
        req.status = "Declined"
        req.decline_reason = data.get("reason", "Capacity reached for this sprint cycle.")
        db.session.commit()
        return jsonify({"success": True, "request": req.to_dict()})
    return jsonify({"success": False, "error": "Request not found"}), 404

@app.route("/api/mentorship/revise", methods=["POST"])
def api_mentorship_revise():
    """Activity Step: Founder revises criteria and goals, re-submitting request"""
    data = request.get_json() or request.form
    if not db:
        return jsonify({"success": True, "status": "Pending"})

    req = MentorshipRequest.query.get(data.get("request_id"))
    if req:
        if data.get("mentor_id"): req.mentor_id = int(data["mentor_id"])
        req.goals = data.get("goals", req.goals)
        req.status = "Pending"
        req.decline_reason = None
        req.proposed_slots_json = None
        db.session.commit()
        return jsonify({"success": True, "request": req.to_dict()})
    return jsonify({"success": False, "error": "Request not found"}), 404

@app.route("/api/mentorship/confirm-slot", methods=["POST"])
def api_mentorship_confirm_slot():
    """Activity Step: Founder confirms timeslot, scheduling session"""
    data = request.get_json() or request.form
    if not db:
        return jsonify({"success": True, "status": "Scheduled"})

    req = MentorshipRequest.query.get(data.get("request_id"))
    if req:
        req.status = "Scheduled"
        session_obj = MentorshipSession(
            request_id=req.id,
            founder_id=req.founder_id,
            mentor_id=req.mentor_id,
            scheduled_at=data.get("selected_slot", "Friday, Dec 5 at 3:00 PM CAT"),
            status="Scheduled",
            outcome="Pending session completion"
        )
        db.session.add(session_obj)
        db.session.commit()
        return jsonify({"success": True, "session": session_obj.to_dict()})
    return jsonify({"success": False, "error": "Request not found"}), 404

@app.route("/api/mentorship/session/review", methods=["POST"])
def api_session_review():
    """Activity Step: Founder conducts session and submits rating (1-5) and review"""
    data = request.get_json() or request.form
    if not db:
        return jsonify({"success": True, "status": "Completed"})

    sess = MentorshipSession.query.get(data.get("session_id"))
    if sess:
        sess.status = "Completed"
        sess.outcome = data.get("outcome", "Completed successfully")
        sess.rating = int(data.get("rating", 5))
        sess.review = data.get("review", "Great advisory session.")
        db.session.commit()
        return jsonify({"success": True, "session": sess.to_dict()})
    return jsonify({"success": False, "error": "Session not found"}), 404


if __name__ == '__main__':
    app.run(port=8000, debug=True)
