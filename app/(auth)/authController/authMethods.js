import {
  createUserWithEmailAndPassword,
  deleteUser,
  fetchSignInMethodsForEmail,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { doc, serverTimestamp, setDoc } from "firebase/firestore";
import { auth, db } from "../../../firebaseConfig";

const firebaseSignUp = async (email, password, profileData = {}) => {
  if (email === "" || password === "") {
    throw new Error("Please fill in all fields.");
  }
  // Check if email already exists
  const signInMethods = await fetchSignInMethodsForEmail(auth, email);
  if (signInMethods.length > 0) {
    throw new Error("Email already exists. Please use a different email.");
  }

  const userCredential = await createUserWithEmailAndPassword(
    auth,
    email,
    password,
  );

  try {
    await setDoc(doc(db, profileData.userRole, userCredential.user.uid), {
      uid: userCredential.user.uid,
      email: userCredential.user.email,
      ...profileData,
      createdAt: serverTimestamp(),
    });
  } catch (error) {
    await deleteUser(userCredential.user).catch((deleteError) => {
      console.error("Failed to rollback auth user:", deleteError);
    });
    throw error;
  }

  console.log("User created successfully:", userCredential.user.email);
  return userCredential;
};

const firebaseLogin = async (email, password) => {
  if (email === "" || password === "") {
    throw new Error("Please fill in all fields.");
  }
  try {
    await signInWithEmailAndPassword(auth, email, password);
    setTimeout(() => {
      console.log("User logged in successfully:", email);
    }, 1000);
  } catch (error) {
    throw new Error("Invalid email or password.");
  }
};

export { firebaseLogin, firebaseSignUp };

