# api/services.py
def process_sap_row(raw_row_dict, upload_instance):
    """
    Expects a dict like: {'Werk': 'P001', 'Datum': '24.05.2026', 'Menge': '500', 'ME': 'L', 'Kraftstoffart': 'Diesel'}
    """
    # 1. Extract Raw Data
    quantity = float(raw_row_dict.get('Menge', 0))
    unit = raw_row_dict.get('ME', '').upper()
    fuel_type = raw_row_dict.get('Kraftstoffart', '').lower()
    
    # 2. Normalization Rules
    normalized_qty = quantity
    if unit == 'GAL':
        normalized_qty = quantity * 3.78541  # Convert Gallons to Liters
        
    # 3. Emission Factors (Hardcoded for prototype)
    emission_factors = {
        'diesel': 2.68, # kg CO2e per Liter
        'benzin': 2.31  # Gasoline
    }
    ef = emission_factors.get(fuel_type, 0)
    
    # Mathematical calculation: Emissions = Volume(L) * EF
    emissions = normalized_qty * ef
    
    # 4. The "Suspicious" Logic
    status = 'PENDING'
    if normalized_qty > 10000: # Flag abnormally high fuel purchases
        status = 'FLAGGED'
        
    # 5. Save the Activity Row
    from .models import ActivityRow
    return ActivityRow.objects.create(
        upload=upload_instance,
        scope=1,
        raw_data=raw_row_dict,
        normalized_value=normalized_qty,
        normalized_unit='L',
        emissions_kg_co2e=emissions,
        status=status
    )