import { useState } from "react"
import { Comment } from "../../../entities/comment/model/types"

export const useCommentState = () => {
  const [comments, setComments] = useState<Record<number, Comment[]>>({})
  const [selectedComment, setSelectedComment] = useState<Comment | null>(null)
  const [newComment, setNewComment] = useState<{ body: string; postId: number | null; userId: number }>({
    body: "",
    postId: null,
    userId: 1,
  })

  return {
    comments,
    setComments,
    selectedComment,
    setSelectedComment,
    newComment,
    setNewComment,
  }
}
