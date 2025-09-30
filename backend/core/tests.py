from django.test import TestCase, Client
from django.urls import reverse
from rest_framework.test import APITestCase, APIClient
from rest_framework import status
from django.contrib.auth import get_user_model
from rest_framework.authtoken.models import Token
from .models import CustomUser, Category, Tag
from orders.models import Cart, Wishlist
import json

User = get_user_model()


class CustomUserModelTest(TestCase):
    """Test custom user model"""

    def setUp(self):
        self.user_data = {
            'username': 'testuser',
            'email': 'test@example.com',
            'password': 'testpass123',
            'first_name': 'Test',
            'last_name': 'User',
            'user_type': 'buyer'
        }

    def test_create_user(self):
        user = CustomUser.objects.create_user(**self.user_data)
        self.assertEqual(user.email, 'test@example.com')
        self.assertEqual(user.user_type, 'buyer')
        self.assertTrue(user.check_password('testpass123'))
        self.assertFalse(user.is_verified_artist)

    def test_create_artist_user(self):
        self.user_data['user_type'] = 'artist'
        user = CustomUser.objects.create_user(**self.user_data)
        self.assertEqual(user.user_type, 'artist')

    def test_user_full_name_property(self):
        user = CustomUser.objects.create_user(**self.user_data)
        self.assertEqual(user.full_name, 'Test User')

    def test_user_str_method(self):
        user = CustomUser.objects.create_user(**self.user_data)
        expected = f"Test User (test@example.com)"
        self.assertEqual(str(user), expected)


class UserAuthAPITest(APITestCase):
    """Test user authentication APIs"""

    def setUp(self):
        self.client = APIClient()
        self.register_url = reverse('register')
        self.login_url = reverse('login')
        self.profile_url = reverse('profile')
        
        self.user_data = {
            'username': 'testuser',
            'email': 'test@example.com',
            'password': 'testpass123',
            'first_name': 'Test',
            'last_name': 'User',
            'user_type': 'buyer'
        }

    def test_user_registration(self):
        response = self.client.post(self.register_url, self.user_data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertIn('token', response.data)
        self.assertIn('user', response.data)
        
        # Check if cart and wishlist were created
        user = CustomUser.objects.get(email='test@example.com')
        self.assertTrue(hasattr(user, 'cart'))
        self.assertTrue(hasattr(user, 'wishlist'))

    def test_user_registration_invalid_data(self):
        invalid_data = self.user_data.copy()
        invalid_data['email'] = 'invalid-email'
        response = self.client.post(self.register_url, invalid_data, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_user_login(self):
        # Create user first
        user = CustomUser.objects.create_user(**self.user_data)
        
        login_data = {
            'email': 'test@example.com',
            'password': 'testpass123'
        }
        response = self.client.post(self.login_url, login_data, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn('token', response.data)
        self.assertIn('user', response.data)

    def test_user_login_invalid_credentials(self):
        login_data = {
            'email': 'nonexistent@example.com',
            'password': 'wrongpass'
        }
        response = self.client.post(self.login_url, login_data, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_profile_access_authenticated(self):
        # Create user and token
        user = CustomUser.objects.create_user(**self.user_data)
        token = Token.objects.create(user=user)
        
        self.client.credentials(HTTP_AUTHORIZATION='Token ' + token.key)
        response = self.client.get(self.profile_url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['email'], 'test@example.com')

    def test_profile_access_unauthenticated(self):
        response = self.client.get(self.profile_url)
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)


class CategoryTagModelTest(TestCase):
    """Test Category and Tag models"""

    def test_create_category(self):
        category = Category.objects.create(
            name='Paintings',
            description='Traditional and modern paintings'
        )
        self.assertEqual(str(category), 'Paintings')
        self.assertTrue(category.slug)

    def test_create_tag(self):
        tag = Tag.objects.create(name='Abstract')
        self.assertEqual(str(tag), 'Abstract')
        self.assertTrue(tag.slug)
