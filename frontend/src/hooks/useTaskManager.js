import { useState } from 'react';
import {
  createTask,
  updateTask,
  deleteTask,
  downloadTaskFile,
  markTaskAsDone,
  fetchTasks,
} from '../services';
import { downloadBlob } from '../utils';

export default function useTaskManager({ onTasksUpdated } = {}) {
  const [open, setOpen] = useState(false);
  const [taskData, setTaskData] = useState(null);
  const [file, setFile] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);

  const openForCreate = () => {
    setIsEditing(false);
    setTaskData({ title: '', description: '', deadline: '', status: 'TODO' });
    setFile(null);
    setOpen(true);
  };

  const openForEdit = (task) => {
    setIsEditing(true);
    setTaskData(task);
    setFile(null);
    setOpen(true);
  };

  const close = () => {
    setOpen(false);
    setTaskData(null);
    setFile(null);
  };

  const handleFileChange = (event) => {
    if (!event) return;
    if (event.target?.files?.length) setFile(event.target.files[0]);
    else setFile(null);
  };

  const save = async () => {
    if (!taskData) return;
    setSaving(true);
    try {
      if (isEditing) {
        await updateTask(taskData._id, {
          title: taskData.title,
          description: taskData.description,
          deadline: taskData.deadline,
        });
      } else {
        const form = new FormData();
        form.append('title', taskData.title);
        form.append('description', taskData.description);
        form.append('deadline', taskData.deadline);
        form.append('status', taskData.status || 'TODO');
        if (file) form.append('pdf', file);
        await createTask(form);
      }

      // refresh tasks externally if callback provided
      if (onTasksUpdated) {
        const data = await fetchTasks();
        onTasksUpdated(data);
      }

      close();
    } catch (err) {
      console.error('save task failed', err);
    } finally {
      setSaving(false);
    }
  };

  const remove = async (id) => {
    if (!window.confirm('Are you sure you want to delete this task?')) return;
    await deleteTask(id);
    if (onTasksUpdated) {
      const data = await fetchTasks();
      onTasksUpdated(data);
    }
  };

  const markDone = async (id) => {
    await markTaskAsDone(id);
    if (onTasksUpdated) {
      const data = await fetchTasks();
      onTasksUpdated(data);
    }
  };

  const downloadFile = async (id, filename) => {
    try {
      const res = await downloadTaskFile(id);
      const contentType = res.headers['content-type'] || 'application/pdf';
      downloadBlob(res.data, contentType, filename);
    } catch (err) {
      console.error('downloadFile error', err);
      alert('Unable to download file');
    }
  };

  return {
    open,
    taskData,
    setTaskData,
    file,
    isEditing,
    saving,
    openForCreate,
    openForEdit,
    close,
    handleFileChange,
    save,
    remove,
    markDone,
    downloadFile,
  };
}
