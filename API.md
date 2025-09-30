# Artify API Documentation

## Base URL
- **Development**: `http://localhost:8000/api/`  
- **Production**: `https://your-domain.com/api/`

## Authentication

All authenticated endpoints require a token in the Authorization header:
```
Authorization: Token your_token_here
```

## Response Format

All API responses follow this structure:
```json
{
  "success": true,
  "data": {},
  "message": "Success message",
  "errors": []
}
```

## Endpoints

### Authentication

#### Register User
- **POST** `/auth/register/`
- **Body**:
```json
{
  "username": "string",
  "email": "email",
  "password": "string",
  "first_name": "string",
  "last_name": "string", 
  "user_type": "buyer|artist|admin"
}
```
- **Response**: User object + authentication token

#### Login
- **POST** `/auth/login/`
- **Body**:
```json
{
  "email": "email",
  "password": "string"
}
```
- **Response**: User object + authentication token

#### Logout
- **POST** `/auth/logout/`
- **Headers**: Authorization required
- **Response**: Success message

### Users

#### Get Profile
- **GET** `/users/profile/`
- **Headers**: Authorization required
- **Response**: Current user profile

#### Update Profile  
- **PATCH** `/users/profile/`
- **Headers**: Authorization required
- **Body**: User fields to update
- **Response**: Updated user object

#### Get User by ID
- **GET** `/users/{id}/`
- **Response**: Public user profile

#### Follow/Unfollow Artist
- **POST** `/users/{id}/follow/`
- **DELETE** `/users/{id}/follow/`
- **Headers**: Authorization required

### Artworks

#### List Artworks
- **GET** `/artworks/`
- **Query Parameters**:
  - `search`: Search in title, description
  - `category`: Filter by category ID
  - `artist`: Filter by artist ID  
  - `min_price`: Minimum price
  - `max_price`: Maximum price
  - `medium`: Filter by medium
  - `ordering`: Sort by `price`, `-price`, `created_at`, `-created_at`
  - `page`: Page number
  - `page_size`: Items per page (default: 20)

#### Get Artwork Detail
- **GET** `/artworks/{id}/`
- **Response**: Full artwork details with images

#### Create Artwork
- **POST** `/artworks/`
- **Headers**: Authorization required (artist only)
- **Body**:
```json
{
  "title": "string",
  "description": "text",
  "price": "decimal",
  "medium": "string",
  "dimensions": "string",
  "year_created": "integer",
  "category": "integer",
  "tags": ["tag1", "tag2"]
}
```

#### Update Artwork
- **PATCH** `/artworks/{id}/`
- **Headers**: Authorization required (owner only)
- **Body**: Fields to update

#### Delete Artwork
- **DELETE** `/artworks/{id}/`
- **Headers**: Authorization required (owner only)

#### Like/Unlike Artwork
- **POST** `/artworks/{id}/like/`
- **DELETE** `/artworks/{id}/like/`
- **Headers**: Authorization required

#### Upload Artwork Images
- **POST** `/artworks/{id}/images/`
- **Headers**: Authorization required (owner only)
- **Body** (multipart/form-data):
```
image: File
alt_text: string (optional)
is_primary: boolean (optional)
```

### Categories & Tags

#### List Categories
- **GET** `/categories/`
- **Response**: List of all categories

#### List Tags
- **GET** `/tags/`
- **Response**: List of all tags

#### Create Category/Tag
- **POST** `/categories/` or `/tags/`
- **Headers**: Authorization required (admin only)

### Orders & Cart

#### Get Cart
- **GET** `/cart/`
- **Headers**: Authorization required
- **Response**: User's cart with items

#### Add to Cart
- **POST** `/cart/items/`
- **Headers**: Authorization required
- **Body**:
```json
{
  "artwork_id": "uuid"
}
```

#### Remove from Cart
- **DELETE** `/cart/items/{artwork_id}/`
- **Headers**: Authorization required

#### Create Order
- **POST** `/orders/`
- **Headers**: Authorization required
- **Body**:
```json
{
  "shipping_address": {
    "line_1": "string",
    "line_2": "string",
    "city": "string",
    "state": "string",
    "postal_code": "string",
    "country": "string"
  },
  "payment_method": "stripe_card"
}
```

