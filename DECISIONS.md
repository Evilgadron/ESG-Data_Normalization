## Ambiguities Resolved
1. **Handling Non-Calendar Billing Cycles:** Utility bills rarely align perfectly with calendar months. I decided to use a pro-rata allocation strategy. If a bill spans April 14 to May 12, the daily average is calculated and distributed across the respective months. 
2. **Flagging Logic Thresholds:** The prompt didn't specify what makes data "suspicious". I implemented a basic threshold logic (e.g., fuel quantities > 10,000L) to automatically set the status to `FLAGGED` to demonstrate the review workflow.
3. **Database Choice & Deployment:** I used SQLite to optimize for local development speed and rapid deployment on Vercel to hit the 4-day deadline. Because Vercel is serverless, I am aware this makes the SQLite database transient (it will reset when the container sleeps). In a true production environment, this architecture would immediately be migrated to a managed PostgreSQL instance (e.g., AWS RDS or Supabase) to ensure the immutable audit trail is preserved permanently.

## Scope of Sources Handled
* **SAP (Fuel/Procurement):** Handled CSV flat files (typical of legacy SAP GUI exports) focusing on fuel inventory (`Menge`, `ME`). Ignored complex nested IDocs to focus on the normalization logic rather than parsing deep XML structures.
* **Utility Data (Electricity):** Handled structured CSV (mimicking the Green Button standard). Deliberately ignored PDF parsing, as OCR introduces high error rates that distract from testing the core math of the normalization engine.
* **Corporate Travel:** Handled JSON arrays representing API responses (e.g., Navan/Concur). Handled airport-to-airport distance logic but deliberately ignored multi-leg layover complexity for the scope of this prototype.

## Questions for the PM
If I had more time, I would ask the PM:
1. "Do we have a central, managed Emission Factor database (like Climatiq or EPA) we want to hit via API, or should we maintain these tables internally to guarantee version control for auditors?"
2. "What is the expected SLA for analysts to clear `FLAGGED` rows? Should we implement an email/Slack notification system for bottlenecks?"
3. "Are we legally required to retain the `raw_data` JSON exactly as it was uploaded for a specific number of years for compliance audits?"