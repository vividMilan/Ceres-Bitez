import {
  createUserWithEmailAndPassword,
  deleteUser,
  fetchSignInMethodsForEmail,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { doc, getDoc, serverTimestamp, setDoc } from "firebase/firestore";
import { auth, db } from "../../../firebaseConfig";

import { useEffect, useState } from "react";



// Add this new function to authMethods.js
const validateUserRole = async (uid, expectedRole) => {
  try {
    const userDocRef = doc(db, expectedRole, uid);
    const userDoc = await getDoc(userDocRef);
    
    if (!userDoc.exists()) {
      throw new Error(`User not found as ${expectedRole}`);
    }
    
    const userData = userDoc.data();
    return {
      uid: uid,
      role: userData.userRole,
      email: userData.email,
      ...userData
    };
  } catch (error) {
    throw new Error(`Role validation failed: ${error.message}`);
  }
};


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
    const userCredential = await signInWithEmailAndPassword(auth, normalizedEmail, normalizedPassword);
    setTimeout(() => {
      console.log("User logged in successfully:", normalizedEmail);
    }, 1000);
    return userCredential.user;
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

const getUserData = () => {
    const [userData, setUserData] = useState(null);
    const [loading, setLoading] = useState(true);
    useEffect(() => {
        const fetchUserData = async () => { 
            try {
                const currentUser = auth.currentUser;
                if (!currentUser) {
                    setLoading(false);
                    return;
                }
                const home = await getDoc(doc(db, "home", currentUser.uid));
                const ngo = await getDoc(doc(db, "ngo", currentUser.uid));
                const restaurants = await getDoc(doc(db, "restaurants", currentUser.uid));
                const volunteers = await getDoc(doc(db, "volunteers", currentUser.uid));
                const students = await getDoc(doc(db, "student", currentUser.uid));
                let snp = null;

                if (home.exists()) snp = home;
                else if (ngo.exists()) snp = ngo;
                else if (restaurants.exists()) snp = restaurants;
                else if (volunteers.exists()) snp = volunteers;
                else if (students.exists()) snp = students;
                if (snp && snp.exists()) {
                    setUserData({ uid: currentUser.uid, ...snp.data() });
                }
            } catch (error) {
                console.error("Error fetching user data:", error);
            } finally {
                setLoading(false);}
        };
        fetchUserData();
    }, []);
    return { userData, loading };
}


export { firebaseLogin, firebaseLogout, firebaseSignUp, getUserData, validateUserRole };

