import { useState, useEffect } from "react";
import CategoryPill from "@/components/molecules/CategoryPill";
import Button from "@/components/atoms/Button";
import ApperIcon from "@/components/ApperIcon";
import categoriesService from "@/services/api/categoriesService";
import tasksService from "@/services/api/tasksService";

const CategorySidebar = ({ selectedCategory, onCategorySelect }) => {
  const [categories, setCategories] = useState([]);
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [categoriesData, tasksData] = await Promise.all([
        categoriesService.getAll(),
        tasksService.getAll()
      ]);
      
      // Update task counts for categories
      const updatedCategories = categoriesData.map(category => ({
        ...category,
        taskCount: tasksData.filter(task => task.category === category.name).length
      }));
      
      setCategories(updatedCategories);
      setTasks(tasksData);
    } catch (error) {
      console.error("Failed to load categories and tasks:", error);
    }
  };

  const allCategory = {
    Id: 0,
    name: "All",
    taskCount: tasks.length
  };

  const completedCategory = {
    Id: -1,
    name: "Completed",
    taskCount: tasks.filter(task => task.completed).length
  };

  const allCategories = [allCategory, ...categories, completedCategory];

  return (
    <div className="bg-white h-full border-r border-slate-200 p-6">
      <div className="mb-8">
        <h2 className="text-lg font-bold text-slate-800 mb-4">Categories</h2>
        <div className="space-y-2">
          {allCategories.map(category => (
            <div key={category.Id} className="w-full">
              <CategoryPill
                category={category}
                isActive={selectedCategory === category.name}
                onClick={() => onCategorySelect(category.name)}
                className="w-full justify-between"
              />
            </div>
          ))}
        </div>
      </div>

      <div className="border-t border-slate-200 pt-6">
        <h3 className="text-sm font-semibold text-slate-700 mb-3">Quick Stats</h3>
        <div className="space-y-3">
          <div className="flex items-center justify-between text-sm">
            <span className="text-slate-600">Total Tasks</span>
            <span className="font-semibold text-slate-800">{tasks.length}</span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-slate-600">Completed</span>
            <span className="font-semibold text-green-600">
              {tasks.filter(task => task.completed).length}
            </span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-slate-600">Pending</span>
            <span className="font-semibold text-amber-600">
              {tasks.filter(task => !task.completed).length}
            </span>
          </div>
        </div>
      </div>

      <div className="mt-8 p-4 bg-gradient-to-br from-primary-50 to-primary-100 rounded-lg">
        <div className="text-center">
          <ApperIcon name="Target" className="w-8 h-8 text-primary-600 mx-auto mb-2" />
          <p className="text-sm text-primary-700 font-medium">Stay Focused</p>
          <p className="text-xs text-primary-600 mt-1">
            Complete your daily tasks to build momentum
          </p>
        </div>
      </div>
    </div>
  );
};

export default CategorySidebar;