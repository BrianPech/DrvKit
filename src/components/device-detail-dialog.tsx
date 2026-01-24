import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { LucideIcon } from "lucide-react";

interface DetailItem {
  label: string;
  value: string | number;
  highlight?: boolean;
}

interface DeviceDetailDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description?: string;
  icon?: LucideIcon;
  details: DetailItem[];
}

export function DeviceDetailDialog({
  open,
  onOpenChange,
  title,
  description,
  icon: Icon,
  details,
}: DeviceDetailDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px] dark:bg-card border-muted">
        <DialogHeader>
          <div className="flex items-center gap-3">
            {Icon && (
              <div className="rounded-md bg-primary/10 p-2 text-primary">
                <Icon className="h-5 w-5" />
              </div>
            )}
            <div>
              <DialogTitle>{title}</DialogTitle>
              {description && (
                <DialogDescription className="mt-1">
                  {description}
                </DialogDescription>
              )}
            </div>
          </div>
        </DialogHeader>
        <Separator className="my-2" />
        <div className="grid gap-4 py-2">
          {details.map((item, index) => (
            <div
              key={index}
              className="flex justify-between items-center text-sm"
            >
              <span className="text-muted-foreground">{item.label}</span>
              <span
                className={`font-medium font-mono ${item.highlight ? "text-primary" : ""}`}
              >
                {item.value}
              </span>
            </div>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
}
