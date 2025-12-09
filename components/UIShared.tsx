
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

// --- Spinner ---
export const Spinner = ({ className }: { className?: string }) => (
  <Icons.Loader2 className={classNames("h-5 w-5 animate-spin text-neon-cyan", className)} />
);

// --- Progress ---
export const Progress = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & { value?: number | null }
>(({ className, value, ...props }, ref) => (
  <div
    ref={ref}
    className={classNames(
      "relative h-2 w-full overflow-hidden rounded-full bg-white/10",
      className
    )}
    {...props}
  >
    <div
      className="h-full w-full flex-1 bg-neon-cyan transition-all duration-300 ease-in-out"
      style={{ transform: `translateX(-${100 - (value || 0)}%)` }}
    />
  </div>
))
Progress.displayName = "Progress"

// --- Kbd ---
export const Kbd = ({ children, className }: { children?: React.ReactNode; className?: string }) => (
  <kbd className={classNames("pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border border-white/20 bg-white/10 px-1.5 font-mono text-[10px] font-medium text-gray-400 opacity-100", className)}>
    {children}
  </kbd>
);

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

export const CardFooter = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={classNames("flex items-center p-6 pt-0", className)} {...props} />
  )
);
CardFooter.displayName = "CardFooter";

// --- Tabs ---
const TabsContext = React.createContext<{ value: string; onValueChange: (v: string) => void }>({ value: '', onValueChange: () => {} });

export const Tabs = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement> & { defaultValue: string }>(
  ({ defaultValue, className, children, ...props }, ref) => {
    const [value, setValue] = useState(defaultValue);
    return (
      <TabsContext.Provider value={{ value, onValueChange: setValue }}>
        <div ref={ref} className={classNames("w-full", className)} {...props}>
          {children}
        </div>
      </TabsContext.Provider>
    );
  }
);
Tabs.displayName = "Tabs";

export const TabsList = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={classNames(
        "inline-flex h-10 items-center justify-center rounded-md bg-black/40 p-1 text-gray-500 border border-dark-border",
        className
      )}
      {...props}
    />
  )
);
TabsList.displayName = "TabsList";

export const TabsTrigger = React.forwardRef<HTMLButtonElement, React.ButtonHTMLAttributes<HTMLButtonElement> & { value: string }>(
  ({ className, value, ...props }, ref) => {
    const { value: selectedValue, onValueChange } = React.useContext(TabsContext);
    const isSelected = selectedValue === value;
    return (
      <button
        ref={ref}
        type="button"
        role="tab"
        aria-selected={isSelected}
        onClick={() => onValueChange(value)}
        className={classNames(
          "inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
          isSelected ? "bg-dark-card text-white shadow-sm" : "hover:bg-white/5 hover:text-gray-300",
          className
        )}
        {...props}
      />
    );
  }
);
TabsTrigger.displayName = "TabsTrigger";

