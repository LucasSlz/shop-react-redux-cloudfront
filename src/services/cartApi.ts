import axios, { AxiosResponse } from "axios";
import API_PATHS from "~/constants/apiPaths";
import { CartItem } from "~/models/CartItem";

/**
 * Cart API Service
 * Handles all cart-related API operations
 */

// Types for API requests and responses
export interface AddToCartRequest {
  productId: string;
  count: number;
}

export interface UpdateCartItemRequest {
  count: number;
}

export interface CheckoutResponse {
  success: boolean;
  orderId?: string;
  message?: string;
}

/**
 * Get the authorization token from localStorage
 */
const getAuthHeaders = () => ({
  Authorization: `Basic ${localStorage.getItem("authorization_token")}`,
});

/**
 * Get user's cart
 * @param userId - User ID
 * @returns Promise<CartItem[]>
 */
export const getCart = async (userId: string): Promise<CartItem[]> => {
  try {
    const response: AxiosResponse<CartItem[]> = await axios.get(
      `${API_PATHS.cart}/api/cart/${userId}`,
      {
        headers: getAuthHeaders(),
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching cart:", error);
    throw error;
  }
};

/**
 * Add item to cart
 * @param userId - User ID
 * @param productId - Product ID to add
 * @param count - Quantity to add
 * @returns Promise<CartItem[]>
 */
export const addToCart = async (
  userId: string,
  productId: string,
  count: number
): Promise<CartItem[]> => {
  try {
    const response: AxiosResponse<CartItem[]> = await axios.post(
      `${API_PATHS.cart}/api/cart/${userId}/items`,
      { productId, count },
      {
        headers: getAuthHeaders(),
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error adding item to cart:", error);
    throw error;
  }
};

/**
 * Update cart item quantity
 * @param userId - User ID
 * @param productId - Product ID to update
 * @param count - New quantity
 * @returns Promise<CartItem[]>
 */
export const updateCartItem = async (
  userId: string,
  productId: string,
  count: number
): Promise<CartItem[]> => {
  try {
    const response: AxiosResponse<CartItem[]> = await axios.put(
      `${API_PATHS.cart}/api/cart/${userId}/items/${productId}`,
      { count },
      {
        headers: getAuthHeaders(),
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error updating cart item:", error);
    throw error;
  }
};

/**
 * Remove item from cart
 * @param userId - User ID
 * @param productId - Product ID to remove
 * @returns Promise<CartItem[]>
 */
export const removeFromCart = async (
  userId: string,
  productId: string
): Promise<CartItem[]> => {
  try {
    const response: AxiosResponse<CartItem[]> = await axios.delete(
      `${API_PATHS.cart}/api/cart/${userId}/items/${productId}`,
      {
        headers: getAuthHeaders(),
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error removing item from cart:", error);
    throw error;
  }
};

/**
 * Checkout cart
 * @param userId - User ID
 * @returns Promise<CheckoutResponse>
 */
export const checkout = async (userId: string): Promise<CheckoutResponse> => {
  try {
    const response: AxiosResponse<CheckoutResponse> = await axios.post(
      `${API_PATHS.cart}/api/cart/${userId}/checkout`,
      {},
      {
        headers: getAuthHeaders(),
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error during checkout:", error);
    throw error;
  }
};
