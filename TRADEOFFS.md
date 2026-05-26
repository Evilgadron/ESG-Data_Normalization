# TRADEOFFS.md

Here are three things I deliberately chose *not* to build, and why:

### 1. Complex Authentication & Role-Based Access Control (RBAC)
**Why:** Implementing JWTs, login screens, and separating "Uploader" vs. "Analyst" roles would consume 20% of the 4-day timeline. I prioritized the core data modeling and normalization engine. I assumed a trusted environment for this prototype.

### 2. PDF Parsing / OCR for Utility Bills
**Why:** Extracting tables from utility bill PDFs is notoriously brittle due to varying vendor templates. Building a robust OCR pipeline would distract from demonstrating the core multi-tenancy and audit-trail architecture. I assumed the client could export structured CSVs (e.g., Green Button).

### 3. Live External Emission Factor API Integration
**Why:** Calling external APIs (like Climatiq) for every row adds network latency and introduces external dependencies that could break during your grading review. I hardcoded a small, representative dictionary of emission factors in the backend logic to guarantee the prototype works seamlessly for the evaluators.

