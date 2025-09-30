import { useState, useMemo } from "react";
import { TaskInput } from "@/components/TaskInput";
import { TaskItem } from "@/components/TaskItem";
import { TaskFilters, SortOption } from "@/components/TaskFilters";
import { ProgressTracker } from "@/components/ProgressTracker";
import { ThemeToggle } from "@/components/ThemeToggle";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { CheckSquare } from "lucide-react";
import { toast } from "sonner";
import { Task, TaskCategory, TaskPriority } from "@/types/task";
import { isPast, isToday } from "date-fns";

const Index = () => {
  const [tasks, setTasks] = useLocalStorage<Task[]>("tasks", []);
  const [selectedCategory, setSelectedCategory] = useState<TaskCategory | "all">("all");
  const [sortBy, setSortBy] = useState<SortOption>("date");
  const [showCompleted, setShowCompleted] = useState(true);

  const addTask = (
    title: string,
    category: TaskCategory,
    priority: TaskPriority,
    dueDate?: Date
  ) => {
    const newTask: Task = {
      id: crypto.randomUUID(),
      title,
      category,
      priority,
      completed: false,
      dueDate: dueDate?.toISOString(),
      createdAt: new Date().toISOString(),
    };
    setTasks([...tasks, newTask]);
    toast.success("Task added successfully!");
  };

  const toggleTask = (id: string) => {
    setTasks(
      tasks.map((task) =>
        task.id === id ? { ...task, completed: !task.completed } : task
      )
    );
  };

  const editTask = (id: string, newTitle: string) => {
    setTasks(
      tasks.map((task) => (task.id === id ? { ...task, title: newTitle } : task))
    );
    toast.success("Task updated!");
  };

  const deleteTask = (id: string) => {
    setTasks(tasks.filter((task) => task.id !== id));
    toast.success("Task deleted!");
  };

  // Filter and sort tasks
  const filteredAndSortedTasks = useMemo(() => {
    let filtered = tasks;

    // Filter by category
    if (selectedCategory !== "all") {
      filtered = filtered.filter((task) => task.category === selectedCategory);
    }

    // Filter by completion status
    if (!showCompleted) {
      filtered = filtered.filter((task) => !task.completed);
    }

    // Sort tasks
    const sorted = [...filtered].sort((a, b) => {
      switch (sortBy) {
        case "priority":
          const priorityOrder = { high: 0, medium: 1, low: 2 };
          return priorityOrder[a.priority] - priorityOrder[b.priority];
        case "dueDate":
          if (!a.dueDate && !b.dueDate) return 0;
          if (!a.dueDate) return 1;
          if (!b.dueDate) return -1;
          return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
        case "category":
          return a.category.localeCompare(b.category);
        case "date":
        default:
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      }
    });

    return sorted;
  }, [tasks, selectedCategory, sortBy, showCompleted]);

  // Check for overdue tasks
  const overdueTasks = tasks.filter(
    (task) => task.dueDate && !task.completed && isPast(new Date(task.dueDate)) && !isToday(new Date(task.dueDate))
  );

  return (
    <div className="min-h-screen bg-background py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Theme Toggle - Fixed Position */}
        <div className="fixed top-6 right-6 z-50">
          <ThemeToggle />
        </div>

        {/* Header */}
        <div className="text-center mb-8 space-y-2">
          <div className="flex items-center justify-center gap-3 mb-3">
            <div className="p-3 rounded-2xl bg-gradient-to-br from-primary to-primary-glow shadow-[var(--shadow-medium)]">
              <CheckSquare className="h-8 w-8 text-primary-foreground" />
            </div>
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold bg-gradient-to-r from-primary to-primary-glow bg-clip-text text-transparent">
            Task Manager
          </h1>
          <p className="text-lg text-muted-foreground">
            Organize your day, track your progress
          </p>
          {overdueTasks.length > 0 && (
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-destructive/10 text-destructive text-sm font-medium">
              ⚠️ You have {overdueTasks.length} overdue task{overdueTasks.length > 1 ? "s" : ""}
            </div>
          )}
        </div>

        {/* Progress Tracker */}
        <div className="mb-8 p-6 rounded-2xl bg-card border border-border shadow-[var(--shadow-medium)]">
          <ProgressTracker tasks={tasks} />
        </div>

        {/* Task Input */}
        <div className="mb-6 p-6 rounded-2xl bg-card border border-border shadow-[var(--shadow-medium)]">
          <TaskInput onAddTask={addTask} />
        </div>

        {/* Filters */}
        {tasks.length > 0 && (
          <div className="mb-6 p-4 rounded-2xl bg-card border border-border shadow-[var(--shadow-soft)]">
            <TaskFilters
              selectedCategory={selectedCategory}
              onCategoryChange={setSelectedCategory}
              sortBy={sortBy}
              onSortChange={setSortBy}
              showCompleted={showCompleted}
              onShowCompletedChange={setShowCompleted}
            />
          </div>
        )}

        {/* Task List */}
        <div className="space-y-3">
          {filteredAndSortedTasks.length === 0 ? (
            <div className="text-center py-12 px-4 rounded-2xl bg-card border border-border border-dashed">
              <p className="text-lg text-muted-foreground">
                {tasks.length === 0
                  ? "No tasks yet. Add one to get started! 🚀"
                  : "No tasks match your filters"}
              </p>
            </div>
          ) : (
            filteredAndSortedTasks.map((task) => (
              <TaskItem
                key={task.id}
                task={task}
                onToggle={toggleTask}
                onEdit={editTask}
                onDelete={deleteTask}
              />
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default Index;
