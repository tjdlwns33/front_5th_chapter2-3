import { Dialog, DialogContent, DialogTitle } from "@radix-ui/react-dialog"

import { User } from "../model/types"
import { DialogHeader } from "../../../shared/ui/Modal"

interface UserModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  user: User | null
}

export const UserModal = ({ open, onOpenChange, user }: UserModalProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>사용자 정보</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <img src={user?.image} alt={user?.username} className="w-24 h-24 rounded-full mx-auto" />
          <h3 className="text-xl font-semibold text-center">{user?.username}</h3>
          <div className="space-y-2">
            <p>
              <strong>이름:</strong> {user?.firstName} {user?.lastName}
            </p>
            <p>
              <strong>나이:</strong> {user?.age}
            </p>
            <p>
              <strong>이메일:</strong> {user?.email}
            </p>
            <p>
              <strong>전화번호:</strong> {user?.phone}
            </p>
            <p>
              <strong>주소:</strong> {user?.address?.address}, {user?.address?.city}, {user?.address?.state}
            </p>
            <p>
              <strong>직장:</strong> {user?.company?.name} - {user?.company?.title}
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
