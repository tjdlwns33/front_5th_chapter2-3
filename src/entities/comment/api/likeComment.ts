import { Comment } from "../model/types"

interface likeCommentProps {
  id: number
  postId: number
  comments: Record<number, Comment[]>
  setComments: React.Dispatch<React.SetStateAction<Record<number, Comment[]>>>
}

// 댓글 좋아요
export const likeComment = async ({ id, postId, comments, setComments }: likeCommentProps) => {
  try {
    const commentList = comments[postId]
    if (!commentList) {
      console.error("댓글 목록이 없습니다.")
      return
    }

    const targetComment = comments[postId].find((c) => c.id === id)
    if (!targetComment) {
      console.error("대상 댓글을 찾을 수 없습니다.")
      return
    }

    const response = await fetch(`/api/comments/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ likes: targetComment.likes + 1 }),
    })
    const data = await response.json()
    setComments((prev) => ({
      ...prev,
      [postId]: prev[postId].map((comment) =>
        comment.id === data.id ? { ...data, likes: comment.likes + 1 } : comment,
      ),
    }))
  } catch (error) {
    console.error("댓글 좋아요 오류:", error)
  }
}
