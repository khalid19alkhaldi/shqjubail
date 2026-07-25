import React, { useRef } from "react";
import SignatureCanvas from "react-signature-canvas";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { CheckCircle2, Eraser } from "lucide-react";

interface SignatureModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
  title: string;
}

export function SignatureModal({ isOpen, onOpenChange, onConfirm, title }: SignatureModalProps) {
  const sigCanvas = useRef<SignatureCanvas>(null);

  const clear = () => {
    sigCanvas.current?.clear();
  };

  const handleConfirm = () => {
    if (sigCanvas.current?.isEmpty()) {
      toast.error("يرجى إدخال التوقيع أولاً");
      return;
    }

    // In a real app, you would save the signature dataURL
    // const signatureData = sigCanvas.current?.getTrimmedCanvas().toDataURL('image/png');

    onConfirm();
    onOpenChange(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[450px]" dir="rtl">
        <DialogHeader>
          <DialogTitle className="text-right font-bold text-primary-deep flex items-center gap-2">
            <CheckCircle2 className="h-5 w-5 text-primary" />
            تأكيد الإنجاز والتوقيع
          </DialogTitle>
          <DialogDescription className="text-right">
            يرجى توقيع مسؤول الموقع في المربع أدناه لإتمام: <span className="font-bold">{title}</span>
          </DialogDescription>
        </DialogHeader>

        <div className="py-6 flex flex-col items-center gap-4">
          <div className="border-2 border-border rounded-2xl overflow-hidden bg-secondary/10 w-full h-64">
            <SignatureCanvas
              ref={sigCanvas}
              penColor="#15362b"
              canvasProps={{
                className: "w-full h-full cursor-crosshair",
                style: { width: '100%', height: '100%' }
              }}
            />
          </div>
          <Button
            variant="ghost"
            size="sm"
            className="text-muted-foreground flex items-center gap-2 hover:text-red-600 transition-colors"
            onClick={clear}
          >
            <Eraser className="h-4 w-4" />
            مسح التوقيع
          </Button>
        </div>

        <DialogFooter className="gap-2 sm:gap-0">
          <Button
            className="flex-1 rounded-xl font-bold bg-primary hover:bg-primary-deep h-12"
            onClick={handleConfirm}
          >
            اعتماد الإنجاز نهائياً
          </Button>
          <Button
            variant="outline"
            className="rounded-xl h-12"
            onClick={() => onOpenChange(false)}
          >
            إلغاء
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
