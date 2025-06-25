import { initializeApp } from "firebase/app";
import { getAuth  , GoogleAuthProvider} from "firebase/auth";
import {
  getFirestore,
  collection,
  doc,
  getDoc,
  setDoc,
  updateDoc,
  arrayUnion,
} from "firebase/firestore";

const firebaseConfig = {
  apiKey: "",
  authDomain: "",
  projectId: "",
  storageBucket: "",
  messagingSenderId: "",
  appId: "",
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const googleProvider = new GoogleAuthProvider();

// Helper functions
export const createUserDocument = async (user) => {
  const userRef = doc(db, "users", user.uid);
  await setDoc(userRef, {
    uid: user.uid,
    email: user.email,
    displayName:
      user.displayName || `User${Math.random().toString(36).substring(7)}`,
    entries: [],
    createdAt: new Date(),
  });
};


export const addJournalEntry = async (userId, entryData) => {
  const userRef = doc(db, "users", userId);
  
  // First check if user document exists
  const userDoc = await getDoc(userRef);
  
  if (!userDoc.exists()) {
    // Create user document if it doesn't exist
    await setDoc(userRef, {
      uid: userId,
      entries: []
    });
  }
  
  // Add the new entry
  await updateDoc(userRef, {
    entries: arrayUnion({
      id: Date.now().toString(),
      ...entryData
    })
  });
};

export const updateJournalEntry = async (userId, entryId, updatedData) => {
  const userRef = doc(db, "users", userId);
  const userDoc = await getDoc(userRef);
  
  if (!userDoc.exists()) {
    throw new Error("User document not found");
  }
  
  const entries = userDoc.data().entries || [];
  const entryIndex = entries.findIndex(entry => entry.id === entryId);
  
  if (entryIndex === -1) {
    throw new Error("Entry not found");
  }
  
  const updatedEntries = [...entries];
  updatedEntries[entryIndex] = {
    ...updatedEntries[entryIndex],
    ...updatedData
  };
  
  await updateDoc(userRef, { entries: updatedEntries });
};

export const getEntryForDate = async (userId, date) => {
  const userRef = doc(db, 'users', userId);
  const userDoc = await getDoc(userRef);
  const entries = userDoc.data()?.entries || [];
  console.log(date)
  return entries.find(entry => entry.date === date);
};

export const saveEntry = async ({ userId, date, content }) => {
  const userRef = doc(db, 'users', userId);
  const userDoc = await getDoc(userRef);
  const entries = userDoc.data()?.entries || [];
  
  const existingIndex = entries.findIndex(entry => entry.date === date);
  const newEntry = {
    date,
    content,
    updatedAt: new Date()
  };

  if (existingIndex >= 0) {
    entries[existingIndex] = newEntry;
  } else {
    entries.push(newEntry);
  }

  await updateDoc(userRef, { entries });
};
