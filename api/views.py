from rest_framework.views import APIView
from rest_framework.response import Response
from .models import Organization, DataUpload
from .services import process_sap_row
from .serializers import ActivityRowSerializer
from rest_framework import status
from django.utils import timezone
from .models import ActivityRow, AuditLog
import csv
import io

class SAPUploadView(APIView):
    def post(self, request):
        # 1. Setup default context for prototype
        org, _ = Organization.objects.get_or_create(name="Acme Corp")
        upload = DataUpload.objects.create(
            organization=org, 
            source_type='SAP', 
            original_file_name='upload.csv'
        )
        
        # 2. Parse CSV
        file_obj = request.FILES['file']
        decoded_file = file_obj.read().decode('utf-8')
        reader = csv.DictReader(io.StringIO(decoded_file))
        
        # 3. Process each row through the engine
        for row in reader:
            process_sap_row(row, upload)
            
        return Response({"status": "Success", "upload_id": upload.id})

class ActivityRowListView(APIView):
    def get(self, request):
        # Fetch all rows, newest first
        rows = ActivityRow.objects.all().order_by('-upload__uploaded_at')
        serializer = ActivityRowSerializer(rows, many=True)
        return Response(serializer.data)
    
class ApproveRowView(APIView):
    def post(self, request, pk):
        try:
            row = ActivityRow.objects.get(pk=pk)
            old_status = row.status
            
            # 1. Update the row
            row.status = 'APPROVED'
            row.reviewed_at = timezone.now()
            # If we had real auth hooked up, we'd do: row.reviewed_by = request.user
            row.save()
            
            # 2. Create the Audit Log
            AuditLog.objects.create(
                activity_row=row,
                field_changed='status',
                old_value=old_status,
                new_value='APPROVED'
            )
            
            return Response({"status": "Approved successfully"})
        except ActivityRow.DoesNotExist:
            return Response({"error": "Row not found"}, status=status.HTTP_404_NOT_FOUND)