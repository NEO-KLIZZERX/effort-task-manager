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
      title: t('app.taskAdded'),
      description: t('app.taskAddedDesc'),
      className: "bg-white/10 border-white/10 text-white",
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
      title: t('app.taskDeleted'),
      description: t('app.taskDeletedDesc'),
      className: "bg-white/10 border-white/10 text-white",
    });
  };

  return (
    <div className="min-h-screen">
      <Settings />
      <div className="text-center pt-12 pb-8">
        <h1 className="text-5xl md:text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600 mb-4">
          {t('app.title')}
        </h1>
        <p className="text-lg text-white/60">
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