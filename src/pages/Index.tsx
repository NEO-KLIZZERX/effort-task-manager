import { useState } from "react";
import { TaskList } from "@/components/TaskList";
import { Task } from "@/types/task";
import { useToast } from "@/components/ui/use-toast";
import { useTranslation } from "react-i18next";
import { Settings } from "@/components/Settings";

const Index = () => {
  const [tasks, setTasks] = useState<Task[]>(() => {
    const savedTasks = localStorage.getItem('tasks');
    return savedTasks ? JSON.parse(savedTasks) : [];
  });
  
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
    const updatedTasks = [newTask, ...tasks];
    setTasks(updatedTasks);
    localStorage.setItem('tasks', JSON.stringify(updatedTasks));
    toast({
      title: t('app.addTask'),
      description: t('app.taskTitle'),
    });
  };

  const handleUpdateTask = (updatedTask: Task) => {
    const updatedTasks = tasks.map((t) => (t.id === updatedTask.id ? updatedTask : t));
    setTasks(updatedTasks);
    localStorage.setItem('tasks', JSON.stringify(updatedTasks));
  };

  const handleDeleteTask = (taskId: string) => {
    const updatedTasks = tasks.filter((t) => t.id !== taskId);
    setTasks(updatedTasks);
    localStorage.setItem('tasks', JSON.stringify(updatedTasks));
    toast({
      title: "Task deleted",
      description: "The task has been removed from your list.",
    });
  };

  return (
    <div className="min-h-screen bg-gradient-soft">
      <Settings />
      <div className="text-center pt-8 pb-4">
        <h1 className="text-4xl font-bold text-primary mb-2">
          {t('app.title')}
        </h1>
        <p className="text-gray-600 text-sm">
          {t('app.subtitle')}
        </p>
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