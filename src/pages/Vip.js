import { useState, useMemo } from "react";
import axios from "axios";
import { useQuery } from "react-query";
import tw, { styled } from "twin.macro";
import ImageGallery from "react-image-gallery";
import { useParams, useNavigate } from "react-router-dom";

import Button from "../components/productDetails/ProductDetailsButton";
import QuantityPicker from "../components/productDetails/QuantityPicker";
import { isMercadoPagoOn } from "../utils";

const Container = tw.div`flex justify-center px-10 sm:py-12
md:flex-row
py-4 w-full flex flex-1 flex-col my-0 mx-auto  small:mb-12`;

const ImageContainer = styled.div`
  .image-gallery-image {
    display: flex;
    flex: 1;
    height: 500px;
  }
`;
const ImageContainers = tw.div`w-full md:w-1/2 h-120 flex-1`;
const DetailsContainer = tw.div`pt-2 px-0 md:px-10 pb-8 w-full md:w-1/2`;
const Title = tw.h1`font-sans	sm:mt-0 mt-2 text-5xl font-light leading-large`;
const SubTitle = tw.h2`font-sans text-2xl tracking-wide sm:py-8 py-6 font-light`;
const Description = tw.p`font-sans text-gray-600 leading-7`;
const QuantityPickerContainer = tw.div`my-6`;

const getProductById = async ({ queryKey }) => {
  const [_, productId] = queryKey;
  let response;

  response = await axios({
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    method: "get",
    url: `${process.env.REACT_APP_API_URL}/api/products/${productId}`,
  });

  return response.data;
};

const getProductImages = (product) =>
  product.images.map((image) => {
    const originalImageUrl =
      image.image.url && image.image.url.includes("localhost")
        ? `${image.image.url}`
        : `${process.env.REACT_APP_API_URL}${image.image.url}`;
    const thumbnailUrl =
      image.image.url && image.image.url.includes("localhost")
        ? `${image.image.sizes.thumbnail.url}`
        : `${process.env.REACT_APP_API_URL}${image.image.sizes.thumbnail.url}`;
    return {
      original: originalImageUrl,
      thumbnail: thumbnailUrl,
    };
  });

export default () => {
  const navigate = useNavigate();
  let { productId } = useParams();
  const [numberOfitems, updateNumberOfItems] = useState(1);

  const {
    status: status,
    data: product,
    isFetching,
  } = useQuery({
    queryKey: ["products", productId],
    queryFn: getProductById,
    refetchOnWindowFocus: false,
  });

  const productImages = useMemo(() => {
    if (!product) return [];
    console.log("product", product);
    return getProductImages(product);
  }, [product]);

  function goToCheckout() {
    navigate("/checkout", { state: { product: product } });
  }

  if (isFetching || !product) {
    return;
  }

  function increment() {
    updateNumberOfItems(numberOfitems + 1);
  }

  function decrement() {
    if (numberOfitems === 1) return;
    updateNumberOfItems(numberOfitems - 1);
  }
  const loremIpsum = `Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.`;

  return (
    <Container>
      <ImageContainers>
        <ImageContainer>
          <ImageGallery
            items={productImages}
            showBullets={false}
            useBrowserFullscreen={false}
            showPlayButton={false}
            showNav={false}
            showFullscreenButton={true}
            useTranslate3D={false}
          />
        </ImageContainer>
      </ImageContainers>
      <DetailsContainer>
        <Title>{product.title}</Title>
        <SubTitle>${product.price}</SubTitle>
        <Description>
          {!!product.description ? product.description : loremIpsum}
        </Description>

        {isMercadoPagoOn() && (
          <>
          {/* TODO: Enable when product has stock */}
            {false && (
              <QuantityPickerContainer>
                <QuantityPicker
                  increment={increment}
                  decrement={decrement}
                  numberOfitems={numberOfitems}
                />
              </QuantityPickerContainer>
            )}
            <Button full title="Comprar" onClick={goToCheckout} />
          </>
        )}
      </DetailsContainer>
    </Container>
  );
};
