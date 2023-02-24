import { useState, useRef, useEffect } from "react";
import axios from "axios";
import tw from "twin.macro";
import { useQuery, useMutation } from "react-query";
import HashLoader from "react-spinners/HashLoader";
import { useNavigate, useLocation } from "react-router-dom";
import { useForm } from "react-hook-form";

import CartSummary from "components/cartSummary";
import UserDataForm from "components/forms/UserDataForm";

const Container = tw.div`flex justify-between flex-1 font-sans max-w-screen-xl px-2
sm:flex-col md:flex-col lg:flex-row xl:flex-row 2xl:flex-row tablet:flex-col tablet:items-center
tablet:mb-12
`;

const HalfContainer = tw.div`flex justify-between flex-1 tablet:w-full`;
const LeftContainer = tw(HalfContainer)`justify-start tablet:self-start`;
const RightContainer = tw(
  HalfContainer
)`tablet:mt-8 justify-end justify-center tablet:w-full`;

const FormTitle = tw.h1`font-bold`;
const ShippingError = tw.span`ml-4 text-red-600`;

const getCheckoutInfo = async ({ queryKey }) => {
  console.log("query key", queryKey);
  const [_, product] = queryKey;

  let response;

  response = await axios.post(
    `${process.env.REACT_APP_API_URL}/checkout/${process.env.REACT_APP_BUSINESS_HANDLE}`,
    { products: [{ id: product.id }] }
  );

  return response.data;
};

const createOrder = async (data) => {
  const products = data.products.map((product) => {
    return {
      id: product.id,
      quantity: 1,
    };
  });

  const request = {
    clientName: `${data.name} ${data.lastName}`,
    clientEmail: data.email,
    clientPhone: data.phone,
    address: data.address,
    city: data.city,
    postalCode: data.postalCode,
    shippingOption: data.shippingOption,
    paymentMethod: data.paymentMethod,
    products: products,
  };
  let response;

  response = await axios.post(
    `${process.env.REACT_APP_API_URL}/create_order/${process.env.REACT_APP_BUSINESS_HANDLE}`,
    request
  );

  return response.data;
};

export default () => {
  const bottomRef = useRef(null);
  const scrollToBottom = () => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const { state } = useLocation();
  const { product } = state;

  const { status, data, isFetching, error } = useQuery({
    queryKey: ["checkoutInfo", product],
    queryFn: getCheckoutInfo,
    refetchOnWindowFocus: false,
  });

  const { mutate } = useMutation(createOrder, {
    onSuccess: (data) => {
      console.log("res", data);
      goToCongrats(data.id);
    },
  });

  console.log("CHO", status, data);
  const {
    register,
    handleSubmit,
    watch,
    setError,
    formState: { errors },
  } = useForm();
  const onSubmit = (data) => {
    console.log("aa", selectedPaymentMethod, selectedShippingOption);
    if (!selectedShippingOption) {
      setError("root.shippingError", {
        type: "not selected",
      });
    }

    if (!selectedPaymentMethod) {
      setError("root.paymentMethodError", {
        type: "not selected",
      });
    }

    if (!!selectedPaymentMethod && !!selectedShippingOption) {
      mutate({
        ...data,
        shippingOption: selectedShippingOption,
        paymentMethod: selectedPaymentMethod,
        products: [product],
      });
    } else {
      scrollToBottom();
    }
  };

  const navigate = useNavigate();
  const [selectedShippingOption, setSelectedShippingOption] = useState(null);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState(null);

  function goToCongrats(orderId) {
    navigate(`/congrats`, { state: { orderId: orderId } });
  }

  const renderSpinner = () => (
    <Container>
      <HashLoader
        loading={isFetching}
        size={350}
        color={"#aaa"}
        aria-label="Loading Spinner"
        data-testid="loader"
      />
    </Container>
  );

  if (isFetching) {
    return renderSpinner();
  }
  return (
    <Container>
      <LeftContainer>
        <div style={{ flexDirection: "column", width: "100%" }}>
          <FormTitle>Detalles de Facturación</FormTitle>
          <UserDataForm
            register={register}
            errors={errors}
            handleSubmit={handleSubmit}
            onSubmit={onSubmit}
          />
        </div>
      </LeftContainer>
      {console.log("error", errors)}
      <RightContainer>
        <CartSummary
          products={data.products}
          shippingOptions={data.shippingOptions}
          selectedShippingOption={selectedShippingOption}
          selectShippingOption={setSelectedShippingOption}
          paymentMethods={data.paymentMethods}
          selectedPaymentMethod={selectedPaymentMethod}
          selectPaymentMethod={setSelectedPaymentMethod}
          shippingOptionError={
            errors && errors.root && errors.root.shippingError
          }
          paymentMethodError={
            errors && errors.root && errors.root.paymentMethodError
          }
        ></CartSummary>
        <div ref={bottomRef} />
      </RightContainer>
    </Container>
  );
};
