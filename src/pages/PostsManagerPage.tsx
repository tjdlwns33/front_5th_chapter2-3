import { useEffect, useState } from "react"
import { Plus, Search } from "lucide-react"
import { useLocation, useNavigate } from "react-router-dom"

import { FetchPostsResponse, Post } from "../entities/post/model/types"
import { Tag } from "../shared/model/types"
import { FetchUsersResponse, User } from "../entities/user/model/types"
import { Comment } from "../entities/comment/model/types"
import { UserModal } from "../entities/user/ui/UserModal"
import { PostDetailModal } from "../features/post/ui/PostDetailModal"
import { EditCommentModal } from "../features/comments/ui/EditCommentModal"
import { AddCommentModal } from "../features/comments/ui/AddCommentModal"
import { PostEditModal } from "../features/post/ui/PostEditModal"
import { PostAddModal } from "../features/post/ui/PostAddModal"
import { Pagination } from "../shared/ui/Pagination"
import { Button } from "../shared/ui/Button"
import { Card, CardContent, CardHeader, CardTitle } from "../shared/ui/Card"
import { Input } from "../shared/ui/Input"
import { PostTable } from "../features/post/ui/PostTable"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../shared/ui/Select"

const PostsManager = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const queryParams = new URLSearchParams(location.search)

  // 상태 관리
  const [posts, setPosts] = useState<Post[]>([])
  const [selectedPost, setSelectedPost] = useState<Post | null>(null)
  const [newPost, setNewPost] = useState<{ title: string; body: string; userId: number }>({
    title: "",
    body: "",
    userId: 1,
  })

  const [total, setTotal] = useState<number>(0)
  const [skip, setSkip] = useState<number>(parseInt(queryParams.get("skip") || "0"))
  const [limit, setLimit] = useState<number>(parseInt(queryParams.get("limit") || "10"))
  const [searchQuery, setSearchQuery] = useState<string>(queryParams.get("search") || "")
  const [sortBy, setSortBy] = useState<string>(queryParams.get("sortBy") || "")
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">((queryParams.get("sortOrder") as "asc" | "desc") || "asc")
  const [loading, setLoading] = useState<boolean>(false)

  const [tags, setTags] = useState<Tag[]>([])
  const [selectedTag, setSelectedTag] = useState<string>(queryParams.get("tag") || "")

  const [comments, setComments] = useState<Record<number, Comment[]>>({})
  const [selectedComment, setSelectedComment] = useState<Comment | null>(null)
  const [newComment, setNewComment] = useState<{ body: string; postId: number | null; userId: number }>({
    body: "",
    postId: null,
    userId: 1,
  })

  const [selectedUser, setSelectedUser] = useState<User | null>(null)

  const [showAddDialog, setShowAddDialog] = useState<boolean>(false)
  const [showEditDialog, setShowEditDialog] = useState<boolean>(false)
  const [showAddCommentDialog, setShowAddCommentDialog] = useState<boolean>(false)
  const [showEditCommentDialog, setShowEditCommentDialog] = useState<boolean>(false)
  const [showPostDetailDialog, setShowPostDetailDialog] = useState<boolean>(false)
  const [showUserModal, setShowUserModal] = useState<boolean>(false)

  // URL 업데이트 함수
  const updateURL = () => {
    const params = new URLSearchParams()
    if (skip) params.set("skip", skip.toString())
    if (limit) params.set("limit", limit.toString())
    if (searchQuery) params.set("search", searchQuery)
    if (sortBy) params.set("sortBy", sortBy)
    if (sortOrder) params.set("sortOrder", sortOrder)
    if (selectedTag) params.set("tag", selectedTag)
    navigate(`?${params.toString()}`)
  }

  // 게시물 가져오기
  const fetchPosts = async () => {
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

  // 태그 가져오기
  const fetchTags = async () => {
    try {
      const response = await fetch("/api/posts/tags")
      const data = await response.json()
      setTags(data)
    } catch (error) {
      console.error("태그 가져오기 오류:", error)
    }
  }

  // 게시물 검색
  const searchPosts = async () => {
    if (!searchQuery) {
      fetchPosts()
      return
    }
    setLoading(true)
    try {
      const response = await fetch(`/api/posts/search?q=${searchQuery}`)
      const data = await response.json()
      setPosts(data.posts)
      setTotal(data.total)
    } catch (error) {
      console.error("게시물 검색 오류:", error)
    }
    setLoading(false)
  }

  // 태그별 게시물 가져오기
  const fetchPostsByTag = async (tag: string) => {
    if (!tag || tag === "all") {
      fetchPosts()
      return
    }
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

  // 게시물 추가
  const addPost = async () => {
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

  // 게시물 업데이트
  const updatePost = async () => {
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

  // 게시물 삭제
  const deletePost = async (id: number) => {
    try {
      await fetch(`/api/posts/${id}`, {
        method: "DELETE",
      })
      setPosts(posts.filter((post) => post.id !== id))
    } catch (error) {
      console.error("게시물 삭제 오류:", error)
    }
  }

  // 댓글 가져오기
  const fetchComments = async (postId: number) => {
    if (comments[postId]) return // 이미 불러온 댓글이 있으면 다시 불러오지 않음
    try {
      const response = await fetch(`/api/comments/post/${postId}`)
      const data = await response.json()
      setComments((prev) => ({ ...prev, [postId]: data.comments }))
    } catch (error) {
      console.error("댓글 가져오기 오류:", error)
    }
  }

  // 댓글 추가
  const addComment = async () => {
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

  // 댓글 업데이트
  const updateComment = async () => {
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

  // 댓글 삭제
  const deleteComment = async (id: number, postId: number) => {
    try {
      await fetch(`/api/comments/${id}`, {
        method: "DELETE",
      })
      setComments((prev) => ({
        ...prev,
        [postId]: prev[postId].filter((comment) => comment.id !== id),
      }))
    } catch (error) {
      console.error("댓글 삭제 오류:", error)
    }
  }

  // 댓글 좋아요
  const likeComment = async (id: number, postId: number) => {
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

  // 게시물 상세 보기
  const openPostDetail = (post: Post) => {
    setSelectedPost(post)
    fetchComments(post.id)
    setShowPostDetailDialog(true)
  }

  // 사용자 모달 열기
  const openUserModal = async (user: User) => {
    try {
      const response = await fetch(`/api/users/${user.id}`)
      const userData = await response.json()
      setSelectedUser(userData)
      setShowUserModal(true)
    } catch (error) {
      console.error("사용자 정보 가져오기 오류:", error)
    }
  }

  useEffect(() => {
    fetchTags()
  }, [])

  useEffect(() => {
    if (selectedTag) {
      fetchPostsByTag(selectedTag)
    } else {
      fetchPosts()
    }
    updateURL()
  }, [skip, limit, sortBy, sortOrder, selectedTag])

  useEffect(() => {
    const params = new URLSearchParams(location.search)
    setSkip(parseInt(params.get("skip") || "0"))
    setLimit(parseInt(params.get("limit") || "10"))
    setSearchQuery(params.get("search") || "")
    setSortBy(params.get("sortBy") || "")
    const sortOrderParam = params.get("sortOrder")
    if (sortOrderParam === "asc" || sortOrderParam === "desc") {
      setSortOrder(sortOrderParam)
    } else {
      setSortOrder("asc")
    }
    setSelectedTag(params.get("tag") || "")
  }, [location.search])

  return (
    <Card className="w-full max-w-6xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>게시물 관리자</span>
          <Button onClick={() => setShowAddDialog(true)}>
            <Plus className="w-4 h-4 mr-2" />
            게시물 추가
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col gap-4">
          {/* 검색 및 필터 컨트롤 */}
          <div className="flex gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="게시물 검색..."
                  className="pl-8"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && searchPosts()}
                />
              </div>
            </div>
            <Select
              value={selectedTag}
              onValueChange={(value) => {
                setSelectedTag(value)
                fetchPostsByTag(value)
                updateURL()
              }}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="태그 선택" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">모든 태그</SelectItem>
                {tags.map((tag) => (
                  <SelectItem key={tag.url} value={tag.slug}>
                    {tag.slug}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="정렬 기준" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">없음</SelectItem>
                <SelectItem value="id">ID</SelectItem>
                <SelectItem value="title">제목</SelectItem>
                <SelectItem value="reactions">반응</SelectItem>
              </SelectContent>
            </Select>
            <Select
              value={sortOrder}
              onValueChange={(value) => {
                if (value === "asc" || value === "desc") {
                  setSortOrder(value)
                }
              }}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="정렬 순서" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="asc">오름차순</SelectItem>
                <SelectItem value="desc">내림차순</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* 게시물 테이블 */}
          {loading ? (
            <div className="flex justify-center p-4">로딩 중...</div>
          ) : (
            <PostTable
              posts={posts}
              searchQuery={searchQuery}
              selectedTag={selectedTag}
              setSelectedTag={setSelectedTag}
              updateURL={updateURL}
              openUserModal={openUserModal}
              openPostDetail={openPostDetail}
              setSelectedPost={setSelectedPost}
              setShowEditDialog={setShowEditDialog}
              deletePost={deletePost}
            />
          )}

          {/* 페이지네이션 */}
          <Pagination limit={limit} skip={skip} total={total} onLimitChange={setLimit} onSkipChange={setSkip} />
        </div>
      </CardContent>

      {/* 댓글 추가 대화상자 */}
      <AddCommentModal
        open={showAddCommentDialog}
        onOpenChange={setShowAddCommentDialog}
        newComment={newComment}
        onChange={setNewComment}
        onClick={addComment}
      />

      {/* 댓글 수정 대화상자 */}
      <EditCommentModal
        open={showEditCommentDialog}
        onOpenChange={setShowEditCommentDialog}
        comment={selectedComment}
        onChange={setSelectedComment}
        onClick={updateComment}
      />

      {/* 게시물 추가 대화상자 */}
      <PostAddModal
        open={showAddDialog}
        onOpenChange={setShowAddDialog}
        newPost={newPost}
        onChange={setNewPost}
        onClick={addPost}
      />

      {/* 게시물 수정 대화상자 */}
      <PostEditModal
        open={showEditDialog}
        onOpenChange={setShowEditDialog}
        post={selectedPost}
        onChange={setSelectedPost}
        onClick={updatePost}
      />

      {/* 게시물 상세 보기 대화상자 */}
      <PostDetailModal
        open={showPostDetailDialog}
        onOpenChange={setShowPostDetailDialog}
        post={selectedPost}
        comments={comments}
        searchQuery={searchQuery}
        onAddComment={addComment}
        onEditComment={updateComment}
        onDeleteComment={deleteComment}
        onLikeComment={likeComment}
      />

      {/* 사용자 모달 */}
      <UserModal open={showUserModal} onOpenChange={setShowUserModal} user={selectedUser} />
    </Card>
  )
}

export default PostsManager
