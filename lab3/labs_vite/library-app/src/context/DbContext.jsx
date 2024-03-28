import { createContext, useEffect, useState } from "react";
import { openDb } from "../indexedDB/api";

export const DbContext = createContext(null);

const DbContextProvider = ({ children }) => {
  const [db, setDb] = useState(null);
  useEffect(() => {
    async function openDatabase() {
      const db = await openDb();
      setDb(db);
    }
    openDatabase();
  }, []);
  return <DbContext.Provider value={db}>{children}</DbContext.Provider>;
};
export default DbContextProvider;
