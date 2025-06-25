export const Login = ({ signIn }) => {
  return (
    <div className="bg-white w-full flex items-center justify-center flex-col p-4 gap-4">
      <p className="text-center text-4xl">DoodleMood</p>
      <div className="bg-orange-50 w-5/6 rounded-xl h-screen flex items-center justify-center flex-col gap-2">
        <p className="w-1/2 mx-auto tracking-wide  text-6xl text-center">
          Journal your life with <span className="text-orange-500">Power</span>{" "}
          of AI{" "}
        </p>
        <p className="text-gray-700" >Make your day to day entries and let ai analyse your mood and save it for you</p>
        <button onClick={signIn} className="my-4 bg-orange-500 px-4 py-2 rounded text-white cursor-pointer ">
          Sign in with Google
        </button>
      </div>
    </div>
  );
};
