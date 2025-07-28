import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"

export function NotesSection({ notes, status, onNotesChange }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Ghi chú</CardTitle>
      </CardHeader>
      <CardContent>
        <Textarea
          placeholder={status === "SENT" ? "Xem ghi chú..." : "Thêm ghi chú cho báo giá..."}
          value={notes}
          onChange={(e) => onNotesChange(e.target.value)}
          rows={3}
          disabled={status === "SENT"}
        />
      </CardContent>
    </Card>
  )
}
