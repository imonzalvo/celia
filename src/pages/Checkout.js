import { useEffect, useState } from "react";
import tw from "twin.macro";
import axios from "axios";
import HashLoader from "react-spinners/HashLoader";
import { useNavigate, useLocation } from "react-router-dom";

import Header from "../components/headers/light";
import useMercadopago from "hooks/useMercadoPago";
import CartSummary from "components/cartSummary";

const Container = tw.div`flex justify-center px-10 flex-1 mt-4 md:flex-row lg:flex-row xl:flex-row 2xl:flex-row small:flex-col-reverse small:items-center`;
const HalfContaier = tw.div`flex small:w-full flex-1 justify-center`;

export default () => {
  const PUBLIC_KEY = process.env.REACT_APP_MERCADO_PAGO_PUBLIC_KEY;
  const navigate = useNavigate();
  const { state } = useLocation();
  const { product } = state;
  const mercadopago = useMercadopago(PUBLIC_KEY, {
    locale: "es-UY",
  });
  const [isLoading, setIsLoading] = useState(true);

  function goToCongrats(paymentId) {
    navigate(`/congrats/${paymentId}`);
  }

  console.log("useEffect", product);

  useEffect(() => {
    if (mercadopago) {
      const settings = {
        locale: "es-UY",
        initialization: {
          amount: product.price,
        },
        callbacks: {
          onReady: () => {
            setIsLoading(false);
          },
          onSubmit: onFormSubmit,
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
          // setIsLoading(false);
        });
    }
  }, [mercadopago, product]);

  const buildTransaction = (cardFormData) => ({
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
    transactionAmount: product.price,
  });
  
  const onFormSubmit = (cardFormData) =>
    new Promise((resolve, reject) => {
      axios
        .post(
          `${process.env.REACT_APP_API_URL}/process_payment/${process.env.REACT_APP_BUSINESS_HANDLE}`,
          buildTransaction(cardFormData)
        )
        .then((res) => {
          resolve();
          goToCongrats(res.data.paymentId);
        })
        .catch((e) => {
          console.log("error", e);
          reject();
        });
    });

  return (
    <>
      <Header />
      <Container>
        {isLoading && (
          <HashLoader
            loading={isLoading}
            size={350}
            color={"#aaa"}
            aria-label="Loading Spinner"
            data-testid="loader"
          />
        )}
      </Container>
      <Container style={isLoading ? { display: "none" } : {}}>
        <HalfContaier
          id="cardPaymentBrick_container"
          style={{ fontFamily: "sans-serif" }}
        ></HalfContaier>
        <HalfContaier>
          <CartSummary product={product}></CartSummary>
        </HalfContaier>
      </Container>
    </>
  );
};
