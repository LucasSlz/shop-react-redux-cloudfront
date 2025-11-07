import Typography from "@mui/material/Typography";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";
import { Product } from "~/models/Product";
import CartIcon from "@mui/icons-material/ShoppingCart";
import Add from "@mui/icons-material/Add";
import Remove from "@mui/icons-material/Remove";
import IconButton from "@mui/material/IconButton";
import { useCart, useInvalidateCart, useUpsertCart } from "~/queries/cart";
import React from "react";

type AddProductToCartProps = {
  product: Product;
};

export default function AddProductToCart({ product }: AddProductToCartProps) {
  const { data = [], isFetching } = useCart();
  const { mutate: upsertCart, isLoading, error } = useUpsertCart();
  const invalidateCart = useInvalidateCart();
  const cartItem = data.find((i) => i.product.id === product.id);
  const [showError, setShowError] = React.useState(false);

  const addProduct = () => {
    upsertCart(
      { product, count: cartItem ? cartItem.count + 1 : 1 },
      { 
        onSuccess: invalidateCart,
        onError: () => setShowError(true),
      }
    );
  };

  const removeProduct = () => {
    if (cartItem) {
      upsertCart(
        { ...cartItem, count: cartItem.count - 1 },
        { 
          onSuccess: invalidateCart,
          onError: () => setShowError(true),
        }
      );
    }
  };

  const handleCloseError = () => {
    setShowError(false);
  };

  const isDisabled = isFetching || isLoading;

  return (
    <>
      {cartItem ? (
        <>
          <IconButton disabled={isDisabled} onClick={removeProduct} size="large">
            <Remove color={"secondary"} />
          </IconButton>
          <Typography align="center">{cartItem.count}</Typography>
          <IconButton disabled={isDisabled} onClick={addProduct} size="large">
            <Add color={"secondary"} />
          </IconButton>
        </>
      ) : (
        <IconButton disabled={isDisabled} onClick={addProduct} size="large">
          <CartIcon color={"secondary"} />
        </IconButton>
      )}
      
      <Snackbar 
        open={showError} 
        autoHideDuration={6000} 
        onClose={handleCloseError}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert onClose={handleCloseError} severity="error" sx={{ width: '100%' }}>
          Failed to update cart. Please try again.
        </Alert>
      </Snackbar>
    </>
  );
}
