from django.db import models
from django.contrib.contenttypes.models import ContentType
from django.contrib.contenttypes.fields import GenericForeignKey
from core.models import CustomUser
import uuid


class Notification(models.Model):
    NOTIFICATION_TYPES = [
        ('new_artwork', 'New Artwork'),
        ('artwork_sold', 'Artwork Sold'),
        ('new_follower', 'New Follower'),
        ('new_review', 'New Review'),
        ('order_update', 'Order Update'),
        ('artwork_liked', 'Artwork Liked'),
        ('price_drop', 'Price Drop'),
        ('system', 'System Notification'),
    ]

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    recipient = models.ForeignKey(CustomUser, on_delete=models.CASCADE, related_name='notifications')
    sender = models.ForeignKey(CustomUser, on_delete=models.CASCADE, null=True, blank=True, related_name='sent_notifications')
    
    notification_type = models.CharField(max_length=20, choices=NOTIFICATION_TYPES)
    title = models.CharField(max_length=200)
    message = models.TextField()
    
    # Generic foreign key to link to any model
    content_type = models.ForeignKey(ContentType, on_delete=models.CASCADE, null=True, blank=True)
    object_id = models.CharField(max_length=100, null=True, blank=True)
    content_object = GenericForeignKey('content_type', 'object_id')
    
    is_read = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-created_at']
        indexes = [
            models.Index(fields=['recipient', 'is_read']),
            models.Index(fields=['created_at']),
        ]

    def __str__(self):
        return f"{self.title} - {self.recipient.full_name}"

    def mark_as_read(self):
        self.is_read = True
        self.save()


class NotificationPreference(models.Model):
    """User preferences for different types of notifications"""
    user = models.OneToOneField(CustomUser, on_delete=models.CASCADE, related_name='notification_preferences')
    
    # Email notifications
    email_new_artwork = models.BooleanField(default=True)
    email_artwork_sold = models.BooleanField(default=True)
    email_new_follower = models.BooleanField(default=True)
    email_new_review = models.BooleanField(default=True)
    email_order_update = models.BooleanField(default=True)
    email_artwork_liked = models.BooleanField(default=False)
    email_price_drop = models.BooleanField(default=True)
    email_system = models.BooleanField(default=True)
    
    # In-app notifications
    app_new_artwork = models.BooleanField(default=True)
    app_artwork_sold = models.BooleanField(default=True)
    app_new_follower = models.BooleanField(default=True)
    app_new_review = models.BooleanField(default=True)
    app_order_update = models.BooleanField(default=True)
    app_artwork_liked = models.BooleanField(default=True)
    app_price_drop = models.BooleanField(default=True)
    app_system = models.BooleanField(default=True)
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"Notification preferences for {self.user.full_name}"


class UserFollow(models.Model):
    """Artist following system"""
    follower = models.ForeignKey(CustomUser, on_delete=models.CASCADE, related_name='following')
    following = models.ForeignKey(CustomUser, on_delete=models.CASCADE, related_name='followers')
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('follower', 'following')

    def __str__(self):
        return f"{self.follower.full_name} follows {self.following.full_name}"

    def save(self, *args, **kwargs):
        # Prevent self-following
        if self.follower == self.following:
            raise ValueError("Users cannot follow themselves")
        super().save(*args, **kwargs)
