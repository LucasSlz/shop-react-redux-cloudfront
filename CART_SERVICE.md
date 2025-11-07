# Cart Service Integration

This document describes the cart service implementation and integration with the Cart API.

## Overview

The cart service provides a complete shopping cart management system with:
- Fetching user cart
- Adding items to cart
- Updating item quantities
- Removing items from cart
- Checkout functionality

## Architecture

### 1. Environment Configuration

The cart API URL is configured via environment variables:

**File:** `.env.local`
```
REACT_APP_CART_API_URL=https://jzb5auuo91.execute-api.us-east-1.amazonaws.com/prod
```

### 2. API Service Layer

**File:** `src/services/cartApi.ts`

Provides low-level API functions:
- `getCart(userId)` - GET `/api/cart/${userId}`
- `addToCart(userId, productId, count)` - POST `/api/cart/${userId}/items`
- `updateCartItem(userId, productId, count)` - PUT `/api/cart/${userId}/items/${productId}`
- `removeFromCart(userId, productId)` - DELETE `/api/cart/${userId}/items/${productId}`
- `checkout(userId)` - POST `/api/cart/${userId}/checkout`

All functions include:
- Proper TypeScript typing
- Authorization headers from localStorage
- Error handling and logging

### 3. React Query Hooks

**File:** `src/queries/cart.ts`

Provides React hooks for cart operations:

#### Data Fetching
- `useCart()` - Fetches and caches cart data
- `useCartData()` - Gets cart data from cache
- `useInvalidateCart()` - Invalidates cart cache

#### Mutations
- `useAddToCart()` - Adds item to cart
- `useUpdateCartItem()` - Updates item quantity
- `useRemoveFromCart()` - Removes item from cart
- `useUpsertCart()` - Adds or updates item (backwards compatible)
- `useCheckout()` - Initiates checkout

All hooks include:
- Automatic cache invalidation on success
- Error handling
- Loading states
- TypeScript types

### 4. User ID Management

Currently uses a simple localStorage-based user ID system:
- First visit generates a unique user ID
- Stored in `localStorage` as `userId`
- Used for all cart operations

**Future Enhancement:** Replace with proper authentication context when auth is implemented.

## Component Integration

### Cart Display (Header)

**File:** `src/components/MainLayout/components/Cart.tsx`

Shows cart icon with item count badge:
- Displays loading spinner during fetch
- Shows error state with red badge
- Calculates total items across all cart items
- Links to cart page

### Cart Page

**File:** `src/components/pages/PageCart/PageCart.tsx`

Full cart checkout flow:
- Loading state with spinner
- Error alerts for failed operations
- Empty cart message
- Multi-step checkout process

### Add to Cart Button

**File:** `src/components/AddProductToCart/AddProductToCart.tsx`

Product list integration:
- Add to cart button
- Quantity controls (+ / -)
- Loading state disables buttons
- Error notifications via Snackbar

## Error Handling

### Network Errors
- Caught in API service layer
- Logged to console
- Propagated to React Query
- Displayed to user via UI components

### API Errors (4xx, 5xx)
- Axios automatically throws on error status
- Handled by React Query error callbacks
- Displayed via Alert/Snackbar components

### Empty States
- Empty cart message on cart page
- Badge hidden when cart is empty
- Graceful handling of missing data

## Authentication

Current implementation:
- Uses `authorization_token` from localStorage
- Set during app initialization
- Passed as `Authorization: Basic ${token}` header

All cart API requests include the authorization header via `getAuthHeaders()` function.

## Usage Examples

### Fetching Cart
```tsx
import { useCart } from '~/queries/cart';

function MyComponent() {
  const { data: cartItems, isLoading, error } = useCart();
  
  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;
  
  return <div>{cartItems.length} items in cart</div>;
}
```

### Adding to Cart
```tsx
import { useAddToCart } from '~/queries/cart';

function ProductCard({ product }) {
  const { mutate: addToCart, isLoading } = useAddToCart();
  
  const handleAdd = () => {
    addToCart({ product, count: 1 }, {
      onSuccess: () => console.log('Added!'),
      onError: (error) => console.error(error),
    });
  };
  
  return <button onClick={handleAdd} disabled={isLoading}>Add to Cart</button>;
}
```

### Updating Quantity
```tsx
import { useUpdateCartItem } from '~/queries/cart';

function CartItem({ item }) {
  const { mutate: updateItem } = useUpdateCartItem();
  
  const handleIncrease = () => {
    updateItem({ 
      productId: item.product.id, 
      count: item.count + 1 
    });
  };
  
  return <button onClick={handleIncrease}>+</button>;
}
```

### Checkout
```tsx
import { useCheckout } from '~/queries/cart';

function CheckoutButton() {
  const { mutate: checkout, isLoading } = useCheckout();
  
  const handleCheckout = () => {
    checkout(undefined, {
      onSuccess: (response) => {
        console.log('Order ID:', response.orderId);
      },
    });
  };
  
  return <button onClick={handleCheckout} disabled={isLoading}>Checkout</button>;
}
```

## Testing

To test the cart service:

1. **Start the development server**
   ```bash
   npm start
   ```

2. **Open browser dev tools**
   - Check Network tab for API calls
   - Verify Authorization headers are sent
   - Check localStorage for `userId` and `authorization_token`

3. **Test scenarios**
   - Add product to cart from product listing
   - Update quantities in cart
   - Remove items from cart
   - Navigate to cart page and checkout
   - Refresh page and verify cart persists

4. **Error scenarios**
   - Disable network to test error handling
   - Invalid authorization token
   - Server errors (4xx, 5xx)

## Future Enhancements

1. **Authentication Integration**
   - Replace localStorage userId with auth context
   - Use real user authentication
   - Handle token refresh

2. **Optimistic Updates**
   - Update UI immediately before API response
   - Rollback on error

3. **Cart Persistence**
   - Sync cart across devices
   - Save cart for logged-in users

4. **Enhanced Error Handling**
   - Retry failed requests
   - Better error messages
   - Offline support

5. **Performance**
   - Cart data polling/real-time updates
   - Debounced quantity updates
   - Request cancellation

## API Reference

### Base URL
```
https://jzb5auuo91.execute-api.us-east-1.amazonaws.com/prod
```

### Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/cart/${userId}` | Get user's cart |
| POST | `/api/cart/${userId}/items` | Add item to cart |
| PUT | `/api/cart/${userId}/items/${productId}` | Update item quantity |
| DELETE | `/api/cart/${userId}/items/${productId}` | Remove item |
| POST | `/api/cart/${userId}/checkout` | Checkout cart |

### Request/Response Types

See `src/services/cartApi.ts` for complete TypeScript definitions.
