import { Comment } from "../model/types"

interface addCommentProps {
  newComment: { body: string; postId: number | null; userId: number }
  setComments: React.Dispatch<React.SetStateAction<Record<number, Comment[]>>>
  setShowAddCommentDialog: (showAddCommentDialog: boolean) => void
  setNewComment: (newComment: { body: string; postId: number | null; userId: number }) => void
}

// 댓글 추가
export const addComment = async ({
  newComment,
  setComments,
  setShowAddCommentDialog,
  setNewComment,
}: addCommentProps) => {
  try {
    const response = await fetch("/api/comments/add", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newComment),
    })
    const data = await response.json()
    setComments((prev) => ({
      ...prev,
      [data.postId]: [...(prev[data.postId] || []), data],
    }))
    setShowAddCommentDialog(false)
    setNewComment({ body: "", postId: null, userId: 1 })
  } catch (error) {
    console.error("댓글 추가 오류:", error)
  }
}
