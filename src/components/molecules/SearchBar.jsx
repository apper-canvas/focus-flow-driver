import { useState, useEffect } from "react";
import Input from "@/components/atoms/Input";
import ApperIcon from "@/components/ApperIcon";
import { cn } from "@/utils/cn";

const SearchBar = ({ 
  onSearch, 
  placeholder = "Search tasks...", 
  className,
  ...props 
}) => {
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      onSearch(searchQuery);
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [searchQuery, onSearch]);

  return (
    <div className={cn("relative", className)} {...props}>
      <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
        <ApperIcon name="Search" className="w-4 h-4 text-slate-400" />
      </div>
      <Input
        type="text"
        placeholder={placeholder}
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="pl-11"
      />
    </div>
  );
};

export default SearchBar;