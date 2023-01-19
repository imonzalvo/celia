import React, { useState } from "react";
import tw from "twin.macro";
import { css } from "styled-components/macro"; //eslint-disable-line
import AnimationRevealPage from "helpers/AnimationRevealPage.js";
import Hero from "components/hero/TwoColumnWithVideo.js";
import Features from "components/features/ThreeColSimple.js";
import MainFeature from "components/features/TwoColWithButton.js";
import MainFeature2 from "components/features/TwoColSingleFeatureWithStats2.js";
import TabGrid from "components/cards/TabCardGrid.js";
import Testimonial from "components/testimonials/ThreeColumnWithProfileImage.js";
import DownloadApp from "components/cta/DownloadApp.js";
import Footer from "components/footers/FiveColumnWithInputForm.js";
import axios from "axios";
import { useQuery } from "react-query";
import qs from "qs";

const getHomeInfo = async () => {
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

  console.log("here", activeTab);
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

  const {
    status: categoryStatus,
    data: category,
    isFetching: isFetchingCategoryProducts,
  } = useQuery({
    queryKey: ["categories", activeTab],
    queryFn: getCategoryById,
    enabled: activeTab.id != "todos",
    staleTime: Infinity,
  });

  const HighlightedText = tw.span`bg-primary-500 text-gray-100 px-4 transform -skew-x-12 inline-block`;
  const imageCss = tw`rounded-4xl h-128`;

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

  if (landingStatus === "loading") {
    console.log("loading landingStatus");
  }

  if (landingStatus === "error") {
    console.log("error landingStatus");
  }

  if (categoryStatus === "loading") {
    console.log("loading categoryStatus");
  }

  if (categoryStatus === "error") {
    console.log("error categoryStatus");
  }

  if (isFetching) {
    console.log("is fetching home");
    return;
  }

  if (isFetchingCategoryProducts) {
    console.log("is isFetchingCategoryProducts");
    // return;
  }

  const description = data.configurations.description;
  const landingImageUrl = data.configurations.image.url;
  return (
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
  );
};
