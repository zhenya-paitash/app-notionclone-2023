"use client";

import { useParams } from "next/navigation";
import { useQuery } from "convex/react";
import { MenuIcon } from "lucide-react";

import { api } from "@convex/_generated/api";
import { Id } from "@convex/_generated/dataModel";

import { Title } from "./title";

interface NavbarProps {
  isCollapsed: boolean;
  onResetWidth: () => void;
}

export const Navbar = ({
  isCollapsed,
  onResetWidth,
}: NavbarProps) => {
  const params = useParams();
  const document = useQuery(api.documents.getById, {
    documentId: params.documentId as Id<"documents">,
  });

  if (document === undefined) {
    return (
      <nav className="flex items-center w-full px-3 py-2 bg-background dark:bg-[#1F1F1f]">
        <Title.Skeleton />
      </nav>
    );
  }
  if (document === null) return null;

  return (
    <>
      <nav className="bg-background dark:bg-[#1F1F1F] px-3 py-2 w-full flex items-center gap-x-4">
        {isCollapsed && (
          <MenuIcon
            role="button"
            onClick={onResetWidth}
            className="h-4 w-4 pr-2"
          />
        )}
        <div className="flex text-center justify-between w-full">
          <Title initialData={document} />
        </div>
      </nav>
    </>
  );
};
