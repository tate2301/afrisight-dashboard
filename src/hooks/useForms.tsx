import { useState, useEffect } from "react";
import { getDocs, collection } from "firebase/firestore";
import { db } from "../lib/firebase";
import { FormType } from "../utils/types";
import { getMessage } from "../helpers/getMessage";

const useForms = () => {
  const [forms, setForms] = useState<FormType[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const getAllForms = async () => {
    try {
      const snapshot = await getDocs(collection(db, "forms"));
      const fetchedForms = snapshot.docs.map((doc) => ({
        id: doc.id,
        form: {
          ...(doc.data() as Omit<FormType["form"], "id">),
        },
      }));
      setForms(fetchedForms);
    } catch (err) {
      setError(getMessage(err));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getAllForms();
  }, []);

  return { forms, loading, error };
};

export default useForms;
