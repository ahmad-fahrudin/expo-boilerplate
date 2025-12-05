import initFirebase from '@/config/firebase';
import type { Item } from '@/types/test-item';
import { addDoc, collection, deleteDoc, doc, getDocs, getFirestore, updateDoc } from 'firebase/firestore';

initFirebase();
const db = getFirestore();

export async function createItem(text: string): Promise<string> {
  const col = collection(db, 'testItems');
  const docRef = await addDoc(col, { text, createdAt: Date.now() });
  return docRef.id;
}

export async function fetchItems(): Promise<Item[]> {
  const col = collection(db, 'testItems');
  const snapshot = await getDocs(col);
  const list: Item[] = snapshot.docs.map((d) => ({ id: d.id, text: (d.data() as any).text ?? '' }));
  return list;
}

export async function updateItem(id: string, text: string): Promise<void> {
  const d = doc(db, 'testItems', id);
  await updateDoc(d, { text });
}

export async function deleteItem(id: string): Promise<void> {
  const d = doc(db, 'testItems', id);
  await deleteDoc(d);
}

export default {
  createItem,
  fetchItems,
  updateItem,
  deleteItem,
};
