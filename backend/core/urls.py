from django.urls import path
from . import views

urlpatterns = [
    path('register/', views.UserRegistrationView.as_view(), name='register'),
    path('login/', views.login_view, name='login'),
    path('logout/', views.logout_view, name='logout'),
    path('profile/', views.UserProfileView.as_view(), name='profile'),
    path('users/<uuid:id>/', views.UserDetailView.as_view(), name='user-detail'),
    path('categories/', views.CategoryListView.as_view(), name='categories'),
    path('tags/', views.TagListView.as_view(), name='tags'),
]