"use client";

import { ChevronDown, ChevronRight, LucideIcon } from "lucide-react";

import { Id } from "@convex/_generated/dataModel";
import { cn } from "@/lib/utils";

interface ItemProps {
  label: string;
  onClick: () => void;
  icon: LucideIcon;

  id?: Id<"documents">;
  documentIcon?: string;
  level?: number;
  active?: boolean;
  isSearch?: boolean;
  expanded?: boolean;
  onExpand?: () => void;
}

export const Item = ({
  label,
  onClick,
  icon: Icon,
  id,
  documentIcon,
  level = 0,
  active,
  isSearch,
  expanded,
  onExpand,
}: ItemProps) => {
  const ChevronIcon = expanded ? ChevronDown : ChevronRight;

  return (
    <div
      onClick={onClick}
      role="button"
      style={{
        paddingLeft: `${(level * 12) + 12}px`,
      }}
      className={cn(
        `group min-h-[27px] text-sm py-1 pr-3 w-full hover:bg-primary/5 flex items-center text-muted-foreground font-medium`,
        active && "bg-primary/5 text-primary",
      )}
    >
      {!!id && (
        <div
          role="button"
          onClick={() => {}}
          className="h-full rounded-sm hover:bg-neutral-300 dark:bg-neutral-600 mr-1"
        >
          <ChevronIcon className="h-4 w-4 shrink-0 text-muted-foreground/50" />
        </div>
      )}

      {documentIcon
        ? (
          <div className="shrink-0 mr-2 text-[18px]">
            {documentIcon}
          </div>
        )
        : <Icon className="shrink-0 h-[18px] mr-2 text-muted-foreground" />}

      <span className="truncate">{label}</span>

      {isSearch && (
        <kbd
          className={`
            ml-auto
            pointer-events-none
            inline-flex
            h-5
            select-none
            items-center
            gap-1
            rounded
            border
            bg-muted
            x-1.5
            font-mono
            text-[10px]
            font-medium
            text-muted-foreground
            opacity-100
          `}
        >
          <span className="text-xs">⌘</span>k
        </kbd>
      )}
    </div>
  );
};
