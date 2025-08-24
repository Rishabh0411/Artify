from rest_framework import serializers
from .models import Artwork, ArtworkImage, ArtworkLike
from core.serializers import UserProfileSerializer, CategorySerializer, TagSerializer

class ArtworkImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = ArtworkImage
        fields = ['id', 'image', 'alt_text', 'is_primary', 'order']


class ArtworkSerializer(serializers.ModelSerializer):
    artist = UserProfileSerializer(read_only=True)
    category = CategorySerializer(read_only=True)
    tags = TagSerializer(many=True, read_only=True)
    images = ArtworkImageSerializer(many=True, read_only=True)
    main_image = serializers.SerializerMethodField()
    is_liked = serializers.SerializerMethodField()
    is_in_cart = serializers.SerializerMethodField()

    class Meta:
        model = Artwork
        fields = [
            'id', 'title', 'description', 'artist', 'category', 'tags',
            'medium', 'dimensions', 'year_created', 'condition',
            'price', 'availability', 'is_featured', 'slug',
            'likes_count', 'views_count', 'images', 'main_image',
            'is_liked', 'is_in_cart', 'is_published', 'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'slug', 'likes_count', 'views_count', 'created_at', 'updated_at']

    def get_main_image(self, obj):
        request = self.context.get('request')
        main_image = obj.get_main_image()
        if main_image and request:
            return request.build_absolute_uri(main_image)
        return main_image

    def get_is_liked(self, obj):
        request = self.context.get('request')
        if request and request.user.is_authenticated:
            return ArtworkLike.objects.filter(user=request.user, artwork=obj).exists()
        return False

    def get_is_in_cart(self, obj):
        request = self.context.get('request')
        if request and request.user.is_authenticated:
            from orders.models import CartItem
            return CartItem.objects.filter(cart__user=request.user, artwork=obj).exists()
        return False


class ArtworkCreateUpdateSerializer(serializers.ModelSerializer):
    images = ArtworkImageSerializer(many=True, read_only=True)
    uploaded_images = serializers.ListField(
        child=serializers.ImageField(), write_only=True, required=False
    )

    class Meta:
        model = Artwork
        fields = [
            'title', 'description', 'category', 'medium', 'dimensions',
            'year_created', 'condition', 'price', 'availability',
            'tags', 'images', 'uploaded_images'
        ]

    def create(self, validated_data):
        uploaded_images = validated_data.pop('uploaded_images', [])
        tags_data = validated_data.pop('tags', [])
        
        artwork = Artwork.objects.create(**validated_data)
        artwork.tags.set(tags_data)
        
        for i, image in enumerate(uploaded_images):
            ArtworkImage.objects.create(
                artwork=artwork,
                image=image,
                is_primary=(i == 0),
                order=i
            )
        
        return artwork

    def update(self, instance, validated_data):
        uploaded_images = validated_data.pop('uploaded_images', [])
        tags_data = validated_data.pop('tags', [])
        
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()
        
        if tags_data:
            instance.tags.set(tags_data)
        
        if uploaded_images:
            # Add new images
            existing_count = instance.images.count()
            for i, image in enumerate(uploaded_images):
                ArtworkImage.objects.create(
                    artwork=instance,
                    image=image,
                    is_primary=(existing_count == 0 and i == 0),
                    order=existing_count + i
                )
        
        return instance
