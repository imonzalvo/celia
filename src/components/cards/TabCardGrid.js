import React, { useState } from "react";
import { motion } from "framer-motion";
import tw from "twin.macro";
import styled from "styled-components";
import { css } from "styled-components/macro"; //eslint-disable-line
import { Container, ContentWithPaddingXl } from "components/misc/Layouts.js";
import { SectionHeading } from "components/misc/Headings.js";
import { ReactComponent as SvgDecoratorBlob1 } from "images/svg-decorator-blob-5.svg";
import { ReactComponent as SvgDecoratorBlob2 } from "images/svg-decorator-blob-7.svg";
import { Lightbox } from "react-modal-image";

import HashLoader from "react-spinners/HashLoader";

const HeaderRow = tw.div`flex justify-between items-center flex-col xl:flex-row`;
const Header = tw(SectionHeading)``;
const TabsControl = tw.div`flex flex-wrap bg-gray-200 px-2 py-2 rounded leading-none mt-12 xl:mt-0`;

const TabControl = styled.div`
  ${tw`cursor-pointer px-6 py-3 sm:mt-0 sm:mr-2 last:mr-0 text-gray-600 font-medium rounded-sm transition duration-300 text-sm sm:text-base  sm:w-auto text-center`}
  &:hover {
    ${tw`bg-gray-300 text-gray-700`}
  }
  ${(props) => props.active && tw`bg-primary-500! text-gray-100!`}
  }
`;
const LoaderContainer = tw(
  motion.div
)`mt-6 flex justify-center sm:-mr-10 md:-mr-6 lg:-mr-12`;

const TabContent = tw(
  motion.div
)`mt-6 flex flex-wrap sm:-mr-10 md:-mr-6 lg:-mr-12`;
const CardContainer = tw.div`mt-10 w-full sm:w-1/2 md:w-1/3 lg:w-1/4 sm:pr-10 md:pr-6 lg:pr-12`;
const Card = tw(
  motion.a
)`bg-gray-200 rounded-b block max-w-xs mx-auto sm:max-w-none sm:mx-0`;
const CardImageContainer = styled.div`
  ${(props) =>
    css`
      background-image: url("${props.imageSrc}");
    `}
  ${tw`h-56 xl:h-64 bg-center bg-cover relative rounded-t`}
`;

const CardText = tw.div`p-4 text-gray-900`;
const CardTitle = tw.h5`text-lg font-semibold group-hover:text-primary-500`;
const CardContent = tw.p`mt-1 text-sm font-medium text-gray-600`;
const CardPrice = tw.p`mt-4 text-xl font-bold`;

const DecoratorBlob1 = styled(SvgDecoratorBlob1)`
  ${tw`pointer-events-none -z-20 absolute right-0 top-0 h-64 w-64 opacity-15 transform translate-x-2/3 -translate-y-12 text-pink-400`}
`;
const DecoratorBlob2 = styled(SvgDecoratorBlob2)`
  ${tw`pointer-events-none -z-20 absolute left-0 bottom-0 h-80 w-80 opacity-15 transform -translate-x-2/3 text-primary-500`}
`;

export default ({
  heading = "Checkout the Menu",
  tabs = {},
  products,
  activeTab,
  setActiveTab,
  isFetching,
}) => {
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState("");
  const [selectedImageTitle, setSelectedImageTitle] = useState("");
  const toggleModal = () => setModalIsOpen(!modalIsOpen);
  /*
   * To customize the tabs, pass in data using the `tabs` prop. It should be an object which contains the name of the tab
   * as the key and value of the key will be its content (as an array of objects).
   * To see what attributes are configurable of each object inside this array see the example above for "Starters".
   */

  return (
    <Container>
      <ContentWithPaddingXl>
        <HeaderRow>
          <Header>{heading}</Header>
          <TabsControl>
            {Object.keys(tabs).map((name, index) => (
              <TabControl
                key={name}
                active={activeTab.name === name}
                onClick={() => {
                  setActiveTab({ name: name, id: tabs[name].id });
                }}
              >
                {name}
              </TabControl>
            ))}
          </TabsControl>
        </HeaderRow>

        {modalIsOpen && (
          <Lightbox
            medium={selectedImage}
            large={selectedImage}
            alt={selectedImageTitle}
            id="3"
            onClose={toggleModal}
          />
        )}
        <TabContent
          variants={{
            current: {
              opacity: 1,
              scale: 1,
              display: "flex",
            },
            hidden: {
              opacity: 0,
              scale: 0.8,
              display: "none",
            },
          }}
          transition={{ duration: 0.4 }}
        >
          {!isFetching &&
            products.map((card, index) => {
              const cardImageThumbnail = `${process.env.REACT_APP_API_URL}${card.image.sizes["thumbnail"].url}`;
              const cardImage = `${process.env.REACT_APP_API_URL}${card.image.url}`;
              return (
                <CardContainer key={card.id}>
                  <Card
                    className="group"
                    href={card.url}
                    initial="rest"
                    whileHover="hover"
                    animate="rest"
                  >
                    <CardImageContainer
                      imageSrc={cardImageThumbnail}
                      onClick={() => {
                        setSelectedImage(cardImage);
                        setSelectedImageTitle(card.title);
                        toggleModal();
                      }}
                    ></CardImageContainer>
                    <CardText>
                      <CardTitle>{card.title}</CardTitle>
                      <CardContent>{card.content}</CardContent>
                      <CardPrice>{`$ ${card.price}`}</CardPrice>
                    </CardText>
                  </Card>
                </CardContainer>
              );
            })}
        </TabContent>
        <LoaderContainer>
            <HashLoader
              loading={isFetching}
              size={350}
              color={"#aaa"}
              aria-label="Loading Spinner"
              data-testid="loader"
            />
          </LoaderContainer>
      </ContentWithPaddingXl>
      <DecoratorBlob1 />
      <DecoratorBlob2 />
    </Container>
  );
};
