"use client";

import * as React from "react";
import { Drawer as DrawerPrimitive } from "vaul";

import { cn } from "@aniways/ui";

interface DrawerContextValue {
  isOpen: boolean;
  setIsOpen: (value: boolean) => void;
  open: () => void;
  close: () => void;
}

const DrawerContext = React.createContext<DrawerContextValue | undefined>(
  undefined
);

export const useDrawerContext = () => {
  const context = React.useContext(DrawerContext);
  if (!context) {
    throw new Error("useDrawerContext must be used within a DrawerProvider");
  }
  return context;
};

const DrawerProvider = ({
  children,
  defaultValues,
}: {
  children: React.ReactNode;
  defaultValues?: Partial<DrawerContextValue>;
}) => {
  const [open, setOpen] = React.useState(defaultValues?.isOpen ?? false);

  React.useEffect(() => {
    if (!defaultValues?.isOpen) return;
    setOpen(defaultValues.isOpen);
  }, [defaultValues?.isOpen]);

  return (
    <DrawerContext.Provider
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
    </DrawerContext.Provider>
  );
};

const Drawer = ({
  shouldScaleBackground = true,
  ...props
}: React.ComponentProps<typeof DrawerPrimitive.Root>) => (
  <DrawerProvider
    defaultValues={{
      isOpen: props.open,
      setIsOpen: props.onOpenChange,
      open: props.onOpenChange?.bind(null, true),
      close: props.onOpenChange?.bind(null, false),
    }}
  >
    <DrawerRoot shouldScaleBackground={shouldScaleBackground} {...props} />
  </DrawerProvider>
);
Drawer.displayName = "Drawer";

const DrawerRoot: React.FC<
  React.ComponentProps<typeof DrawerPrimitive.Root>
> = props => {
  const { isOpen, setIsOpen } = useDrawerContext();

  return (
    <DrawerPrimitive.Root {...props} open={isOpen} onOpenChange={setIsOpen} />
  );
};

const DrawerTrigger = DrawerPrimitive.Trigger;

const DrawerPortal = DrawerPrimitive.Portal;

const DrawerClose = DrawerPrimitive.Close;

const DrawerOverlay = React.forwardRef<
  React.ElementRef<typeof DrawerPrimitive.Overlay>,
  React.ComponentPropsWithoutRef<typeof DrawerPrimitive.Overlay>
>(({ className, ...props }, ref) => (
  <DrawerPrimitive.Overlay
    ref={ref}
    className={cn("fixed inset-0 z-50 bg-black/80", className)}
    {...props}
  />
));
DrawerOverlay.displayName = DrawerPrimitive.Overlay.displayName;

const DrawerContent = React.forwardRef<
  React.ElementRef<typeof DrawerPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof DrawerPrimitive.Content>
>(({ className, children, ...props }, ref) => (
  <DrawerPortal>
    <DrawerOverlay />
    <DrawerPrimitive.Content
      ref={ref}
      className={cn(
        "fixed inset-x-0 bottom-0 z-50 mt-24 flex h-auto flex-col rounded-t-[10px] border bg-background",
        className
      )}
      {...props}
    >
      <div className="mx-auto mt-4 h-2 w-[100px] rounded-full bg-muted" />
      {children}
    </DrawerPrimitive.Content>
  </DrawerPortal>
));
DrawerContent.displayName = "DrawerContent";

const DrawerHeader = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn("grid gap-1.5 p-4 text-center sm:text-left", className)}
    {...props}
  />
);
DrawerHeader.displayName = "DrawerHeader";

const DrawerFooter = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn("mt-auto flex flex-col gap-2 p-4", className)}
    {...props}
  />
);
DrawerFooter.displayName = "DrawerFooter";

const DrawerTitle = React.forwardRef<
  React.ElementRef<typeof DrawerPrimitive.Title>,
  React.ComponentPropsWithoutRef<typeof DrawerPrimitive.Title>
>(({ className, ...props }, ref) => (
  <DrawerPrimitive.Title
    ref={ref}
    className={cn(
      "text-lg font-semibold leading-none tracking-tight",
      className
    )}
    {...props}
  />
));
DrawerTitle.displayName = DrawerPrimitive.Title.displayName;

const DrawerDescription = React.forwardRef<
  React.ElementRef<typeof DrawerPrimitive.Description>,
  React.ComponentPropsWithoutRef<typeof DrawerPrimitive.Description>
>(({ className, ...props }, ref) => (
  <DrawerPrimitive.Description
    ref={ref}
    className={cn("text-sm text-muted-foreground", className)}
    {...props}
  />
));
DrawerDescription.displayName = DrawerPrimitive.Description.displayName;

export {
  Drawer,
  DrawerPortal,
  DrawerOverlay,
  DrawerTrigger,
  DrawerClose,
  DrawerContent,
  DrawerHeader,
  DrawerFooter,
  DrawerTitle,
  DrawerDescription,
};
