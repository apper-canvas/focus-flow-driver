import { useState, useEffect, useMemo } from "react";
import { useSelector } from "react-redux";
import TaskItem from "@/components/organisms/TaskItem";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import tasksService from "@/services/api/tasksService";
import { toast } from "react-toastify";
const TaskList = ({ 
  searchQuery = "", 
  selectedCategory = "All", 
  statusFilter = "All",
  priorityFilter = "All",
  onEditTask,
  onRefresh
}) => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    loadTasks();
  }, []);

  useEffect(() => {
    if (onRefresh) {
      loadTasks();
    }
  }, [onRefresh]);

const { user, isAuthenticated } = useSelector((state) => state.user);

  const loadTasks = async () => {
    try {
      setLoading(true);
      setError("");
      
      if (!isAuthenticated || !user) {
        setError("Please log in to view your tasks.");
        return;
      }

      const data = await tasksService.getAll(user.userId);
      setTasks(data);
    } catch (err) {
      setError("Failed to load tasks. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleToggleComplete = async (taskId, completed) => {
    try {
      const updatedTask = await tasksService.update(taskId, { completed });
      setTasks(prev => prev.map(task => 
        task.Id === taskId ? updatedTask : task
      ));
      toast.success(completed ? "Task completed! 🎉" : "Task marked as incomplete");
    } catch (error) {
      toast.error("Failed to update task status");
    }
  };

  const handleDeleteTask = async (taskId) => {
    if (!confirm("Are you sure you want to delete this task?")) return;
    
    try {
      await tasksService.delete(taskId);
      setTasks(prev => prev.filter(task => task.Id !== taskId));
      toast.success("Task deleted successfully");
    } catch (error) {
      toast.error("Failed to delete task");
    }
  };

  const filteredTasks = useMemo(() => {
    return tasks.filter(task => {
      // Search filter
      if (searchQuery && !task.title.toLowerCase().includes(searchQuery.toLowerCase()) &&
          !task.description.toLowerCase().includes(searchQuery.toLowerCase())) {
        return false;
      }

      // Category filter
      if (selectedCategory !== "All" && task.category !== selectedCategory) {
        return false;
      }

      // Status filter
      if (statusFilter !== "All") {
        if (statusFilter === "Completed" && !task.completed) return false;
        if (statusFilter === "Pending" && task.completed) return false;
      }

      // Priority filter
      if (priorityFilter !== "All" && task.priority !== priorityFilter) {
        return false;
      }

      return true;
    }).sort((a, b) => {
      // Sort by completion status (incomplete first), then by priority, then by due date
      if (a.completed !== b.completed) {
        return a.completed ? 1 : -1;
      }
      
      const priorityOrder = { High: 3, Medium: 2, Low: 1 };
      const priorityDiff = priorityOrder[b.priority] - priorityOrder[a.priority];
      if (priorityDiff !== 0) return priorityDiff;
      
      // Sort by due date (earliest first)
      if (a.dueDate && b.dueDate) {
        return new Date(a.dueDate) - new Date(b.dueDate);
      }
      if (a.dueDate && !b.dueDate) return -1;
      if (!a.dueDate && b.dueDate) return 1;
      
      return 0;
    });
  }, [tasks, searchQuery, selectedCategory, statusFilter, priorityFilter]);

  if (loading) {
    return <Loading variant="skeleton" className="p-6" />;
  }

  if (error) {
    return (
      <Error 
        message={error} 
        onRetry={loadTasks}
        className="p-6"
      />
    );
  }

  if (filteredTasks.length === 0) {
    const isEmpty = tasks.length === 0;
    return (
      <Empty
        icon={isEmpty ? "CheckSquare" : "Search"}
        title={isEmpty ? "No tasks yet" : "No matching tasks"}
        description={isEmpty 
          ? "Get started by creating your first task to stay organized and productive" 
          : "Try adjusting your filters or search terms"
        }
        actionText={isEmpty ? "Create Your First Task" : "Clear Filters"}
        onAction={isEmpty ? () => onEditTask(null) : () => window.location.reload()}
        className="p-6"
      />
    );
  }

  return (
    <div className="space-y-3 p-6">
      {filteredTasks.map(task => (
        <TaskItem
          key={task.Id}
          task={task}
          onToggleComplete={handleToggleComplete}
          onEdit={onEditTask}
          onDelete={handleDeleteTask}
        />
      ))}
    </div>
  );
};

export default TaskList;