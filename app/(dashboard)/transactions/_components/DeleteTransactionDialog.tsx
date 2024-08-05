"use client";

import {
  AlertDialogHeader,
  AlertDialogFooter,
} from "@/components/ui/alert-dialog";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogCancel,
  AlertDialogAction,
} from "@/components/ui/alert-dialog";
import { useQueryClient, useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { DeleteTransaction } from "../_actions/deleteTransaction";

interface Props {
  open: boolean;
  setOpen: (open: boolean) => void;
  transactionId: string;
}

export default function DeleteTransactionDialog({
  open,
  setOpen,
  transactionId,
}: Props) {
  const queryClient = useQueryClient();

  const deleteMutation = useMutation({
    mutationFn: DeleteTransaction,

    onSuccess: () => {
      toast.success("Transaction deleted successfully", {
        id: transactionId,
      });

      queryClient.invalidateQueries({
        queryKey: ["overview"],
      });

      queryClient.invalidateQueries({ queryKey: ["transactions"] });
    },

    onError: () => {
      toast.error("Something went wrong", {
        id: transactionId,
      });
    },
  });

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>

          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete your
            category
          </AlertDialogDescription>
        </AlertDialogHeader>

        <AlertDialogFooter>
          <AlertDialogAction
            onClick={() => {
              toast.loading("Deleting transaction...", {
                id: transactionId,
              });

              deleteMutation.mutate(transactionId);
            }}
          >
            Continue
          </AlertDialogAction>

          <AlertDialogCancel>Cancel</AlertDialogCancel>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
