import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Plus, CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { TaskCategory, TaskPriority, CATEGORIES, PRIORITIES } from "@/types/task";

interface TaskInputProps {
  onAddTask: (title: string, category: TaskCategory, priority: TaskPriority, dueDate?: Date) => void;
}

export const TaskInput = ({ onAddTask }: TaskInputProps) => {
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState<TaskCategory>("personal");
  const [priority, setPriority] = useState<TaskPriority>("medium");
  const [dueDate, setDueDate] = useState<Date | undefined>();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (title.trim()) {
      onAddTask(title.trim(), category, priority, dueDate);
      setTitle("");
      setDueDate(undefined);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <Input
        type="text"
        placeholder="Add a new task..."
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="h-12 text-base bg-card border-border focus-visible:ring-primary shadow-[var(--shadow-soft)] transition-all duration-300 focus-visible:shadow-[var(--shadow-medium)]"
      />
      
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
        <Select value={category} onValueChange={(value: TaskCategory) => setCategory(value)}>
          <SelectTrigger className="h-11 bg-card border-border shadow-[var(--shadow-soft)]">
            <SelectValue placeholder="Category" />
          </SelectTrigger>
          <SelectContent>
            {CATEGORIES.map((cat) => (
              <SelectItem key={cat.value} value={cat.value}>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: cat.color }} />
                  {cat.label}
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={priority} onValueChange={(value: TaskPriority) => setPriority(value)}>
          <SelectTrigger className="h-11 bg-card border-border shadow-[var(--shadow-soft)]">
            <SelectValue placeholder="Priority" />
          </SelectTrigger>
          <SelectContent>
            {PRIORITIES.map((pri) => (
              <SelectItem key={pri.value} value={pri.value}>
                {pri.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className="h-11 justify-start text-left font-normal bg-card border-border shadow-[var(--shadow-soft)]"
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {dueDate ? format(dueDate, "PPP") : <span>Due date</span>}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="single"
              selected={dueDate}
              onSelect={setDueDate}
              initialFocus
            />
          </PopoverContent>
        </Popover>
      </div>

      <Button
        type="submit"
        size="lg"
        className="w-full h-12 bg-gradient-to-br from-primary to-primary-glow hover:opacity-90 shadow-[var(--shadow-soft)] hover:shadow-[var(--shadow-medium)] transition-all duration-300"
      >
        <Plus className="h-5 w-5 mr-2" />
        Add Task
      </Button>
    </form>
  );
};
