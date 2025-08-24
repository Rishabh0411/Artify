from django.urls import path
from . import views

urlpatterns = [
    path('', views.ArtworkListView.as_view(), name='artwork-list'),
    path('create/', views.ArtworkCreateView.as_view(), name='artwork-create'),
    path('featured/', views.FeaturedArtworksView.as_view(), name='featured-artworks'),
    path('my-artworks/', views.MyArtworksView.as_view(), name='my-artworks'),
    path('<uuid:id>/', views.ArtworkDetailView.as_view(), name='artwork-detail'),
    path('<uuid:id>/update/', views.ArtworkUpdateView.as_view(), name='artwork-update'),
    path('<uuid:id>/delete/', views.ArtworkDeleteView.as_view(), name='artwork-delete'),
    path('<uuid:id>/like/', views.like_artwork, name='like-artwork'),
]