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
    <div className="w-full max-w-4xl mx-auto p-6 space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-center gap-4 bg-white/5 backdrop-blur-lg rounded-2xl p-6 border border-white/10">
        <h1 className="text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-600">
          EFFORT
        </h1>
        <Button
          onClick={onAddTask}
          className="w-full md:w-auto bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white shadow-lg hover:shadow-xl transition-all duration-200 border-0"
        >
          <PlusCircle className="w-5 h-5 mr-2" />
          {t('app.addTask')}
        </Button>
      </div>
      <div className="grid gap-6">
        {tasks.map((task) => (
          <TaskCard
            key={task.id}
            task={task}
            onUpdate={onUpdateTask}
            onDelete={onDeleteTask}
          />
        ))}
        {tasks.length === 0 && (
          <div className="text-center py-16 bg-white/5 backdrop-blur-lg rounded-2xl border border-white/10">
            <div className="text-2xl font-semibold text-white/60 mb-2">
              {t('app.noTasks')}
            </div>
            <p className="text-white/40">
              {t('app.addTaskPrompt')}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};