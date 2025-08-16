
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { ExternalLink } from "lucide-react";
import amazon from "@/assets/amazon.jpg"
import asos from "@/assets/asos.png"
import ebay from "@/assets/ebay.png"
import gmarket from "@/assets/gmarket.png"

// Selectable Product Card Component (only when in selection mode)
export default function NonSubItems({
  item,
  subRequestId,
  onProductClick,
  isGroupingMode,
  isSelected,
  onSelectionChange,
  platform,
}) {
  const handleCardClick = () => {
    if (isGroupingMode) {
      onSelectionChange(item.id, !isSelected);
    } else {
      onProductClick(item.id);
    }
  };
  const platformIcon = (platform) => {
    switch (platform) {
      case "AMAZON":
        return amazon;
      case "ASOS":
        return asos;
      case "EBAY":
        return ebay;
      case "GMARKET":
        return gmarket;
      default:
        return amazon;
    }
  };

  return (
    <Card
      isItemCard
      className={`transition-all hover:shadow-md cursor-pointer ${isGroupingMode && isSelected ? "ring-2 ring-blue-500 bg-blue-50" : ""
        } ${isGroupingMode ? "border-2 border-dashed border-blue-300" : ""}`}
      onClick={handleCardClick}
    >
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3 min-w-0 flex-1">
            {platform !== "Unknown" && <img src={platformIcon(platform)} alt={platform} className="w-16 h-6" />}
            {isGroupingMode && (
              <Checkbox
                checked={isSelected}
                onCheckedChange={(checked) =>
                  onSelectionChange(item.id, checked)
                }
                onClick={(e) => e.stopPropagation()}
                className="shrink-0"
              />
            )}
            <span className="font-semibold text-base truncate">
              {item.productName}
            </span>
          </div>
          <div className="flex items-center gap-3">
            <span
              className={`font-bold text-lg ${subRequestId ? "text-orange-600" : "text-blue-600"
                }`}
            >
              ×{item.quantity}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
  