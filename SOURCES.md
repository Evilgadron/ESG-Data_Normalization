## 1. SAP (Fuel & Procurement)
* [cite_start]**Researched Format:** SAP IDoc (Intermediate Document) and Flat File exports[cite: 25].
* [cite_start]**Learning:** SAP exports often use German headers (e.g., `Menge` for Quantity) and non-standard date formats (YYYYMMDD)[cite: 26].
* [cite_start]**Sample Data Strategy:** My sample data uses a "Flat File" structure with inconsistent units (Liters vs. Gallons) to test the normalization engine's ability to handle "unfriendly" enterprise data[cite: 25, 27].

## 2. Utility Data (Electricity)
* [cite_start]**Researched Format:** Green Button Standard (XML/CSV) and Portal Exports[cite: 29].
* [cite_start]**Learning:** Billing periods rarely align with calendar months, requiring pro-rata calculations[cite: 30].
* **Sample Data Strategy:** Focused on CSV portal exports as they are the most common way facilities teams pull data manually.

## 3. Corporate Travel (Flights/Hotels)
* [cite_start]**Researched Format:** SAP Concur / Navan API structures[cite: 31, 32].
* [cite_start]**Learning:** Flights often omit distance (km) and only provide IATA airport codes (e.g., JFK to LHR), necessitating a lookup table for distance[cite: 33].
* [cite_start]**Sample Data Strategy:** Provided JSON payloads mimicking API responses to demonstrate handling of Ground vs. Air transport categories[cite: 32, 34].