import { getApps, initializeApp } from 'firebase/app';

// Firebase Web SDK configuration (extracted from workspace `google-services.json`).
export const firebaseConfig = {
  apiKey: 'AIzaSyC564Rkdi4nOSjiyoUqsOIGIDOyMVeU9ow',
  authDomain: 'expo-boilerplate-3bbab.firebaseapp.com',
  projectId: 'expo-boilerplate-3bbab',
  storageBucket: 'expo-boilerplate-3bbab.firebasestorage.app',
  messagingSenderId: '410936478162',
  appId: '1:410936478162:android:6fc050987b47d8d787600b',
};

export function initFirebase() {
  if (!getApps().length) {
    try {
      initializeApp(firebaseConfig);
    } catch (e) {
      // eslint-disable-next-line no-console
      console.warn('Firebase init error', e);
    }
  }
}

export default initFirebase;
