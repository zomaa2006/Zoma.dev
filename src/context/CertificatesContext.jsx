import { createContext, useContext, useEffect, useState } from 'react';
import { collection, onSnapshot, query, orderBy } from 'firebase/firestore';
import { db } from '../services/firebase';

const CertificatesContext = createContext();
export const useCertificates = () => useContext(CertificatesContext);

export function CertificatesProvider({ children }) {
  const [certificates, setCertificates] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const q = query(collection(db, 'certificates'), orderBy('date', 'desc'));
    const unsub = onSnapshot(q, (snap) => {
      setCertificates(snap.docs.map(d => ({ id: d.id, ...d.data() })));
      setLoading(false);
    }, () => setLoading(false));
    return () => unsub();
  }, []);

  return (
    <CertificatesContext.Provider value={{ certificates, loading }}>
      {children}
    </CertificatesContext.Provider>
  );
}
