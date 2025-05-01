import { Comment } from "../model/types"

interface updateCommentProps {
  selectedComment: Comment | null
  setComments: React.Dispatch<React.SetStateAction<Record<number, Comment[]>>>
  setShowEditCommentDialog: (showEditCommentDialog: boolean) => void
}

// 댓글 업데이트
export const updateComment = async ({ selectedComment, setComments, setShowEditCommentDialog }: updateCommentProps) => {
  if (!selectedComment) {
    console.error("업데이트할 댓글이 없습니다.")
    return
  }

  try {
    const response = await fetch(`/api/comments/${selectedComment.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ body: selectedComment.body }),
    })
    const data = await response.json()
    setComments((prev) => ({
      ...prev,
      [data.postId]: prev[data.postId].map((comment) => (comment.id === data.id ? data : comment)),
    }))
    setShowEditCommentDialog(false)
  } catch (error) {
    console.error("댓글 업데이트 오류:", error)
  }
}
