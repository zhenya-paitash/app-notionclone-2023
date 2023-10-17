"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useQuery } from "convex/react";
import { FileIcon } from "lucide-react";

import { Doc, Id } from "@convex/_generated/dataModel";
import { api } from "@convex/_generated/api";
import { cn } from "@/lib/utils";

import { Item } from "./item";

interface DocumentListProps {
  level?: number;
  parentDocumentId?: Id<"documents">;
  data?: Doc<"documents">[];
}

export const DocumentList = ({
  parentDocumentId,
  level = 0,
}: DocumentListProps) => {
  const params = useParams();
  const router = useRouter();
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});

  const onExpand = (documentId: string) => {
    setExpanded((prev) => ({
      ...prev,
      [documentId]: !prev[documentId],
    }));
  };

  const onRedirect = (docId: string) => router.push(`/documents/${docId}`);

  const documents = useQuery(api.documents.getSidebar, {
    parentDocument: parentDocumentId,
  });

  if (documents === undefined) {
    return (
      <>
        <Item.Skeleton level={level} />
        {!level && (
          <>
            <Item.Skeleton level={level} />
            <Item.Skeleton level={level} />
          </>
        )}
      </>
    );
  }

  return (
    <>
      <p
        style={{ paddingLeft: level ? `${(level * 12) + 25}px` : undefined }}
        className={cn(
          "hidden text-sm font-medium text-muted-foreground/80",
          expanded && "last:block",
          !level && "hidden",
        )}
      >
        No pages inside
      </p>

      {documents.map((doc) => (
        <div key={doc._id}>
          <Item
            id={doc._id}
            label={doc.title}
            icon={FileIcon}
            documentIcon={doc.icon}
            active={params.documentId === doc._id}
            level={level}
            expanded={expanded[doc._id]}
            onClick={() => onRedirect(doc._id)}
            onExpand={() => onExpand(doc._id)}
          />
          {expanded[doc._id] && (
            <DocumentList
              parentDocumentId={doc._id}
              level={level + 1}
            />
          )}
        </div>
      ))}
    </>
  );
};
