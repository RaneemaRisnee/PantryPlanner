import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { Alert } from 'react-native';

import { loadData, saveData } from '../storage/storage';

const AppDataContext = createContext(null);

function createId() {
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
}

function touchList(lists, listId) {
  const updatedAt = new Date().toISOString();
  return lists.map((list) => (list.id === listId ? { ...list, updatedAt } : list));
}

export function AppDataProvider({ children }) {
  const [data, setData] = useState({ lists: [], items: [] });
  const [status, setStatus] = useState('loading');
  const saveQueue = useRef(Promise.resolve());

  const load = useCallback(async () => {
    setStatus('loading');
    try {
      setData(await loadData());
      setStatus('ready');
    } catch (error) {
      console.error('Could not load saved data', error);
      setStatus('error');
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  // Saving only starts once loading succeeds, so a failed load cannot wipe saved data.
  // Writes are queued so that an older snapshot can never land after a newer one.
  useEffect(() => {
    if (status !== 'ready') return;
    saveQueue.current = saveQueue.current
      .then(() => saveData(data))
      .catch((error) => {
        console.error('Could not save data', error);
        Alert.alert('Not saved', 'Your latest change could not be saved on this device.');
      });
  }, [data, status]);

  const createList = useCallback(({ title, description }) => {
    const now = new Date().toISOString();
    const list = {
      id: createId(),
      title: title.trim(),
      description: description.trim(),
      createdAt: now,
      updatedAt: now,
      completed: false,
      completedAt: null,
    };
    setData((current) => ({ ...current, lists: [list, ...current.lists] }));
    return list.id;
  }, []);

  const updateList = useCallback((listId, { title, description }) => {
    setData((current) => ({
      ...current,
      lists: current.lists.map((list) =>
        list.id === listId
          ? {
              ...list,
              title: title.trim(),
              description: description.trim(),
              updatedAt: new Date().toISOString(),
            }
          : list,
      ),
    }));
  }, []);

  const deleteList = useCallback((listId) => {
    setData((current) => ({
      lists: current.lists.filter((list) => list.id !== listId),
      items: current.items.filter((item) => item.listId !== listId),
    }));
  }, []);

  const setListCompleted = useCallback((listId, completed) => {
    const now = new Date().toISOString();
    setData((current) => ({
      ...current,
      lists: current.lists.map((list) =>
        list.id === listId
          ? { ...list, completed, completedAt: completed ? now : null, updatedAt: now }
          : list,
      ),
    }));
  }, []);

  const addItem = useCallback((listId, fields) => {
    const item = { ...fields, id: createId(), listId, purchased: false };
    setData((current) => ({
      lists: touchList(current.lists, listId),
      items: [...current.items, item],
    }));
  }, []);

  const updateItem = useCallback((itemId, fields) => {
    setData((current) => {
      const existing = current.items.find((item) => item.id === itemId);
      if (!existing) return current;
      return {
        lists: touchList(current.lists, existing.listId),
        items: current.items.map((item) => (item.id === itemId ? { ...item, ...fields } : item)),
      };
    });
  }, []);

  const togglePurchased = useCallback((itemId) => {
    setData((current) => {
      const existing = current.items.find((item) => item.id === itemId);
      if (!existing) return current;
      return {
        lists: touchList(current.lists, existing.listId),
        items: current.items.map((item) =>
          item.id === itemId ? { ...item, purchased: !item.purchased } : item,
        ),
      };
    });
  }, []);

  const deleteItem = useCallback((itemId) => {
    setData((current) => {
      const existing = current.items.find((item) => item.id === itemId);
      if (!existing) return current;
      return {
        lists: touchList(current.lists, existing.listId),
        items: current.items.filter((item) => item.id !== itemId),
      };
    });
  }, []);

  const value = useMemo(
    () => ({
      ...data,
      status,
      reload: load,
      createList,
      updateList,
      deleteList,
      setListCompleted,
      addItem,
      updateItem,
      togglePurchased,
      deleteItem,
    }),
    [
      data,
      status,
      load,
      createList,
      updateList,
      deleteList,
      setListCompleted,
      addItem,
      updateItem,
      togglePurchased,
      deleteItem,
    ],
  );

  return <AppDataContext.Provider value={value}>{children}</AppDataContext.Provider>;
}

export function useAppData() {
  const context = useContext(AppDataContext);
  if (!context) {
    throw new Error('useAppData must be used inside AppDataProvider');
  }
  return context;
}
