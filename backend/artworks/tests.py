from django.test import TestCase
from rest_framework.test import APITestCase, APIClient
from rest_framework import status
from django.contrib.auth import get_user_model
from rest_framework.authtoken.models import Token
from django.urls import reverse
from django.core.files.uploadedfile import SimpleUploadedFile
from .models import Artwork, ArtworkImage, ArtworkLike, ArtworkView, ArtworkCollection
from core.models import Category, Tag
from decimal import Decimal
import tempfile
from PIL import Image
import io

User = get_user_model()


class ArtworkModelTest(TestCase):
    """Test Artwork model functionality"""

    def setUp(self):
        self.user = User.objects.create_user(
            username='artist1',
            email='artist@example.com',
            password='testpass123',
            user_type='artist'
        )
        self.category = Category.objects.create(name='Paintings')
        self.tag = Tag.objects.create(name='Abstract')

    def test_create_artwork(self):
        artwork = Artwork.objects.create(
            title='Test Artwork',
            description='A beautiful test artwork',
            artist=self.user,
            category=self.category,
            medium='Oil on Canvas',
            dimensions='24x36 inches',
            year_created=2023,
            price=Decimal('500.00')
        )
        artwork.tags.add(self.tag)
        
        self.assertEqual(str(artwork), f"Test Artwork by {self.user.full_name}")
        self.assertTrue(artwork.is_available)
        self.assertTrue(artwork.slug)
        self.assertEqual(artwork.average_rating, 0.0)
        self.assertEqual(artwork.review_count, 0)

    def test_artwork_availability_property(self):
        artwork = Artwork.objects.create(
            title='Test Artwork',
            description='A test artwork',
            artist=self.user,
            medium='Digital',
            dimensions='1920x1080 pixels',
            year_created=2023,
            price=Decimal('100.00'),
            availability='sold'
        )
        self.assertFalse(artwork.is_available)

    def test_artwork_slug_generation(self):
        artwork = Artwork.objects.create(
            title='My Amazing Artwork',
            description='A test artwork',
            artist=self.user,
            medium='Digital',
            dimensions='1920x1080 pixels',
            year_created=2023,
            price=Decimal('100.00')
        )
        self.assertTrue('my-amazing-artwork' in artwork.slug)


