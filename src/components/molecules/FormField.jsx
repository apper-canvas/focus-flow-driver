import Label from "@/components/atoms/Label";
import { cn } from "@/utils/cn";

const FormField = ({ 
  label, 
  children, 
  error, 
  required, 
  className,
  ...props 
}) => {
  return (
    <div className={cn("space-y-2", className)} {...props}>
      {label && (
        <Label className="block">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </Label>
      )}
      {children}
      {error && (
        <p className="text-sm text-red-600 font-medium">{error}</p>
      )}
    </div>
  );
};

export default FormField;