import { useContext } from "react";
import Button from "@/components/atoms/Button";
import SearchBar from "@/components/molecules/SearchBar";
import ApperIcon from "@/components/ApperIcon";
import { AuthContext } from "@/App";
import { useSelector } from "react-redux";

const Header = ({ onAddTask, onSearch, searchQuery }) => {
  const { logout } = useContext(AuthContext);
  const { user } = useSelector((state) => state.user);

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
          
          <div className="flex items-center gap-3">
            {user && (
              <div className="flex items-center gap-2 px-3 py-2 bg-slate-100 rounded-lg">
                <ApperIcon name="User" className="w-4 h-4 text-slate-600" />
                <span className="text-sm font-medium text-slate-700">
                  {user.firstName} {user.lastName}
                </span>
              </div>
            )}
            <Button 
              onClick={logout} 
              variant="outline" 
              className="flex items-center gap-2"
            >
              <ApperIcon name="LogOut" className="w-4 h-4" />
              Logout
            </Button>
            <Button onClick={onAddTask} className="flex items-center gap-2 px-6">
              <ApperIcon name="Plus" className="w-4 h-4" />
              Add Task
            </Button>
          </div>
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