import {useState } from "react";

import { useParams, useNavigate } from "react-router-dom";

import Header from "../components/headers/light";

export default () => {
  const navigate = useNavigate();
  let { productId } = useParams();

  function goToCheckout(productId) {
    navigate("/checkout", { state: { product: { id: productId } } });
  }

  return (
    <>
      <Header />
      <div>VIP</div>
      <div onClick={() => goToCheckout(productId)}>{productId}</div>
    </>
  );
};
