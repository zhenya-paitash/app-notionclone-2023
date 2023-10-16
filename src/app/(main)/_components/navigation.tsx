"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { ChevronsLeft, MenuIcon, PlusCircle, Search, Settings } from "lucide-react";
import { useMediaQuery } from "usehooks-ts";
import { useMutation, useQuery } from "convex/react";
import { toast } from "sonner";

import { cn } from "@/lib/utils";
import { api } from "@convex/_generated/api";

import { UserItem } from "./user-item";
import { Item } from "./item";

export const Navigation = () => {
  const pathname = usePathname();
  const isMobile = useMediaQuery("(max-width: 768px)");

  const isResizingRef = useRef(false);
  const sidebarRef = useRef<React.ElementRef<"aside">>(null);
  const navbarRef = useRef<React.ElementRef<"div">>(null);

  const [isResetting, setIsResetting] = useState(false);
  const [isCollapsed, setisCollapsed] = useState(isMobile);

  const documents = useQuery(api.documents.get);
  const create = useMutation(api.documents.create);

  const minWidth = 240;
  const maxWidth = 480;

  useEffect(() => {
    isMobile ? collapse() : resetWidth();
  }, [isMobile]);

  useEffect(() => {
    if (isMobile) collapse();
  }, [pathname, isMobile]);

  const handleMouseMove = (e: MouseEvent) => {
    if (!isResizingRef.current) return;

    let newWidth = e.clientX;
    if (newWidth < minWidth) newWidth = minWidth;
    if (newWidth > maxWidth) newWidth = maxWidth;

    if (sidebarRef.current && navbarRef.current) {
      sidebarRef.current.style.width = `${newWidth}px`;
      navbarRef.current.style.setProperty("left", `${newWidth}px`);
      navbarRef.current.style.setProperty("width", `calc(100%-${newWidth}px)`);
    }
  };

  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    e.preventDefault();
    e.stopPropagation();

    isResizingRef.current = true;
    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
  };

  const handleMouseUp = () => {
    isResizingRef.current = false;
    document.removeEventListener("mousemove", handleMouseMove);
    document.removeEventListener("mouseup", handleMouseUp);
  };

  const resetWidth = () => {
    if (sidebarRef.current && navbarRef.current) {
      setisCollapsed(false);
      setIsResetting(true);

      sidebarRef.current.style.width = isMobile ? "100%" : `${minWidth}px`;
      navbarRef.current.style.setProperty(
        "width",
        isMobile ? "0" : `calc(100%-${minWidth}px)`,
      );
      navbarRef.current.style.setProperty(
        "left",
        isMobile ? "100%" : `${minWidth}px`,
      );

      setTimeout(() => setIsResetting(false), 300);
    }
  };

  const collapse = () => {
    if (sidebarRef.current && navbarRef.current) {
      setisCollapsed(true);
      setIsResetting(true);

      sidebarRef.current.style.width = "0";
      navbarRef.current.style.setProperty("width", "100%");
      navbarRef.current.style.setProperty("left", "0");

      setTimeout(() => setIsResetting(false), 300);
    }
  };

  const handleCreate = () => {
    const promise = create({ title: "Untilted" });
    toast.promise(promise, {
      loading: "Creating a new note...",
      success: "New note created!",
      error: "Failed to create a new note.",
    });
  };

  return (
    <>
      <aside
        ref={sidebarRef}
        className={cn(
          `
            group/sidebar
            h-full
            w-60
            flex
            flex-col
            relative
            overflow-y-auto
            bg-secondary
            z-[99999]
          `,
          isResetting && "transition-all ease-in-out duration-300",
          isMobile && "w-0",
        )}
      >
        <div
          onClick={collapse}
          role="button"
          className={cn(
            `
            h-6
            w-6
            text-muted-foreground
            rounded-sm
            hover:bg-neutral-300
            dark:hover:bg-neutral-600
            absolute
            top-3
            right-2
            opacity-0
            group-hover/sidebar:opacity-100
            transition
          `,
            isMobile && "opacity-100",
          )}
        >
          <ChevronsLeft className="h-6 w-6" />
        </div>

        <div>
          <UserItem />
          <Item
            label="Search"
            icon={Search}
            isSearch
            onClick={() => {}}
          />
          <Item
            label="Settings"
            icon={Settings}
            onClick={() => {}}
          />
          <Item
            onClick={handleCreate}
            label="New page"
            icon={PlusCircle}
          />
        </div>

        <div className="mt-4">
          {documents?.map((document) => (
            <p key={document._id}>{document.title}</p>
          ))}
        </div>

        <div
          onMouseDown={handleMouseDown}
          onClick={resetWidth}
          className="
            absolute
            h-full
            w-1
            right-0
            top-0
            opacity-0
            group-hover/sidebar:opacity-100
            bg-primary/10
            transition
            cursor-ew-resize
          "
        />
      </aside>

      <div
        ref={navbarRef}
        className={cn(
          `
            absolute
            top-0
            z-[99999]
            left-60
            w-[calc(100%-${minWidth}px)]
          `,
          isResetting && "transition-all ease-in-out duration-300",
          isMobile && "left-0 w-full",
        )}
      >
        <nav className="bg-transparent px-3 py-2 w-full">
          {isCollapsed && (
            <MenuIcon
              onClick={resetWidth}
              role="button"
              className="h-6 w-6 text-muted-foreground"
            />
          )}
        </nav>
      </div>
    </>
  );
};
