import { useEffect, useState } from "react";

import { useNavigate, useLocation } from "react-router-dom";

import Header from "../components/headers/light";
import useMercadopago from "hooks/useMercadoPago";
import axios from "axios";

export default () => {
  const navigate = useNavigate();
  const { state } = useLocation();
  const { product } = state;
  const mercadopago = useMercadopago(
    "TEST-517d0ba6-119b-4734-a690-a177656d4ab8",
    {
      locale: "es-UY",
    }
  );
  const [isLoading, setIsLoading] = useState(true);

  function goToCongrats(paymentId) {
    console.log("congrats");
    navigate(`/congrats/${paymentId}`);
  }

  const total = 100;

  useEffect(() => {
    if (mercadopago) {
      const settings = {
        locale: "es-UY",
        initialization: {
          amount: total,
        },
        callbacks: {
          // eslint-disable-next-line @typescript-eslint/no-empty-function
          onReady: () => {
            // Acá es donde al querer cargar el form por 2da vez, no llega nunca.
            setIsLoading(false);
          },
          onSubmit: (cardFormData) =>
            new Promise((resolve, reject) => {
              const transaction = {
                token: cardFormData.token,
                installments: cardFormData.installments,
                issuerId: cardFormData.issuer_id,
                paymentMethodId: cardFormData.payment_method_id,
                payer: {
                  email: cardFormData.payer.email,
                  identification: {
                    number: cardFormData.payer.identification.number,
                    type: cardFormData.payer.identification.type,
                  },
                },
                transactionAmount: total,
              };
              axios
                .post(
                  `${process.env.REACT_APP_API_URL}/process_payment`,
                  transaction
                )
                .then((res) => {
                  console.log("res", res);
                  resolve();
                  goToCongrats(res.data.paymentId);
                })
                .catch((e) => {
                  console.log("error", e);
                });
            }),
          onError: (error) => {
            // TODO: meter logica de que si hay un error con la carga del form mostrar un msj de error o algo
            console.log("MPForm -> error", error);
          },
        },
        customization: {
          paymentMethods: {
            maxInstallments: 12,
          },
        },
      };
      mercadopago
        .bricks()
        .create("cardPayment", "cardPaymentBrick_container", settings)
        .then((res) => {
          console.log("MPForm -> res", res);
        });
    }
  }, [mercadopago]);

  return (
    <>
      {console.log(product)}
      <Header />
      <div>Checkout</div>
      <div>{product.id}</div>
      <div>
        <div
          id="cardPaymentBrick_container"
          style={{ fontFamily: "sans-serif" }}
        ></div>
      </div>
    </>
  );
};
