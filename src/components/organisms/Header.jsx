import Button from "@/components/atoms/Button";
import SearchBar from "@/components/molecules/SearchBar";
import ApperIcon from "@/components/ApperIcon";

const Header = ({ onAddTask, onSearch, searchQuery }) => {
  return (
    <header className="bg-white border-b border-slate-200 shadow-sm">
      <div className="px-6 py-4">
        <div className="flex items-center justify-between gap-4 mb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary-500 to-primary-600 flex items-center justify-center">
              <ApperIcon name="CheckSquare" className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-slate-800">Focus Flow</h1>
              <p className="text-sm text-slate-600">Organize your tasks with purpose</p>
            </div>
          </div>
          
          <Button onClick={onAddTask} className="flex items-center gap-2 px-6">
            <ApperIcon name="Plus" className="w-4 h-4" />
            Add Task
          </Button>
        </div>
        
        <div className="max-w-md">
          <SearchBar
            onSearch={onSearch}
            placeholder="Search tasks..."
            className="w-full"
          />
        </div>
      </div>
    </header>
  );
};

export default Header;