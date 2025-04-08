from rest_framework import serializers
from .models import Task
from memos.serializers import MemoSerializer


class TaskSerializer(serializers.ModelSerializer):
    memos = MemoSerializer(many=True, read_only=True)
    
    class Meta:
        model = Task
        fields = "__all__"
        read_only_fields = (
            "user",
            "created_at",
            "updated_at",
        )
