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
import { ClipboardCheck, Send } from "lucide-react";
import { updateOrderStatus } from "@/lib/data-service";

interface ContractorPlanModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  orderId: string;
  orderTitle: string;
}

export function ContractorPlanModal({ isOpen, onOpenChange, orderId, orderTitle }: ContractorPlanModalProps) {
  const [loading, setLoading] = React.useState(false);
  const [duration, setDuration] = React.useState("");
  const [crew, setCrew] = React.useState("");
  const [parts, setParts] = React.useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    setTimeout(() => {
      updateOrderStatus(orderId, "تم تقديم خطة تنفيذ", {
        plan: `${duration} — ${crew} فني`,
        parts,
      });
      setLoading(false);
      onOpenChange(false);
      toast.success("تم إرسال خطة التنفيذ بنجاح", {
        description: `سيراجعها الموظف المسؤول عن الطلب ${orderId}`,
      });
      window.location.reload();
    }, 800);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[450px]" dir="rtl">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold flex items-center gap-2 text-primary-deep">
            <ClipboardCheck className="h-6 w-6 text-primary" />
            قبول العمل وتقديم خطة تنفيذ
          </DialogTitle>
          <DialogDescription className="text-right">
            حدّد مدة التنفيذ وفريق العمل للطلب: <span className="font-bold">{orderTitle}</span>
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6 py-4 text-right">
          <div className="grid gap-4">
            <div className="space-y-2">
              <Label htmlFor="duration" className="text-sm font-bold">مدة التنفيذ المتوقعة</Label>
              <Input
                id="duration"
                placeholder="مثال: يومان عمل"
                required
                className="rounded-xl"
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="crew" className="text-sm font-bold">عدد الفنيين</Label>
              <Input
                id="crew"
                type="number"
                min={1}
                placeholder="مثال: 2"
                required
                className="rounded-xl"
                value={crew}
                onChange={(e) => setCrew(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="parts" className="text-sm font-bold">قطع الغيار / المتطلبات</Label>
              <Textarea
                id="parts"
                placeholder="اذكر القطع أو المعدات المطلوبة وأي ترتيبات دخول للمبنى..."
                className="rounded-xl min-h-[100px]"
                value={parts}
                onChange={(e) => setParts(e.target.value)}
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
              {loading ? "جاري الإرسال..." : "إرسال الخطة للموظف"}
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
