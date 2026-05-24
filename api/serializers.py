from rest_framework import serializers
from .models import ActivityRow

class ActivityRowSerializer(serializers.ModelSerializer):
    class Meta:
        model = ActivityRow
        fields = '__all__'