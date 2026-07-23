import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction
} from "@/components/ui/alert-dialog";

interface DialogProps {
  alertTrigger: any;
  onClick?: () => void;
}

export function Dialog({ alertTrigger, onClick }: DialogProps) {
  <AlertDialog>
    <AlertDialogTrigger>
      <button>Delete tournament</button>
    </AlertDialogTrigger>
    <AlertDialogContent>
      <AlertDialogHeader>
        <AlertDialogTitle>Delete this tournament?</AlertDialogTitle>
        <AlertDialogDescription>
          This removes all brackets, matches, and registrations. Can't be
          undone.
        </AlertDialogDescription>
      </AlertDialogHeader>
      <AlertDialogFooter>
        <AlertDialogCancel>Cancel</AlertDialogCancel>
        <AlertDialogAction onClick={onClick}>Delete</AlertDialogAction>
      </AlertDialogFooter>
    </AlertDialogContent>
  </AlertDialog>;
}
