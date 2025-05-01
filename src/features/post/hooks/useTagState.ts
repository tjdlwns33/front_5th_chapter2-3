import { useState } from "react"
import { Tag } from "../../../shared/model/types"

export const useTagState = (initialTag: string = "") => {
  const [tags, setTags] = useState<Tag[]>([])
  const [selectedTag, setSelectedTag] = useState<string>(initialTag)

  return {
    tags,
    setTags,
    selectedTag,
    setSelectedTag,
  }
}
