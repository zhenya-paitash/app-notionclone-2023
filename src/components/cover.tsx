"use client";

import Image from "next/image";
import { useParams } from "next/navigation";
import { ImageIcon, X } from "lucide-react";
import { useMutation } from "convex/react";

import { cn } from "@/lib/utils";
import { useCoverImage } from "@/hooks/use-cover-image";
import { api } from "@convex/_generated/api";
import { Id } from "@convex/_generated/dataModel";

import { Button } from "@/components/ui/button";

interface CoverProps {
  url?: string;
  preview?: boolean;
}

export const Cover = ({
  url,
  preview,
}: CoverProps) => {
  const params = useParams();
  const coverimage = useCoverImage();
  const removeCoverImage = useMutation(api.documents.removeCoverImage);

  const onRemove = () => {
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
            onClick={coverimage.onOpen}
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
