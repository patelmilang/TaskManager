import { useEffect, useState, useCallback } from 'react';
import { fetchTasks } from '../services';

export default function useTask() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const data = await fetchTasks();
      setTasks(data || []);
    } catch (err) {
      console.error('useTask: fetchTasks failed', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  return { tasks, loading, refreshTasks: load, setTasks };
}
