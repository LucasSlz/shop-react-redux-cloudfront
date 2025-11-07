const API_PATHS = {
  products: "https://41yveouno7.execute-api.us-east-1.amazonaws.com/prod/products",
  order: "https://41yveouno7.execute-api.us-east-1.amazonaws.com/prod/orders",
  import: "https://p0kvqtubqk.execute-api.us-east-1.amazonaws.com/prod/import",
  bff: "https://41yveouno7.execute-api.us-east-1.amazonaws.com/prod/bff",
  cart: import.meta.env.REACT_APP_CART_API_URL || "https://jzb5auuo91.execute-api.us-east-1.amazonaws.com/prod",
};

export default API_PATHS;
