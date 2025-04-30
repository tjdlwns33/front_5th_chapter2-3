import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@radix-ui/react-select"
import { forwardRef } from "react"
import { Button } from "./Button"

interface PaginationProps extends React.HTMLAttributes<HTMLDivElement> {
  limit: number
  skip: number
  total: number
  onLimitChange: (limit: number) => void
  onSkipChange: (skip: number) => void
}

export const Pagination = forwardRef<HTMLDivElement, PaginationProps>(
  ({ className, limit, skip, total, onLimitChange, onSkipChange, ...props }, ref) => (
    <div className="flex justify-between items-center" ref={ref} {...props}>
      <div className="flex items-center gap-2">
        <span>표시</span>
        <Select value={limit.toString()} onValueChange={(value) => onLimitChange(Number(value))}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="10" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="10">10</SelectItem>
            <SelectItem value="20">20</SelectItem>
            <SelectItem value="30">30</SelectItem>
          </SelectContent>
        </Select>
        <span>항목</span>
      </div>
      <div className="flex gap-2">
        <Button disabled={skip === 0} onClick={() => onSkipChange(Math.max(0, skip - limit))}>
          이전
        </Button>
        <Button disabled={skip + limit >= total} onClick={() => onSkipChange(skip + limit)}>
          다음
        </Button>
      </div>
    </div>
  ),
)

Pagination.displayName = "Pagination"
