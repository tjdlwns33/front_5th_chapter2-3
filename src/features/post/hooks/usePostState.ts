import { useState } from "react"
import { Post } from "../../../entities/post/model/types"

export const usePostState = () => {
  const [posts, setPosts] = useState<Post[]>([])
  const [selectedPost, setSelectedPost] = useState<Post | null>(null)
  const [newPost, setNewPost] = useState<{ title: string; body: string; userId: number }>({
    title: "",
    body: "",
    userId: 1,
  })

  return {
    posts,
    setPosts,
    selectedPost,
    setSelectedPost,
    newPost,
    setNewPost,
  }
}
