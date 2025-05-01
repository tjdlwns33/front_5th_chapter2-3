import { User } from "../../entities/user/model/types"

interface openUserModalProps {
  user: User
  setSelectedUser: (selectedUser: User | null) => void
  setShowUserModal: (showUserModal: boolean) => void
}

// 사용자 모달 열기
export const openUserModal = async ({ user, setSelectedUser, setShowUserModal }: openUserModalProps) => {
  try {
    const response = await fetch(`/api/users/${user.id}`)
    const userData = await response.json()
    setSelectedUser(userData)
    setShowUserModal(true)
  } catch (error) {
    console.error("사용자 정보 가져오기 오류:", error)
  }
}
