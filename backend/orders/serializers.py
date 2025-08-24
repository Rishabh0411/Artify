from rest_framework import serializers
from .models import Cart, CartItem, Wishlist, WishlistItem, Order, OrderItem, Payment, Review
from artworks.serializers import ArtworkSerializer

class CartItemSerializer(serializers.ModelSerializer):
    artwork = ArtworkSerializer(read_only=True)

    class Meta:
        model = CartItem
        fields = ['id', 'artwork', 'added_at']


class CartSerializer(serializers.ModelSerializer):
    items = CartItemSerializer(many=True, read_only=True)
    total_items = serializers.ReadOnlyField()
    total_amount = serializers.ReadOnlyField()

    class Meta:
        model = Cart
        fields = ['id', 'items', 'total_items', 'total_amount', 'updated_at']


class WishlistItemSerializer(serializers.ModelSerializer):
    artwork = ArtworkSerializer(read_only=True)

    class Meta:
        model = WishlistItem
        fields = ['id', 'artwork', 'added_at']


class WishlistSerializer(serializers.ModelSerializer):
    items = WishlistItemSerializer(many=True, read_only=True)
    total_items = serializers.ReadOnlyField()

    class Meta:
        model = Wishlist
        fields = ['id', 'items', 'total_items', 'updated_at']


class OrderItemSerializer(serializers.ModelSerializer):
    artwork = ArtworkSerializer(read_only=True)
    artist_name = serializers.CharField(source='artist.full_name', read_only=True)

    class Meta:
        model = OrderItem
        fields = ['id', 'artwork', 'price', 'artist', 'artist_name', 'artist_earnings']


class OrderSerializer(serializers.ModelSerializer):
    items = OrderItemSerializer(many=True, read_only=True)
    buyer_name = serializers.CharField(source='buyer.full_name', read_only=True)

    class Meta:
        model = Order
        fields = [
            'id', 'order_number', 'buyer', 'buyer_name', 'status', 'payment_status',
            'subtotal', 'tax_amount', 'shipping_amount', 'total_amount',
            'shipping_first_name', 'shipping_last_name', 'shipping_email', 'shipping_phone',
            'shipping_address_line_1', 'shipping_address_line_2', 'shipping_city',
            'shipping_state', 'shipping_postal_code', 'shipping_country',
            'notes', 'tracking_number', 'items', 'created_at', 'updated_at'
        ]


class OrderCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Order
        fields = [
            'shipping_first_name', 'shipping_last_name', 'shipping_email', 'shipping_phone',
            'shipping_address_line_1', 'shipping_address_line_2', 'shipping_city',
            'shipping_state', 'shipping_postal_code', 'shipping_country',
            'billing_first_name', 'billing_last_name', 'billing_email', 'billing_phone',
            'billing_address_line_1', 'billing_address_line_2', 'billing_city',
            'billing_state', 'billing_postal_code', 'billing_country',
            'notes'
        ]


class PaymentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Payment
        fields = ['id', 'order', 'amount', 'payment_method', 'status', 'transaction_id', 'created_at']


class ReviewSerializer(serializers.ModelSerializer):
    reviewer_name = serializers.CharField(source='reviewer.full_name', read_only=True)
    artwork_title = serializers.CharField(source='artwork.title', read_only=True)

    class Meta:
        model = Review
        fields = [
            'id', 'rating', 'title', 'content', 'reviewer', 'reviewer_name',
            'artwork', 'artwork_title', 'is_verified', 'created_at'
        ]
        read_only_fields = ['id', 'reviewer', 'artwork', 'is_verified', 'created_at']