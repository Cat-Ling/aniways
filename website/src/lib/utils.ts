import { clsx, type ClassValue } from 'clsx';
import { mount, type Component, type ComponentProps } from 'svelte';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const convertComponentToHTML = (
  component: Parameters<typeof mount>[0],
  props: ComponentProps<Component>
) => {
  const div = document.createElement('div');
  mount(component, { target: div, props });
  const string = div.innerHTML;
  div.remove();
  return string;
};
