from django.contrib import admin
from .models import Cart, CartItem, Wishlist, WishlistItem, Order, OrderItem, Payment, Review

class CartItemInline(admin.TabularInline):
    model = CartItem
    extra = 0
    readonly_fields = ('added_at',)

@admin.register(Cart)
class CartAdmin(admin.ModelAdmin):
    list_display = ('user', 'total_items', 'total_amount', 'updated_at')
    search_fields = ('user__email', 'user__first_name', 'user__last_name')
    readonly_fields = ('created_at', 'updated_at')
    inlines = [CartItemInline]

class WishlistItemInline(admin.TabularInline):
    model = WishlistItem
    extra = 0
    readonly_fields = ('added_at',)

@admin.register(Wishlist)
class WishlistAdmin(admin.ModelAdmin):
    list_display = ('user', 'total_items', 'updated_at')
    search_fields = ('user__email', 'user__first_name', 'user__last_name')
    readonly_fields = ('created_at', 'updated_at')
    inlines = [WishlistItemInline]

class OrderItemInline(admin.TabularInline):
    model = OrderItem
    extra = 0
    readonly_fields = ('created_at', 'artist_earnings')

@admin.register(Order)
class OrderAdmin(admin.ModelAdmin):
    list_display = ('order_number', 'buyer', 'status', 'payment_status', 'total_amount', 'created_at')
    list_filter = ('status', 'payment_status', 'created_at')
    search_fields = ('order_number', 'buyer__email', 'buyer__first_name', 'buyer__last_name')
    list_editable = ('status',)
    readonly_fields = ('order_number', 'created_at', 'updated_at')
    inlines = [OrderItemInline]
    
    fieldsets = (
        ('Order Information', {
            'fields': ('order_number', 'buyer', 'status', 'payment_status')
        }),
        ('Pricing', {
            'fields': ('subtotal', 'tax_amount', 'shipping_amount', 'total_amount')
        }),
        ('Shipping Address', {
            'fields': (
                'shipping_first_name', 'shipping_last_name', 'shipping_email', 'shipping_phone',
                'shipping_address_line_1', 'shipping_address_line_2', 'shipping_city',
                'shipping_state', 'shipping_postal_code', 'shipping_country'
            )
        }),
        ('Notes & Tracking', {
            'fields': ('notes', 'tracking_number'),
            'classes': ('collapse',)
        }),
        ('Timestamps', {
            'fields': ('created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )

@admin.register(OrderItem)
class OrderItemAdmin(admin.ModelAdmin):
    list_display = ('order', 'artwork', 'artist', 'price', 'artist_earnings', 'created_at')
    list_filter = ('created_at',)
    search_fields = ('order__order_number', 'artwork__title', 'artist__first_name', 'artist__last_name')
    readonly_fields = ('artist_earnings', 'created_at')

@admin.register(Payment)
class PaymentAdmin(admin.ModelAdmin):
    list_display = ('order', 'amount', 'payment_method', 'status', 'transaction_id', 'created_at')
    list_filter = ('payment_method', 'status', 'created_at')
    search_fields = ('order__order_number', 'transaction_id')
    readonly_fields = ('created_at', 'updated_at')

@admin.register(Review)
class ReviewAdmin(admin.ModelAdmin):
    list_display = ('artwork', 'reviewer', 'rating', 'is_verified', 'is_published', 'created_at')
    list_filter = ('rating', 'is_verified', 'is_published', 'created_at')
    search_fields = ('artwork__title', 'reviewer__email', 'title', 'content')
    list_editable = ('is_published',)
    readonly_fields = ('is_verified', 'created_at', 'updated_at')
    
    fieldsets = (
        ('Review Information', {
            'fields': ('reviewer', 'artwork', 'artist', 'rating', 'title', 'content')
        }),
        ('Status', {
            'fields': ('is_verified', 'is_published')
        }),
        ('Timestamps', {
            'fields': ('created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )