// hooks/useBanners.js
import { useState, useEffect } from "react";
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "../firebase/config"; // adjust path as needed

const useBanners = (bannerType = null) => {
  const [banners, setBanners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBanners = async () => {
      try {
        setLoading(true);
        let q;
        
        // If bannerType is specified, filter by type, otherwise get all banners
        if (bannerType) {
          q = query(
            collection(db, "banners"), 
            where("type", "==", bannerType)
          );
        } else {
          q = collection(db, "banners");
        }

        const querySnapshot = await getDocs(q);
        const bannersData = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));

        setBanners(bannersData);
      } catch (err) {
        console.error("Error fetching banners:", err);
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchBanners();
  }, [bannerType]);

  return { banners, loading, error };
};

export default useBanners;
