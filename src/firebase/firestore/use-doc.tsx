'use client';

import { useState, useEffect } from 'react';
import { 
  onSnapshot, 
  doc, 
  DocumentReference,
  Firestore
} from 'firebase/firestore';
import { useFirestore } from '../provider';
import { errorEmitter } from '../error-emitter';
import { FirestorePermissionError } from '../errors';

/**
 * Hook to subscribe to a single Firestore document.
 * @param pathOrRef The document path string or a Firestore DocumentReference.
 */
export function useDoc(pathOrRef: string | DocumentReference) {
  const db = useFirestore();
  const [data, setData] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!db) return;

    let docRef: DocumentReference;
    let pathHint: string;

    if (typeof pathOrRef === 'string') {
      pathHint = pathOrRef;
      docRef = doc(db, pathOrRef);
    } else {
      docRef = pathOrRef;
      pathHint = docRef.path;
    }

    const unsubscribe = onSnapshot(
      docRef,
      (snapshot) => {
        if (snapshot.exists()) {
          setData({ id: snapshot.id, ...snapshot.data() });
        } else {
          setData(null);
        }
        setLoading(false);
      },
      async (err: any) => {
        const permissionError = new FirestorePermissionError({
          path: pathHint,
          operation: 'get',
        });
        errorEmitter.emit('permission-error', permissionError);
        setError(err);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [db, pathOrRef]);

  return { data, loading, error };
}
