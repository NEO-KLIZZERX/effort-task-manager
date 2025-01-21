import React from "react";
import { PlusCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { TaskCard } from "./TaskCard";
import { Task } from "@/types/task";
import { useTranslation } from "react-i18next";

interface TaskListProps {
  tasks: Task[];
  onAddTask: () => void;
  onUpdateTask: (task: Task) => void;
  onDeleteTask: (taskId: string) => void;
}

export const TaskList: React.FC<TaskListProps> = ({
  tasks,
  onAddTask,
  onUpdateTask,
  onDeleteTask,
}) => {
  const { t } = useTranslation();

  return (
    <div className="w-full max-w-4xl mx-auto p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-semibold">{t('app.title')}</h1>
        <Button
          onClick={onAddTask}
          className="flex items-center gap-2 bg-white hover:bg-gray-50 text-gray-800 border border-gray-200 shadow-sm transition-all duration-200"
        >
          <PlusCircle className="w-5 h-5" />
          {t('app.addTask')}
        </Button>
      </div>
      <div className="space-y-4">
        {tasks.map((task) => (
          <TaskCard
            key={task.id}
            task={task}
            onUpdate={onUpdateTask}
            onDelete={onDeleteTask}
          />
        ))}
        {tasks.length === 0 && (
          <div className="text-center py-12 text-gray-500">
            {t('app.noTasks')}
          </div>
        )}
      </div>
    </div>
  );
};