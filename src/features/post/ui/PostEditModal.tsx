import { Post } from "../../../entities/post/model/types"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../../../shared/ui/Modal"
import { Input } from "../../../shared/ui/Input"
import { Textarea } from "../../../shared/ui/Textarea"
import { Button } from "../../../shared/ui/Button"

interface PostEditModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  post: Post | null
  onChange: (post: Post | null) => void
  onClick: () => void
}

export const PostEditModal = ({ open, onOpenChange, post, onChange, onClick }: PostEditModalProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>게시물 수정</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <Input
            placeholder="제목"
            value={post?.title || ""}
            onChange={(e) => {
              if (!post) return
              onChange({ ...post, title: e.target.value })
            }}
          />
          <Textarea
            rows={15}
            placeholder="내용"
            value={post?.body || ""}
            onChange={(e) => {
              if (!post) return
              onChange({ ...post, body: e.target.value })
            }}
          />
          <Button onClick={onClick}>게시물 업데이트</Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
