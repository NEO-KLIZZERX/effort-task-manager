import React, { useState } from "react";
import { ChevronDown, ChevronUp, Trash2, Plus, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Task, SubTask, TaskStatus, TaskPriority } from "@/types/task";
import { useTranslation } from "react-i18next";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface TaskCardProps {
  task: Task;
  onUpdate: (task: Task) => void;
  onDelete: (taskId: string) => void;
}

export const TaskCard: React.FC<TaskCardProps> = ({ task, onUpdate, onDelete }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [newSubtask, setNewSubtask] = useState("");
  const { t } = useTranslation();

  const handleStatusChange = (value: string) => {
    onUpdate({ ...task, status: value as TaskStatus });
  };

  const handlePriorityChange = (value: string) => {
    onUpdate({ ...task, priority: value as TaskPriority });
  };

  const handleAddSubtask = () => {
    if (!newSubtask.trim()) return;
    const subtask: SubTask = {
      id: Date.now().toString(),
      title: newSubtask,
      completed: false,
    };
    onUpdate({
      ...task,
      subtasks: [...task.subtasks, subtask],
    });
    setNewSubtask("");
  };

  const handleToggleSubtask = (subtaskId: string) => {
    const updatedSubtasks = task.subtasks.map((st) =>
      st.id === subtaskId ? { ...st, completed: !st.completed } : st
    );
    onUpdate({ ...task, subtasks: updatedSubtasks });
  };

  const handleDeleteSubtask = (subtaskId: string) => {
    const updatedSubtasks = task.subtasks.filter((st) => st.id !== subtaskId);
    onUpdate({ ...task, subtasks: updatedSubtasks });
  };

  const getPriorityColor = (priority: TaskPriority) => {
    switch (priority) {
      case "LOW":
        return "bg-task-low";
      case "MEDIUM":
        return "bg-task-medium";
      case "HIGH":
        return "bg-task-high";
      default:
        return "bg-gray-400";
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden animate-task-appear">
      <div className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4 flex-1">
            <input
              type="checkbox"
              checked={task.status === "DONE"}
              onChange={() =>
                handleStatusChange(task.status === "DONE" ? "TODO" : "DONE")
              }
              className="w-5 h-5 rounded border-gray-300 text-primary transition-colors duration-200"
            />
            <input
              value={task.title}
              onChange={(e) => onUpdate({ ...task, title: e.target.value })}
              className="flex-1 text-lg font-medium bg-transparent border-none focus:outline-none"
              placeholder={t('app.taskTitle')}
            />
          </div>
          <div className="flex items-center gap-2">
            <div className={`w-3 h-3 rounded-full ${getPriorityColor(task.priority)}`} />
            <Select value={task.priority} onValueChange={handlePriorityChange}>
              <SelectTrigger className="w-[100px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="LOW">{t('app.priority.low')}</SelectItem>
                <SelectItem value="MEDIUM">{t('app.priority.medium')}</SelectItem>
                <SelectItem value="HIGH">{t('app.priority.high')}</SelectItem>
              </SelectContent>
            </Select>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsExpanded(!isExpanded)}
            >
              {isExpanded ? (
                <ChevronUp className="w-5 h-5" />
              ) : (
                <ChevronDown className="w-5 h-5" />
              )}
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onDelete(task.id)}
              className="text-red-500 hover:text-red-600"
              title={t('app.deleteTask')}
            >
              <Trash2 className="w-5 h-5" />
            </Button>
          </div>
        </div>
        {isExpanded && (
          <div className="mt-4 space-y-4">
            <div>
              <label className="text-sm font-medium text-gray-700">{t('app.description')}</label>
              <textarea
                value={task.description}
                onChange={(e) => onUpdate({ ...task, description: e.target.value })}
                className="mt-1 w-full rounded-md border border-gray-300 shadow-sm p-2 focus:border-primary focus:ring-1 focus:ring-primary"
                rows={3}
                placeholder={t('app.description')}
              />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700">{t('app.subtasks')}</label>
              <div className="mt-2 space-y-2">
                {task.subtasks.map((subtask) => (
                  <div
                    key={subtask.id}
                    className="flex items-center gap-2 group animate-task-appear"
                  >
                    <input
                      type="checkbox"
                      checked={subtask.completed}
                      onChange={() => handleToggleSubtask(subtask.id)}
                      className="w-4 h-4 rounded border-gray-300"
                    />
                    <span
                      className={`flex-1 ${
                        subtask.completed ? "line-through text-gray-400" : ""
                      }`}
                    >
                      {subtask.title}
                    </span>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDeleteSubtask(subtask.id)}
                      className="opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
                <div className="flex items-center gap-2">
                  <Input
                    value={newSubtask}
                    onChange={(e) => setNewSubtask(e.target.value)}
                    placeholder={t('app.addSubtask')}
                    className="flex-1"
                    onKeyPress={(e) => {
                      if (e.key === "Enter") {
                        handleAddSubtask();
                      }
                    }}
                  />
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={handleAddSubtask}
                    disabled={!newSubtask.trim()}
                  >
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};