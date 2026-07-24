import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { Calculator, Send } from "lucide-react";

interface ContractorQuoteModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  orderId: string;
  orderTitle: string;
}

export function ContractorQuoteModal({ isOpen, onOpenChange, orderId, orderTitle }: ContractorQuoteModalProps) {
  const [loading, setLoading] = React.useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    setTimeout(() => {
      setLoading(false);
      onOpenChange(false);
      toast.success("تم إرسال العرض المالي بنجاح", {
        description: `سيتم مراجعة العرض من قبل إدارة الجمعية للطلب ${orderId}`,
      });
    }, 1500);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[450px]" dir="rtl">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold flex items-center gap-2 text-primary-deep">
            <Calculator className="h-6 w-6 text-primary" />
            تقديم عرض مالي للاصلاح
          </DialogTitle>
          <DialogDescription className="text-right">
            أدخل التكلفة التقديرية ووقت التنفيذ المتوقع للطلب: <span className="font-bold">{orderTitle}</span>
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6 py-4 text-right">
          <div className="grid gap-4">
            <div className="space-y-2">
              <Label htmlFor="amount" className="text-sm font-bold">المبلغ المطلوب (ر.س)</Label>
              <Input id="amount" type="number" placeholder="مثال: 1500" required className="rounded-xl" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="duration" className="text-sm font-bold">وقت التنفيذ المتوقع</Label>
              <Input id="duration" placeholder="مثال: يومين عمل" required className="rounded-xl" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="notes" className="text-sm font-bold">ملاحظات العرض / قطع الغيار</Label>
              <Textarea
                id="notes"
                placeholder="اذكر تفاصيل التكلفة أو أي قطع غيار مطلوبة..."
                className="rounded-xl min-h-[100px]"
              />
            </div>
          </div>

          <DialogFooter className="gap-3 sm:gap-0">
            <Button
              type="submit"
              className="bg-primary hover:bg-primary-deep w-full sm:w-auto font-bold rounded-xl h-11 px-8 gap-2"
              disabled={loading}
            >
              <Send className="h-4 w-4" />
              {loading ? "جاري الإرسال..." : "إرسال العرض للموظف"}
            </Button>
            <Button
              type="button"
              variant="outline"
              className="rounded-xl h-11"
              onClick={() => onOpenChange(false)}
            >
              إلغاء
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
