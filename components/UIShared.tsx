
import React, { useState, useRef, useEffect } from "react";
import { Icons } from "./Icons";

// --- Utility ---
export const classNames = (...classes: (string | undefined | null | false)[]) => {
  return classes.filter(Boolean).join(" ");
};

// --- Button ---
export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "outline" | "ghost" | "link" | "secondary";
  size?: "default" | "sm" | "lg" | "icon";
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "default", size = "default", ...props }, ref) => {
    const variants = {
      default: "bg-white text-black hover:bg-gray-200 shadow-sm font-bold tracking-tight",
      secondary: "bg-dark-card border border-dark-border hover:bg-white/10 text-white",
      outline: "border border-dark-border bg-transparent hover:bg-white/5 text-white transition-all",
      ghost: "hover:bg-white/10 text-white",
      link: "text-white underline-offset-4 hover:underline",
    };
    
    const sizes = {
      default: "h-10 px-4 py-2",
      sm: "h-9 rounded-md px-3 text-xs",
      lg: "h-11 rounded-md px-8",
      icon: "h-10 w-10",
    };

    return (
      <button
        ref={ref}
        className={classNames(
          "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
          variants[variant],
          sizes[size],
          className
        )}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

// --- Card ---
export const Card = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={classNames("rounded-xl border border-dark-border bg-dark-card text-white shadow-sm", className)}
      {...props}
    />
  )
);
Card.displayName = "Card";

export const CardHeader = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={classNames("flex flex-col space-y-1.5 p-6", className)} {...props} />
  )
);
CardHeader.displayName = "CardHeader";

export const CardTitle = React.forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLHeadingElement>>(
  ({ className, ...props }, ref) => (
    <h3 ref={ref} className={classNames("text-2xl font-semibold leading-none tracking-tight", className)} {...props} />
  )
);
CardTitle.displayName = "CardTitle";

export const CardDescription = React.forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLParagraphElement>>(
  ({ className, ...props }, ref) => (
    <p ref={ref} className={classNames("text-sm text-gray-400", className)} {...props} />
  )
);
CardDescription.displayName = "CardDescription";

export const CardContent = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={classNames("p-6 pt-0", className)} {...props} />
  )
);
CardContent.displayName = "CardContent";

// --- Input & Textarea ---
export const Input = React.forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement>>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={classNames(
          "flex h-10 w-full rounded-md border border-dark-border bg-black/40 px-3 py-2 text-sm text-white ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-gray-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neon-cyan focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);
Input.displayName = "Input";

export const Textarea = React.forwardRef<HTMLTextAreaElement, React.TextareaHTMLAttributes<HTMLTextAreaElement>>(
  ({ className, ...props }, ref) => {
    return (
      <textarea
        className={classNames(
          "flex min-h-[80px] w-full rounded-md border border-dark-border bg-black/40 px-3 py-2 text-sm text-white ring-offset-background placeholder:text-gray-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neon-cyan focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);
Textarea.displayName = "Textarea";

// --- InputGroup ---
export const InputGroup = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={classNames("flex items-center w-full relative", className)} {...props} />
  )
);
InputGroup.displayName = "InputGroup";

export const InputGroupInput = React.forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement>>(
  ({ className, ...props }, ref) => (
     <Input ref={ref} className={classNames("pr-10", className)} {...props} />
  )
);
InputGroupInput.displayName = "InputGroupInput";

export const InputGroupAddon = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement> & { align?: 'inline-end' | 'inline-start' }>(
  ({ className, align = 'inline-end', ...props }, ref) => {
    const posClass = align === 'inline-end' ? 'absolute right-3' : 'absolute left-3';
    return <div ref={ref} className={classNames(posClass, "text-gray-500 pointer-events-none", className)} {...props} />;
  }
);
InputGroupAddon.displayName = "InputGroupAddon";


// --- Select (Custom Implementation) ---
interface SelectProps {
  value?: string;
  onValueChange?: (value: string) => void;
  children: React.ReactNode;
}
const SelectContext = React.createContext<{ value?: string; onValueChange?: (v: string) => void; open: boolean; setOpen: (v: boolean) => void }>({ open: false, setOpen: () => {} });

export const Select: React.FC<SelectProps> = ({ value, onValueChange, children }) => {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    
    if (open) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [open]);

  return (
    <div ref={ref} className="relative">
      <SelectContext.Provider value={{ value, onValueChange, open, setOpen }}>
        {children}
      </SelectContext.Provider>
    </div>
  );
};

export const SelectTrigger: React.FC<React.ButtonHTMLAttributes<HTMLButtonElement>> = ({ className, children, ...props }) => {
  const { open, setOpen } = React.useContext(SelectContext);
  return (
    <button 
      type="button"
      onClick={() => setOpen(!open)}
      className={classNames("flex h-10 w-full items-center justify-between rounded-md border border-dark-border bg-black/40 px-3 py-2 text-sm text-white ring-offset-background placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-neon-cyan disabled:cursor-not-allowed disabled:opacity-50", className)}
      {...props}
    >
      {children}
      <Icons.ChevronDown className="h-4 w-4 opacity-50" />
    </button>
  );
};

export const SelectValue: React.FC<{ placeholder?: string }> = ({ placeholder }) => {
  const { value } = React.useContext(SelectContext);
  return <span className="pointer-events-none block truncate">{value || placeholder}</span>;
};

export const SelectContent: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { open } = React.useContext(SelectContext);
  if (!open) return null;
  return (
    <div className="absolute z-50 min-w-[8rem] overflow-hidden rounded-md border border-dark-border bg-dark-card text-white shadow-md animate-in fade-in-80 mt-1 w-full max-w-[var(--radix-select-trigger-width)]">
      <div className="p-1 max-h-60 overflow-y-auto">{children}</div>
    </div>
  );
};

export const SelectItem: React.FC<{ value: string; children: React.ReactNode; className?: string }> = ({ value, children, className }) => {
  const { onValueChange, setOpen } = React.useContext(SelectContext);
  return (
    <div 
      onClick={() => { onValueChange?.(value); setOpen(false); }}
      className={classNames("relative flex w-full cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none focus:bg-white/10 hover:bg-white/10 data-[disabled]:pointer-events-none data-[disabled]:opacity-50", className)}
    >
      <span className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
        {/* Check icon could go here if selected */}
      </span>
      {children}
    </div>
  );
};

// --- Avatar ---
export const Avatar = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={classNames("relative flex h-10 w-10 shrink-0 overflow-hidden rounded-full", className)} {...props} />
  )
);
Avatar.displayName = "Avatar";

export const AvatarImage = React.forwardRef<HTMLImageElement, React.ImgHTMLAttributes<HTMLImageElement>>(
  ({ className, ...props }, ref) => (
    <img ref={ref} className={classNames("aspect-square h-full w-full", className)} {...props} />
  )
);
AvatarImage.displayName = "AvatarImage";

export const AvatarFallback = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={classNames("flex h-full w-full items-center justify-center rounded-full bg-white/10", className)} {...props} />
  )
);
AvatarFallback.displayName = "AvatarFallback";

