import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import categoriesService from "@/services/api/categoriesService";
import tasksService from "@/services/api/tasksService";
import ApperIcon from "@/components/ApperIcon";
import FormField from "@/components/molecules/FormField";
import Button from "@/components/atoms/Button";
import Input from "@/components/atoms/Input";
import Select from "@/components/atoms/Select";
import Textarea from "@/components/atoms/Textarea";

const TaskForm = ({ task = null, onSave, onCancel }) => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    priority: "Medium",
    dueDate: "",
    category: "Personal"
  });
const [categories, setCategories] = useState([]);
  const [naturalLanguageInput, setNaturalLanguageInput] = useState("");
  const [isAiParsing, setIsAiParsing] = useState(false);
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

// AI-powered natural language parsing
  const handleAiParse = async () => {
    if (!naturalLanguageInput.trim()) {
      toast.error("Please enter a task description to parse");
      return;
    }

    if (naturalLanguageInput.length > 2000) {
      toast.error("Description too long. Maximum 2000 characters.");
      return;
    }

    setIsAiParsing(true);
    
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      const result = await apperClient.functions.invoke(import.meta.env.VITE_CLAUDE_TASK_PARSER, {
        method: 'POST',
        body: JSON.stringify({
          naturalLanguageInput: naturalLanguageInput.trim()
        }),
        headers: {
          'Content-Type': 'application/json'
        }
      });

      if (result.success && result.data) {
        // Populate form fields with AI-parsed data
        setFormData(prev => ({
          ...prev,
          title: result.data.title || prev.title,
          description: result.data.description || prev.description,
          priority: result.data.priority || prev.priority,
          dueDate: result.data.dueDate || prev.dueDate,
          category: result.data.category || prev.category
        }));
        
        // Clear the natural language input after successful parsing
        setNaturalLanguageInput("");
        toast.success("Task details extracted successfully!");
      } else {
        toast.error(result.error || "Failed to parse task description");
      }
    } catch (error) {
      console.error("Error parsing natural language:", error);
      toast.error("Failed to parse task description. Please try again.");
    } finally {
      setIsAiParsing(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
    <FormField label="Task Title" required error={errors.title}>
        <Input
            value={formData.title}
            onChange={e => handleChange("title", e.target.value)}
            placeholder="Enter task title..." />
    </FormField>
    <FormField label="Description">
        <Textarea
            value={formData.description}
            onChange={e => handleChange("description", e.target.value)}
            placeholder="Add task description..."
            rows={3} />
    </FormField>
    {/* AI-Powered Natural Language Input */}
    <div
        className="mb-6 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-100">
        <div className="flex items-center gap-2 mb-3">
            <ApperIcon name="Sparkles" className="w-5 h-5 text-blue-600" />
            <h3 className="text-sm font-medium text-blue-900">AI-Powered Task Creation</h3>
        </div>
        <p className="text-sm text-blue-700 mb-3">Describe your task in natural language and let AI extract the details for you.
                    </p>
        <div className="space-y-3">
            <Textarea
                value={naturalLanguageInput}
                onChange={e => setNaturalLanguageInput(e.target.value)}
                placeholder="Example: 'I need to call the dentist tomorrow to schedule a cleaning appointment. This is high priority because I've been putting it off for months.'"
                rows={3}
                className="w-full resize-none"
                maxLength={2000} />
            <div className="flex justify-between items-center">
                <span className="text-xs text-blue-600">
                    {naturalLanguageInput.length}/2000 characters
                                </span>
                <Button
                    type="button"
                    onClick={handleAiParse}
                    disabled={!naturalLanguageInput.trim() || isAiParsing}
                    variant="outline"
                    className="flex items-center gap-2 px-4 py-2 text-sm border-blue-200 text-blue-700 hover:bg-blue-50 disabled:opacity-50">
                    {isAiParsing ? <>
                        <ApperIcon name="Loader2" className="w-4 h-4 animate-spin" />Parsing...
                                        </> : <>
                        <ApperIcon name="Wand2" className="w-4 h-4" />Parse with AI
                                        </>}
                </Button>
            </div>
        </div>
    </div>
    {/* Traditional Form Fields */}
    <div className="space-y-4">
        <div className="flex items-center gap-2 mb-2">
            <ApperIcon name="Edit3" className="w-4 h-4 text-gray-600" />
            <span className="text-sm font-medium text-gray-700">Manual Entry</span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField label="Priority">
                <Select
                    value={formData.priority}
                    onChange={e => handleChange("priority", e.target.value)}>
                    <option value="High">High Priority</option>
                    <option value="Medium">Medium Priority</option>
                    <option value="Low">Low Priority</option>
                </Select>
            </FormField>
            <FormField label="Category">
                <Select
                    value={formData.category}
                    onChange={e => handleChange("category", e.target.value)}>
                    {categories.map(category => <option key={category.Id} value={category.name}>
                        {category.name}
                    </option>)}
                </Select>
            </FormField>
        </div>
        <FormField label="Due Date">
            <Input
                type="date"
                value={formData.dueDate}
                onChange={e => handleChange("dueDate", e.target.value)} />
        </FormField>
        <div className="flex gap-3 pt-4">
            <Button type="submit" disabled={loading} className="flex-1">
                {loading ? <>
                    <ApperIcon name="Loader2" className="w-4 h-4 mr-2 animate-spin" />
                    {task ? "Updating..." : "Creating..."}
                </> : <>
                    <ApperIcon name={task ? "Save" : "Plus"} className="w-4 h-4 mr-2" />
                    {task ? "Update Task" : "Create Task"}
                </>}
            </Button>
            <Button type="button" variant="outline" onClick={onCancel} disabled={loading}>Cancel
                        </Button>
        </div>
    </div></form>
  );
};

export default TaskForm;