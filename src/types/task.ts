export type TaskCategory = "work" | "personal" | "study" | "health";
export type TaskPriority = "high" | "medium" | "low";

export interface Task {
  id: string;
  title: string;
  completed: boolean;
  category: TaskCategory;
  priority: TaskPriority;
  dueDate?: string;
  createdAt: string;
}

export const CATEGORIES: { value: TaskCategory; label: string; color: string }[] = [
  { value: "work", label: "Work", color: "hsl(250 80% 60%)" },
  { value: "personal", label: "Personal", color: "hsl(280 70% 60%)" },
  { value: "study", label: "Study", color: "hsl(200 80% 55%)" },
  { value: "health", label: "Health", color: "hsl(145 65% 55%)" },
];

export const PRIORITIES: { value: TaskPriority; label: string }[] = [
  { value: "high", label: "High" },
  { value: "medium", label: "Medium" },
  { value: "low", label: "Low" },
];
