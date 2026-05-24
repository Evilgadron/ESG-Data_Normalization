import uuid
from django.db import models
from django.contrib.auth.models import User

class Organization(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    name = models.CharField(max_length=255)

class DataUpload(models.Model):
    SOURCE_CHOICES = [('SAP', 'SAP'), ('UTILITY', 'Utility'), ('CONCUR', 'Concur')]
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    organization = models.ForeignKey(Organization, on_delete=models.CASCADE)
    source_type = models.CharField(max_length=20, choices=SOURCE_CHOICES)
    uploaded_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True)
    uploaded_at = models.DateTimeField(auto_now_add=True)
    original_file_name = models.CharField(max_length=255)

class ActivityRow(models.Model):
    STATUS_CHOICES = [('PENDING', 'Pending'), ('FLAGGED', 'Flagged'), ('APPROVED', 'Approved')]
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    upload = models.ForeignKey(DataUpload, on_delete=models.CASCADE, related_name='rows')
    scope = models.IntegerField(choices=[(1, 'Scope 1'), (2, 'Scope 2'), (3, 'Scope 3')])
    raw_data = models.JSONField() # Preserves the exact ugly row
    
    # Normalized fields
    normalized_value = models.FloatField(null=True)
    normalized_unit = models.CharField(max_length=50, null=True)
    emissions_kg_co2e = models.FloatField(null=True)
    
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='PENDING')
    reviewed_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, related_name='reviewed_rows')
    reviewed_at = models.DateTimeField(null=True, blank=True)

class AuditLog(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    activity_row = models.ForeignKey(ActivityRow, on_delete=models.CASCADE)
    edited_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True)
    edited_at = models.DateTimeField(auto_now_add=True)
    field_changed = models.CharField(max_length=255)
    old_value = models.CharField(max_length=255)
    new_value = models.CharField(max_length=255)