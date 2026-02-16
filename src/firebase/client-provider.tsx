'use client';

import React, { useMemo } from 'react';
import { initializeFirebase } from './index';
import { FirebaseProvider } from './provider';

/**
 * A client-side provider that initializes Firebase once and wraps the app in the FirebaseProvider.
 */
export const FirebaseClientProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { app, firestore, auth } = useMemo(() => initializeFirebase(), []);

  return (
    <FirebaseProvider app={app} firestore={firestore} auth={auth}>
      {children}
    </FirebaseProvider>
  );
};
