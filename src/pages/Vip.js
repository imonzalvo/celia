import { useState } from "react";
import axios from "axios";
import { useQuery } from "react-query";
import { useParams, useNavigate } from "react-router-dom";
import { FloatingWhatsApp } from "react-floating-whatsapp";

import ProductDetail from "./ProductDetails";
import Header from "../components/headers/light";

const getProductById = async ({ queryKey }) => {
  const [_, productId] = queryKey;
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
    refetchOnWindowFocus: false,
  });

  const whatsAppNumber = process.env.REACT_APP_WHATSAPP_NUMBER;

  function goToCheckout() {
    navigate("/checkout", { state: { product: product } });
  }

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
      {!!whatsAppNumber && (
        <FloatingWhatsApp
          phoneNumber={whatsAppNumber}
          statusMessage={"Disponible"}
          accountName={process.env.REACT_APP_BUSINESS_TITLE}
          chatMessage={"Buenas! En que podemos ayudarte?"}
          placeholder={"Escriba su consulta"}
          style={{ height: 420 }}
          notification={true}
          notificationDelay={10}
          notificationSound={true}
          avatar="favicon.ico"
        />
      )}
    </>
  );
};
