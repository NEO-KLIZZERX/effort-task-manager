import { useState } from "react";
import { TaskList } from "@/components/TaskList";
import { Task } from "@/types/task";
import { useToast } from "@/components/ui/use-toast";
import { useTranslation } from "react-i18next";
import { Settings } from "@/components/Settings";

const Index = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const { toast } = useToast();
  const { t } = useTranslation();

  const handleAddTask = () => {
    const newTask: Task = {
      id: Date.now().toString(),
      title: "",
      description: "",
      status: "TODO",
      priority: "MEDIUM",
      subtasks: [],
    };
    setTasks([newTask, ...tasks]);
    toast({
      title: t('app.addTask'),
      description: t('app.noTasks'),
    });
  };

  const handleUpdateTask = (updatedTask: Task) => {
    setTasks(tasks.map((t) => (t.id === updatedTask.id ? updatedTask : t)));
  };

  const handleDeleteTask = (taskId: string) => {
    setTasks(tasks.filter((t) => t.id !== taskId));
    toast({
      title: "Task deleted",
      description: "The task has been removed from your list.",
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Settings />
      <div className="text-center pt-8 pb-4">
        <h1 className="text-4xl font-bold text-gray-800 mb-2">{t('app.title')}</h1>
        <p className="text-gray-600 text-sm">{t('app.subtitle')}</p>
      </div>
      <TaskList
        tasks={tasks}
        onAddTask={handleAddTask}
        onUpdateTask={handleUpdateTask}
        onDeleteTask={handleDeleteTask}
      />
    </div>
  );
};

export default Index;