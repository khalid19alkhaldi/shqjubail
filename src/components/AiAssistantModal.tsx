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
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Sparkles,
  Wrench,
  ShieldAlert,
  Package,
  CheckCircle2,
  BrainCircuit,
  AlertTriangle,
  Loader2
} from "lucide-react";
import { getAiMaintenanceAdvice, type AiResponse } from "@/lib/ai-service";

interface AiAssistantModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  problemDescription: string;
  orderTitle: string;
}

export function AiAssistantModal({ isOpen, onOpenChange, problemDescription, orderTitle }: AiAssistantModalProps) {
  const [loading, setLoading] = React.useState(true);
  const [advice, setAiAdvice] = React.useState<AiResponse | null>(null);

  React.useEffect(() => {
    if (isOpen) {
      setLoading(true);
      getAiMaintenanceAdvice(problemDescription).then(res => {
        setAiAdvice(res);
        setLoading(false);
      });
    }
  }, [isOpen, problemDescription]);

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[550px] p-0 overflow-hidden rounded-3xl border-none shadow-elegant" dir="rtl">
        <div className="bg-gradient-to-r from-primary-deep to-primary p-6 text-white">
          <DialogHeader>
            <div className="flex items-center gap-3 mb-2">
              <div className="h-10 w-10 rounded-xl bg-white/20 flex items-center justify-center backdrop-blur-md">
                <BrainCircuit className="h-6 w-6 text-gold" />
              </div>
              <div>
                <DialogTitle className="text-xl font-black text-white text-right">مساعد Gemini الذكي</DialogTitle>
                <DialogDescription className="text-white/70 text-right text-xs">خبير الصيانة الرقمي لجمعية تحفيظ القرآن</DialogDescription>
              </div>
            </div>
          </DialogHeader>
        </div>

        <ScrollArea className="max-h-[70vh] p-6">
          {loading ? (
            <div className="py-20 flex flex-col items-center justify-center gap-4">
              <Loader2 className="h-10 w-10 text-primary animate-spin" />
              <div className="text-sm font-bold text-primary-deep animate-pulse">جاري تحليل العطل واستخراج الحلول...</div>
            </div>
          ) : advice ? (
            <div className="space-y-6">
              {/* Diagnosis */}
              <div className="bg-secondary/30 p-5 rounded-2xl border border-primary/10">
                <div className="flex items-center gap-2 text-primary-deep font-bold mb-2">
                  <Sparkles className="h-4 w-4 text-gold" />
                  التشخيص الأولي
                </div>
                <p className="text-sm leading-relaxed text-foreground/80">{advice.diagnosis}</p>
                <div className="mt-3">
                  <Badge className={
                    advice.urgency === "high" ? "bg-red-100 text-red-700 border-none" :
                    advice.urgency === "medium" ? "bg-amber-100 text-amber-700 border-none" : "bg-blue-100 text-blue-700 border-none"
                  }>
                    {advice.urgency === "high" ? "حالة طارئة جداً" : advice.urgency === "medium" ? "أولوية متوسطة" : "حالة عادية"}
                  </Badge>
                </div>
              </div>

              {/* Safety */}
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-red-600 font-bold text-sm px-2">
                  <ShieldAlert className="h-4 w-4" />
                  تعليمات السلامة (هام)
                </div>
                <div className="space-y-2">
                  {advice.safetyWarnings.map((warning, i) => (
                    <div key={i} className="flex gap-3 bg-red-50 p-3 rounded-xl border border-red-100">
                      <AlertTriangle className="h-4 w-4 text-red-500 shrink-0 mt-0.5" />
                      <span className="text-xs text-red-900 font-medium">{warning}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Steps */}
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-primary-deep font-bold text-sm px-2">
                  <Wrench className="h-4 w-4" />
                  خطوات الإصلاح المقترحة
                </div>
                <div className="space-y-3">
                  {advice.steps.map((step, i) => (
                    <div key={i} className="flex gap-4 group">
                      <div className="h-6 w-6 rounded-full bg-primary/10 text-primary flex items-center justify-center text-[10px] font-black shrink-0">{i+1}</div>
                      <p className="text-xs text-muted-foreground group-hover:text-foreground transition-colors">{step}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Spare Parts */}
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-primary-deep font-bold text-sm px-2">
                  <Package className="h-4 w-4" />
                  قطع الغيار المحتملة
                </div>
                <div className="flex flex-wrap gap-2">
                  {advice.partsNeeded.map((part, i) => (
                    <Badge key={i} variant="outline" className="rounded-lg border-primary/20 text-primary-deep py-1">
                      {part}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          ) : null}
        </ScrollArea>

        <div className="p-6 bg-secondary/10 border-t border-border">
          <Button className="w-full rounded-xl font-bold h-12 gap-2" onClick={() => onOpenChange(false)}>
            <CheckCircle2 className="h-5 w-5" />
            فهمت، سأبدأ في التنفيذ
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
