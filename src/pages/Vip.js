import { useState } from "react";
import ProductDetail from "./ProductDetails";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { useQuery } from "react-query";
import Header from "../components/headers/light";

const getProductById = async ({ queryKey }) => {
  const [_, productId] = queryKey;

  console.log("here", productId);
  let response;

  response = await axios({
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    method: "get",
    url: `${process.env.REACT_APP_API_URL}/api/products/${productId}`,
  });

  return response.data;
};

export default () => {
  const navigate = useNavigate();
  let { productId } = useParams();
  const {
    status: status,
    data: product,
    isFetching,
  } = useQuery({
    queryKey: ["products", productId],
    queryFn: getProductById,
  });

  function goToCheckout() {
    navigate("/checkout", { state: { product: product } });
  }

  console.log("status", status, product, isFetching);

  if (isFetching) {
    return;
  }


  return (
    <>
      <Header />
      <ProductDetail
        product={product}
        goToCheckout={() => goToCheckout(productId)}
      />
    </>
  );
};
