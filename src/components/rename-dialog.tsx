"use client"

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from "@/components/ui/dialog"

import { api } from "@/convex/_generated/api"
import { Id } from "@/convex/_generated/dataModel"
import { useMutation } from "convex/react"
import React, { useState } from "react"
import { Input } from "./ui/input"
import { Button } from "./ui/button"
import { toast } from "sonner"

interface RenameDialogProps {
  documentId: Id<"documents">
  readonly initialTitle: string
  children: React.ReactNode
}

export const RenameDialog = ({ documentId, initialTitle, children }: RenameDialogProps) => {

  const update = useMutation(api.documents.updateById);
  const [isUpdating, setIsUpdating] = useState(false);

  const [title, setTitle] = useState(initialTitle);
  const [open, setOpen] = useState(false);

 const onSubmit = ( e: React.FormEvent<HTMLFormElement>) => {
  e.preventDefault();
  setIsUpdating(true);

  update({ id: documentId, title: title.trim() || "Untitled" })
    .then(() => {
      setOpen(false)
      toast.success("Document title updated")}
    )
    .catch(() => toast.error("Failed to update document title"))
    .finally(() => setIsUpdating(false));
 }

  return (
   <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent onClick={e => e.stopPropagation()}>
        <form onSubmit={onSubmit}>
          <DialogHeader>
            <DialogTitle>Rename document</DialogTitle>
            <DialogDescription>
              Enter a new name for your document
            </DialogDescription>
          </DialogHeader>
          <div className="my-4">
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Document name"
              onClick={(e) => e.stopPropagation()}
            />
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="ghost"
              onClick={(e) => {
                e.stopPropagation()
                setOpen(false)
              }}
              disabled={isUpdating}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isUpdating}
              onClick={(e) => e.stopPropagation()} 
            >
              Save
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
   </Dialog>
  )
}