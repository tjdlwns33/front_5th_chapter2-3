import { Post } from "../model/types"

interface deletePostProps {
  id: number
  posts: Post[]
  setPosts: (post: Post[]) => void
}

// 게시물 삭제
export const deletePost = async ({ id, posts, setPosts }: deletePostProps) => {
  try {
    await fetch(`/api/posts/${id}`, {
      method: "DELETE",
    })
    setPosts(posts.filter((post) => post.id !== id))
  } catch (error) {
    console.error("게시물 삭제 오류:", error)
  }
}
