from django.urls import path
from .views import SAPUploadView, ActivityRowListView, ApproveRowView

urlpatterns = [
    path('upload/sap/', SAPUploadView.as_view(), name='sap-upload'),
    path('rows/', ActivityRowListView.as_view(), name='row-list'),
    path('rows/<uuid:pk>/approve/', ApproveRowView.as_view(), name='approve-row'), 
]