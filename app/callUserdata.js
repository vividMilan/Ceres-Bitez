import { doc, getDoc } from "firebase/firestore";
import { useEffect, useState } from "react";
import { auth, db } from "../firebaseConfig";


export default function useUserdata() {
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
                setLoading(false);
            }
        };

        fetchUserData();
    }, []);

    return { userData, loading };
}
