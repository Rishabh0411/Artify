from django.contrib import admin
from .models import Artwork, ArtworkImage, ArtworkLike, ArtworkView

class ArtworkImageInline(admin.TabularInline):
    model = ArtworkImage
    extra = 1
    fields = ('image', 'alt_text', 'is_primary', 'order')

@admin.register(Artwork)
class ArtworkAdmin(admin.ModelAdmin):
    list_display = ['title', 'artist', 'is_featured', 'availability', 'is_published', 'is_approved', 'price', 'created_at']
    list_editable = ['is_featured', 'availability', 'is_published', 'is_approved', 'price']
    list_filter = ['category', 'is_published', 'is_approved', 'is_featured', 'availability', 'created_at']
    search_fields = ['title', 'artist__username', 'description']
    list_editable = ('is_featured', 'availability', 'is_published', 'is_approved')
    readonly_fields = ('slug', 'likes_count', 'views_count', 'created_at', 'updated_at')
    filter_horizontal = ('tags',)
    inlines = [ArtworkImageInline]
    
    fieldsets = (
        ('Basic Information', {
            'fields': ('title', 'description', 'artist', 'category', 'tags')
        }),
        ('Artwork Details', {
            'fields': ('medium', 'dimensions', 'year_created', 'condition')
        }),
        ('Pricing & Availability', {
            'fields': ('price', 'availability', 'is_featured')
        }),
        ('Status', {
            'fields': ('is_published', 'is_approved')
        }),
        ('SEO', {
            'fields': ('slug',),
            'classes': ('collapse',)
        }),
        ('Statistics', {
            'fields': ('likes_count', 'views_count'),
            'classes': ('collapse',)
        }),
        ('Timestamps', {
            'fields': ('created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )

    def get_queryset(self, request):
        return super().get_queryset(request).select_related('artist', 'category')

@admin.register(ArtworkImage)
class ArtworkImageAdmin(admin.ModelAdmin):
    list_display = ('artwork', 'is_primary', 'order', 'created_at')
    list_filter = ('is_primary', 'created_at')
    search_fields = ('artwork__title', 'alt_text')

@admin.register(ArtworkLike)
class ArtworkLikeAdmin(admin.ModelAdmin):
    list_display = ('user', 'artwork', 'created_at')
    list_filter = ('created_at',)
    search_fields = ('user__email', 'artwork__title')

@admin.register(ArtworkView)
class ArtworkViewAdmin(admin.ModelAdmin):
    list_display = ('artwork', 'user', 'ip_address', 'created_at')
    list_filter = ('created_at',)
    search_fields = ('artwork__title', 'user__email', 'ip_address')
    readonly_fields = ('user', 'artwork', 'ip_address', 'user_agent', 'created_at')

