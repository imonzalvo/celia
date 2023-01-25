import React from "react";
import tw from "twin.macro";

export default function QuantityPicker({
  increment,
  decrement,
  numberOfitems,
  hideQuantityLabel,
}) {
  const Container = tw.div`flex items-center`;
  const ButtonMinus = tw.button`w-10 h-10 text-xl
    md:w-8 md:h-8 md:text-sm 
    cursor-pointer text-center border pb-.5
    hover:bg-gray-900 hover:text-white
    focus:outline-none`;
  const ButtonPlus = tw.button`w-10 h-10 text-2xl
    md:w-8 md:h-8 md:text-sm
    cursor-pointer text-center border pb-.5
    hover:bg-gray-900 hover:text-white
    focus:outline-none`;

  const NumberOfItems = tw.p`w-10 h-10 pt-4 text-base
  md:w-8 md:h-8 md:pt-4 md:text-xs
  m-0 border-t border-b text-center font-sans`;

  const Quantity = tw.div`px-2 text-xs font-sans`;
  return (
    <Container>
      {!hideQuantityLabel && <Quantity>CANTIDAD</Quantity>}
      <ButtonMinus onClick={increment}>+</ButtonMinus>
      <NumberOfItems>{numberOfitems}</NumberOfItems>
      <ButtonPlus onClick={decrement}>-</ButtonPlus>
    </Container>
  );
}
