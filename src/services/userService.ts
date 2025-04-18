import { getDocs, collection, getFirestore } from "firebase/firestore";

const db = getFirestore();

export const getUsers = async () => {
  try {
    const usersSnapshot = await getDocs(collection(db, "users"));
    return usersSnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
  } catch (error) {
    console.error("Error fetching users:", error);
    return [];
  }
};
