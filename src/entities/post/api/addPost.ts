import { Post } from "../model/types"

interface addPostProps {
  posts: Post[]
  newPost: { title: string; body: string; userId: number }
  setPosts: (post: Post[]) => void
  setShowAddDialog: (showAddDialog: boolean) => void
  setNewPost: (newPost: { title: string; body: string; userId: number }) => void
}

// 게시물 추가
export const addPost = async ({ posts, newPost, setPosts, setShowAddDialog, setNewPost }: addPostProps) => {
  try {
    const response = await fetch("/api/posts/add", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newPost),
    })
    const data = await response.json()
    setPosts([data, ...posts])
    setShowAddDialog(false)
    setNewPost({ title: "", body: "", userId: 1 })
  } catch (error) {
    console.error("게시물 추가 오류:", error)
  }
}
