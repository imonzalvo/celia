import { useMemo } from "react";
import tw from "twin.macro";

const CartSumaryContainer = tw.div`flex flex-col w-2/3 tablet:w-full shadow-md p-4 rounded-md h-fit m-4 small:m-0 bg-gray-100`;
const Row = tw.div`flex flex-row justify-between items-center`;
const Title = tw.h1`text-xl font-extrabold md:text-xl lg:text-xl xl:text-xl text-gray-900 leading-tight font-sans`;
const Subtitle = tw.h2`text-base font-semibold font-sans`;
const Product = tw.h2`mt-2 mb-2 text-base font-light text-gray-700 font-sans`;
const ProductQuantity = tw.h2`mt-2 mb-2 text-base font-light text-gray-700 font-sans`;
const BigDivider = tw.hr`h-px my-6 bg-gray-200 border-0 dark:bg-gray-700 w-full`;
const SmallDivider = tw.hr`h-px my-2 bg-gray-200 border-0 dark:bg-gray-700 w-full`;
const OptionsContainer = tw.div`flex flex-col`;
const Option = tw.div` cursor-pointer flex flex-row mt-4 justify-between`;
const OptionInfo = tw.div`pr-4`;
const OptionTitle = tw.span`font-sans font-bold`;
const OptionDescription = tw.span`font-sans mr-2 text-sm`;
const Input = tw.input`mr-4 cursor-pointer`;
const ErrorMessage = tw.span`mt-2 ml-4 text-red-600`;

const calculatePaymentMethodCost = (
  paymentMethod,
  paymentMethods,
  selectedPaymentMethod
) => {
  if (!!paymentMethod) {
    return !!paymentMethod.price ? paymentMethod.price : 0;
  }

  const selectedOption = paymentMethods.filter((option) => {
    return option.id == selectedPaymentMethod;
  });

  if (selectedOption.length > 0 && !!selectedOption[0].price) {
    return selectedOption[0].price;
  }
  return 0;
};

const calculateShippingOptionCost = (
  shippingOption,
  shippingOptions,
  selectedShippingOption
) => {
  if (!!shippingOption) {
    return !!shippingOption.price ? shippingOption.price : 0;
  }

  const selectedOption = shippingOptions.filter((option) => {
    return option.id == selectedShippingOption;
  });

  return selectedOption.length > 0 ? selectedOption[0].price : 0;
};

const calculateProductsTotalAmount = (products) =>
  products.reduce((acc, product) => {
    return acc + product.price;
  }, 0);

export default function CartSummary({
  products,
  shippingOptions,
  selectedShippingOption,
  selectShippingOption,
  // Only used for congrats
  shippingOption,
  paymentMethods,
  selectedPaymentMethod,
  selectPaymentMethod,
  // Only used for congrats
  paymentMethod,
  // Errors
  shippingOptionError,
  paymentMethodError,
}) {
  const paymentMethodCost = useMemo(() => {
    return calculatePaymentMethodCost(
      paymentMethod,
      paymentMethods,
      selectPaymentMethod
    );
  }, [paymentMethod, paymentMethods, selectPaymentMethod]);

  const shippingOptionCost = useMemo(() => {
    return calculateShippingOptionCost(
      shippingOption,
      shippingOptions,
      selectedShippingOption
    );
  }, [shippingOption, shippingOptions, selectedShippingOption]);

  const productsTotalAmount = useMemo(() => {
    return calculateProductsTotalAmount(products);
  }, [products]);

  const totalPurchaseAmount =
    productsTotalAmount + paymentMethodCost + shippingOptionCost;

  const renderOptionsSection = (
    optionsTitle,
    options,
    selectedOption,
    selectOption,
    error
  ) => (
    <Row>
      <OptionsContainer>
        <Subtitle>{optionsTitle}</Subtitle>
        {options.map((option) => {
          const optionPrice = option && !!option.price ? option.price : 0;

          return (
            <Option onClick={() => selectOption(option.id)} key={option.id}>
              <OptionInfo>
                <Input
                  type={"radio"}
                  value={option.id}
                  checked={selectedOption === option.id}
                  onChange={(event) => selectOption(event.target.value)}
                ></Input>
                <OptionDescription>
                  <OptionTitle>{option.name}</OptionTitle>
                  {" - "}
                  {option.description}
                </OptionDescription>
              </OptionInfo>
              <span style={{ flex: "none" }}>{`$ ${optionPrice}`}</span>
            </Option>
          );
        })}
        {!!error && <ErrorMessage>{error}</ErrorMessage>}
      </OptionsContainer>
    </Row>
  );

  const renderSelectedOption = (optionsTitle, option) => (
    <>
      <Row>
        <Subtitle>{optionsTitle}</Subtitle>
        <Subtitle>Costo</Subtitle>
      </Row>
      <Row>
        <Product>{`${option.name}`}</Product>
        <ProductQuantity>{`$ ${
          !!option.price ? option.price : 0
        }`}</ProductQuantity>
      </Row>
    </>
  );

  return (
    <CartSumaryContainer>
      <Row>
        <Title>Detalles del Pedido</Title>
      </Row>
      <BigDivider />
      <Row>
        <Subtitle>Producto</Subtitle>
        <Subtitle>Total</Subtitle>
      </Row>
      {products.map((product) => (
        <Row key={product.id}>
          <Product>{`${product.title} (1)`}</Product>
          <ProductQuantity>{`$ ${product.price}`}</ProductQuantity>
        </Row>
      ))}
      {/* <BigDivider />
      <Row>
        <Subtitle>Subtotal</Subtitle>
        <Subtitle>{`$ ${totalPurchaseAmount}`}</Subtitle>
      </Row> */}
      <BigDivider />
      {shippingOptions
        ? renderOptionsSection(
            "Envío",
            shippingOptions,
            selectedShippingOption,
            selectShippingOption,
            shippingOptionError ? "Elegir opción de envío" : false
          )
        : renderSelectedOption("Envío", shippingOption)}
      <BigDivider />
      {!!paymentMethods
        ? renderOptionsSection(
            "Forma de Pago",
            paymentMethods,
            selectedPaymentMethod,
            selectPaymentMethod,
            paymentMethodError ? "Elegir método de pago" : false
          )
        : renderSelectedOption("Forma de pago", paymentMethod)}
      <BigDivider />
      <Row>
        <Subtitle>Total</Subtitle>
        <Subtitle>{`$ ${totalPurchaseAmount}`}</Subtitle>
      </Row>
    </CartSumaryContainer>
  );
}