class ArtworkAPITest(APITestCase):
    """Test Artwork API endpoints"""

    def setUp(self):
        self.client = APIClient()
        self.artist = User.objects.create_user(
            username='artist1',
            email='artist@example.com',
            password='testpass123',
            user_type='artist'
        )
        self.buyer = User.objects.create_user(
            username='buyer1',
            email='buyer@example.com',
            password='testpass123',
            user_type='buyer'
        )
        self.category = Category.objects.create(name='Paintings')
        self.artwork = Artwork.objects.create(
            title='Test Artwork',
            description='A beautiful test artwork',
            artist=self.artist,
            category=self.category,
            medium='Oil on Canvas',
            dimensions='24x36 inches',
            year_created=2023,
            price=Decimal('500.00')
        )

    def test_artwork_list_api(self):
        url = reverse('artwork-list')
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data['results']), 1)

    def test_artwork_detail_api(self):
        url = reverse('artwork-detail', kwargs={'id': self.artwork.id})
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['title'], 'Test Artwork')

    def test_artwork_create_authenticated_artist(self):
        token = Token.objects.create(user=self.artist)
        self.client.credentials(HTTP_AUTHORIZATION='Token ' + token.key)
        
        url = reverse('artwork-create')
        data = {
            'title': 'New Artwork',
            'description': 'A new artwork',
            'medium': 'Watercolor',
            'dimensions': '12x16 inches',
            'year_created': 2023,
            'price': '250.00',
            'category': self.category.id
        }
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

    def test_artwork_create_unauthenticated(self):
        url = reverse('artwork-create')
        data = {
            'title': 'New Artwork',
            'description': 'A new artwork',
            'medium': 'Watercolor',
            'dimensions': '12x16 inches',
            'year_created': 2023,
            'price': '250.00'
        }
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_artwork_like_api(self):
        token = Token.objects.create(user=self.buyer)
        self.client.credentials(HTTP_AUTHORIZATION='Token ' + token.key)
        
        url = reverse('artwork-like', kwargs={'id': self.artwork.id})
        response = self.client.post(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertTrue(ArtworkLike.objects.filter(user=self.buyer, artwork=self.artwork).exists())

    def test_artwork_unlike_api(self):
        # First like the artwork
        ArtworkLike.objects.create(user=self.buyer, artwork=self.artwork)
        
        token = Token.objects.create(user=self.buyer)
        self.client.credentials(HTTP_AUTHORIZATION='Token ' + token.key)
        
        url = reverse('artwork-like', kwargs={'id': self.artwork.id})
        response = self.client.delete(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertFalse(ArtworkLike.objects.filter(user=self.buyer, artwork=self.artwork).exists())


class ArtworkImageTest(TestCase):
    """Test ArtworkImage model"""

    def setUp(self):
        self.user = User.objects.create_user(
            username='artist1',
            email='artist@example.com',
            password='testpass123',
            user_type='artist'
        )
        self.artwork = Artwork.objects.create(
            title='Test Artwork',
            description='A test artwork',
            artist=self.user,
            medium='Digital',
            dimensions='1920x1080 pixels',
            year_created=2023,
            price=Decimal('100.00')
        )

    def create_test_image(self):
        """Create a test image file"""
        image = Image.new('RGB', (100, 100), color='red')
        temp_file = io.BytesIO()
        image.save(temp_file, format='JPEG')
        temp_file.seek(0)
        return SimpleUploadedFile(
            "test.jpg", 
            temp_file.getvalue(), 
            content_type="image/jpeg"
        )

    def test_create_artwork_image(self):
        test_image = self.create_test_image()
        artwork_image = ArtworkImage.objects.create(
            artwork=self.artwork,
            image=test_image,
            alt_text='Test image',
            is_primary=True
        )
        self.assertEqual(str(artwork_image), f"Image for {self.artwork.title}")
        self.assertTrue(artwork_image.is_primary)

    def test_primary_image_uniqueness(self):
        """Test that only one image can be primary per artwork"""
        test_image1 = self.create_test_image()
        test_image2 = self.create_test_image()
        
        # Create first primary image
        image1 = ArtworkImage.objects.create(
            artwork=self.artwork,
            image=test_image1,
            is_primary=True
        )
        
        # Create second primary image
        image2 = ArtworkImage.objects.create(
            artwork=self.artwork,
            image=test_image2,
            is_primary=True
        )
        
        # Refresh from database
        image1.refresh_from_db()
        
        # Only the second image should be primary
        self.assertFalse(image1.is_primary)
        self.assertTrue(image2.is_primary)


class ArtworkCollectionTest(TestCase):
    """Test ArtworkCollection model"""

    def setUp(self):
        self.user = User.objects.create_user(
            username='collector',
            email='collector@example.com',
            password='testpass123'
        )
        self.artist = User.objects.create_user(
            username='artist1',
            email='artist@example.com',
            password='testpass123',
            user_type='artist'
        )
        self.artwork = Artwork.objects.create(
            title='Test Artwork',
            description='A test artwork',
            artist=self.artist,
            medium='Digital',
            dimensions='1920x1080 pixels',
            year_created=2023,
            price=Decimal('100.00')
        )

    def test_create_collection(self):
        collection = ArtworkCollection.objects.create(
            user=self.user,
            name='My Favorites',
            description='My favorite artworks'
        )
        collection.artworks.add(self.artwork)
        
        self.assertEqual(str(collection), f"My Favorites by {self.user.full_name}")
        self.assertIn(self.artwork, collection.artworks.all())

    def test_collection_unique_constraint(self):
        """Test that user cannot have duplicate collection names"""
        ArtworkCollection.objects.create(
            user=self.user,
            name='My Collection'
        )
        
        # This should raise an error due to unique_together constraint
        with self.assertRaises(Exception):
            ArtworkCollection.objects.create(
                user=self.user,
                name='My Collection'
            )
