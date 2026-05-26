# Data Architecture & Audit Strategy

## Overview
The architecture relies on a "Preservation-First" philosophy. To satisfy auditor requirements for an immutable ledger, we never discard the original "messy" data. Instead, we store it alongside the normalized output.

## Core Schema
### 1. Organization (Multi-Tenancy)
Ensures data isolation between different enterprise clients.
* `id`: UUID (Primary Key)
* `name`: CharField

### 2. DataUpload (Source-of-Truth Tracking)
Tracks the exact event of data entering the system.
* `id`: UUID (PK)
* `organization`: ForeignKey -> Organization
* `source_type`: CharField (SAP, UTILITY, TRAVEL)
* `uploaded_at`: DateTimeField

### 3. ActivityRow (Normalization & Review)
The primary engine for carbon accounting.
* `scope`: IntegerField (1, 2, or 3)
* `raw_data`: JSONField (Stores the original SAP/Utility/Concur row exactly as ingested)
* `normalized_value`: FloatField (Standardized to Liter, kWh, or km)
* `normalized_unit`: CharField
* `emissions_kg_co2e`: FloatField ($Value \times Emission Factor$)
* `status`: Enum (PENDING, FLAGGED, APPROVED)

### 4. AuditLog (The Audit Trail)
Records every manual intervention by an analyst.
* `activity_row`: ForeignKey -> ActivityRow
* `field_changed`: CharField (e.g., 'status' or 'normalized_value')
* `old_value` / `new_value`: CharField
* `action_timestamp`: DateTimeField

## Defense of Design Decisions
* **JSONField for `raw_data`:** Instead of 50+ nullable columns for every possible SAP header or travel API field, a JSONField captures "realistic shapes" without schema bloat.
* **Decoupled Audit Logs:** Keeping logs in a separate table ensures that the `ActivityRow` table remains performant for the dashboard while providing a complete "Source of Truth" for auditors.
