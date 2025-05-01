import { useLocation, useNavigate } from "react-router-dom"

export const useQueryParams = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const queryParams = new URLSearchParams(location.search)

  const getParam = (key: string): string | null => {
    return queryParams.get(key)
  }

  const setParam = (key: string, value: string) => {
    queryParams.set(key, value)
    navigate({ search: queryParams.toString() }, { replace: true })
  }

  const deleteParam = (key: string) => {
    queryParams.delete(key)
    navigate({ search: queryParams.toString() }, { replace: true })
  }

  return {
    getParam,
    setParam,
    deleteParam,
    queryParams,
  }
}
