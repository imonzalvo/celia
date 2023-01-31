import { useState } from "react";
// import Head from 'next/head'
import tw from "twin.macro";

import Button from "../components/productDetails/ProductDetailsButton";
import QuantityPicker from "../components/productDetails/QuantityPicker";


const Cont = tw.div`flex justify-center px-10`;
const Container = tw.div`sm:py-12
md:flex-row
py-4 w-full flex flex-1 flex-col my-0 mx-auto`;

const ImageContainer = tw.div`w-full md:w-1/2 h-120 flex flex-1`;
const ImageContainer2 = tw.div`flex flex-1 justify-center items-center`;
const Image = tw.img`max-h-full max-w-full`;

const DetailsContainer = tw.div`pt-2 px-0 md:px-10 pb-8 w-full md:w-1/2`;
const Title = tw.h1`font-sans	sm:mt-0 mt-2 text-5xl font-light leading-large`;
const SubTitle = tw.h2`font-sans text-2xl tracking-wide sm:py-8 py-6 font-light`;
const Description = tw.p`font-sans text-gray-600 leading-7`;
const QuantityPickerContainer = tw.div`my-6`;


export default ({ product, goToCheckout }) => {
  const [numberOfitems, updateNumberOfItems] = useState(1);

  const { price, image, title, description } = product;

  function increment() {
    updateNumberOfItems(numberOfitems + 1);
  }

  function decrement() {
    if (numberOfitems === 1) return;
    updateNumberOfItems(numberOfitems - 1);
  }
  const productImageUrl = `${process.env.REACT_APP_API_URL}${image.url}`;
  const loremIpsum = `Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.`;
  return (
    <>
      <Cont>
        <Container>
          <ImageContainer>
            <ImageContainer2>
              <Image src={productImageUrl} alt="Inventory item" />
            </ImageContainer2>
          </ImageContainer>
          <DetailsContainer>
            <Title>{title}</Title>
            <SubTitle>${price}</SubTitle>
            <Description>
              {!!description ? description : loremIpsum}
            </Description>
            <QuantityPickerContainer>
              <QuantityPicker
                increment={increment}
                decrement={decrement}
                numberOfitems={numberOfitems}
              />
            </QuantityPickerContainer>
            <Button full title="Comprar" onClick={goToCheckout} />
          </DetailsContainer>
        </Container>
      </Cont>
    </>
  );
};
