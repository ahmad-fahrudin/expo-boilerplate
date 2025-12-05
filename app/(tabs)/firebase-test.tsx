import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import React, { useEffect, useState } from 'react';
import { Alert, FlatList, Pressable, StyleSheet, TextInput, View } from 'react-native';

import {
  createItem as createItemService,
  deleteItem as deleteItemService,
  fetchItems as fetchItemsService,
  updateItem as updateItemService,
} from '@/services/testService';
import type { Item } from '@/types/test-item';

export default function FirebaseTestScreen() {
  const [text, setText] = useState('');
  const [items, setItems] = useState<Item[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);

  useEffect(() => {
    fetchItems();
  }, []);

  async function createItem() {
    if (!text.trim()) return Alert.alert('Masukkan teks dahulu');
    try {
      const id = await createItemService(text.trim());
      setText('');
      await fetchItems();
      Alert.alert('Berhasil', `Item dibuat (id: ${id})`);
    } catch (e) {
      // eslint-disable-next-line no-console
      console.error(e);
      Alert.alert('Error', 'Gagal membuat item. Pastikan Firebase terkonfigurasi dan paket `firebase` terpasang.');
    }
  }

  async function fetchItems() {
    try {
      const list = await fetchItemsService();
      setItems(list);
    } catch (e) {
      // eslint-disable-next-line no-console
      console.error(e);
      Alert.alert('Error', 'Gagal mengambil items dari Firestore.');
    }
  }

  async function startEdit(item: Item) {
    setEditingId(item.id);
    setText(item.text);
  }

  async function saveEdit() {
    if (!editingId) return;
    try {
      await updateItemService(editingId, text.trim());
      setEditingId(null);
      setText('');
      await fetchItems();
      Alert.alert('Berhasil', 'Item diperbarui');
    } catch (e) {
      // eslint-disable-next-line no-console
      console.error(e);
      Alert.alert('Error', 'Gagal memperbarui item.');
    }
  }

  async function removeItem(id: string) {
    try {
      await deleteItemService(id);
      await fetchItems();
      Alert.alert('Berhasil', 'Item dihapus');
    } catch (e) {
      // eslint-disable-next-line no-console
      console.error(e);
      Alert.alert('Error', 'Gagal menghapus item.');
    }
  }

  return (
    <ThemedView style={styles.container}>
      <ThemedText type="title">Firebase CRUD Test</ThemedText>

      <View style={styles.inputRow}>
        <TextInput
          placeholder="Text untuk disimpan"
          value={text}
          onChangeText={setText}
          style={styles.input}
        />
        <Pressable
          style={[styles.button, { backgroundColor: editingId ? '#0a84ff' : '#20c997' }]}
          onPress={editingId ? saveEdit : createItem}
        >
          <ThemedText type="defaultSemiBold">{editingId ? 'Simpan' : 'Tambah'}</ThemedText>
        </Pressable>
      </View>

      <View style={styles.actionsRow}>
        <Pressable style={styles.smallButton} onPress={fetchItems}>
          <ThemedText type="subtitle">Muat Ulang</ThemedText>
        </Pressable>
      </View>

      <FlatList
        data={items}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.itemRow}>
            <ThemedText style={styles.itemText}>{item.text}</ThemedText>
            <View style={styles.itemActions}>
              <Pressable style={styles.actionButton} onPress={() => startEdit(item)}>
                <ThemedText type="defaultSemiBold">Edit</ThemedText>
              </Pressable>
              <Pressable style={[styles.actionButton, { backgroundColor: '#ff6b6b' }]} onPress={() => removeItem(item.id)}>
                <ThemedText type="defaultSemiBold">Hapus</ThemedText>
              </Pressable>
            </View>
          </View>
        )}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
        contentContainerStyle={{ paddingBottom: 40 }}
      />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  inputRow: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 12,
    marginBottom: 8,
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  button: {
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  actionsRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginBottom: 8,
  },
  smallButton: {
    paddingHorizontal: 8,
    paddingVertical: 6,
    borderRadius: 6,
    backgroundColor: '#e6e6e6',
  },
  itemRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
  },
  itemText: {
    flex: 1,
    marginRight: 12,
  },
  itemActions: {
    flexDirection: 'row',
    gap: 8,
  },
  actionButton: {
    paddingHorizontal: 8,
    paddingVertical: 6,
    borderRadius: 6,
    backgroundColor: '#ffd43b',
    marginLeft: 8,
  },
  separator: {
    height: 1,
    backgroundColor: '#eee',
  },
});
