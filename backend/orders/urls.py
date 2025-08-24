from django.urls import path
from . import views

urlpatterns = [
    path('cart/', views.CartView.as_view(), name='cart'),
    path('cart/add/', views.add_to_cart, name='add-to-cart'),
    path('cart/remove/<uuid:artwork_id>/', views.remove_from_cart, name='remove-from-cart'),
    
    path('wishlist/', views.WishlistView.as_view(), name='wishlist'),
    path('wishlist/add/', views.add_to_wishlist, name='add-to-wishlist'),
    path('wishlist/remove/<uuid:artwork_id>/', views.remove_from_wishlist, name='remove-from-wishlist'),
    
    path('orders/', views.OrderListView.as_view(), name='order-list'),
    path('orders/create/', views.create_order, name='create-order'),
    path('orders/<uuid:id>/', views.OrderDetailView.as_view(), name='order-detail'),
    path('orders/<uuid:order_id>/payment/', views.process_payment, name='process-payment'),
]