import { Comment } from "../../../entities/comment/model/types"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../../../shared/ui/Modal"
import { Textarea } from "../../../shared/ui/Textarea"
import { Button } from "../../../shared/ui/Button"

interface EditCommentModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  comment: Comment | null
  onChange: (comment: Comment | null) => void
  onClick: () => void
}

export const EditCommentModal = ({ open, onOpenChange, comment, onChange, onClick }: EditCommentModalProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>댓글 수정</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <Textarea
            placeholder="댓글 내용"
            value={comment?.body || ""}
            onChange={(e) => {
              if (!comment) return
              onChange({ ...comment, body: e.target.value })
            }}
          />
          <Button onClick={onClick}>댓글 업데이트</Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
