import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { User, MapPin, Phone, Mail } from "lucide-react"

export function CustomerInfoCard({ customer, shippingAddress, formatCurrency }) {
  return (
    <Card className="col-span-1">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <User className="h-5 w-5" />
          Thông tin khách hàng
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center gap-3">
          <Avatar className="h-12 w-12">
            <AvatarImage src={customer.avatar || "/placeholder.svg"} alt={customer.name} />
            <AvatarFallback>{customer.name.charAt(0)}</AvatarFallback>
          </Avatar>
          <div>
            <div className="font-semibold">{customer.name}</div>
          </div>
        </div>
        <Separator />
        <div className="space-y-3 text-sm">
          <div className="flex items-center gap-2">
            <Mail className="h-4 w-4 text-muted-foreground" />
            <span>{customer.email}</span>
          </div>
          <div className="flex items-center gap-2">
            <Phone className="h-4 w-4 text-muted-foreground" />
            <span>{customer.phone}</span>
          </div>
          <div className="flex items-start gap-2">
            <MapPin className="flex-shrink-0 h-4 w-4 text-muted-foreground mt-0.5" />
            <div>
              <div className="font-medium">{shippingAddress.name}</div>
              <div className="text-muted-foreground">{shippingAddress.location}</div>
              <div className="text-muted-foreground">{shippingAddress.phoneNumber}</div>
              <Badge variant="secondary" className="mt-1 text-xs">
                {shippingAddress.tag}
              </Badge>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
