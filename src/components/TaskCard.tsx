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
        return "bg-green-400/80";
      case "MEDIUM":
        return "bg-orange-400/80";
      case "HIGH":
        return "bg-red-400/80";
      default:
        return "bg-gray-400/80";
    }
  };

  return (
    <div className="group animate-slide-up bg-white/5 backdrop-blur-lg rounded-xl border border-white/10 overflow-hidden transition-all duration-300 hover:bg-white/10 hover:shadow-lg hover:scale-[1.02] hover:border-white/20">
      <div className="p-4">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-4 flex-1">
            <input
              type="checkbox"
              checked={task.status === "DONE"}
              onChange={() =>
                handleStatusChange(task.status === "DONE" ? "TODO" : "DONE")
              }
              className="w-5 h-5 rounded-lg border-white/20 bg-white/5 checked:bg-purple-500 transition-colors duration-200 hover:border-white/40"
            />
            <input
              value={task.title}
              onChange={(e) => onUpdate({ ...task, title: e.target.value })}
              className="flex-1 text-lg font-medium bg-transparent border-none focus:outline-none text-white/90 placeholder-white/40 transition-colors duration-200"
              placeholder={t('app.taskTitle')}
            />
          </div>
          <div className="flex items-center gap-2">
            <div className={`w-3 h-3 rounded-full ${getPriorityColor(task.priority)} animate-pulse-soft`} />
            <Select value={task.priority} onValueChange={handlePriorityChange}>
              <SelectTrigger className="w-[100px] bg-white/5 border-white/10 text-white/90 hover:bg-white/10 transition-colors duration-200">
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
              className="text-white/60 hover:text-white transition-colors duration-200"
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
              className="text-red-400 hover:text-red-300 opacity-0 group-hover:opacity-100 transition-all duration-200 hover:scale-110"
            >
              <Trash2 className="w-5 h-5" />
            </Button>
          </div>
        </div>
        {isExpanded && (
          <div className="mt-4 space-y-4 animate-fade-in">
            <div>
              <label className="text-sm font-medium text-white/60">{t('app.description')}</label>
              <textarea
                value={task.description}
                onChange={(e) => onUpdate({ ...task, description: e.target.value })}
                className="mt-1 w-full rounded-lg bg-white/5 border border-white/10 text-white/90 shadow-sm p-2 focus:border-purple-500 focus:ring-1 focus:ring-purple-500 placeholder-white/40 transition-all duration-200 hover:bg-white/10"
                rows={3}
                placeholder={t('app.description')}
              />
            </div>
            <div>
              <label className="text-sm font-medium text-white/60">{t('app.subtasks')}</label>
              <div className="mt-2 space-y-2">
                {task.subtasks.map((subtask) => (
                  <div
                    key={subtask.id}
                    className="flex items-center gap-2 group/item animate-task-appear hover:bg-white/5 rounded-lg p-2 transition-all duration-200"
                  >
                    <input
                      type="checkbox"
                      checked={subtask.completed}
                      onChange={() => handleToggleSubtask(subtask.id)}
                      className="w-4 h-4 rounded-lg border-white/20 bg-white/5 checked:bg-purple-500 transition-colors duration-200 hover:border-white/40"
                    />
                    <span
                      className={`flex-1 text-white/90 ${
                        subtask.completed ? "line-through text-white/40" : ""
                      } transition-all duration-200`}
                    >
                      {subtask.title}
                    </span>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDeleteSubtask(subtask.id)}
                      className="opacity-0 group-hover/item:opacity-100 transition-opacity text-white/60 hover:text-white hover:scale-110"
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
                    className="flex-1 bg-white/5 border-white/10 text-white/90 placeholder-white/40 transition-all duration-200 hover:bg-white/10 focus:border-purple-500 focus:ring-1 focus:ring-purple-500"
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
                    className="text-white/60 hover:text-white disabled:opacity-50 transition-all duration-200 hover:scale-110"
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