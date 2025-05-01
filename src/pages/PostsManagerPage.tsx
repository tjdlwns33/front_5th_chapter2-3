import { useEffect, useState } from "react"
import { Plus, Search } from "lucide-react"
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
import { fetchPosts } from "../entities/post/api/fetchPosts"
import { searchPosts } from "../entities/post/api/searchPosts"
import { fetchPostsByTag } from "../entities/post/api/fetchPostsByTag"
import { addPost } from "../entities/post/api/addPost"
import { updatePost } from "../entities/post/api/updatePost"
import { deletePost } from "../entities/post/api/deletePost"
import { fetchTags } from "../entities/post/api/fetchTags"
import { addComment } from "../entities/comment/api/addComment"
import { updateComment } from "../entities/comment/api/updateComment"
import { deleteComment } from "../entities/comment/api/deleteComment"
import { likeComment } from "../entities/comment/api/likeComment"
import { useLoadingState } from "../shared/hooks/useLoadingState"
import { usePostState } from "../features/post/hooks/usePostState"
import { useQueryParams } from "../shared/hooks/useQueryParams"
import { useTagState } from "../features/post/hooks/useTagState"
import { usePostSearchState } from "../features/post/hooks/usePostSearchState"
import { useCommentState } from "../features/comments/hooks/useCommentState"
import { useUserState } from "../shared/hooks/useUserState"
import { useModalState } from "../shared/hooks/useModalState"
import { openUserModal } from "../shared/api/openUserModal"
import { usePostDetail } from "../features/post/hooks/usePostDetail"

const PostsManager = () => {
  const { getParam, setParam } = useQueryParams()
  const [initialTag, setInitialTag] = useState("")
  const [initialSkip, setInitialSkip] = useState(0)
  const [initialLimit, setInitialLimit] = useState(10)
  const [initialSearchQuery, setInitialSearchQuery] = useState("")
  const [initialSortBy, setInitialSortBy] = useState("")
  const [initialSortOrder, setInitialSortOrder] = useState<"asc" | "desc">("asc")

  useEffect(() => {
    setInitialTag(getParam("tag") || "")
    setInitialSkip(parseInt(getParam("skip") || "0"))
    setInitialLimit(parseInt(getParam("limit") || "10"))
    setInitialSearchQuery(getParam("search") || "")
    setInitialSortBy(getParam("sortBy") || "")
    setInitialSortOrder((getParam("sortOrder") as "asc" | "desc") || "asc")
  }, [])

  // 상태 관리
  const { loading, setLoading } = useLoadingState()
  const { posts, setPosts, selectedPost, setSelectedPost, newPost, setNewPost } = usePostState()
  const { tags, setTags, selectedTag, setSelectedTag } = useTagState(initialTag)
  const {
    total,
    setTotal,
    skip,
    setSkip,
    limit,
    setLimit,
    searchQuery,
    setSearchQuery,
    sortBy,
    setSortBy,
    sortOrder,
    setSortOrder,
  } = usePostSearchState(initialSkip, initialLimit, initialSearchQuery, initialSortBy, initialSortOrder)
  const { comments, setComments, selectedComment, setSelectedComment, newComment, setNewComment } = useCommentState()
  const { selectedUser, setSelectedUser } = useUserState()
  const {
    showAddDialog,
    setShowAddDialog,
    showEditDialog,
    setShowEditDialog,
    showAddCommentDialog,
    setShowAddCommentDialog,
    showEditCommentDialog,
    setShowEditCommentDialog,
    showPostDetailDialog,
    setShowPostDetailDialog,
    showUserModal,
    setShowUserModal,
  } = useModalState()
  const { openPostDetail } = usePostDetail({
    setSelectedPost,
    setComments,
    setShowPostDetailDialog,
    comments,
  })

  // URL 업데이트 함수
  const updateURL = () => {
    if (skip !== undefined) setParam("skip", skip.toString())
    if (limit !== undefined) setParam("limit", limit.toString())
    if (searchQuery) setParam("search", searchQuery)
    if (sortBy) setParam("sortBy", sortBy)
    if (sortOrder) setParam("sortOrder", sortOrder)
    if (selectedTag) setParam("tag", selectedTag)
  }

  useEffect(() => {
    fetchTags({ setTags })
  }, [])

  useEffect(() => {
    if (selectedTag) {
      if (!selectedTag || selectedTag === "all") {
        fetchPosts({ limit, skip, setLoading, setPosts, setTotal })
      } else {
        fetchPostsByTag({ tag: selectedTag, setLoading, setPosts, setTotal })
      }
    } else {
      fetchPosts({ limit, skip, setLoading, setPosts, setTotal })
    }
    updateURL()
  }, [skip, limit, setLoading, setPosts, setTotal, selectedTag])

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
                  onKeyPress={(e) => {
                    if (e.key === "Enter") {
                      if (!searchQuery) {
                        fetchPosts({ limit, skip, setLoading, setPosts, setTotal })
                        return
                      }
                      searchPosts({ searchQuery, setLoading, setPosts, setTotal })
                    }
                  }}
                />
              </div>
            </div>
            <Select
              value={selectedTag}
              onValueChange={(value) => {
                setSelectedTag(value)
                if (!value || value === "all") {
                  fetchPosts({ limit, skip, setLoading, setPosts, setTotal })
                } else {
                  fetchPostsByTag({ tag: value, setLoading, setPosts, setTotal })
                }
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
              openUserModal={(user) => openUserModal({ user, setSelectedUser, setShowUserModal })}
              openPostDetail={openPostDetail}
              setSelectedPost={setSelectedPost}
              setShowEditDialog={setShowEditDialog}
              deletePost={(id) => deletePost({ id, posts, setPosts })}
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
        onClick={() => addComment({ newComment, setComments, setShowAddCommentDialog, setNewComment })}
      />

      {/* 댓글 수정 대화상자 */}
      <EditCommentModal
        open={showEditCommentDialog}
        onOpenChange={setShowEditCommentDialog}
        comment={selectedComment}
        onChange={setSelectedComment}
        onClick={() => updateComment({ selectedComment, setComments, setShowEditCommentDialog })}
      />

      {/* 게시물 추가 대화상자 */}
      <PostAddModal
        open={showAddDialog}
        onOpenChange={setShowAddDialog}
        newPost={newPost}
        onChange={setNewPost}
        onClick={() => addPost({ posts, newPost, setPosts, setShowAddDialog, setNewPost })}
      />

      {/* 게시물 수정 대화상자 */}
      <PostEditModal
        open={showEditDialog}
        onOpenChange={setShowEditDialog}
        post={selectedPost}
        onChange={setSelectedPost}
        onClick={() => updatePost({ posts, selectedPost, setPosts, setShowEditDialog })}
      />

      {/* 게시물 상세 보기 대화상자 */}
      <PostDetailModal
        open={showPostDetailDialog}
        onOpenChange={setShowPostDetailDialog}
        post={selectedPost}
        comments={comments}
        searchQuery={searchQuery}
        onAddComment={() => addComment({ newComment, setComments, setShowAddCommentDialog, setNewComment })}
        onEditComment={() => updateComment({ selectedComment, setComments, setShowEditCommentDialog })}
        onDeleteComment={(id, postId) => deleteComment({ id, postId, setComments })}
        onLikeComment={(id, postId) => likeComment({ id, postId, comments, setComments })}
      />

      {/* 사용자 모달 */}
      <UserModal open={showUserModal} onOpenChange={setShowUserModal} user={selectedUser} />
    </Card>
  )
}

export default PostsManager
