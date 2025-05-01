import { fetchComments } from "../../../entities/comment/api/fetchComments"
import { Comment } from "../../../entities/comment/model/types"
import { Post } from "../../../entities/post/model/types"

interface usePostDetailProps {
  setSelectedPost: (selectedPost: Post | null) => void
  comments: Record<number, Comment[]>
  setComments: React.Dispatch<React.SetStateAction<Record<number, Comment[]>>>
  setShowPostDetailDialog: (showPostDetailDialog: boolean) => void
}

export const usePostDetail = ({
  setSelectedPost,
  setComments,
  setShowPostDetailDialog,
  comments,
}: usePostDetailProps) => {
  const openPostDetail = (post: Post) => {
    setSelectedPost(post)
    fetchComments({ postId: post.id, comments, setComments })
    setShowPostDetailDialog(true)
  }

  return { openPostDetail }
}
