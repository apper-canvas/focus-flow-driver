import { motion } from "framer-motion";
import TaskForm from "@/components/organisms/TaskForm";
import ApperIcon from "@/components/ApperIcon";

const TaskModal = ({ isOpen, task, onSave, onClose }) => {
  if (!isOpen) return null;

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const handleSave = (savedTask) => {
    onSave(savedTask);
    onClose();
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50"
      onClick={handleBackdropClick}
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
      >
        <div className="p-6 border-b border-slate-200">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-slate-800">
              {task ? "Edit Task" : "Create New Task"}
            </h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
            >
              <ApperIcon name="X" className="w-5 h-5 text-slate-500" />
            </button>
          </div>
        </div>
        
        <div className="p-6">
          <TaskForm
            task={task}
            onSave={handleSave}
            onCancel={onClose}
          />
        </div>
      </motion.div>
    </motion.div>
  );
};

export default TaskModal;