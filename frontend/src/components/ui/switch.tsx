/* eslint-disable @typescript-eslint/no-unused-vars */
import { cn } from "@/lib/utils";

const Switch = ({
  checked: _checked,
  onCheckedChange: _onCheckedChange,
  className,
  ...props
}: {
  checked: boolean;
  onCheckedChange: (isChecked: boolean) => void;
  className?: string;
}) => {
  return (
    <div
      className={cn(
        "relative flex items-center justify-center h-9 w-20",
        className
      )}
      {...props}
    >
      <span
        className={cn(
          "peer absolute inset-0 h-full w-full rounded-full bg-input/50 transition-colors",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
          "[&>span]:h-7 [&>span]:w-7 [&>span]:rounded-full [&>span]:bg-background [&>span]:shadow [&>span]:z-10",
          "data-[state=unchecked]:[&>span]:translate-x-1",
          "data-[state=checked]:[&>span]:translate-x-[44px]"
        )}
      >
        <span className="pointer-events-none block h-7 w-7 rounded-full bg-background" />
      </span>
    </div>
  );
};

export default Switch;