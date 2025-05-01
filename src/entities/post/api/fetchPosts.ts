import { FetchUsersResponse } from "../../user/model/types"
import { FetchPostsResponse, Post } from "../model/types"

interface fetchPostsProps {
  limit: number
  skip: number
  setLoading: (loading: boolean) => void
  setPosts: (post: Post[]) => void
  setTotal: (total: number) => void
}

// 게시물 가져오기
export const fetchPosts = async ({ limit, skip, setLoading, setPosts, setTotal }: fetchPostsProps) => {
  setLoading(true)
  try {
    const postsResponse = await fetch(`/api/posts?limit=${limit}&skip=${skip}`)
    const postsData = (await postsResponse.json()) as FetchPostsResponse

    const usersResponse = await fetch("/api/users?limit=0&select=username,image")
    const usersData = (await usersResponse.json()) as FetchUsersResponse

    const postsWithUsers: Post[] = postsData.posts.map((post) => ({
      ...post,
      author: usersData.users.find((user) => user.id === post.userId),
    }))
    setPosts(postsWithUsers)
    setTotal(postsData.total)
  } catch (error) {
    console.error("게시물 가져오기 오류:", error)
  } finally {
    setLoading(false)
  }
}
