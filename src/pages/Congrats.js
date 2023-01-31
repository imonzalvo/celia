import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import tw from "twin.macro";
import HashLoader from "react-spinners/HashLoader";

import Header from "../components/headers/light";
import useMercadopago from "hooks/useMercadoPago";

const Container = tw.div`flex justify-center flex-1`;
const CongratsContainer = tw.div`w-2/5 mt-10 small:w-full sm:w-2/3 lg:w-2/5`;

export default () => {
  const mercadopago = useMercadopago(
    process.env.REACT_APP_MERCADO_PAGO_PUBLIC_KEY,
    {
      locale: "es-UY",
    }
  );
  let { paymentId } = useParams();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (mercadopago) {
      const settings = {
        initialization: {
          paymentId: paymentId,
        },
        callbacks: {
          onReady: () => {
            setIsLoading(false);
          },
          onError: (error) => {
            // TODO:
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
  }, [mercadopago, paymentId]);

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
        <CongratsContainer style={isLoading ? { display: "none" } : {}}>
          <div
            id="statusScreenBrick_container"
            style={{ fontFamily: "sans-serif" }}
          ></div>
        </CongratsContainer>
      </Container>
    </>
  );
};
