import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Pencil, Trash2, Check, X, Calendar, AlertCircle } from "lucide-react";
import { format, isPast, isToday } from "date-fns";
import { Task, CATEGORIES } from "@/types/task";

interface TaskItemProps {
  task: Task;
  onToggle: (id: string) => void;
  onEdit: (id: string, newTitle: string) => void;
  onDelete: (id: string) => void;
}

export const TaskItem = ({ task, onToggle, onEdit, onDelete }: TaskItemProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(task.title);

  const handleEdit = () => {
    if (editTitle.trim() && editTitle !== task.title) {
      onEdit(task.id, editTitle.trim());
    }
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditTitle(task.title);
    setIsEditing(false);
  };

  const categoryInfo = CATEGORIES.find((c) => c.value === task.category);
  const isOverdue = task.dueDate && !task.completed && isPast(new Date(task.dueDate)) && !isToday(new Date(task.dueDate));
  const isDueToday = task.dueDate && !task.completed && isToday(new Date(task.dueDate));

  const priorityColors = {
    high: "bg-destructive/10 text-destructive border-destructive/20",
    medium: "bg-primary/10 text-primary border-primary/20",
    low: "bg-muted text-muted-foreground border-border",
  };

  return (
    <div
      className={`group flex flex-col gap-3 p-4 rounded-xl bg-card border shadow-[var(--shadow-soft)] hover:shadow-[var(--shadow-medium)] transition-all duration-300 ${
        task.completed ? "opacity-60" : ""
      } ${isOverdue ? "border-destructive/30" : "border-border"}`}
    >
      <div className="flex items-start gap-3">
        <Checkbox
          checked={task.completed}
          onCheckedChange={() => onToggle(task.id)}
          className="h-5 w-5 mt-0.5 border-2 data-[state=checked]:bg-gradient-to-br data-[state=checked]:from-success data-[state=checked]:to-accent data-[state=checked]:border-success transition-all duration-300"
        />

        {isEditing ? (
          <div className="flex-1 flex gap-2">
            <Input
              type="text"
              value={editTitle}
              onChange={(e) => setEditTitle(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleEdit();
                if (e.key === "Escape") handleCancel();
              }}
              className="flex-1 h-9"
              autoFocus
            />
            <Button
              size="sm"
              variant="ghost"
              onClick={handleEdit}
              className="h-9 w-9 p-0 hover:bg-success/10 hover:text-success"
            >
              <Check className="h-4 w-4" />
            </Button>
            <Button
              size="sm"
              variant="ghost"
              onClick={handleCancel}
              className="h-9 w-9 p-0 hover:bg-destructive/10 hover:text-destructive"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        ) : (
          <>
            <div className="flex-1 space-y-2">
              <span
                className={`block text-base ${
                  task.completed
                    ? "line-through text-muted-foreground"
                    : "text-foreground"
                }`}
              >
                {task.title}
              </span>

              <div className="flex flex-wrap items-center gap-2">
                <Badge
                  variant="outline"
                  className="text-xs border"
                  style={{
                    borderColor: categoryInfo?.color,
                    color: categoryInfo?.color,
                  }}
                >
                  <div
                    className="w-2 h-2 rounded-full mr-1.5"
                    style={{ backgroundColor: categoryInfo?.color }}
                  />
                  {categoryInfo?.label}
                </Badge>

                <Badge variant="outline" className={`text-xs ${priorityColors[task.priority]}`}>
                  {task.priority}
                </Badge>

                {task.dueDate && (
                  <Badge
                    variant="outline"
                    className={`text-xs flex items-center gap-1 ${
                      isOverdue
                        ? "bg-destructive/10 text-destructive border-destructive/20"
                        : isDueToday
                        ? "bg-primary/10 text-primary border-primary/20"
                        : "bg-muted text-muted-foreground border-border"
                    }`}
                  >
                    {isOverdue ? (
                      <AlertCircle className="h-3 w-3" />
                    ) : (
                      <Calendar className="h-3 w-3" />
                    )}
                    {format(new Date(task.dueDate), "MMM d")}
                  </Badge>
                )}
              </div>
            </div>

            <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
              <Button
                size="sm"
                variant="ghost"
                onClick={() => setIsEditing(true)}
                className="h-8 w-8 p-0 hover:bg-primary/10 hover:text-primary"
              >
                <Pencil className="h-4 w-4" />
              </Button>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => onDelete(task.id)}
                className="h-8 w-8 p-0 hover:bg-destructive/10 hover:text-destructive"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};
