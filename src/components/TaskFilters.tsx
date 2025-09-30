import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { TaskCategory, CATEGORIES } from "@/types/task";
import { Filter, SortAsc } from "lucide-react";

export type SortOption = "date" | "priority" | "dueDate" | "category";

interface TaskFiltersProps {
  selectedCategory: TaskCategory | "all";
  onCategoryChange: (category: TaskCategory | "all") => void;
  sortBy: SortOption;
  onSortChange: (sort: SortOption) => void;
  showCompleted: boolean;
  onShowCompletedChange: (show: boolean) => void;
}

export const TaskFilters = ({
  selectedCategory,
  onCategoryChange,
  sortBy,
  onSortChange,
  showCompleted,
  onShowCompletedChange,
}: TaskFiltersProps) => {
  return (
    <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center">
      <div className="flex items-center gap-2 text-sm font-medium text-foreground">
        <Filter className="h-4 w-4" />
        Filters:
      </div>

      <div className="flex flex-wrap gap-2 flex-1">
        <Button
          variant={selectedCategory === "all" ? "default" : "outline"}
          size="sm"
          onClick={() => onCategoryChange("all")}
          className={
            selectedCategory === "all"
              ? "bg-gradient-to-br from-primary to-primary-glow"
              : ""
          }
        >
          All
        </Button>
        {CATEGORIES.map((cat) => (
          <Button
            key={cat.value}
            variant={selectedCategory === cat.value ? "default" : "outline"}
            size="sm"
            onClick={() => onCategoryChange(cat.value)}
            className={
              selectedCategory === cat.value
                ? ""
                : "hover:bg-muted"
            }
            style={
              selectedCategory === cat.value
                ? {
                    backgroundColor: cat.color,
                    borderColor: cat.color,
                  }
                : {}
            }
          >
            <div
              className="w-2 h-2 rounded-full mr-1.5"
              style={{ backgroundColor: cat.color }}
            />
            {cat.label}
          </Button>
        ))}
      </div>

      <div className="flex gap-2 items-center">
        <Select value={sortBy} onValueChange={(value: SortOption) => onSortChange(value)}>
          <SelectTrigger className="w-[140px] h-9">
            <SortAsc className="h-4 w-4 mr-2" />
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="date">Date added</SelectItem>
            <SelectItem value="priority">Priority</SelectItem>
            <SelectItem value="dueDate">Due date</SelectItem>
            <SelectItem value="category">Category</SelectItem>
          </SelectContent>
        </Select>

        <Button
          variant="outline"
          size="sm"
          onClick={() => onShowCompletedChange(!showCompleted)}
          className="h-9"
        >
          {showCompleted ? "Hide" : "Show"} completed
        </Button>
      </div>
    </div>
  );
};
