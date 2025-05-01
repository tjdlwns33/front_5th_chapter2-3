import { Post } from "../../../entities/post/model/types"

import { highlightText } from "../../../shared/lib/highlightText"
import { CommentsSection } from "../../comments/ui/CommentsSection"
import { Comment } from "../../../entities/comment/model/types"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../../../shared/ui/Modal"

interface PostDetailModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  post: Post | null
  comments: Record<number, Comment[]>
  searchQuery: string
  onAddComment: (postId: number) => void
  onEditComment: (comment: Comment) => void
  onDeleteComment: (commentId: number, postId: number) => void
  onLikeComment: (commentId: number, postId: number) => void
}

export const PostDetailModal = ({
  open,
  onOpenChange,
  post,
  comments,
  searchQuery,
  onAddComment,
  onEditComment,
  onDeleteComment,
  onLikeComment,
}: PostDetailModalProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>{highlightText(post?.title ?? "", searchQuery)}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <p>{highlightText(post?.body ?? "", searchQuery)}</p>
          {post?.id !== undefined && (
            <CommentsSection
              postId={post.id}
              comments={comments}
              searchQuery={searchQuery}
              onAdd={onAddComment}
              onEdit={onEditComment}
              onDelete={onDeleteComment}
              onLike={onLikeComment}
            />
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
