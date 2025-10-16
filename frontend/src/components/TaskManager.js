
import React from "react";
import { Box, Typography, Fab } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import TaskTable from "./TaskTable";
import TaskModal from "./TaskModal";
import { LoadingIndicator } from "./LoadingIndicator";
import useTask from "../hooks/useTask";
import useTaskManager from "../hooks/useTaskManager";


export const TaskManager = () => {
  const { tasks, loading, refreshTasks, setTasks } = useTask();
  const manager = useTaskManager({ onTasksUpdated: setTasks });

  const handleAddClick = () => manager.openForCreate();
  const handleEditClick = (task) => manager.openForEdit(task);
  const handleClose = () => manager.close();
  const handleSave = () => manager.save();
  const handleFileChange = (e) => manager.handleFileChange(e);
  const handleMarkAsDone = (id) => manager.markDone(id);
  const handleDownloadFile = (id, filename) => manager.downloadFile(id, filename);
  const handleDelete = (id) => manager.remove(id);

  return (
    <div>
      {loading ? (
        <LoadingIndicator />
      ) : tasks.length ? (
        <TaskTable
          tasks={tasks}
          onMarkAsDone={handleMarkAsDone}
          onDownloadFile={(data, contentType) => handleDownloadFile(data, contentType)}
          onEdit={handleEditClick}
          onDelete={handleDelete}
        />
      ) : (
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          height="80vh"
        >
          <Typography variant="h4" component="h1" gutterBottom>
            No tasks found!
          </Typography>
        </Box>
      )}
      <TaskModal
        open={manager.open}
        handleClose={handleClose}
        taskData={manager.taskData}
        handleChange={(field, value) => manager.setTaskData((prev) => ({ ...prev, [field]: value }))}
        handleSave={handleSave}
        handleFileChange={handleFileChange}
        file={manager.file}
        isEditing={manager.isEditing}
      />
      <Fab
        aria-label="add"
        color="primary"
        onClick={handleAddClick}
        style={{
          position: "absolute",
          bottom: 16,
          right: 16,
        }}
      >
        <AddIcon />
      </Fab>
    </div>
  );
};