import React, {  } from 'react'
import { Button } from '@/components/ui/button'
import { PopoverContent } from '@/components/ui/popover'
import { Check } from 'lucide-react'
import { ChevronsUpDown } from "lucide-react"
import { cn } from "@/lib/utils"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import {
  Popover,
  PopoverTrigger,
} from "@/components/ui/popover"

export function LocationCombobox({
  label,
  placeholder,
  options,
  value,
  onChange,
  disabled,
}) {
  const [open, setOpen] = React.useState(false)

  return (
    <div>
      <label className="block mb-1 font-medium">{label}</label>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="w-full justify-between"
            disabled={disabled}
          >
            {value
              ? options.find((item) => item.id === value?.id)?.full_name
              : placeholder}
            <ChevronsUpDown className="h-4 w-4 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-full p-0">
          <Command>
            <CommandInput placeholder={`Tìm ${label?.toLowerCase()}...`} className="h-9" />
            <CommandList>
              <CommandEmpty>Không tìm thấy.</CommandEmpty>
              <CommandGroup>
                {options.map((item) => (
                  <CommandItem
                    key={item.id}
                    value={item.full_name}
                    onSelect={() => {
                      onChange(item)
                      setOpen(false)
                    }}
                  >
                    {item.full_name}
                    <Check
                      className={cn(
                        "ml-auto",
                        value?.id === item.id ? "opacity-100" : "opacity-0"
                      )}
                    />
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  )
}