// --- Empty State ---
export const Empty = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={classNames("flex flex-col items-center justify-center text-center p-8 border border-dashed border-dark-border rounded-xl bg-black/20", className)} {...props} />
  )
);
Empty.displayName = "Empty";

export const EmptyHeader = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={classNames("flex flex-col items-center gap-2 mb-6", className)} {...props} />
);

export const EmptyMedia = ({ className, variant = "default", children, ...props }: React.HTMLAttributes<HTMLDivElement> & { variant?: "default" | "icon" }) => (
  <div className={classNames("flex items-center justify-center mb-2 text-gray-500", variant === "icon" && "h-12 w-12 rounded-full bg-white/5", className)} {...props}>
    {children}
  </div>
);

export const EmptyTitle = ({ className, ...props }: React.HTMLAttributes<HTMLHeadingElement>) => (
  <h3 className={classNames("text-lg font-bold text-white", className)} {...props} />
);

export const EmptyDescription = ({ className, ...props }: React.HTMLAttributes<HTMLParagraphElement>) => (
  <p className={classNames("text-sm text-gray-400 max-w-xs", className)} {...props} />
);

export const EmptyContent = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={classNames("flex flex-col gap-2", className)} {...props} />
);

// --- Fields ---
export const FieldGroup = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={classNames("space-y-4", className)} {...props} />
  )
);
FieldGroup.displayName = "FieldGroup";

export const Field = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement> & { orientation?: 'vertical' | 'horizontal' | 'responsive' }>(
  ({ className, orientation = 'vertical', ...props }, ref) => {
    const orientationClass = orientation === 'horizontal' ? 'flex-row items-center gap-4' 
      : orientation === 'responsive' ? 'flex flex-col md:flex-row md:items-start md:gap-8' 
      : 'flex-col gap-2';
    return (
      <div ref={ref} className={classNames("flex", orientationClass, className)} {...props} />
    );
  }
);
Field.displayName = "Field";

export const FieldContent = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={classNames("flex flex-col gap-1 min-w-[150px]", className)} {...props} />
);

export const FieldLabel = React.forwardRef<HTMLLabelElement, React.LabelHTMLAttributes<HTMLLabelElement>>(
  ({ className, ...props }, ref) => (
    <label
      ref={ref}
      className={classNames("text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-gray-200", className)}
      {...props}
    />
  )
);
FieldLabel.displayName = "FieldLabel";

export const FieldDescription = React.forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLParagraphElement>>(
  ({ className, ...props }, ref) => (
    <p ref={ref} className={classNames("text-xs text-gray-500", className)} {...props} />
  )
);
FieldDescription.displayName = "FieldDescription";

export const FieldSeparator = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, children, ...props }, ref) => (
    <div
      ref={ref}
      className={classNames("relative flex items-center justify-center my-6 w-full", className)}
      {...props}
    >
      <div className="absolute inset-0 flex items-center">
        <span className="w-full border-t border-dark-border" />
      </div>
      {children && (
        <div className="relative bg-dark-bg px-2 text-xs uppercase text-gray-500 font-mono">
          {children}
        </div>
      )}
    </div>
  )
);
FieldSeparator.displayName = "FieldSeparator";

export const FieldSet = React.forwardRef<HTMLFieldSetElement, React.HTMLAttributes<HTMLFieldSetElement>>(
  ({ className, ...props }, ref) => (
    <fieldset ref={ref} className={classNames("border border-dark-border rounded-lg p-6", className)} {...props} />
  )
);
FieldSet.displayName = "FieldSet";

export const FieldLegend = React.forwardRef<HTMLLegendElement, React.HTMLAttributes<HTMLLegendElement>>(
  ({ className, ...props }, ref) => (
    <legend ref={ref} className={classNames("px-2 text-sm font-bold text-white", className)} {...props} />
  )
);
FieldLegend.displayName = "FieldLegend";