export const TabsContent = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement> & { value: string }>(
  ({ className, value, children, ...props }, ref) => {
    const { value: selectedValue } = React.useContext(TabsContext);
    if (selectedValue !== value) return null;
    return (
      <div
        ref={ref}
        role="tabpanel"
        className={classNames(
          "mt-2 ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 animate-in fade-in slide-in-from-bottom-2",
          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
);
TabsContent.displayName = "TabsContent";


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

// --- Checkbox ---
export const Checkbox = React.forwardRef<HTMLButtonElement, React.ButtonHTMLAttributes<HTMLButtonElement> & { checked?: boolean; onCheckedChange?: (checked: boolean) => void }>(
  ({ className, checked, onCheckedChange, ...props }, ref) => (
    <button
      type="button"
      role="checkbox"
      aria-checked={checked}
      ref={ref}
      onClick={() => onCheckedChange?.(!checked)}
      className={classNames(
        "peer h-4 w-4 shrink-0 rounded-sm border border-neon-cyan ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 transition-all flex items-center justify-center",
        checked ? "bg-neon-cyan text-black" : "bg-transparent text-transparent",
        className
      )}
      {...props}
    >
      <Icons.Check className="h-3 w-3 font-bold stroke-[3]" />
    </button>
  )
);
Checkbox.displayName = "Checkbox";

// --- Label ---
export const Label = React.forwardRef<HTMLLabelElement, React.LabelHTMLAttributes<HTMLLabelElement>>(
  ({ className, ...props }, ref) => (
    <label
      ref={ref}
      className={classNames(
        "text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-gray-300 select-none cursor-pointer",
        className
      )}
      {...props}
    />
  )
);
Label.displayName = "Label";

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


// --- Select & Dropdown Context ---
interface SelectProps {
  value?: string;
  onValueChange?: (value: string) => void;
  children?: React.ReactNode;
}
const SelectContext = React.createContext<{ value?: string; onValueChange?: (v: string) => void; open: boolean; setOpen: (v: boolean) => void }>({ open: false, setOpen: () => {} });

export const DropdownMenu = ({ children }: { children?: React.ReactNode }) => {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    if (open) document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [open]);

  return (
    <div ref={ref} className="relative inline-block w-full text-left">
      <SelectContext.Provider value={{ open, setOpen, value: '', onValueChange: () => {} }}>
        {children}
      </SelectContext.Provider>
    </div>
  );
};

export const DropdownMenuTrigger = ({ asChild, children }: { asChild?: boolean, children?: React.ReactNode }) => {
  const { open, setOpen } = React.useContext(SelectContext);
  if (asChild && React.isValidElement(children)) {
      return React.cloneElement(children as React.ReactElement<any>, {
          onClick: (e: React.MouseEvent) => {
              children.props.onClick?.(e);
              setOpen(!open);
          }
      });
  }
  return <button onClick={() => setOpen(!open)}>{children}</button>;
};

export const DropdownMenuContent = ({ className, align, children }: { className?: string, align?: 'end' | 'start', children?: React.ReactNode }) => {
  const { open } = React.useContext(SelectContext);
  if (!open) return null;
  const alignClass = align === 'end' ? 'right-0' : 'left-0';
  return (
    <div className={classNames("absolute z-50 mt-2 min-w-[8rem] overflow-hidden rounded-md border border-dark-border bg-dark-card text-white shadow-xl animate-in fade-in-80", alignClass, className)}>
      <div className="p-1 max-h-80 overflow-y-auto custom-scrollbar">{children}</div>
    </div>
  );
};

export const DropdownMenuItem: React.FC<React.HTMLAttributes<HTMLDivElement> & { key?: React.Key }> = ({ className, onClick, children, ...props }) => {
    const { setOpen } = React.useContext(SelectContext);
    return (
        <div 
            onClick={(e) => { onClick?.(e); setOpen(false); e.stopPropagation(); }}
            className={classNames("relative flex cursor-pointer select-none items-center rounded-sm text-sm outline-none transition-colors hover:bg-white/10 focus:bg-white/10 data-[disabled]:pointer-events-none data-[disabled]:opacity-50", className)}
            {...props}
        >
            {children}
        </div>
    );
};

// --- Item Components ---
export const Item = ({ variant, size, className, children }: { variant?: 'default' | 'outline', size?: string, className?: string, children?: React.ReactNode }) => {
    const variantClass = variant === 'outline' 
        ? "border border-dark-border bg-dark-card rounded-xl p-4 flex-wrap" 
        : "";
    return (
        <div className={classNames("flex items-center gap-3", variantClass, className)}>{children}</div>
    );
};

export const ItemMedia = ({ variant, children }: { variant?: 'default' | 'icon', children?: React.ReactNode }) => {
  const variantClass = variant === 'icon' 
      ? "bg-white/5 p-3 rounded-lg flex items-center justify-center" 
      : "";
  return <div className={classNames("flex-shrink-0", variantClass)}>{children}</div>;
};

export const ItemContent = ({ className, children }: { className?: string, children?: React.ReactNode }) => (
    <div className={classNames("flex flex-col min-w-0 text-left", className)}>{children}</div>
);
export const ItemTitle = ({ className, children }: { className?: string, children?: React.ReactNode }) => (
    <div className={classNames("text-sm font-bold truncate text-white", className)}>{children}</div>
);
export const ItemDescription = ({ className, children }: { className?: string, children?: React.ReactNode }) => (
    <div className={classNames("text-xs text-gray-400 truncate", className)}>{children}</div>
);
export const ItemActions = ({ className, children }: { className?: string, children?: React.ReactNode }) => (
    <div className={classNames("ml-auto flex items-center gap-2", className)}>{children}</div>
);
export const ItemFooter = ({ className, children }: { className?: string, children?: React.ReactNode }) => (
    <div className={classNames("w-full mt-4 basis-full", className)}>{children}</div>
);


// --- Avatar ---
export const Avatar = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={classNames("relative flex h-10 w-10 shrink-0 overflow-hidden rounded-full bg-white/10", className)} {...props} />
  )
);
Avatar.displayName = "Avatar";

export const AvatarImage = React.forwardRef<HTMLImageElement, React.ImgHTMLAttributes<HTMLImageElement>>(
  ({ className, ...props }, ref) => (
    <img ref={ref} className={classNames("aspect-square h-full w-full object-cover", className)} {...props} />
  )
);
AvatarImage.displayName = "AvatarImage";

export const AvatarFallback = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={classNames("flex h-full w-full items-center justify-center rounded-full bg-white/10 text-white", className)} {...props} />
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
    />
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

// --- Pagination ---
export const Pagination = ({ className, ...props }: React.ComponentProps<"nav">) => (
  <nav
    role="navigation"
    aria-label="pagination"
    className={classNames("mx-auto flex w-full justify-center", className)}
    {...props}
  />
)

export const PaginationContent = React.forwardRef<HTMLUListElement, React.ComponentProps<"ul">>(
  ({ className, ...props }, ref) => (
    <ul
      ref={ref}
      className={classNames("flex flex-row items-center gap-2", className)}
      {...props}
    />
  )
)
PaginationContent.displayName = "PaginationContent"

export const PaginationItem = React.forwardRef<HTMLLIElement, React.ComponentProps<"li">>(
  ({ className, ...props }, ref) => (
    <li ref={ref} className={classNames("", className)} {...props} />
  )
)
PaginationItem.displayName = "PaginationItem"

type PaginationLinkProps = {
  isActive?: boolean
} & React.ComponentProps<typeof Button>

export const PaginationLink = ({
  className,
  isActive,
  size = "icon",
  ...props
}: PaginationLinkProps) => (
  <Button
    aria-current={isActive ? "page" : undefined}
    variant={isActive ? "outline" : "ghost"}
    size={size}
    className={classNames(
      "h-9",
      size === "icon" ? "w-9" : "w-auto px-4",
      isActive && "border-neon-cyan text-neon-cyan", 
      className
    )}
    {...props}
  />
)

export const PaginationPrevious = ({
  className,
  ...props
}: React.ComponentProps<typeof PaginationLink>) => (
  <PaginationLink
    aria-label="Go to previous page"
    size="default"
    className={classNames("gap-1 pl-2.5", className)}
    {...props}
  >
    <Icons.ChevronLeft className="h-4 w-4" />
    <span className="hidden sm:block">Previous</span>
  </PaginationLink>
)

export const PaginationNext = ({
  className,
  ...props
}: React.ComponentProps<typeof PaginationLink>) => (
  <PaginationLink
    aria-label="Go to next page"
    size="default"
    className={classNames("gap-1 pr-2.5", className)}
    {...props}
  >
    <span className="hidden sm:block">Next</span>
    <Icons.ChevronRight className="h-4 w-4" />
  </PaginationLink>
)

export const PaginationEllipsis = ({
  className,
  ...props
}: React.ComponentProps<"span">) => (
  <span
    aria-hidden
    className={classNames("flex h-9 w-9 items-center justify-center", className)}
    {...props}
  >
    <Icons.MoreHorizontal className="h-4 w-4" />
    <span className="sr-only">More pages</span>
  </span>
)
