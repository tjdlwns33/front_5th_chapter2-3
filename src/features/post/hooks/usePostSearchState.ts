import { useState } from "react"

export const usePostSearchState = (
  initialSkip: number = 0,
  initialLimit: number = 10,
  initialSearch: string = "",
  initialSortBy: string = "",
  initialSortOrder: "asc" | "desc" = "asc",
) => {
  const [total, setTotal] = useState<number>(0)
  const [skip, setSkip] = useState<number>(initialSkip)
  const [limit, setLimit] = useState<number>(initialLimit)
  const [searchQuery, setSearchQuery] = useState<string>(initialSearch)
  const [sortBy, setSortBy] = useState<string>(initialSortBy)
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">(initialSortOrder)

  return {
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
  }
}
