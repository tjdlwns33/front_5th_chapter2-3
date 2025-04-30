import { Dialog, DialogContent, DialogTitle } from "@radix-ui/react-dialog"
import { DialogHeader } from "../../../shared/ui/Modal"
import { Textarea } from "../../../shared/ui/Textarea"
import { Button } from "../../../shared/ui/Button"

interface AddCommentModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  newComment: { body: string; postId: number | null; userId: number }
  onChange: (newComment: { body: string; postId: number | null; userId: number }) => void
  onClick: () => void
}

export const AddCommentModal = ({ open, onOpenChange, newComment, onChange, onClick }: AddCommentModalProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>새 댓글 추가</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <Textarea
            placeholder="댓글 내용"
            value={newComment.body}
            onChange={(e) => onChange({ ...newComment, body: e.target.value })}
          />
          <Button onClick={onClick}>댓글 추가</Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
