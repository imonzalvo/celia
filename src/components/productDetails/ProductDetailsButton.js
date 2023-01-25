import tw from "twin.macro";


export default function Button({ title, onClick, full = false }) {
    const Button = tw.button`w-full text-sm font-bold tracking-wider bg-transparent hover:bg-black text-black font-semibold hover:text-white py-4 px-12 border-2 border-black hover:border-transparent`;
  return (
    <Button onClick={onClick}>
      <div>
        {title}
      </div>
    </Button>
  )
}