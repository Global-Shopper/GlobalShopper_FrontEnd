import { Card, CardHeader, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ChevronDown, ChevronUp, Store, Contact } from "lucide-react"

export function SubRequestDetails({ subRequest, index, isExpanded, onToggleExpansion, requestType, children }) {
  // Get the first contact info as title, fallback to seller name
  const getDisplayTitle = () => {
    if (subRequest.contactInfo && subRequest.contactInfo.length > 0) {
      return subRequest.contactInfo[0]
    }
    return subRequest.seller
  }

  return (
    <Card className="border-l-4 border-l-blue-500">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between cursor-pointer" onClick={() => onToggleExpansion(index)}>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <Store className="h-4 w-4 text-blue-600" />
              <span className="font-semibold">{getDisplayTitle()}</span>
            </div>
            {requestType === "ONLINE" && subRequest.ecommercePlatform && (
              <Badge variant="secondary" className="text-xs">
                {subRequest.ecommercePlatform}
              </Badge>
            )}
            <Badge variant="outline" className="text-xs">
              {subRequest.requestItems.length} sản phẩm
            </Badge>
          </div>
          <Button variant="ghost" size="sm">
            {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
          </Button>
        </div>

        {/* Contact Info - Only show when expanded */}
        {isExpanded && subRequest.contactInfo && subRequest.contactInfo.length > 0 && (
          <div className="mt-3 bg-blue-50 border border-blue-200 rounded-lg p-3">
            <div className="flex items-center gap-2 mb-2">
              <Contact className="h-4 w-4 text-blue-600" />
              <span className="font-medium text-blue-900">Thông tin liên hệ</span>
            </div>
            <div className="space-y-2">
              {subRequest.contactInfo.map((info, i) => (
                <div key={i} className="text-sm bg-white px-3 py-2 rounded border border-blue-100">
                  {info.split("\n").map((line, lineIdx) => (
                    <div key={lineIdx} className={lineIdx > 0 ? "mt-1" : ""}>
                      {line}
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>
        )}
      </CardHeader>

      <CardContent className="pt-0">
        <div className="space-y-2">{children}</div>
      </CardContent>
    </Card>
  )
}
