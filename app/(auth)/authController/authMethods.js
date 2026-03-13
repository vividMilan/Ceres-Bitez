import {
  createUserWithEmailAndPassword,
  deleteUser,
  fetchSignInMethodsForEmail,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { doc, serverTimestamp, setDoc } from "firebase/firestore";
import { auth, db } from "../../../firebaseConfig";

const firebaseSignUp = async (email, password, profileData = {}) => {
  const normalizedEmail = email?.trim().toLowerCase();
  const normalizedPassword = password ?? "";

  if (normalizedEmail === "" || normalizedPassword === "") {
    throw new Error("Please fill in all fields.");
  }
  // Check if email already exists
  const signInMethods = await fetchSignInMethodsForEmail(auth, normalizedEmail);
  if (signInMethods.length > 0) {
    throw new Error("Email already exists. Please use a different email.");
  }

  const userCredential = await createUserWithEmailAndPassword(
    auth,
    normalizedEmail,
    normalizedPassword,
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
  const normalizedEmail = email?.trim().toLowerCase();
  const normalizedPassword = password ?? "";

  if (normalizedEmail === "" || normalizedPassword === "") {
    throw new Error("Please fill in all fields.");
  }
  try {
    await signInWithEmailAndPassword(auth, normalizedEmail, normalizedPassword);
    setTimeout(() => {
      console.log("User logged in successfully:", normalizedEmail);
    }, 1000);
  } catch (error) {
        console.error("Login failed for email:", normalizedEmail, error);

    throw new Error("Invalid email or password.");
  } 
}; 


const firebaseLogout = async () => {
  try {
    await auth.signOut();
    console.log("User logged out successfully");
  } catch (error) {
    console.error("Logout failed:", error);
    throw new Error("Failed to log out. Please try again.");
  }
};

export { firebaseLogin, firebaseLogout, firebaseSignUp };

