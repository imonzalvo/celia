import tw from "twin.macro";

const StyledButton = tw.button`mt-8 cursor-pointer w-full text-sm font-bold tracking-wider bg-transparent 
                              hover:bg-black text-black font-semibold 
                              hover:text-white py-4 px-12 border-2 border-black hover:border-transparent 
                              small:fixed small:bottom-0 small:left-0 small:bg-black small:text-white`;

export default function Button({ title, onClick, full = false }) {
  return (
    <StyledButton onClick={onClick}>
      <div>{title}</div>
    </StyledButton>
  );
}
