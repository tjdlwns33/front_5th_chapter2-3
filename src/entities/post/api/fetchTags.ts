import { Tag } from "../../../shared/model/types"

interface fetchTagsProps {
  setTags: (tags: Tag[]) => void
}

// 태그 가져오기
export const fetchTags = async ({ setTags }: fetchTagsProps) => {
  try {
    const response = await fetch("/api/posts/tags")
    const data = await response.json()
    setTags(data)
  } catch (error) {
    console.error("태그 가져오기 오류:", error)
  }
}
