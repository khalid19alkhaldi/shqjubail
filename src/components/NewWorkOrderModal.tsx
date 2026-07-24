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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { ClipboardList, Building2, AlertCircle, Wrench, UserCheck } from "lucide-react";

interface NewWorkOrderModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

export function NewWorkOrderModal({ isOpen, onOpenChange }: NewWorkOrderModalProps) {
  const [loading, setLoading] = React.useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // Simulate API call
    setTimeout(() => {
      setLoading(false);
      onOpenChange(false);
      toast.success("تم إنشاء أمر العمل WO-5600 وإسناده بنجاح", {
        description: "تم إرسال التنبيه للمقاول المختار للمتابعة.",
      });
    }, 1500);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[550px]" dir="rtl">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold flex items-center gap-2 text-primary-deep">
            <ClipboardList className="h-6 w-6 text-primary" />
            إنشاء أمر عمل جديد
          </DialogTitle>
          <DialogDescription className="text-right">
            قم بتعبئة تفاصيل البلاغ وإسناده للجهة المسؤولة.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6 py-4 text-right">
          <div className="grid gap-4">
            {/* Title */}
            <div className="space-y-2">
              <Label htmlFor="title" className="text-sm font-bold">عنوان الطلب</Label>
              <Input id="title" placeholder="مثلاً: صيانة مكيفات الطابق الثاني" required className="rounded-xl" />
            </div>

            <div className="grid grid-cols-2 gap-4">
              {/* Building */}
              <div className="space-y-2 text-right">
                <Label className="text-sm font-bold flex items-center gap-1 justify-end">
                  <Building2 className="h-3 w-3" /> المبنى
                </Label>
                <Select required>
                  <SelectTrigger className="rounded-xl">
                    <SelectValue placeholder="اختر المبنى" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="furqan">مدرسة الفرقان</SelectItem>
                    <SelectItem value="farooq">مسجد الفاروق</SelectItem>
                    <SelectItem value="admin">المبنى الإداري</SelectItem>
                    <SelectItem value="awqaf">مبنى الأوقاف</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Category */}
              <div className="space-y-2 text-right">
                <Label className="text-sm font-bold flex items-center gap-1 justify-end">
                  <Wrench className="h-3 w-3" /> القسم
                </Label>
                <Select required>
                  <SelectTrigger className="rounded-xl">
                    <SelectValue placeholder="اختر القسم" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ac">تكييف</SelectItem>
                    <SelectItem value="elec">كهرباء</SelectItem>
                    <SelectItem value="plumb">سباكة</SelectItem>
                    <SelectItem value="safety">أمن وسلامة</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              {/* Priority */}
              <div className="space-y-2 text-right">
                <Label className="text-sm font-bold flex items-center gap-1 justify-end">
                  <AlertCircle className="h-3 w-3" /> الأولوية
                </Label>
                <Select required>
                  <SelectTrigger className="rounded-xl">
                    <SelectValue placeholder="تحديد الأولوية" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="high">عالية (عاجل)</SelectItem>
                    <SelectItem value="medium">متوسطة</SelectItem>
                    <SelectItem value="low">منخفضة</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Contractor Assignment */}
              <div className="space-y-2 text-right">
                <Label className="text-sm font-bold flex items-center gap-1 justify-end">
                  <UserCheck className="h-3 w-3" /> إسناد لمقاول
                </Label>
                <Select>
                  <SelectTrigger className="rounded-xl border-primary/30 bg-primary/5">
                    <SelectValue placeholder="اختياري: اختر مقاول" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="sharq">مؤسسة صيانة الشرق</SelectItem>
                    <SelectItem value="jubail">مؤسسة الجبيل للمقاولات</SelectItem>
                    <SelectItem value="internal">فني داخلي (الجمعية)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Description */}
            <div className="space-y-2">
              <Label htmlFor="desc" className="text-sm font-bold">وصف المشكلة بالتفصيل</Label>
              <Textarea
                id="desc"
                placeholder="يرجى كتابة تفاصيل المشكلة وأي ملاحظات إضافية..."
                className="rounded-xl min-h-[100px]"
                required
              />
            </div>
          </div>

          <DialogFooter className="gap-3 sm:gap-0">
            <Button
              type="submit"
              className="bg-primary hover:bg-primary-deep w-full sm:w-auto font-bold rounded-xl h-11 px-8"
              disabled={loading}
            >
              {loading ? "جاري الإرسال..." : "إرسال الطلب وإسناده"}
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
