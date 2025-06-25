import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { format, parseISO } from "date-fns";
import { getEntryForDate, saveEntry } from "./firebase";
import { auth } from "./firebase.js";
import { useAuthState } from "react-firebase-hooks/auth";
import { analyzeMood } from "./MoodAnalysis.js";

const EntryPage = ({ userId }) => {
  const [user] = useAuthState(auth);
  const { date } = useParams();
  const navigate = useNavigate();
  const [entry, setEntry] = useState(null);
  const [content, setContent] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [results, setResults] = useState({});

  useEffect(() => {
    const fetchEntry = async () => {
      // Replace with your Firestore fetch logic

      const entryData = await getEntryForDate(user.uid, date);
      setEntry(entryData);
      setContent(entryData?.content || "");
      setIsLoading(false);
    };

    fetchEntry();
  }, [date, userId]);

  const handleSave = async () => {
    // Replace with your Firestore save/update logic
    await saveEntry({
      userId: user.uid,
      date,
      content,
    });
    navigate("/");
  };

  const getAnalysis = async () => {
    const data = await analyzeMood(content);
    console.log(data);
    setResults(data);
  };

  if (isLoading) return <div>Loading...</div>;

  return (
    // <div className="max-w-2xl mx-auto p-4">
    //   <h1 className="text-2xl font-bold mb-4">
    //     {format(parseISO(date), 'MMMM d, yyyy')}
    //   </h1>
    //   <textarea
    //     value={content}
    //     onChange={(e) => setContent(e.target.value)}
    //     className="w-full h-64 p-4 border rounded-lg mb-4"
    //     placeholder="Write your thoughts here..."
    //   />
    //   <div className="flex justify-end space-x-2">
    //     <button
    //       onClick={() => navigate('/')}
    //       className="px-4 py-2 border rounded-lg"
    //     >
    //       Cancel
    //     </button>
    //     <button
    //       onClick={handleSave}
    //       className="px-4 py-2 bg-blue-500 text-white rounded-lg"
    //     >
    //       Save
    //     </button>
    //   </div>
    // </div>
    <div className="bg-white w-full flex items-center justify-center flex-col p-4 gap-4">

      <p className="text-center text-4xl cursor-pointer" onClick={() => navigate('/')} >DoodleMood</p>
      <div className="bg-orange-50 w-5/6 rounded-xl h-screen flex py-4 flex-col gap-8">
        <p className="w-1/2 mx-auto tracking-wide text-orange-500 font-semibold  text-3xl text-center">
          {format(parseISO(date), "MMMM d, yyyy")}
        </p>
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="h-64 p-4 border rounded-lg mb-4 w-5/6 mx-auto border-orange-500 border-2 focus:outline-none"
          placeholder="Write your thoughts here..."
        />
        <div className="flex justify-center space-x-2">
          {" "}
          <button
            onClick={() => navigate("/")}
            className="px-4 py-2 border rounded-lg cursor-pointer"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="px-4 py-2 bg-orange-500 text-white rounded-lg cursor-pointer"
          >
            Save
          </button>
          <button
            onClick={() => navigate("/")}
            className="px-4 py-2 bg-gray-700 text-white rounded-lg cursor-pointer"
          >
            Back
          </button>
        </div>
        <div className="flex w-4/5 mx-auto items-center justify-center gap-4 flex-col">
          <button
            onClick={getAnalysis}
            className="px-4 py-2 bg-orange-500 text-white rounded-lg cursor-pointer"
          >
            Get AI Analysis ✨
          </button>
          <div className={`p-4  w-full border-2 rounded-lg `}>
            <div>
              <span className="text-xl font-semibold text-orange-500">
                Mood Color:
              </span>
              <div className={`w-6  h-6 bg-[${results?.hexcolor}]`}></div>
            </div>
            <p className="text-xl font-semibold text-orange-500">
              Mood: {results?.mood}
            </p>
            <p className="text-xl font-semibold text-orange-500">
              Summary : {results?.summary}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EntryPage;
