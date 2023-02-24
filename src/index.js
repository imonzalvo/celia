import React from "react";
import tw from "twin.macro";
import { createRoot } from "react-dom/client";
import Modal from "react-modal";
import { QueryClient, QueryClientProvider } from "react-query";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { FloatingWhatsApp } from "react-floating-whatsapp";
// import { ReactQueryDevtools } from "react-query/devtools";

import App from "./App";
import ErrorPage from "./pages/ErrorPage";
import Vip from "./pages/Vip";
import Congrats from "./pages/Congrats";
import OrderCongrats from "./pages/OrderCongrats";
import Checkout from "./pages/Checkout";
import Header from "./components/headers/light";

const Container = tw.div`flex flex-1 justify-center md:w-full sm:w-full lg:w-full`;

Modal.setAppElement("#root");
const queryClient = new QueryClient();
const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    errorElement: <ErrorPage />,
  },
  {
    path: "vip/:productId",
    element: <Vip />,
  },
  {
    path: "checkout",
    element: <Checkout />,
  },
  {
    path: "success/:paymentId",
    element: <Congrats />,
  },
  {
    path: "congrats",
    element: <OrderCongrats />,
  },
]);

const container = document.getElementById("root");
const root = createRoot(container);
const whatsAppNumber = process.env.REACT_APP_WHATSAPP_NUMBER;

root.render(
  <QueryClientProvider client={queryClient} contextSharing={true}>
    <Header />
    <Container>
      <RouterProvider router={router} />
      {/* <ReactQueryDevtools initialIsOpen={false} /> */}
      {!!whatsAppNumber && (
        <div style={{ position: "absolute" }}>
          <FloatingWhatsApp
            phoneNumber={whatsAppNumber}
            statusMessage={"Disponible"}
            accountName={process.env.REACT_APP_BUSINESS_TITLE}
            chatMessage={"Buenas! En que podemos ayudarte?"}
            placeholder={"Escriba su consulta"}
            avatar="favicon.ico"
          />
        </div>
      )}
    </Container>
  </QueryClientProvider>
);
