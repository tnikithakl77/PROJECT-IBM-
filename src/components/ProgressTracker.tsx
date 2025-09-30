import { CheckCircle2, Circle, TrendingUp } from "lucide-react";
import { Task, CATEGORIES } from "@/types/task";

interface ProgressTrackerProps {
  tasks: Task[];
}

export const ProgressTracker = ({ tasks }: ProgressTrackerProps) => {
  const total = tasks.length;
  const completed = tasks.filter((t) => t.completed).length;
  const percentage = total === 0 ? 0 : Math.round((completed / total) * 100);

  // Calculate completion by category
  const categoryStats = CATEGORIES.map((cat) => {
    const categoryTasks = tasks.filter((t) => t.category === cat.value);
    const categoryCompleted = categoryTasks.filter((t) => t.completed).length;
    const categoryPercentage =
      categoryTasks.length === 0
        ? 0
        : Math.round((categoryCompleted / categoryTasks.length) * 100);

    return {
      ...cat,
      total: categoryTasks.length,
      completed: categoryCompleted,
      percentage: categoryPercentage,
    };
  }).filter((stat) => stat.total > 0);

  return (
    <div className="space-y-6">
      {/* Overall Progress */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 text-foreground">
              <CheckCircle2 className="h-5 w-5 text-success" />
              <span className="text-2xl font-bold">{completed}</span>
              <span className="text-muted-foreground">of</span>
              <span className="text-2xl font-bold">{total}</span>
            </div>
          </div>
          <div className="text-3xl font-bold bg-gradient-to-r from-primary to-primary-glow bg-clip-text text-transparent">
            {percentage}%
          </div>
        </div>

        <div className="relative h-3 bg-secondary rounded-full overflow-hidden shadow-inner">
          <div
            className="h-full bg-gradient-to-r from-success to-accent rounded-full transition-all duration-500 ease-out shadow-[0_0_12px_rgba(34,197,94,0.4)]"
            style={{ width: `${percentage}%` }}
          />
        </div>

        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <Circle className="h-4 w-4" />
            <span>{total - completed} remaining</span>
          </div>
          <span>
            {percentage === 100 && total > 0
              ? "🎉 All done!"
              : percentage > 0
              ? "Keep going!"
              : "Start your tasks"}
          </span>
        </div>
      </div>

      {/* Category Breakdown */}
      {categoryStats.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-sm font-medium text-foreground">
            <TrendingUp className="h-4 w-4" />
            Progress by Category
          </div>
          <div className="space-y-3">
            {categoryStats.map((stat) => (
              <div key={stat.value} className="space-y-1.5">
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <div
                      className="w-2.5 h-2.5 rounded-full"
                      style={{ backgroundColor: stat.color }}
                    />
                    <span className="font-medium">{stat.label}</span>
                  </div>
                  <span className="text-muted-foreground">
                    {stat.completed}/{stat.total} • {stat.percentage}%
                  </span>
                </div>
                <div className="relative h-2 bg-secondary rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-500"
                    style={{
                      width: `${stat.percentage}%`,
                      backgroundColor: stat.color,
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
