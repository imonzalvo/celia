import React, { useState } from "react";
import tw from "twin.macro";
import AnimationRevealPage from "helpers/AnimationRevealPage.js";
import Hero from "components/hero/TwoColumnWithVideo.js";
import TabGrid from "components/cards/TabCardGrid.js";
import axios from "axios";
import { useQuery } from "react-query";

const getHomeInfo = async () => {
  const response = await axios({
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    method: "get",
    url: `${process.env.REACT_APP_API_URL}/api/companies/handle/${process.env.REACT_APP_BUSINESS_HANDLE}`,
  });

  console.log(response.data);
  return response.data;
};

const getCategoryById = async (categoryId) => {
  console.log("here", categoryId)
  const response = await axios({
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    method: "get",
    url: `${process.env.REACT_APP_API_URL}/api/categories/${categoryId}/products`,
  });

  console.log(response.data);
  return response.data;
};

export default () => {
  const [activeTab, setActiveTab] = useState("Todos");

  const { status, data, isFetching, error } = useQuery("homeInfo", getHomeInfo);

  // const {
  //   data: category,
  //   refetch: refetchCategory,
  // } = useQuery({
  //   queryKey: ["categories", activeTab],
  //   queryFn: getCategoryById,
  //   enabled: false,
  // });

  const { data: cat } = useQuery(['category', activeTab], getCategoryById)


  const HighlightedText = tw.span`bg-primary-500 text-gray-100 px-4 transform -skew-x-12 inline-block`;
  const imageCss = tw`rounded-4xl h-128`;

  const getTabs = () => {
    let tabsKeys = {};
    tabsKeys["Todos"] = data.products;

    data.categories.forEach((category) => {
      tabsKeys[category.name] = {
        products: [],
        tabName: category.name,
        id: category.id        
      };
    });

    return tabsKeys;
  };

  const description = data.configurations.description;
  const landingImageUrl = data.configurations.image.url;
  const allProducts = data.products;
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
        products={allProducts}
        fetchCategoryProducts={null}
        activeTab={activeTab}
        setActiveTab={(tab) => setActiveTab(tab)}
      />
    </AnimationRevealPage>
  );
};
