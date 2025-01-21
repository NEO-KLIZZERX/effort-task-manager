import { useState } from "react";
import { TaskList } from "@/components/TaskList";
import { Task } from "@/types/task";
import { useToast } from "@/components/ui/use-toast";

const Index = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const { toast } = useToast();

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
      title: "Task created",
      description: "A new task has been added to your list.",
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
      <div className="text-center pt-8 pb-4">
        <h1 className="text-4xl font-bold text-gray-800 mb-2">EFFORT Task Manager</h1>
        <p className="text-gray-600 text-sm">By Eclipse Forge Studio</p>
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