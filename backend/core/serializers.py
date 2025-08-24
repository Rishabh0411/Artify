from rest_framework import serializers
from django.contrib.auth import authenticate
from django.contrib.auth.password_validation import validate_password
from .models import CustomUser, Category, Tag

class UserRegistrationSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, validators=[validate_password])
    password_confirm = serializers.CharField(write_only=True)

    class Meta:
        model = CustomUser
        fields = ['email', 'username', 'first_name', 'last_name', 'password', 'password_confirm', 'user_type']

    def validate(self, attrs):
        if attrs['password'] != attrs['password_confirm']:
            raise serializers.ValidationError("Passwords don't match")
        return attrs

    def create(self, validated_data):
        validated_data.pop('password_confirm')
        user = CustomUser.objects.create_user(**validated_data)
        return user


class UserLoginSerializer(serializers.Serializer):
    email = serializers.EmailField()
    password = serializers.CharField()

    def validate(self, attrs):
        email = attrs.get('email')
        password = attrs.get('password')

        if email and password:
            user = authenticate(username=email, password=password)
            if not user:
                raise serializers.ValidationError('Invalid credentials')
            if not user.is_active:
                raise serializers.ValidationError('User account is disabled')
            attrs['user'] = user
        else:
            raise serializers.ValidationError('Must include email and password')
        return attrs


class UserProfileSerializer(serializers.ModelSerializer):
    full_name = serializers.ReadOnlyField()
    artworks_count = serializers.SerializerMethodField()
    orders_count = serializers.SerializerMethodField()

    class Meta:
        model = CustomUser
        fields = [
            'id', 'email', 'username', 'first_name', 'last_name', 'full_name',
            'user_type', 'phone', 'profile_picture', 'bio', 'date_of_birth',
            'address_line_1', 'address_line_2', 'city', 'state', 'postal_code', 'country',
            'artist_statement', 'website', 'instagram', 'twitter', 'is_verified_artist',
            'artworks_count', 'orders_count', 'created_at'
        ]
        read_only_fields = ['id', 'email', 'is_verified_artist', 'created_at']

    def get_artworks_count(self, obj):
        if obj.is_artist():
            return obj.artworks.filter(is_published=True).count()
        return 0

    def get_orders_count(self, obj):
        return obj.orders.count()


class CategorySerializer(serializers.ModelSerializer):
    artworks_count = serializers.SerializerMethodField()

    class Meta:
        model = Category
        fields = ['id', 'name', 'description', 'artworks_count', 'is_active']

    def get_artworks_count(self, obj):
        return obj.artwork_set.filter(is_published=True, availability='for_sale').count()


class TagSerializer(serializers.ModelSerializer):
    class Meta:
        model = Tag
        fields = ['id', 'name']
