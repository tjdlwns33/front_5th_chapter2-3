import { Comment } from "../model/types"

interface deleteCommentProps {
  id: number
  postId: number
  setComments: React.Dispatch<React.SetStateAction<Record<number, Comment[]>>>
}

// 댓글 삭제
export const deleteComment = async ({ id, postId, setComments }: deleteCommentProps) => {
  try {
    await fetch(`/api/comments/${id}`, {
      method: "DELETE",
    })
    setComments((prev) => ({
      ...prev,
      [postId]: prev[postId].filter((comment) => comment.id !== id),
    }))
  } catch (error) {
    console.error("댓글 삭제 오류:", error)
  }
}
