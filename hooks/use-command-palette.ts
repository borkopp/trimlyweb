"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";

export interface CommandAction {
  id: string;
  label: string;
  description?: string;
  shortcut?: string;
  icon?: React.ReactNode;
  action: () => void;
  group: string;
}

export function useCommandPalette() {
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();

  // Toggle command palette
  const toggle = useCallback(() => {
    setIsOpen((prev) => !prev);
  }, []);

  // Close command palette
  const close = useCallback(() => {
    setIsOpen(false);
  }, []);

  // Open command palette
  const open = useCallback(() => {
    setIsOpen(true);
  }, []);

  // Execute action and close palette
  const executeAction = useCallback((action: () => void) => {
    action();
    close();
  }, [close]);

  // Navigation shortcuts
  const navigateTo = useCallback((path: string) => {
    router.push(path);
    close();
  }, [router, close]);

  // Global keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const isCtrlOrCmd = e.ctrlKey || e.metaKey;
      
      // Cmd/Ctrl + K to open command palette
      if (isCtrlOrCmd && e.key === "k") {
        e.preventDefault();
        toggle();
        return;
      }

      // Don't handle other shortcuts if command palette is open
      if (isOpen) return;

      // Individual action shortcuts
      if (isCtrlOrCmd && e.key === "b") {
        e.preventDefault();
        // Trigger book appointment action
        const event = new CustomEvent("command-book-appointment");
        window.dispatchEvent(event);
        return;
      }

      if (isCtrlOrCmd && e.shiftKey && e.key === "F") {
        e.preventDefault();
        // Trigger search client action
        const event = new CustomEvent("command-search-client");
        window.dispatchEvent(event);
        return;
      }

      // Navigation shortcuts
      if (isCtrlOrCmd && e.key === "h") {
        e.preventDefault();
        navigateTo("/dashboard");
        return;
      }

      if (isCtrlOrCmd && e.key === "c") {
        e.preventDefault();
        navigateTo("/dashboard/calendar");
        return;
      }

      if (isCtrlOrCmd && e.key === "g") {
        e.preventDefault();
        navigateTo("/dashboard/settings");
        return;
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, toggle, navigateTo]);

  return {
    isOpen,
    open,
    close,
    toggle,
    executeAction,
    navigateTo,
  };
} 