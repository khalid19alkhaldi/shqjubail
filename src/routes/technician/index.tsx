import { createFileRoute, redirect } from "@tanstack/react-router";
import React from "react";
import { PortalLayout } from "@/components/PortalLayout";
import {
  LayoutDashboard,
  MapPin,
  Clock,
  CheckCircle2,
  Wrench,
  AlertCircle,
  Play,
  Camera,
  History,
  User
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { TECH_TASKS } from "@/lib/mock-data";
import { SignatureModal } from "@/components/SignatureModal";
import { AiAssistantModal } from "@/components/AiAssistantModal";
import { BrainCircuit } from "lucide-react";
import { getOrders, updateOrderStatus } from "@/lib/data-service";

export const Route = createFileRoute("/technician/")({
  beforeLoad: () => {
    if (typeof window !== "undefined") {
      const savedUser = localStorage.getItem("shq_user");
      const user = savedUser ? JSON.parse(savedUser) : null;
      if (!user || user.role !== "technician") {
        throw redirect({ to: "/technician/login" });
      }
    }
  },
  component: TechnicianDashboard,
});

const sidebarItems = [
  { title: "مهامي اليوم", icon: Wrench, href: "/technician" },
  { title: "المهام السابقة", icon: History, href: "/technician/history" },
  { title: "تحديث الحالة", icon: CheckCircle2, href: "/technician/status" },
];

function TechnicianDashboard() {
  const [selectedTask, setSelectedTask] = React.useState<any>(null);
  const [aiTask, setAiTask] = React.useState<any>(null);
  const [isSignatureModalOpen, setIsSignatureModalOpen] = React.useState(false);
  const [isAiModalOpen, setIsAiModalOpen] = React.useState(false);

  const handleAction = (taskTitle: string, action: string) => {
    toast.success(`${action}: ${taskTitle}`, {
      description: "سيتم تحديث إدارة الصيانة فوراً.",
    });
  };

  const handleAiAssistant = (task: any) => {
    setAiTask(task);
    setIsAiModalOpen(true);
  };

  const handleComplete = (task: any) => {
    setSelectedTask(task);
    setIsSignatureModalOpen(true);
  };

  const onSignatureConfirm = (signature: string) => {
    if (selectedTask) {
      // Simulate task completion in data service
      const orders = getOrders();
      const order = orders.find((o: any) => o.id === selectedTask.id || o.title === selectedTask.title);
      if (order) {
        updateOrderStatus(order.id, "مكتمل", { signature });
      }

      toast.success(`تم إكمال المهمة: ${selectedTask.title}`, {
        description: "تم توثيق التوقيع الرقمي بنجاح.",
      });
    }
  };

  return (
    <PortalLayout title="بوابة الفني الميداني" items={sidebarItems}>
      <div className="space-y-6 max-w-lg mx-auto">
        {/* User Welcome Mobile */}
        <div className="flex items-center justify-between bg-primary-deep text-white p-6 rounded-[2rem] shadow-elegant">
          <div>
            <div className="text-xs opacity-70 mb-1">مرحباً بك مجدداً</div>
            <h2 className="text-xl font-black">سالم العتيبي</h2>
            <div className="text-[10px] bg-gold/20 text-gold px-2 py-0.5 rounded-full inline-block mt-2 font-bold">فني كهرباء وسباكة</div>
          </div>
          <div className="h-16 w-16 rounded-full bg-white/10 flex items-center justify-center border-2 border-white/20">
            <User className="h-8 w-8 text-gold" />
          </div>
        </div>

        {/* Action Quick Stats */}
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-white p-4 rounded-3xl border border-border shadow-sm flex items-center gap-3">
            <div className="h-10 w-10 rounded-2xl bg-amber-50 flex items-center justify-center text-amber-600">
              <AlertCircle className="h-5 w-5" />
            </div>
            <div>
              <div className="text-xl font-black">3</div>
              <div className="text-[10px] text-muted-foreground">مهام معلقة</div>
            </div>
          </div>
          <div className="bg-white p-4 rounded-3xl border border-border shadow-sm flex items-center gap-3">
            <div className="h-10 w-10 rounded-2xl bg-green-50 flex items-center justify-center text-green-600">
              <CheckCircle2 className="h-5 w-5" />
            </div>
            <div>
              <div className="text-xl font-black">12</div>
              <div className="text-[10px] text-muted-foreground">مكتمل الأسبوع</div>
            </div>
          </div>
        </div>

        {/* Tasks List */}
        <div className="space-y-4 pb-20">
          <h3 className="font-bold text-primary-deep flex items-center gap-2 px-2">
            <Wrench className="h-4 w-4 text-primary" />
            جدول مهامي اليوم
          </h3>

          {TECH_TASKS.map((task) => (
            <Card key={task.id} className="border-none shadow-card-soft overflow-hidden rounded-[1.5rem]">
              <CardContent className="p-0">
                <div className="p-5">
                  <div className="flex justify-between items-start mb-3">
                    <Badge className={task.priority === "عالية" ? "bg-red-50 text-red-600 border-none" : "bg-blue-50 text-blue-600 border-none"}>
                      {task.priority}
                    </Badge>
                    <span className="text-[10px] font-bold text-muted-foreground bg-secondary px-2 py-0.5 rounded-full">{task.id}</span>
                  </div>

                  <h4 className="font-black text-lg mb-2 text-primary-deep">{task.title}</h4>

                  <div className="space-y-2 mb-6">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <MapPin className="h-4 w-4 text-primary" />
                      {task.location}
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Clock className="h-4 w-4 text-primary" />
                      الموعد: {task.time}
                    </div>
                  </div>

                  <div className="flex gap-2 pt-4 border-t border-dashed border-border/60">
                    <Button
                      className="flex-1 bg-primary hover:bg-primary-deep rounded-xl font-bold h-12 gap-2"
                      onClick={() => handleComplete(task)}
                    >
                      <CheckCircle2 className="h-4 w-4" />
                      تم الإنجاز
                    </Button>
                    <Button
                      variant="outline"
                      className="rounded-xl h-12 w-12 p-0 border-primary/20 bg-primary/5 hover:bg-primary/10"
                      onClick={() => handleAiAssistant(task)}
                      title="مساعد الذكاء الاصطناعي"
                    >
                      <BrainCircuit className="h-5 w-5 text-primary" />
                    </Button>
                    <Button
                      variant="outline"
                      className="rounded-xl h-12 w-12 p-0 border-primary/20"
                      onClick={() => handleAction(task.title, "طلب فتح كاميرا الجوال")}
                    >
                      <Camera className="h-5 w-5 text-primary" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {selectedTask && (
        <SignatureModal
          isOpen={isSignatureModalOpen}
          onOpenChange={setIsSignatureModalOpen}
          onConfirm={onSignatureConfirm}
          title={selectedTask.title}
        />
      )}

      {aiTask && (
        <AiAssistantModal
          isOpen={isAiModalOpen}
          onOpenChange={setIsAiModalOpen}
          problemDescription={aiTask.title}
          orderTitle={aiTask.title}
        />
      )}
    </PortalLayout>
  );
}
