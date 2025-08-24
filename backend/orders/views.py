from rest_framework import generics, status, permissions
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from django.db import transaction
from .models import Cart, CartItem, Wishlist, WishlistItem, Order, OrderItem, Payment
from .serializers import (
    CartSerializer, WishlistSerializer, OrderSerializer, 
    OrderCreateSerializer, PaymentSerializer
)
from artworks.models import Artwork

class CartView(generics.RetrieveAPIView):
    serializer_class = CartSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_object(self):
        cart, created = Cart.objects.get_or_create(user=self.request.user)
        return cart


@api_view(['POST'])
@permission_classes([permissions.IsAuthenticated])
def add_to_cart(request):
    artwork_id = request.data.get('artwork_id')
    
    try:
        artwork = Artwork.objects.get(id=artwork_id, availability='for_sale')
        cart, created = Cart.objects.get_or_create(user=request.user)
        
        cart_item, created = CartItem.objects.get_or_create(
            cart=cart,
            artwork=artwork
        )
        
        if created:
            return Response({'message': 'Item added to cart'}, status=status.HTTP_201_CREATED)
        else:
            return Response({'message': 'Item already in cart'}, status=status.HTTP_200_OK)
    
    except Artwork.DoesNotExist:
        return Response({'error': 'Artwork not found or not available'}, status=status.HTTP_404_NOT_FOUND)


@api_view(['DELETE'])
@permission_classes([permissions.IsAuthenticated])
def remove_from_cart(request, artwork_id):
    try:
        cart = Cart.objects.get(user=request.user)
        cart_item = CartItem.objects.get(cart=cart, artwork_id=artwork_id)
        cart_item.delete()
        return Response({'message': 'Item removed from cart'})
    
    except (Cart.DoesNotExist, CartItem.DoesNotExist):
        return Response({'error': 'Item not found in cart'}, status=status.HTTP_404_NOT_FOUND)


class WishlistView(generics.RetrieveAPIView):
    serializer_class = WishlistSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_object(self):
        wishlist, created = Wishlist.objects.get_or_create(user=self.request.user)
        return wishlist


@api_view(['POST'])
@permission_classes([permissions.IsAuthenticated])
def add_to_wishlist(request):
    artwork_id = request.data.get('artwork_id')
    
    try:
        artwork = Artwork.objects.get(id=artwork_id)
        wishlist, created = Wishlist.objects.get_or_create(user=request.user)
        
        wishlist_item, created = WishlistItem.objects.get_or_create(
            wishlist=wishlist,
            artwork=artwork
        )
        
        if created:
            return Response({'message': 'Item added to wishlist', 'in_wishlist': True})
        else:
            wishlist_item.delete()
            return Response({'message': 'Item removed from wishlist', 'in_wishlist': False})
    
    except Artwork.DoesNotExist:
        return Response({'error': 'Artwork not found'}, status=status.HTTP_404_NOT_FOUND)


@api_view(['DELETE'])
@permission_classes([permissions.IsAuthenticated])
def remove_from_wishlist(request, artwork_id):
    try:
        wishlist = Wishlist.objects.get(user=request.user)
        wishlist_item = WishlistItem.objects.get(wishlist=wishlist, artwork_id=artwork_id)
        wishlist_item.delete()
        return Response({'message': 'Item removed from wishlist'})
    
    except (Wishlist.DoesNotExist, WishlistItem.DoesNotExist):
        return Response({'error': 'Item not found in wishlist'}, status=status.HTTP_404_NOT_FOUND)


class OrderListView(generics.ListAPIView):
    serializer_class = OrderSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Order.objects.filter(buyer=self.request.user).order_by('-created_at')


class OrderDetailView(generics.RetrieveAPIView):
    serializer_class = OrderSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Order.objects.filter(buyer=self.request.user)


@api_view(['POST'])
@permission_classes([permissions.IsAuthenticated])
@transaction.atomic
def create_order(request):
    serializer = OrderCreateSerializer(data=request.data)
    if serializer.is_valid():
        # Get user's cart
        try:
            cart = Cart.objects.get(user=request.user)
            cart_items = cart.items.all()
            
            if not cart_items:
                return Response({'error': 'Cart is empty'}, status=status.HTTP_400_BAD_REQUEST)
            
            # Calculate totals
            subtotal = sum(item.artwork.price for item in cart_items)
            tax_amount = subtotal * 0.18  # 18% tax
            shipping_amount = 0 if subtotal > 500 else 50  # Free shipping over Rs.500
            total_amount = subtotal + tax_amount + shipping_amount
            
            # Create order
            order = Order.objects.create(
                buyer=request.user,
                subtotal=subtotal,
                tax_amount=tax_amount,
                shipping_amount=shipping_amount,
                total_amount=total_amount,
                **serializer.validated_data
            )
            
            # Create order items and mark artworks as sold
            for cart_item in cart_items:
                OrderItem.objects.create(
                    order=order,
                    artwork=cart_item.artwork,
                    price=cart_item.artwork.price,
                    artist=cart_item.artwork.artist
                )
                # Mark artwork as sold
                cart_item.artwork.availability = 'sold'
                cart_item.artwork.save()
            
            # Clear cart
            cart_items.delete()
            
            return Response(OrderSerializer(order).data, status=status.HTTP_201_CREATED)
            
        except Cart.DoesNotExist:
            return Response({'error': 'Cart not found'}, status=status.HTTP_404_NOT_FOUND)
    
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['POST'])
@permission_classes([permissions.IsAuthenticated])
def process_payment(request, order_id):
    try:
        order = Order.objects.get(id=order_id, buyer=request.user)
        
        if order.payment_status == 'paid':
            return Response({'error': 'Order already paid'}, status=status.HTTP_400_BAD_REQUEST)
        
        payment_method = request.data.get('payment_method')
        
        # Create payment record
        payment = Payment.objects.create(
            order=order,
            amount=order.total_amount,
            payment_method=payment_method,
            status='processing'
        )
        
        # Simulate payment processing
        # In real implementation, integrate with payment gateway
        payment.status = 'completed'
        payment.transaction_id = f"TXN_{payment.id}"
        payment.save()
        
        # Update order status
        order.payment_status = 'paid'
        order.status = 'confirmed'
        order.save()
        
        return Response({
            'message': 'Payment successful',
            'payment': PaymentSerializer(payment).data
        })
        
    except Order.DoesNotExist:
        return Response({'error': 'Order not found'}, status=status.HTTP_404_NOT_FOUND)