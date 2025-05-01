import { Post } from "../model/types"

interface updatePostProps {
  posts: Post[]
  selectedPost: Post | null
  setPosts: (post: Post[]) => void
  setShowEditDialog: (showEditDialog: boolean) => void
}

// 게시물 업데이트
export const updatePost = async ({ posts, selectedPost, setPosts, setShowEditDialog }: updatePostProps) => {
  if (!selectedPost) {
    console.error("업데이트할 게시물이 없습니다.")
    return
  }

  try {
    const response = await fetch(`/api/posts/${selectedPost.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(selectedPost),
    })
    const data = await response.json()
    setPosts(posts.map((post) => (post.id === data.id ? data : post)))
    setShowEditDialog(false)
  } catch (error) {
    console.error("게시물 업데이트 오류:", error)
  }
}
