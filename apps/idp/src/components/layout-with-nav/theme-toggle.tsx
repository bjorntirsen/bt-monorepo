"use client";

import { useTheme } from "next-themes";
import { MoonIcon, SunIcon, Monitor } from "lucide-react";
import { Button } from "@repo/ui/components/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@repo/ui/components/tooltip";
import { useState, useEffect } from "react";

export default function ThemeToggle() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const { theme, systemTheme, setTheme } = useTheme();

  if (!mounted) return null;

  const resolvedTheme = theme === "system" ? systemTheme : theme;

  const getNextTheme = () => {
    if (theme === "system") return "light";
    if (theme === "light") return "dark";
    return "system";
  };

  const getIcon = () => {
    if (theme === "system") return <Monitor width={16} height={16} />;
    return resolvedTheme === "dark" ? (
      <MoonIcon width={16} height={16} />
    ) : (
      <SunIcon width={16} height={16} />
    );
  };

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          variant="outline"
          aria-label="Toggle theme"
          onClick={() => setTheme(getNextTheme())}
        >
          {getIcon()}
        </Button>
      </TooltipTrigger>
      <TooltipContent>{`Theme: ${theme}`}</TooltipContent>
    </Tooltip>
  );
}
