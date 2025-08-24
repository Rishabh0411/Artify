from django.db import models
from django.core.validators import MinValueValidator, MaxValueValidator
from decimal import Decimal
import uuid
from core.models import CustomUser, Category, Tag

class Artwork(models.Model):
    AVAILABILITY_CHOICES = [
        ('for_sale', 'For Sale'),
        ('sold', 'Sold'),
        ('not_for_sale', 'Not for Sale'),
        ('on_hold', 'On Hold'),
    ]

    CONDITION_CHOICES = [
        ('excellent', 'Excellent'),
        ('very_good', 'Very Good'),
        ('good', 'Good'),
        ('fair', 'Fair'),
    ]

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    title = models.CharField(max_length=200)
    description = models.TextField()
    artist = models.ForeignKey(CustomUser, on_delete=models.CASCADE, related_name='artworks')
    category = models.ForeignKey(Category, on_delete=models.SET_NULL, null=True, blank=True)
    tags = models.ManyToManyField(Tag, blank=True)
    
    # Artwork details
    medium = models.CharField(max_length=100)
    dimensions = models.CharField(max_length=100)  # e.g., "24 x 36 inches"
    year_created = models.IntegerField()
    condition = models.CharField(max_length=20, choices=CONDITION_CHOICES, default='excellent')
    
    # Pricing and availability
    price = models.DecimalField(max_digits=10, decimal_places=2, validators=[MinValueValidator(Decimal('0.01'))])
    availability = models.CharField(max_length=20, choices=AVAILABILITY_CHOICES, default='for_sale')
    is_featured = models.BooleanField(default=False)
    
    # SEO and metadata
    slug = models.SlugField(unique=True, blank=True)
    
    # Engagement
    likes_count = models.PositiveIntegerField(default=0)
    views_count = models.PositiveIntegerField(default=0)
    
    # Status
    is_published = models.BooleanField(default=True)
    is_approved = models.BooleanField(default=True)  # Admin approval
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-created_at']
        indexes = [
            models.Index(fields=['availability', 'is_published']),
            models.Index(fields=['artist', 'availability']),
            models.Index(fields=['category', 'availability']),
        ]

    def __str__(self):
        return f"{self.title} by {self.artist.full_name}"

    def save(self, *args, **kwargs):
        if not self.slug:
            from django.utils.text import slugify
            import uuid
            self.slug = f"{slugify(self.title)}-{str(uuid.uuid4())[:8]}"
        super().save(*args, **kwargs)

    @property
    def is_available(self):
        return self.availability == 'for_sale' and self.is_published and self.is_approved

    def get_main_image(self):
        main_image = self.images.filter(is_primary=True).first()
        return main_image.image.url if main_image else None


class ArtworkImage(models.Model):
    artwork = models.ForeignKey(Artwork, on_delete=models.CASCADE, related_name='images')
    image = models.ImageField(upload_to='artwork_images/')
    alt_text = models.CharField(max_length=200, blank=True)
    is_primary = models.BooleanField(default=False)
    order = models.PositiveIntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['order', 'created_at']

    def __str__(self):
        return f"Image for {self.artwork.title}"

    def save(self, *args, **kwargs):
        if self.is_primary:
            # Ensure only one primary image per artwork
            ArtworkImage.objects.filter(artwork=self.artwork, is_primary=True).update(is_primary=False)
        super().save(*args, **kwargs)


class ArtworkLike(models.Model):
    user = models.ForeignKey(CustomUser, on_delete=models.CASCADE)
    artwork = models.ForeignKey(Artwork, on_delete=models.CASCADE, related_name='likes')
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('user', 'artwork')

    def __str__(self):
        return f"{self.user.full_name} likes {self.artwork.title}"


class ArtworkView(models.Model):
    user = models.ForeignKey(CustomUser, on_delete=models.CASCADE, null=True, blank=True)
    artwork = models.ForeignKey(Artwork, on_delete=models.CASCADE, related_name='artwork_views')
    ip_address = models.GenericIPAddressField()
    user_agent = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('user', 'artwork', 'ip_address')

    def __str__(self):
        return f"View of {self.artwork.title}"