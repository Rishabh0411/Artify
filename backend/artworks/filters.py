import django_filters
from .models import Artwork
from core.models import Category

class ArtworkFilter(django_filters.FilterSet):
    min_price = django_filters.NumberFilter(field_name="price", lookup_expr='gte')
    max_price = django_filters.NumberFilter(field_name="price", lookup_expr='lte')
    category = django_filters.ModelChoiceFilter(queryset=Category.objects.all())
    year_min = django_filters.NumberFilter(field_name="year_created", lookup_expr='gte')
    year_max = django_filters.NumberFilter(field_name="year_created", lookup_expr='lte')
    medium = django_filters.CharFilter(lookup_expr='icontains')
    artist = django_filters.CharFilter(field_name='artist__id')

    class Meta:
        model = Artwork
        fields = ['category', 'medium', 'condition', 'artist']
