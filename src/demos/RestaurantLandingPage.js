import React, { useState } from "react";
import axios from "axios";
import tw from "twin.macro";
import { useQuery } from "react-query";
import { css } from "styled-components/macro"; //eslint-disable-line
import { FloatingWhatsApp } from "react-floating-whatsapp";

import TabGrid from "components/cards/TabCardGrid.js";
import Hero from "components/hero/TwoColumnWithVideo.js";
import AnimationRevealPage from "helpers/AnimationRevealPage.js";
import Footer from "components/footers/FiveColumnWithInputForm.js";

const Container = tw.div`flex flex-1 w-full justify-center`;
const HighlightedText = tw.span`bg-primary-500 text-gray-100 px-4 transform -skew-x-12 inline-block`;

const getHomeInfo = async () => {
  console.log(
    "lo que?",
    `${process.env.REACT_APP_API_URL}/api/companies/handle/${process.env.REACT_APP_BUSINESS_HANDLE}`
  );
  const response = await axios({
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    method: "get",
    url: `${process.env.REACT_APP_API_URL}/api/companies/handle/${process.env.REACT_APP_BUSINESS_HANDLE}`,
  });

  return response.data;
};

const getCategoryById = async ({ queryKey }) => {
  const [_, activeTab] = queryKey;

  let response;

  response = await axios({
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    method: "get",
    url: `${process.env.REACT_APP_API_URL}/api/categories/${activeTab.id}/products`,
  });

  return response.data;
};

export default () => {
  const [activeTab, setActiveTab] = useState({ name: "Todos", id: "todos" });

  const {
    status: landingStatus,
    data,
    isFetching,
    error,
  } = useQuery({
    queryKey: "homeInfo",
    queryFn: getHomeInfo,
    refetchOnWindowFocus: false,
  });

  const whatsAppNumber = process.env.REACT_APP_WHATSAPP_NUMBER;

  const { data: category, isFetching: isFetchingCategoryProducts } = useQuery({
    queryKey: ["categories", activeTab],
    queryFn: getCategoryById,
    enabled: activeTab.id != "todos",
    staleTime: Infinity,
  });

  const imageCss = tw`rounded-4xl h-128`;

  console.log("data", category, data);
  const getTabs = () => {
    let tabsKeys = {};
    tabsKeys["Todos"] = { id: "todos", name: "Todos" };

    data.categories.forEach((category) => {
      tabsKeys[category.name] = {
        tabName: category.name,
        id: category.id,
      };
    });

    return tabsKeys;
  };

  if (isFetching) {
    return;
  }

  const isLocal =
    data && data.company.configurations.image.sizes["tablet"].url.includes("localhost");
  
    const description = data.company.configurations.description;

  const landingImageUrl = `${isLocal ? "" : process.env.REACT_APP_API_URL}${
    data.company.configurations.image.sizes["tablet"].url
  }`;
  return (
    <Container>
      <AnimationRevealPage>
        <Hero
          heading={
            <>
              Manualidades en crochet{" "}
              <HighlightedText>Hechas en casa</HighlightedText>
            </>
          }
          description={description}
          imageSrc={landingImageUrl}
          imageCss={imageCss}
          imageDecoratorBlob={true}
          primaryButtonText="Order Now"
          watchVideoButtonText="Meet The Chefs"
        />
        <TabGrid
          heading={
            <>
              Conocé nuestros <HighlightedText>productos</HighlightedText>
            </>
          }
          tabs={getTabs()}
          products={
            activeTab.id == "todos" || !category
              ? data.products
              : category.products
          }
          activeTab={activeTab}
          setActiveTab={(tab) => setActiveTab(tab)}
          isFetching={isFetchingCategoryProducts}
        />
      </AnimationRevealPage>
    </Container>
  );
};
