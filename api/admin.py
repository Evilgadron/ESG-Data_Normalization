from django.contrib import admin
from .models import Organization, DataUpload, ActivityRow, AuditLog

admin.site.register(Organization)
admin.site.register(DataUpload)
admin.site.register(ActivityRow)
admin.site.register(AuditLog)