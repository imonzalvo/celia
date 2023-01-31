import tw from "twin.macro";

const CartSumaryContainer = tw.div`flex flex-col w-80 small:w-full shadow-md p-4 rounded-md h-fit m-2 bg-gray-100`;
const Row = tw.div`flex flex-row justify-between`;
const Title = tw.h1`text-xl font-extrabold md:text-xl lg:text-xl xl:text-xl text-gray-900 leading-tight font-sans`;
const Subtitle = tw.h2`text-base font-semibold font-sans`;
const Product = tw.h2`text-base font-light text-gray-700 font-sans`;
const ProductQuantity = tw.h2`text-base font-light text-gray-700 font-sans`;
const BigDivider = tw.hr`h-px my-6 bg-gray-200 border-0 dark:bg-gray-700 w-full`;
const SmallDivider = tw.hr`h-px my-2 bg-gray-200 border-0 dark:bg-gray-700 w-full`;

export default function CartSummary({ product }) {
  return (
    <CartSumaryContainer>
      <Row>
        <Title>Summary</Title>
      </Row>
      <BigDivider />

      <Row>
        <Subtitle>Product</Subtitle>
        <Subtitle>Total</Subtitle>
      </Row>
      <Row>
        <Product>{`${product.title} (1)`}</Product>
        <ProductQuantity>{`$ ${product.price}`}</ProductQuantity>
      </Row>
      <SmallDivider />
    </CartSumaryContainer>
  );
}
