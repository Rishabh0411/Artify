from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import CustomUser, Category, Tag

@admin.register(CustomUser)
class CustomUserAdmin(UserAdmin):
    list_display = ('email', 'username', 'first_name', 'last_name', 'user_type', 'is_verified_artist', 'is_staff')
    list_filter = ('user_type', 'is_verified_artist', 'is_staff', 'is_active', 'date_joined')
    search_fields = ('email', 'username', 'first_name', 'last_name')
    ordering = ('-date_joined',)
    
    fieldsets = UserAdmin.fieldsets + (
        ('Profile Info', {
            'fields': ('user_type', 'phone', 'profile_picture', 'bio', 'date_of_birth')
        }),
        ('Address', {
            'fields': ('address_line_1', 'address_line_2', 'city', 'state', 'postal_code', 'country')
        }),
        ('Artist Info', {
            'fields': ('artist_statement', 'website', 'instagram', 'twitter', 'is_verified_artist'),
            'classes': ('collapse',)
        }),
    )
    
    add_fieldsets = UserAdmin.add_fieldsets + (
        ('Profile Info', {
            'fields': ('email', 'user_type', 'first_name', 'last_name')
        }),
    )

@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    list_display = ('name', 'is_active', 'artwork_count', 'created_at')
    list_filter = ('is_active', 'created_at')
    search_fields = ('name', 'description')
    prepopulated_fields = {'name': ('name',)}

    def artwork_count(self, obj):
        return obj.artwork_set.count()
    artwork_count.short_description = 'Artworks'

@admin.register(Tag)
class TagAdmin(admin.ModelAdmin):
    list_display = ('name', 'artwork_count', 'created_at')
    search_fields = ('name',)

    def artwork_count(self, obj):
        return obj.artwork_set.count()
    artwork_count.short_description = 'Artworks'
