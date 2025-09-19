import { useState, useEffect } from "react";
import FormField from "@/components/molecules/FormField";
import Input from "@/components/atoms/Input";
import Textarea from "@/components/atoms/Textarea";
import Select from "@/components/atoms/Select";
import Button from "@/components/atoms/Button";
import ApperIcon from "@/components/ApperIcon";
import tasksService from "@/services/api/tasksService";
import categoriesService from "@/services/api/categoriesService";
import { toast } from "react-toastify";

const TaskForm = ({ task = null, onSave, onCancel }) => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    priority: "Medium",
    dueDate: "",
    category: "Personal"
  });
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    loadCategories();
    if (task) {
      setFormData({
        title: task.title,
        description: task.description || "",
        priority: task.priority,
        dueDate: task.dueDate || "",
        category: task.category
      });
    }
  }, [task]);

  const loadCategories = async () => {
    try {
      const data = await categoriesService.getAll();
      setCategories(data);
    } catch (error) {
      toast.error("Failed to load categories");
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.title.trim()) {
      newErrors.title = "Task title is required";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    try {
      let savedTask;
      if (task) {
        savedTask = await tasksService.update(task.Id, formData);
        toast.success("Task updated successfully!");
      } else {
        savedTask = await tasksService.create(formData);
        toast.success("Task created successfully!");
      }
      onSave(savedTask);
    } catch (error) {
      toast.error(task ? "Failed to update task" : "Failed to create task");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: null }));
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <FormField 
        label="Task Title" 
        required 
        error={errors.title}
      >
        <Input
          value={formData.title}
          onChange={(e) => handleChange("title", e.target.value)}
          placeholder="Enter task title..."
        />
      </FormField>

      <FormField label="Description">
        <Textarea
          value={formData.description}
          onChange={(e) => handleChange("description", e.target.value)}
          placeholder="Add task description..."
          rows={3}
        />
      </FormField>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormField label="Priority">
          <Select
            value={formData.priority}
            onChange={(e) => handleChange("priority", e.target.value)}
          >
            <option value="High">High Priority</option>
            <option value="Medium">Medium Priority</option>
            <option value="Low">Low Priority</option>
          </Select>
        </FormField>

        <FormField label="Category">
          <Select
            value={formData.category}
            onChange={(e) => handleChange("category", e.target.value)}
          >
            {categories.map(category => (
              <option key={category.Id} value={category.name}>
                {category.name}
              </option>
            ))}
          </Select>
        </FormField>
      </div>

      <FormField label="Due Date">
        <Input
          type="date"
          value={formData.dueDate}
          onChange={(e) => handleChange("dueDate", e.target.value)}
        />
      </FormField>

      <div className="flex gap-3 pt-4">
        <Button
          type="submit"
          disabled={loading}
          className="flex-1"
        >
          {loading ? (
            <>
              <ApperIcon name="Loader2" className="w-4 h-4 mr-2 animate-spin" />
              {task ? "Updating..." : "Creating..."}
            </>
          ) : (
            <>
              <ApperIcon name={task ? "Save" : "Plus"} className="w-4 h-4 mr-2" />
              {task ? "Update Task" : "Create Task"}
            </>
          )}
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          disabled={loading}
        >
          Cancel
        </Button>
      </div>
    </form>
  );
};

export default TaskForm;