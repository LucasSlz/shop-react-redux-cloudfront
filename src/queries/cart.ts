import { AxiosError } from "axios";
import React from "react";
import { useQuery, useQueryClient, useMutation } from "react-query";
import { CartItem } from "~/models/CartItem";
import * as cartApi from "~/services/cartApi";
import { Product } from "~/models/Product";

/**
 * Get userId from authorization token
 * Extracts the username from the base64-encoded "username:password" token
 */
const getUserId = (): string => {
  const token = localStorage.getItem("authorization_token");
  
  if (token) {
    try {
      // Decode base64 token to get "username:password"
      const decoded = decodeURIComponent(
        window.atob(token).replace(/%([0-9A-F]{2})/g, (_, p1) =>
          String.fromCharCode(parseInt(p1, 16))
        )
      );
      // Extract username (everything before the colon)
      const username = decoded.split(':')[0];
      return username; // Returns "LucasSlz"
    } catch (error) {
      console.error("Failed to decode authorization token:", error);
    }
  }
  
  // Fallback if token doesn't exist or decode fails
  return "default-user";
};

/**
 * Hook to fetch user's cart
 */
export function useCart() {
  const userId = getUserId();
  
  return useQuery<CartItem[], AxiosError>(
    ["cart", userId],
    async () => {
      return await cartApi.getCart(userId);
    },
    {
      retry: 1,
      refetchOnWindowFocus: false,
    }
  );
}

/**
 * Hook to get cart data from cache
 */
export function useCartData() {
  const queryClient = useQueryClient();
  const userId = getUserId();
  return queryClient.getQueryData<CartItem[]>(["cart", userId]);
}

/**
 * Hook to invalidate cart cache
 */
export function useInvalidateCart() {
  const queryClient = useQueryClient();
  const userId = getUserId();
  
  return React.useCallback(
    () => queryClient.invalidateQueries(["cart", userId], { exact: true }),
    [queryClient, userId]
  );
}

/**
 * Hook to add item to cart
 */
export function useAddToCart() {
  const userId = getUserId();
  const invalidateCart = useInvalidateCart();
  
  return useMutation<CartItem[], AxiosError, { product: Product; count: number }>(
    async ({ product, count }) => {
      return await cartApi.addToCart(userId, product.id!, count);
    },
    {
      onSuccess: () => {
        invalidateCart();
      },
    }
  );
}

/**
 * Hook to update cart item quantity
 */
export function useUpdateCartItem() {
  const userId = getUserId();
  const invalidateCart = useInvalidateCart();
  
  return useMutation<CartItem[], AxiosError, { productId: string; count: number }>(
    async ({ productId, count }) => {
      return await cartApi.updateCartItem(userId, productId, count);
    },
    {
      onSuccess: () => {
        invalidateCart();
      },
    }
  );
}

/**
 * Hook to remove item from cart
 */
export function useRemoveFromCart() {
  const userId = getUserId();
  const invalidateCart = useInvalidateCart();
  
  return useMutation<CartItem[], AxiosError, string>(
    async (productId: string) => {
      return await cartApi.removeFromCart(userId, productId);
    },
    {
      onSuccess: () => {
        invalidateCart();
      },
    }
  );
}

/**
 * Hook for backwards compatibility - upserts cart item
 * Adds new item or updates existing item quantity
 */
export function useUpsertCart() {
  const userId = getUserId();
  const invalidateCart = useInvalidateCart();
  const { data: cartItems = [] } = useCart();
  
  return useMutation<CartItem[], AxiosError, CartItem>(
    async (cartItem: CartItem) => {
      const productId = cartItem.product.id!;
      const count = cartItem.count;
      
      // Check if item exists in cart
      const existingItem = cartItems.find(item => item.product.id === productId);
      
      if (count <= 0) {
        // Remove item if count is 0 or negative
        return await cartApi.removeFromCart(userId, productId);
      } else if (existingItem) {
        // Update existing item
        return await cartApi.updateCartItem(userId, productId, count);
      } else {
        // Add new item
        return await cartApi.addToCart(userId, productId, count);
      }
    },
    {
      onSuccess: () => {
        invalidateCart();
      },
    }
  );
}

/**
 * Hook to checkout cart
 */
export function useCheckout() {
  const userId = getUserId();
  const invalidateCart = useInvalidateCart();
  
  return useMutation<cartApi.CheckoutResponse, AxiosError>(
    async () => {
      return await cartApi.checkout(userId);
    },
    {
      onSuccess: () => {
        invalidateCart();
      },
    }
  );
}
