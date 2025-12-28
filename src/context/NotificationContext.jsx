import React, { createContext, useContext, useState, useCallback } from 'react';
import Notification from '../components/ui/Notification';

const NotificationContext = createContext(null);

export const NotificationProvider = ({ children }) => {
  const [items, setItems] = useState([]);

  const add = useCallback((type, message, timeout = 4500) => {
    const id = Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
    const item = { id, type, message };
    setItems((s) => [item, ...s]);
    if (timeout > 0) {
      setTimeout(() => setItems((s) => s.filter((i) => i.id !== id)), timeout);
    }
    return id;
  }, []);

  const remove = useCallback((id) => {
    setItems((s) => s.filter((i) => i.id !== id));
  }, []);

  const api = {
    notify: (type, message, timeout) => add(type, message, timeout),
    error: (message, timeout) => add('error', message, timeout),
    success: (message, timeout) => add('success', message, timeout),
    info: (message, timeout) => add('info', message, timeout),
    remove,
  };

  return (
    <NotificationContext.Provider value={api}>
      {children}
      <Notification items={items} onRemove={remove} />
    </NotificationContext.Provider>
  );
};

export const useNotification = () => useContext(NotificationContext);

export default NotificationContext;