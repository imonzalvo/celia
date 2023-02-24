import axios from "axios";
import tw from "twin.macro";
import { useQuery } from "react-query";
import { useLocation } from "react-router-dom";
import HashLoader from "react-spinners/HashLoader";

import CartSummary from "components/cartSummary";

const Container = tw.div`flex justify-between flex-1 font-sans max-w-screen-xl px-2
sm:flex-col md:flex-col lg:flex-row xl:flex-row 2xl:flex-row tablet:flex-col tablet:items-center
tablet:mb-20
`;
const HalfContainer = tw.div`flex justify-between flex-1`;
const LeftContainer = tw(HalfContainer)`justify-start tablet:self-start`;
const RightContainer = tw(
  HalfContainer
)`tablet:mt-8 justify-end justify-center tablet:w-full`;

const OrderContainer = tw.div`w-full`;
const Title = tw.h4``;
const OrderInfo = tw.div`gap-4 flex flex-row flex-wrap text-sm text-gray-700`;
const Row = tw.div`flex flex-col justify-around pr-4 border-l-0 border-y-0 border-r-gray-400 border-dashed`;
const RowTitle = tw.span``;
const RowInfo = tw.span`font-bold`;

const OrderSummary = tw.div`flex flex-col mt-8 text-gray-700`;
const OrderSummaryRow = tw.div`flex flex-row mt-4`;
const OrderSummaryTitle = tw.span`font-bold mr-2 whitespace-nowrap`;
const OrderSummaryInfo = tw.span`mr-2`;

const getOrder = async ({ queryKey }) => {
  const [_, orderId] = queryKey;
  const response = await axios({
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    method: "get",
    url: `${process.env.REACT_APP_API_URL}/api/orders/${orderId}?depth=3`,
  });

  return response.data;
};

export default () => {
  const { state } = useLocation();
  const { orderId } = state;

  const { data, isFetching } = useQuery({
    queryKey: ["orderId", orderId],
    queryFn: getOrder,
    refetchOnWindowFocus: false,
  });

  const getFormattedDate = (rawDate) => {
    const date = new Date(rawDate);
    return `${date.getDate()} / ${getFullDateMonth(
      date
    )} / ${date.getFullYear()}`;
  };

  const getFullDateMonth = (date) => {
    let rawMonth = date.getMonth();
    let realMonth = rawMonth + 1;

    return realMonth < 10 ? `0${realMonth}` : realMonth;
  };

  const products =
    data &&
    data.products.map((orderProduct) => {
      const { product } = orderProduct;
      return {
        id: product.id,
        quantity: orderProduct.quantity,
        price: orderProduct.unitPrice,
        title: product.title,
      };
    });
  return (
    <>
      <Container>
        {isFetching && (
          <HashLoader
            loading={isFetching}
            size={350}
            color={"#aaa"}
            aria-label="Loading Spinner"
            data-testid="loader"
          />
        )}
        <LeftContainer>
          <OrderContainer>
            <Title>Gracias! Tu pedido ha sido recibido</Title>
            <OrderInfo>
              <Row>
                <RowTitle>Codigo del pedido</RowTitle>
                <RowInfo>{orderId}</RowInfo>
              </Row>
              <Row>
                <RowTitle>Fecha</RowTitle>
                <RowInfo>
                  {data && data.createdAt && getFormattedDate(data.createdAt)}
                </RowInfo>
              </Row>
              <Row style={{ border: "none" }}>
                <RowTitle>Total</RowTitle>
                <RowInfo>$ {data && data.totalAmount}</RowInfo>
              </Row>
            </OrderInfo>

            <OrderSummary>
              <OrderSummaryRow>
                <OrderSummaryTitle>Metodo de pago:</OrderSummaryTitle>
                <OrderSummaryInfo>
                  {data && data.paymentMethod.name}
                </OrderSummaryInfo>
              </OrderSummaryRow>
              <OrderSummaryRow style={{ border: "none" }}>
                <OrderSummaryTitle>Metodo de envío:</OrderSummaryTitle>
                <span>
                  <OrderSummaryInfo style={{ fontWeight: "bold" }}>
                    {data && `${data.shippingOption.name} - `}
                  </OrderSummaryInfo>
                  <OrderSummaryInfo>
                    {data && data.shippingOption.description}
                  </OrderSummaryInfo>
                </span>
              </OrderSummaryRow>
            </OrderSummary>
          </OrderContainer>
        </LeftContainer>
        <RightContainer>
          {data && data.products && (
            <CartSummary
              products={products}
              shippingOption={data.shippingOption}
              paymentMethod={data.paymentMethod}
            ></CartSummary>
          )}
        </RightContainer>
      </Container>
    </>
  );
};
