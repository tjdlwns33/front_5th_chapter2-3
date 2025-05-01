import { useState } from "react"
import { User } from "../../entities/user/model/types"

export const useUserState = () => {
  const [selectedUser, setSelectedUser] = useState<User | null>(null)

  return {
    selectedUser,
    setSelectedUser,
  }
}
