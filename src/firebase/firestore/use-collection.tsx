'use client';

import { useState, useEffect } from 'react';
import { 
  onSnapshot, 
  collection, 
  Query, 
  CollectionReference,
  Firestore
} from 'firebase/firestore';
import { useFirestore } from '../provider';
import { errorEmitter } from '../error-emitter';
import { FirestorePermissionError } from '../errors';

/**
 * Hook to subscribe to a Firestore collection or query.
 * @param pathOrQuery The collection path string or a Firestore Query object.
 */
export function useCollection(pathOrQuery: string | Query | CollectionReference) {
  const db = useFirestore();
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!db) return;

    let q: Query | CollectionReference;
    let pathHint: string;

    if (typeof pathOrQuery === 'string') {
      pathHint = pathOrQuery;
      q = collection(db, pathOrQuery);
    } else {
      q = pathOrQuery;
      // Extract path for error context if possible
      pathHint = (q as any).path || 'query';
    }

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const items = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setData(items);
        setLoading(false);
      },
      async (err: any) => {
        const permissionError = new FirestorePermissionError({
          path: pathHint,
          operation: 'list',
        });
        errorEmitter.emit('permission-error', permissionError);
        setError(err);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [db, pathOrQuery]);

  return { data, loading, error };
}
