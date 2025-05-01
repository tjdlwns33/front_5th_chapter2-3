import { FetchUsersResponse } from "../../user/model/types"
import { FetchPostsResponse, Post } from "../model/types"

interface fetchPostsByTagProps {
  tag: string
  setLoading: (loading: boolean) => void
  setPosts: (post: Post[]) => void
  setTotal: (total: number) => void
}

// 태그별 게시물 가져오기
export const fetchPostsByTag = async ({ tag, setLoading, setPosts, setTotal }: fetchPostsByTagProps) => {
  setLoading(true)
  try {
    const [postsResponse, usersResponse] = await Promise.all([
      fetch(`/api/posts/tag/${tag}`),
      fetch("/api/users?limit=0&select=username,image"),
    ])
    const postsData = (await postsResponse.json()) as FetchPostsResponse
    const usersData = (await usersResponse.json()) as FetchUsersResponse

    const postsWithUsers: Post[] = postsData.posts.map((post) => ({
      ...post,
      author: usersData.users.find((user) => user.id === post.userId),
    }))

    setPosts(postsWithUsers)
    setTotal(postsData.total)
  } catch (error) {
    console.error("태그별 게시물 가져오기 오류:", error)
  }
  setLoading(false)
}
