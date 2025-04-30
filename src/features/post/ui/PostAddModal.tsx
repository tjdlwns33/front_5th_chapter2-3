import { Dialog, DialogContent, DialogTitle } from "@radix-ui/react-dialog"
import { DialogHeader } from "../../../shared/ui/Modal"
import { Input } from "../../../shared/ui/Input"
import { Textarea } from "../../../shared/ui/Textarea"
import { Button } from "../../../shared/ui/Button"

interface PostAddModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  newPost: { title: string; body: string; userId: number }
  onChange: (newPost: { title: string; body: string; userId: number }) => void
  onClick: () => void
}

export const PostAddModal = ({ open, onOpenChange, newPost, onChange, onClick }: PostAddModalProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>새 게시물 추가</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <Input
            placeholder="제목"
            value={newPost.title}
            onChange={(e) => onChange({ ...newPost, title: e.target.value })}
          />
          <Textarea
            rows={30}
            placeholder="내용"
            value={newPost.body}
            onChange={(e) => onChange({ ...newPost, body: e.target.value })}
          />
          <Input
            type="number"
            placeholder="사용자 ID"
            value={newPost.userId}
            onChange={(e) => onChange({ ...newPost, userId: Number(e.target.value) })}
          />
          <Button onClick={onClick}>게시물 추가</Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
