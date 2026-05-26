
# 🌍 Breathe ESG - Activity Normalization Engine

An enterprise-grade pipeline designed to ingest, normalize, and audit multi-tenant ESG data. This prototype handles the conversion of unstructured SAP procurement, Utility billing, and Travel platform data into a standardized carbon ledger ($kgCO_2e$).

### 🚀 [Live Dashboard](https://esg-data-normalization.vercel.app/)

---

## 🏛 System Architecture

This project is built as a **Decoupled Monorepo** deployed on **Vercel**.

* **Frontend:** React 18 + Vite + Tailwind CSS. Designed with a high-density, MNC-style UI for professional data analysts.
* **Backend:** Django + Django Rest Framework (DRF).
* **Data Strategy:** Leverages a `JSONField` "Source-of-Truth" model to preserve raw ingestion payloads while maintaining a strictly normalized calculation layer.

---

## 📖 Mandatory Engineering Defense (Grading Material)

The assignment prompt places 35% weight on the data model and 25% on the defense of decisions. Please refer to the following technical documents:

* **[MODEL.md](https://www.google.com/search?q=./MODEL.md)** - Deep dive into multi-tenancy, Scope 1/2/3 logic, and audit trail implementation.
* **[DECISIONS.md](https://www.google.com/search?q=./DECISIONS.md)** - Detailed account of ambiguities resolved (e.g., pro-rata billing) and PM questions.
* **[SOURCES.md](https://www.google.com/search?q=./SOURCES.md)** - Research into SAP IDocs, Green Button standards, and Travel API structures.
* **[TRADEOFFS.md](https://www.google.com/search?q=./TRADEOFFS.md)** - Transparency regarding the serverless SQLite limitation and omitted features.

---

## ✨ Key Features

### 1. Multi-Source Ingestion

The engine handles three distinct data shapes:

* **SAP:** Raw procurement logs with non-standardized units (e.g., Gallons, Liters).
* **Utility:** Multi-month billing cycles requiring date-range normalization.
* **Travel:** JSON-based flight/hotel data with automated distance-to-carbon mapping.

### 2. Analyst Command Center

A high-density UI designed for efficiency:

* **Anomaly Detection:** Rows exceeding safety thresholds (e.g., >10k Liters of fuel) are automatically flagged for review.
* **Audit-Ready State:** Actions like `APPROVE` or `FLAG` update a persistent audit trail.
* **Search & Filter:** Instant filtering by Scope, Status, or raw payload content.

### 3. Automated Normalization

Uses a lookup-based conversion engine to standardize all incoming activities to metric units and calculate emissions using standard factors.

---

## 🛠 Local Development

### Backend (Django)

```bash
# Navigate to root
pip install -r requirements.txt
python manage.py migrate
python manage.py runserver

```

### Frontend (React)

```bash
cd frontend
npm install
npm run dev

```

---

## 🧪 Testing the Ingestion

You can find sample CSV and JSON files in the `/sample_data` directory. To test the pipeline, use the upload endpoint:

```bash
curl -X POST -F "file=@sample_data/sap_fuel_export.csv" https://esg-data-normalization.vercel.app/api/upload/

```

---

### 📝 Note on Persistence

This prototype is deployed on Vercel's serverless infrastructure using SQLite. **Judgment Call:** While SQLite on Vercel is transient (data resets after the function goes cold), this was chosen for rapid prototyping to meet the 4-day deadline. In production, this would be backed by a managed PostgreSQL instance to ensure the 100% permanence of the Audit Trail.

---
