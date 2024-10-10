import React, { createContext, useState, useEffect } from 'react';
import { fetchDocuments, subscribeToCollection } from "../services/firebaseservice";

export const ContextPlans = createContext();

// Create Provider for Plans
export const PlansProvider = ({ children }) => {
  const [plans, setPlans] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const plansData = await fetchDocuments('plans');
      setPlans(plansData);
    };
    fetchData();

    // Set up real-time listener
    const unsubscribe = subscribeToCollection('plans', (newPlansData) => {
      setPlans(newPlansData);
    });

    console.log(plans);
    
    // Clean up listener when component unmounts
    return () => unsubscribe();
  }, []);

  return (
    <ContextPlans.Provider value={plans}>
      {children}
    </ContextPlans.Provider>
  );
};
