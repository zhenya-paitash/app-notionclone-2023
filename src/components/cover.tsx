"use client";

import Image from "next/image";
import { useParams } from "next/navigation";
import { ImageIcon, X } from "lucide-react";
import { useMutation } from "convex/react";

import { cn } from "@/lib/utils";
import { useEdgeStore } from "@/lib/edgestore";
import { useCoverImage } from "@/hooks/use-cover-image";
import { api } from "@convex/_generated/api";
import { Id } from "@convex/_generated/dataModel";

import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

interface CoverProps {
  url?: string;
  preview?: boolean;
}

export const Cover = ({
  url,
  preview,
}: CoverProps) => {
  const params = useParams();
  const { edgestore } = useEdgeStore();
  const coverimage = useCoverImage();
  const removeCoverImage = useMutation(api.documents.removeCoverImage);

  const onRemove = async () => {
    if (!url) return;
    await edgestore.publicFiles.delete({ url });
    removeCoverImage({
      id: params.documentId as Id<"documents">,
    });
  };

  return (
    <div
      className={cn(
        "relative w-full h-[35vh] group",
        url ? "bg-muted" : "h-[12vh]",
      )}
    >
      {!!url && (
        <Image
          src={url}
          alt="Cover"
          fill
          className="object-cover"
        />
      )}
      {url && !preview && (
        <div className="opacity-0 group-hover:opacity-100 absolute bottom-5 right-5 flex items-center gap-x-2">
          <Button
            onClick={() => coverimage.onReplace(url)}
            className="text-muted-foreground text-xs"
            variant="outline"
            size="sm"
          >
            <ImageIcon className="h-4 w-4 mr-2" />
            Change cover
          </Button>
          <Button
            onClick={onRemove}
            className="text-muted-foreground text-xs"
            variant="outline"
            size="sm"
          >
            <X className="h-4 w-4 mr-2" />
            Remove
          </Button>
        </div>
      )}
    </div>
  );
};

Cover.Skeleton = function CoverSkeleton() {
  return <Skeleton className="w-full h-[12vh]" />;
};
