import React, { createContext, useState, useEffect } from 'react';
import { fetchDocuments ,subscribeToCollection } from "../services/firebaseservice";
export const ContextCategories = createContext();


// Tạo Provider cho Categories
export const CategoriesProvider = ({ children }) => {
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const categoriesData = await fetchDocuments('categories');
      setCategories(categoriesData);
    };
    fetchData();
    // Thiết lập listener thời gian thực
    const unsubscribe = subscribeToCollection('categories', (newCategoriesData) => {
      setCategories(newCategoriesData);
    });

    // Dọn dẹp listener khi component bị gỡ bỏ
    return () => unsubscribe();
  }, []);

  return (
    <ContextCategories.Provider value={categories}>
      {children}
    </ContextCategories.Provider>
  );
};