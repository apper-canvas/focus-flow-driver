import Select from "@/components/atoms/Select";
import Button from "@/components/atoms/Button";
import ApperIcon from "@/components/ApperIcon";

const FilterBar = ({
  statusFilter,
  onStatusFilterChange,
  priorityFilter,
  onPriorityFilterChange,
  onClearFilters
}) => {
  const hasActiveFilters = statusFilter !== "All" || priorityFilter !== "All";

  return (
    <div className="bg-white border-b border-slate-200 px-6 py-4">
      <div className="flex items-center gap-4 flex-wrap">
        <div className="flex items-center gap-2">
          <ApperIcon name="Filter" className="w-4 h-4 text-slate-500" />
          <span className="text-sm font-medium text-slate-700">Filters:</span>
        </div>
        
        <Select
          value={statusFilter}
          onChange={(e) => onStatusFilterChange(e.target.value)}
          className="w-auto min-w-[120px] h-9 text-sm"
        >
          <option value="All">All Status</option>
          <option value="Pending">Pending</option>
          <option value="Completed">Completed</option>
        </Select>

        <Select
          value={priorityFilter}
          onChange={(e) => onPriorityFilterChange(e.target.value)}
          className="w-auto min-w-[120px] h-9 text-sm"
        >
          <option value="All">All Priority</option>
          <option value="High">High Priority</option>
          <option value="Medium">Medium Priority</option>
          <option value="Low">Low Priority</option>
        </Select>

        {hasActiveFilters && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onClearFilters}
            className="flex items-center gap-2 text-slate-600"
          >
            <ApperIcon name="X" className="w-3 h-3" />
            Clear
          </Button>
        )}
      </div>
    </div>
  );
};

export default FilterBar;