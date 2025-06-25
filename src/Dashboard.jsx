import { useState } from "react";
import { auth } from "./firebase.js";
import { useAuthState } from "react-firebase-hooks/auth";
import { useDocumentData } from "react-firebase-hooks/firestore";
import { doc } from "firebase/firestore";
import { db } from "./firebase";
import Calendar from "./Calendar";


const Dashboard = () => {
  const [user] = useAuthState(auth);
  const [userData] = useDocumentData(doc(db, "users", user?.uid));


  const entries =
    userData?.entries?.map((entry) => ({
      ...entry,
      createdAt: entry.createdAt?.toDate(),
    })) || [];

  const handleDateClick = (date) => {
    setSelectedDate(date);
    // Find existing entry for this date
    const existingEntry = entries.find((entry) =>
      isSameDay(new Date(entry.createdAt), date)
    );
    setSelectedEntry(existingEntry || null);
  };

  const handleLogout = () => {
    auth.signOut();
  };


  return (
    // <div className="min-h-screen bg-white">
    //   <p className="text-center text-4xl">DoodleMood</p>

    //   <main className="max-w-6xl mx-auto p-4 grid grid-cols-1 lg:grid-cols-3 gap-8">
    //     <div className="lg:col-span-2">
    //       <Calendar entries={entries} onDateClick={handleDateClick} />
    //     </div>

    //     <div className="space-y-6">
    //       <EntryEditor
    //         userId={user?.uid}
    //         selectedDate={selectedDate}
    //         existingEntry={selectedEntry}
    //         onEntrySaved={() => {
    //           setSelectedEntry(null); // Reset for new entries
    //         }}
    //       />
    //     </div>
    //   </main>
    // </div>
    <div className="bg-white w-full flex items-center justify-center flex-col p-4 gap-4">
      <div className="flex items-center justify-between px-4 w-4/5 mx-auto">
        <p className="text-center text-4xl">DoodleMood</p>
        <button
          onClick={handleLogout}
          className="px-4 py-2 bg-orange-500 text-white rounded-lg cursor-pointer"
        >
          Logout
        </button>
      </div>
      <div className="bg-orange-50 w-5/6 rounded-xl h-screen flex py-4 flex-col gap-2">
        <p className="w-1/2 mx-auto tracking-wide text-orange-500 font-semibold  text-3xl text-center">
          Montly Calendar
        </p>
        <Calendar entries={entries} onDateClick={handleDateClick} />
      </div>
    </div>
  );
};

export default Dashboard;