#### List Orders
- **GET** `/orders/`
- **Headers**: Authorization required
- **Query Parameters**:
  - `status`: Filter by order status
  - `ordering`: Sort orders

#### Get Order Detail
- **GET** `/orders/{id}/`
- **Headers**: Authorization required (owner only)

### Reviews

#### List Artwork Reviews
- **GET** `/artworks/{id}/reviews/`
- **Query Parameters**:
  - `rating`: Filter by star rating
  - `ordering`: Sort reviews

#### Create Review
- **POST** `/artworks/{id}/reviews/`
- **Headers**: Authorization required (verified purchase)
- **Body**:
```json
{
  "rating": "1-5",
  "title": "string",
  "content": "text"
}
```

#### Mark Review Helpful
- **POST** `/reviews/{id}/helpful/`
- **Headers**: Authorization required

### Wishlist

#### Get Wishlist
- **GET** `/wishlist/`
- **Headers**: Authorization required

#### Add to Wishlist
- **POST** `/wishlist/items/`
- **Headers**: Authorization required
- **Body**:
```json
{
  "artwork_id": "uuid"
}
```

#### Remove from Wishlist
- **DELETE** `/wishlist/items/{artwork_id}/`
- **Headers**: Authorization required

### Collections

#### List User Collections
- **GET** `/collections/`
- **Headers**: Authorization required

#### Create Collection
- **POST** `/collections/`
- **Headers**: Authorization required
- **Body**:
```json
{
  "name": "string",
  "description": "text",
  "is_public": "boolean"
}
```

#### Add Artwork to Collection
- **POST** `/collections/{id}/artworks/`
- **Headers**: Authorization required
- **Body**:
```json
{
  "artwork_id": "uuid"
}
```

### Notifications

#### List Notifications
- **GET** `/notifications/`
- **Headers**: Authorization required
- **Query Parameters**:
  - `is_read`: Filter by read status
  - `notification_type`: Filter by type

#### Mark as Read
- **PATCH** `/notifications/{id}/`
- **Headers**: Authorization required
- **Body**:
```json
{
  "is_read": true
}
```

#### Mark All as Read
- **POST** `/notifications/mark-all-read/`
- **Headers**: Authorization required

### Search

#### Global Search
- **GET** `/search/`
- **Query Parameters**:
  - `q`: Search query
  - `type`: Filter by `artwork`, `artist`, `category`
  - `page`: Page number

#### Autocomplete
- **GET** `/search/autocomplete/`
- **Query Parameters**:
  - `q`: Search query
  - `limit`: Max results (default: 10)

## Error Codes

- **400**: Bad Request - Invalid input data
- **401**: Unauthorized - Authentication required  
- **403**: Forbidden - Insufficient permissions
- **404**: Not Found - Resource doesn't exist
- **429**: Too Many Requests - Rate limit exceeded
- **500**: Internal Server Error - Server error

## Rate Limits

- **General API**: 1000 requests/hour per authenticated user
- **Anonymous**: 100 requests/hour per IP
- **Auth endpoints**: 5 requests/minute per IP
- **Upload endpoints**: 20 requests/hour per user

## Pagination

List endpoints use cursor pagination:
```json
{
  "count": 150,
  "next": "http://api.example.org/accounts/?page=4",
  "previous": "http://api.example.org/accounts/?page=2", 
  "results": [...]
}
```

## File Uploads

- **Max file size**: 10MB
- **Allowed formats**: JPEG, PNG, WebP
- **Image dimensions**: Min 800x600, Max 4000x4000
- **Multiple uploads**: Up to 5 images per artwork

## Webhooks

### Stripe Payment Webhooks
- **Endpoint**: `/webhooks/stripe/`
- **Events**: `payment_intent.succeeded`, `payment_intent.payment_failed`

## SDKs & Tools

### Postman Collection
Import the Postman collection for easy testing: [Download](./postman_collection.json)

### OpenAPI Schema
Access the full OpenAPI schema at: `/api/schema/`

### Interactive Documentation
Explore the API interactively: `/api/schema/swagger-ui/`
