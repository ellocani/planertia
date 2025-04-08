from rest_framework import serializers
from django.contrib.auth import get_user_model
from categories.models import Category


User = get_user_model()


class UserSignupSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)

    class Meta:
        model = User
        fields = [
            "email",
            "username",
            "password",
        ]

    def create(self, validated_data):
        user = User(
            email=validated_data["email"],
            username=validated_data["username"],
        )
        user.set_password(validated_data["password"])
        user.save()

        Category.objects.create(
            user=user,
            name="할 일",
            description="기본 카테고리",
        )
        
        return user
