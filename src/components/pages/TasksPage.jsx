import { useState } from "react";
import Header from "@/components/organisms/Header";
import CategorySidebar from "@/components/organisms/CategorySidebar";
import FilterBar from "@/components/organisms/FilterBar";
import TaskList from "@/components/organisms/TaskList";
import TaskModal from "@/components/organisms/TaskModal";

const TasksPage = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");
  const [priorityFilter, setPriorityFilter] = useState("All");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const handleAddTask = () => {
    setEditingTask(null);
    setIsModalOpen(true);
  };

  const handleEditTask = (task) => {
    setEditingTask(task);
    setIsModalOpen(true);
  };

  const handleSaveTask = () => {
    setRefreshTrigger(prev => prev + 1);
  };

  const handleClearFilters = () => {
    setStatusFilter("All");
    setPriorityFilter("All");
    setSelectedCategory("All");
    setSearchQuery("");
  };

  return (
    <div className="h-screen flex flex-col">
      <Header 
        onAddTask={handleAddTask}
        onSearch={setSearchQuery}
        searchQuery={searchQuery}
      />
      
      <div className="flex-1 flex min-h-0">
        {/* Desktop Sidebar */}
        <div className="hidden lg:block w-80 flex-shrink-0">
          <CategorySidebar
            selectedCategory={selectedCategory}
            onCategorySelect={setSelectedCategory}
          />
        </div>

        {/* Main Content */}
        <div className="flex-1 flex flex-col min-w-0">
          <FilterBar
            statusFilter={statusFilter}
            onStatusFilterChange={setStatusFilter}
            priorityFilter={priorityFilter}
            onPriorityFilterChange={setPriorityFilter}
            onClearFilters={handleClearFilters}
          />
          
          <div className="flex-1 overflow-y-auto">
            <TaskList
              searchQuery={searchQuery}
              selectedCategory={selectedCategory}
              statusFilter={statusFilter}
              priorityFilter={priorityFilter}
              onEditTask={handleEditTask}
              onRefresh={refreshTrigger}
            />
          </div>
        </div>

        {/* Mobile Sidebar Overlay */}
        <div className="lg:hidden">
          {/* Mobile category selector would go here if needed */}
        </div>
      </div>

      <TaskModal
        isOpen={isModalOpen}
        task={editingTask}
        onSave={handleSaveTask}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
};

export default TasksPage;