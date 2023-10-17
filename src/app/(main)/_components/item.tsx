"use client";

import { useMutation } from "convex/react";
import { ChevronDown, ChevronRight, LucideIcon, Plus } from "lucide-react";
import { toast } from "sonner";

import { api } from "@convex/_generated/api";
import { Id } from "@convex/_generated/dataModel";
import { cn } from "@/lib/utils";

import { Skeleton } from "@/components/ui/skeleton";
import { useRouter } from "next/navigation";

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
  const router = useRouter();
  const create = useMutation(api.documents.create);

  const handleExpand = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    e.stopPropagation();
    onExpand?.();
  };

  const ChevronIcon = expanded ? ChevronDown : ChevronRight;

  const onCreate = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    e.stopPropagation();
    if (!id) return;

    const promise = create({ title: "Untitled", parentDocument: id })
      .then((docId) => {
        if (!expanded) onExpand?.();
        // TODO: uncomment router.push after
        // router.push(`/documents/${docId}`);
      });

    toast.promise(promise, {
      loading: "Creating a new note...",
      success: "New note created",
      error: "Failed to create a new note.",
    });
  };

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
          onClick={handleExpand}
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

      {!!id && (
        <div className="ml-auto flex items-center gap-x-2">
          <div
            role="button"
            onClick={onCreate}
            className="opacity-0 group-hover:opacity-100 h-full ml-auto rounded-sm hover:bg-neutral-300 dark:hover:bg-neutral-600"
          >
            <Plus className="h-4 w-4 text-muted-foreground" />
          </div>
        </div>
      )}
    </div>
  );
};

Item.Skeleton = function ItemSkeleton({
  level,
}: {
  level?: number;
}) {
  return (
    <div
      style={{ paddingLeft: level ? `${(level * 12) + 25}px` : "12px" }}
      className="flex gap-x-2 py-[3px]"
    >
      <Skeleton className="h-4 w-4" />
      <Skeleton className="h-4 w-[30%]" />
    </div>
  );
};
