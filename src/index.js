import React from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import Modal from "react-modal";
import { QueryClient, QueryClientProvider } from "react-query";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { ReactQueryDevtools } from "react-query/devtools";
import ErrorPage from "./pages/ErrorPage";
import Vip from "./pages/Vip";
import Congrats from "./pages/Congrats";
import Checkout from "./pages/Checkout";

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
    path: "congrats/:paymentId",
    element: <Congrats />,
  },
]);

const container = document.getElementById("root");
const root = createRoot(container);
root.render(
  <QueryClientProvider client={queryClient} contextSharing={true}>
    <RouterProvider router={router} />
    <ReactQueryDevtools initialIsOpen={false} />
  </QueryClientProvider>
);
