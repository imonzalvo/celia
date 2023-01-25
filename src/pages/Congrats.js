import { useEffect, useRef, useState } from "react";

import { useParams } from "react-router-dom";

import Header from "../components/headers/light";
import useMercadopago from "hooks/useMercadoPago";
import axios from "axios";

export default () => {
  const mercadopago = useMercadopago(
    "TEST-517d0ba6-119b-4734-a690-a177656d4ab8",
    {
      locale: "es-UY",
    }
  );
  let { paymentId } = useParams();
  const [isLoading, setIsLoading] = useState(true);

  console.log("payment", paymentId);

  useEffect(() => {
    if (mercadopago) {
      const settings = {
        initialization: {
          paymentId: paymentId, // id de pago generado por Mercado Pago
        },
        callbacks: {
          onReady: () => {
            // callback llamado cuando Brick está listo
          },
          onError: (error) => {
            // callback llamado para todos los casos de error de Brick
          },
        },
      };
      mercadopago
        .bricks()
        .create("statusScreen", "statusScreenBrick_container", settings)
        .then((res) => {
          console.log("MPStatus -> res", res);
        });
    }
  }, [mercadopago]);

  return (
    <>
      <Header />
      <div>VIP</div>
      <div>{paymentId}</div>
      <div>
        <div
          id="statusScreenBrick_container"
          style={{ fontFamily: "sans-serif" }}
        ></div>
      </div>
    </>
  );
};
