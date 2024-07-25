"use client";

import * as React from "react";
import * as PopoverPrimitive from "@radix-ui/react-popover";

import { cn } from "@aniways/ui";

interface PopoverContextValues {
  isOpen: boolean;
  setIsOpen: (value: boolean) => void;
  open: () => void;
  close: () => void;
}

const PopoverContext = React.createContext<PopoverContextValues | undefined>(
  undefined
);

export const usePopoverContext = () => {
  const context = React.useContext(PopoverContext);
  if (!context) {
    throw new Error("usePopoverContext must be used within a PopoverProvider");
  }
  return context;
};

const PopoverProvider = ({
  children,
  defaultValues,
}: {
  children: React.ReactNode;
  defaultValues?: Partial<PopoverContextValues>;
}) => {
  const [open, setOpen] = React.useState(defaultValues?.isOpen ?? false);

  React.useEffect(() => {
    if (defaultValues?.isOpen !== undefined) {
      setOpen(defaultValues.isOpen);
    }
  }, [defaultValues?.isOpen]);

  return (
    <PopoverContext.Provider
      value={{
        isOpen: open,
        setIsOpen: (value: boolean) => {
          defaultValues?.setIsOpen?.(value);
          setOpen(value);
        },
        open: () => {
          defaultValues?.open?.();
          setOpen(true);
        },
        close: () => {
          defaultValues?.close?.();
          setOpen(false);
        },
      }}
    >
      {children}
    </PopoverContext.Provider>
  );
};

const Popover: React.FC<PopoverPrimitive.PopoverProps> = props => {
  return (
    <PopoverProvider
      defaultValues={{
        isOpen: props.open,
        setIsOpen: props.onOpenChange,
        open: () => props.onOpenChange?.(true),
        close: () => props.onOpenChange?.(false),
      }}
    >
      <PopoverRoot {...props} />
    </PopoverProvider>
  );
};

const PopoverRoot: React.FC<PopoverPrimitive.PopoverProps> = props => {
  const { isOpen, setIsOpen } = usePopoverContext();

  return (
    <PopoverPrimitive.Root {...props} open={isOpen} onOpenChange={setIsOpen} />
  );
};

const PopoverTrigger = PopoverPrimitive.Trigger;

const PopoverContent = React.forwardRef<
  React.ElementRef<typeof PopoverPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof PopoverPrimitive.Content>
>(({ className, align = "center", sideOffset = 4, ...props }, ref) => (
  <PopoverPrimitive.Portal>
    <PopoverPrimitive.Content
      ref={ref}
      align={align}
      sideOffset={sideOffset}
      className={cn(
        "z-50 w-72 rounded-md border bg-popover p-4 text-popover-foreground shadow-md outline-none data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2",
        className
      )}
      {...props}
    />
  </PopoverPrimitive.Portal>
));
PopoverContent.displayName = PopoverPrimitive.Content.displayName;

export { Popover, PopoverTrigger, PopoverContent };
