import Badge from "@mui/material/Badge";
import CartIcon from "@mui/icons-material/ShoppingCart";
import IconButton from "@mui/material/IconButton";
import CircularProgress from "@mui/material/CircularProgress";
import { Link } from "react-router-dom";
import { useCart } from "~/queries/cart";

export default function Cart() {
  const { data = [], isLoading, error } = useCart();
  
  // Calculate total items in cart
  const totalItems = data.reduce((sum, item) => sum + item.count, 0);
  const badgeContent = totalItems || undefined;

  return (
    <IconButton 
      color="inherit" 
      component={Link} 
      to="/cart" 
      size="large"
      disabled={isLoading}
    >
      <Badge 
        badgeContent={badgeContent} 
        color={error ? "error" : "secondary"}
      >
        {isLoading ? (
          <CircularProgress size={24} color="inherit" />
        ) : (
          <CartIcon />
        )}
      </Badge>
    </IconButton>
  );
}
