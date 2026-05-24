# Data Model and Architecture

## Overview
This data model is designed to handle the inherent entropy of ESG data ingestion. The core philosophy is to preserve the exact shape of the incoming data for audit purposes, while providing a strict, normalized schema for calculation and analyst review. 

The architecture relies on three primary tables and one logging table to meet the requirements of multi-tenancy, categorization, source-of-truth tracking, unit normalization, and audit trails.

## 1. Organization (Multi-Tenancy)
Every client onboarded must have an isolated data space.
* `id`: UUID (Primary Key)
* `name`: CharField

## 2. DataUpload (Source-of-Truth Tracking)
Tracks the exact event of data entering the system, providing the first layer of the audit trail.
* `id`: UUID (Primary Key)
* `organization_id`: ForeignKey -> Organization
* `source_type`: CharField (Choices: 'SAP', 'UTILITY', 'CONCUR')
* `uploaded_by`: ForeignKey -> User
* `uploaded_at`: DateTimeField (auto_now_add=True)
* `original_file_name_or_endpoint`: CharField (Tracks exactly where the data originated)

## 3. ActivityRow (Normalization & Review)
This is the core table. It stores both the unstructured raw data and the structured, normalized output.
* `id`: UUID (Primary Key)
* `upload_id`: ForeignKey -> DataUpload
* `scope`: IntegerField (Choices: 1, 2, 3)
* `raw_data`: JSONField (Stores the raw CSV row or JSON object exactly as ingested)
* `normalized_value`: FloatField (The converted value, e.g., Liters, kWh, or km)
* `normalized_unit`: CharField 
* `emissions_kg_co2e`: FloatField (The final calculated carbon output)
* `status`: CharField (Choices: 'PENDING', 'FLAGGED', 'APPROVED')
* `reviewed_by`: ForeignKey -> User (Nullable)
* `reviewed_at`: DateTimeField (Nullable)

## 4. AuditLog (The Audit Trail)
If an analyst edits a flagged row before approval, the original row must not be destroyed. This table tracks all manual interventions.
* `id`: UUID (Primary Key)
* `activity_row_id`: ForeignKey -> ActivityRow
* `edited_by`: ForeignKey -> User
* `edited_at`: DateTimeField (auto_now_add=True)
* `field_changed`: CharField (e.g., 'normalized_value')
* `old_value`: CharField
* `new_value`: CharField

## Justification and Tradeoffs
* **JSONField for `raw_data`:** Instead of creating dozens of nullable columns to accommodate German SAP headers or specific Concur API fields, I used a JSONField. This allows the schema to accept any data shape dynamically, ensuring the exact source-of-truth is preserved for auditors without requiring database migrations for every new client format.
* **Separation of Upload and Row:** By separating `DataUpload` from `ActivityRow`, analysts can easily see if an entire batch of data is anomalous (e.g., a corrupted file upload) versus just a single bad row.
* **Explicit Audit Logging:** Rather than making `ActivityRow` rows immutable and creating complex versioning logic, I chose a straightforward `AuditLog` table. This provides a clear, queryable history of who changed what and when, which is exactly what a carbon auditor looks for.