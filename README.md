# 🌍 Breathe ESG - Activity Normalization Engine

![React](https://img.shields.io/badge/react-%2320232a.svg?style=for-the-badge&logo=react&logoColor=%2361DAFB)
![Django](https://img.shields.io/badge/django-%23092E20.svg?style=for-the-badge&logo=django&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/tailwindcss-%2338B2AC.svg?style=for-the-badge&logo=tailwind-css&logoColor=white)
![SQLite](https://img.shields.io/badge/sqlite-%2307405e.svg?style=for-the-badge&logo=sqlite&logoColor=white)

An enterprise-grade ESG data ingestion and normalization pipeline. This system processes messy, unstructured multi-tenant activity data (SAP exports, Utility bills, Travel logs) and standardizes it into a secure, immutable carbon ledger for analyst review.

---

## 🚀 Live Deployment
**Production URL:** `[INSERT YOUR RENDER URL HERE]`

*(Note: The live environment includes pre-loaded sample data representing Scope 1, 2, and 3 emissions for immediate review.)*

---

## 🧠 System Architecture & Philosophy

The core philosophy of this architecture is **Source-of-Truth Preservation**. Financial and carbon auditors require a perfect paper trail. 

Instead of discarding incoming payload structures, this system ingests chaotic client data and stores the exact raw JSON payload alongside its normalized mathematical outputs ($kgCO_2e$). 

### Key Capabilities
* **Multi-Tenant Ingestion:** Isolated data spaces ensuring zero cross-contamination between organizational clients.
* **Intelligent Normalization:** Dynamically translates varied client formats (e.g., German SAP units like `GAL`) into standardized metric units (Liters, kWh).
* **Automated Anomaly Detection:** Flags suspicious outliers mathematically (e.g., fuel purchases > 10,000L) requiring manual intervention.
* **Analyst Command Center:** A high-density, React-based review dashboard styled for enterprise utility (inspired by GCP/AWS consoles).
* **Immutable Audit Trail:** All manual status overrides are recorded in a dedicated `AuditLog` table with timestamps and user references to ensure strict compliance.

---

## 📂 Engineering Documentation

As per the project requirements, all architectural decisions, edge-case resolutions, and deliberate tradeoffs have been formally documented. Please review the following files:

* [MODEL.md](./MODEL.md) - Database schema design, multi-tenancy logic, and audit-log justification.
* [SOURCES.md](./SOURCES.md) - Breakdown of the sample data formats ingested and normalized.
* [DECISIONS.md](./DECISIONS.md) - Product-sense choices and ambiguities resolved during development.
* [TRADEOFFS.md](./TRADEOFFS.md) - Explicit limitations of this prototype and what was excluded to meet the 4-day deadline.

---

## 💻 Local Setup & Installation

If you prefer to run this prototype locally instead of viewing the deployed environment, follow these steps:

### 1. Backend Setup (Django API)
```bash
# Clone the repository
git clone <your-repo-url>
cd breathe-esg-app

# Create and activate a virtual environment
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Run migrations and start the server
python manage.py migrate
python manage.py runserver

```

*The API is now running on `http://127.0.0.1:8000/*`

### 2. Frontend Setup (React Dashboard)

Open a **new** terminal window:

```bash
# Navigate to the frontend directory
cd frontend

# Install Node dependencies
npm install

# Start the Vite development server
npm run dev

```

*The Analyst Dashboard is now running on `http://localhost:5173/*`

---

## 🧪 Testing the Ingestion Engine

To test the raw data pipeline, you can upload new data via cURL or Postman.

**Example cURL Request (SAP Data):**

```bash
curl -X POST -F "file=@sample_data/sap_export.csv" [http://127.0.0.1:8000/api/upload/sap/](http://127.0.0.1:8000/api/upload/sap/)

```

