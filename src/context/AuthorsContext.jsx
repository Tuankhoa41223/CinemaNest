import React, { createContext, useState, useEffect } from 'react';
import { fetchDocuments, subscribeToCollection } from "../services/firebaseservice";

export const ContextAuthors = createContext();

// Tạo Provider cho Authors
export const AuthorsProvider = ({ children }) => {
  const [authors, setAuthors] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const authorsData = await fetchDocuments('authors');
      setAuthors(authorsData);
    };
    fetchData();

    // Thiết lập listener thời gian thực
    const unsubscribe = subscribeToCollection('authors', (newAuthorsData) => {
      setAuthors(newAuthorsData);
    });
   console.log(authors);
    // Dọn dẹp listener khi component bị gỡ bỏ
    return () => unsubscribe();
  }, []);

  return (
    <ContextAuthors.Provider value={authors}>
      {children}
    </ContextAuthors.Provider>
  );
};
