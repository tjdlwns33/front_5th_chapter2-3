import { User } from "../../user/model/types"

export interface Comment {
  id: number
  postId: number
  userId: number
  body: string
  likes: number
  user?: User
}
