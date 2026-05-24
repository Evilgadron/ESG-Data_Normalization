# 🌍 Breathe ESG - Activity Normalization Engine

An enterprise-grade ESG data ingestion and normalization pipeline. This system processes unstructured, multi-tenant activity data (SAP exports, Utility bills, Travel logs) and standardizes it into a secure, immutable carbon ledger for analyst review.

---

## 🚀 Live Deployment

* **Analyst Dashboard (Frontend):** **[https://esg-data-normalization.vercel.app/](https://esg-data-normalization.vercel.app/)**
* **API Engine (Backend):** `https://your-backend-name.onrender.com/`

> **Pro-Tip for Reviewers:** The dashboard is optimized for high-density data review. Use the **Filter** controls to toggle between 'Flagged' anomalies and 'Approved' records.

---

## 🧠 System Architecture & Philosophy

The core philosophy of this architecture is **Source-of-Truth Preservation**. Financial and carbon auditors require a perfect paper trail. Instead of discarding "messy" incoming payload structures, this system stores the exact raw JSON payload alongside its normalized mathematical outputs ($kgCO_2e$).

### Key Capabilities

* **Multi-Tenant Ingestion:** Isolated data spaces ensuring zero cross-contamination between organizational clients.
* **Intelligent Normalization:** Dynamically translates varied client formats (e.g., German SAP units like `GAL`) into standardized metric units (Liters, kWh).
* **Automated Anomaly Detection:** Flags suspicious outliers (e.g., fuel purchases > 10,000L) for mandatory manual intervention.
* **High-Density Command Center:** A React-based review dashboard styled after MNC-grade internal tools (AWS/GCP Console) for maximum utility.
* **Immutable Audit Trail:** All manual status overrides are recorded with timestamps to ensure strict compliance.

---

## 📂 Engineering Documentation (The "Defense")

As per the project requirements, all architectural decisions, edge-case resolutions, and deliberate tradeoffs have been formally documented. **These files represent the engineering rigor behind the code.**

* **[MODEL.md](https://www.google.com/search?q=./MODEL.md)** - Database schema design, multi-tenancy logic, and audit-log justification.
* **[SOURCES.md](https://www.google.com/search?q=./SOURCES.md)** - Breakdown of the sample data formats ingested and normalized.
* **[DECISIONS.md](https://www.google.com/search?q=./DECISIONS.md)** - Product-sense choices and ambiguities resolved during development.
* **[TRADEOFFS.md](https://www.google.com/search?q=./TRADEOFFS.md)** - Explicit limitations of this prototype and what was excluded to meet the 4-day deadline.

---

## 💻 Local Setup & Installation

### 1. Backend Setup (Django API)

```bash
cd breathe-esg-app
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r requirements.txt
python manage.py migrate
python manage.py runserver

```

### 2. Frontend Setup (React Dashboard)

```bash
cd frontend
npm install
npm run dev

```

---

## 🧪 Testing the Ingestion Engine

To test the raw data pipeline, you can upload new data via cURL.

**Example SAP Data Upload:**

```bash
curl -X POST -F "file=@sample_data/sap_export.csv" https://your-backend-name.onrender.com/api/upload/sap/

```
