from rest_framework import generics, status, permissions, filters
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from django_filters.rest_framework import DjangoFilterBackend
from django.db.models import Q
from .models import Artwork, ArtworkLike, ArtworkView
from .serializers import ArtworkSerializer, ArtworkCreateUpdateSerializer
from .filters import ArtworkFilter

class ArtworkListView(generics.ListAPIView):
    serializer_class = ArtworkSerializer
    permission_classes = [permissions.AllowAny]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_class = ArtworkFilter
    search_fields = ['title', 'description', 'artist__first_name', 'artist__last_name', 'medium']
    ordering_fields = ['created_at', 'price', 'likes_count', 'views_count']
    ordering = ['-created_at']

    def get_queryset(self):
        return Artwork.objects.filter(
            is_published=True,
            is_approved=True,
            availability='for_sale'
        ).select_related('artist', 'category').prefetch_related('tags', 'images')


class ArtworkDetailView(generics.RetrieveAPIView):
    serializer_class = ArtworkSerializer
    permission_classes = [permissions.AllowAny]
    lookup_field = 'id'

    def get_queryset(self):
        return Artwork.objects.filter(
            is_published=True,
            is_approved=True
        ).select_related('artist', 'category').prefetch_related('tags', 'images')

    def retrieve(self, request, *args, **kwargs):
        instance = self.get_object()
        
        # Track view
        if request.user.is_authenticated:
            ArtworkView.objects.get_or_create(
                user=request.user,
                artwork=instance,
                defaults={'ip_address': self.get_client_ip(request)}
            )
        else:
            ArtworkView.objects.get_or_create(
                artwork=instance,
                ip_address=self.get_client_ip(request),
                defaults={'user': None}
            )
        
        # Update view count
        instance.views_count = instance.artwork_views.count()
        instance.save(update_fields=['views_count'])
        
        serializer = self.get_serializer(instance)
        return Response(serializer.data)

    def get_client_ip(self, request):
        x_forwarded_for = request.META.get('HTTP_X_FORWARDED_FOR')
        if x_forwarded_for:
            ip = x_forwarded_for.split(',')[0]
        else:
            ip = request.META.get('REMOTE_ADDR')
        return ip


class ArtworkCreateView(generics.CreateAPIView):
    serializer_class = ArtworkCreateUpdateSerializer
    permission_classes = [permissions.IsAuthenticated]

    def perform_create(self, serializer):
        serializer.save(artist=self.request.user)


class ArtworkUpdateView(generics.UpdateAPIView):
    serializer_class = ArtworkCreateUpdateSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Artwork.objects.filter(artist=self.request.user)


class ArtworkDeleteView(generics.DestroyAPIView):
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Artwork.objects.filter(artist=self.request.user)


class MyArtworksView(generics.ListAPIView):
    serializer_class = ArtworkSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Artwork.objects.filter(
            artist=self.request.user
        ).select_related('category').prefetch_related('tags', 'images')


class FeaturedArtworksView(generics.ListAPIView):
    serializer_class = ArtworkSerializer
    permission_classes = [permissions.AllowAny]

    def get_queryset(self):
        return Artwork.objects.filter(
            is_featured=True,
            is_published=True,
            is_approved=True,
            availability='for_sale'
        ).select_related('artist', 'category')[:10]


@api_view(['POST'])
@permission_classes([permissions.IsAuthenticated])
def like_artwork(request, artwork_id):
    try:
        artwork = Artwork.objects.get(id=artwork_id)
        like, created = ArtworkLike.objects.get_or_create(
            user=request.user,
            artwork=artwork
        )
        
        if not created:
            like.delete()
            artwork.likes_count = artwork.likes.count()
            artwork.save(update_fields=['likes_count'])
            return Response({'liked': False, 'likes_count': artwork.likes_count})
        else:
            artwork.likes_count = artwork.likes.count()
            artwork.save(update_fields=['likes_count'])
            return Response({'liked': True, 'likes_count': artwork.likes_count})
    
    except Artwork.DoesNotExist:
        return Response({'error': 'Artwork not found'}, status=status.HTTP_404_NOT_FOUND)
