"use client";

import * as React from "react";

import { cn } from "@/lib/utils";

import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./dialog";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "./drawer";

function useMediaQuery(query: string) {
  const [value, setValue] = React.useState(false);

  React.useEffect(() => {
    function onChange(event: MediaQueryListEvent) {
      setValue(event.matches);
    }

    const result = matchMedia(query);
    result.addEventListener("change", onChange);
    setValue(result.matches);

    return () => result.removeEventListener("change", onChange);
  }, [query]);

  return value;
}

interface CredenzaContextValue {
  isOpen: boolean;
  setIsOpen: (value: boolean) => void;
  open: () => void;
  close: () => void;
}

const CredenzaContext = React.createContext<CredenzaContextValue | undefined>(
  undefined,
);

export const useCredenzaContext = () => {
  const context = React.useContext(CredenzaContext);
  if (!context) {
    throw new Error(
      "useCredenzaContext must be used within a CredenzaProvider",
    );
  }
  return context;
};

const CredenzaProvider = ({
  children,
  defaultValues,
}: {
  children: React.ReactNode;
  defaultValues?: Partial<CredenzaContextValue>;
}) => {
  const [open, setOpen] = React.useState(defaultValues?.isOpen ?? false);

  React.useEffect(() => {
    if (defaultValues?.isOpen !== undefined) {
      setOpen(defaultValues.isOpen);
    }
  }, [defaultValues?.isOpen]);

  return (
    <CredenzaContext.Provider
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
    </CredenzaContext.Provider>
  );
};

interface BaseProps {
  children: React.ReactNode;
}

interface RootCredenzaProps extends BaseProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

interface CredenzaProps extends BaseProps {
  className?: string;
  asChild?: true;
}

const desktop = "(min-width: 768px)";

const Credenza = ({ children, ...props }: RootCredenzaProps) => (
  <CredenzaProvider
    defaultValues={{
      isOpen: props.open,
      setIsOpen: props.onOpenChange,
      open: () => props.onOpenChange?.(true),
      close: () => props.onOpenChange?.(false),
    }}
  >
    <CredenzaRoot {...props}>{children}</CredenzaRoot>
  </CredenzaProvider>
);

const CredenzaRoot = ({ children, ...props }: RootCredenzaProps) => {
  const isDesktop = useMediaQuery(desktop);
  const Credenza = isDesktop ? Dialog : Drawer;
  const { isOpen, setIsOpen } = useCredenzaContext();

  return (
    <Credenza {...props} open={isOpen} onOpenChange={setIsOpen}>
      {children}
    </Credenza>
  );
};

const CredenzaTrigger = ({ className, children, ...props }: CredenzaProps) => {
  const isDesktop = useMediaQuery(desktop);
  const CredenzaTrigger = isDesktop ? DialogTrigger : DrawerTrigger;

  return (
    <CredenzaTrigger className={className} {...props}>
      {children}
    </CredenzaTrigger>
  );
};

const CredenzaClose = ({ className, children, ...props }: CredenzaProps) => {
  const isDesktop = useMediaQuery(desktop);
  const CredenzaClose = isDesktop ? DialogClose : DrawerClose;

  return (
    <CredenzaClose className={className} {...props}>
      {children}
    </CredenzaClose>
  );
};

const CredenzaContent = ({ className, children, ...props }: CredenzaProps) => {
  const isDesktop = useMediaQuery(desktop);
  const CredenzaContent = isDesktop ? DialogContent : DrawerContent;

  return (
    <CredenzaContent className={className} {...props}>
      {children}
    </CredenzaContent>
  );
};

const CredenzaDescription = ({
  className,
  children,
  ...props
}: CredenzaProps) => {
  const isDesktop = useMediaQuery(desktop);
  const CredenzaDescription = isDesktop ? DialogDescription : DrawerDescription;

  return (
    <CredenzaDescription className={className} {...props}>
      {children}
    </CredenzaDescription>
  );
};

const CredenzaHeader = ({ className, children, ...props }: CredenzaProps) => {
  const isDesktop = useMediaQuery(desktop);
  const CredenzaHeader = isDesktop ? DialogHeader : DrawerHeader;

  return (
    <CredenzaHeader className={className} {...props}>
      {children}
    </CredenzaHeader>
  );
};

const CredenzaTitle = ({ className, children, ...props }: CredenzaProps) => {
  const isDesktop = useMediaQuery(desktop);
  const CredenzaTitle = isDesktop ? DialogTitle : DrawerTitle;

  return (
    <CredenzaTitle className={className} {...props}>
      {children}
    </CredenzaTitle>
  );
};

const CredenzaBody = ({ className, children, ...props }: CredenzaProps) => {
  return (
    <div className={cn("px-4 md:px-0", className)} {...props}>
      {children}
    </div>
  );
};

const CredenzaFooter = ({ className, children, ...props }: CredenzaProps) => {
  const isDesktop = useMediaQuery(desktop);
  const CredenzaFooter = isDesktop ? DialogFooter : DrawerFooter;

  return (
    <CredenzaFooter className={className} {...props}>
      {children}
    </CredenzaFooter>
  );
};

export {
  Credenza,
  CredenzaTrigger,
  CredenzaClose,
  CredenzaContent,
  CredenzaDescription,
  CredenzaHeader,
  CredenzaTitle,
  CredenzaBody,
  CredenzaFooter,
};
