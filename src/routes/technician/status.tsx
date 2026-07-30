import { createFileRoute, redirect } from "@tanstack/react-router";
import React from "react";
import { PortalLayout } from "@/components/PortalLayout";
import { CheckCircle2, Wrench, History, Loader2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { getOrders, updateOrderStatus } from "@/lib/data-service";
import { TECH_TASKS } from "@/lib/mock-data";

export const Route = createFileRoute("/technician/status")({
  beforeLoad: () => {
    if (typeof window !== "undefined") {
      const savedUser = localStorage.getItem("shq_user");
      const user = savedUser ? JSON.parse(savedUser) : null;
      if (!user || user.role !== "technician") {
        throw redirect({ to: "/technician/login" });
      }
    }
  },
  component: TechnicianStatus,
});

const sidebarItems = [
  { title: "مهامي اليوم", icon: Wrench, href: "/technician" },
  { title: "المهام السابقة", icon: History, href: "/technician/history" },
  { title: "تحديث الحالة", icon: CheckCircle2, href: "/technician/status" },
];

const STATUSES = ["نشط", "قيد التنفيذ", "بانتظار قطع غيار", "مكتمل"];

function TechnicianStatus() {
  const [tasks, setTasks] = React.useState<any[]>(TECH_TASKS);
  const [notes, setNotes] = React.useState<Record<string, string>>({});
  const [saving, setSaving] = React.useState<string | null>(null);

  React.useEffect(() => {
    (async () => {
      const orders = await getOrders();
      const active = orders.filter((o: any) => o.status !== "مكتمل");
      if (active.length) setTasks(active);
    })();
  }, []);

  const handleUpdate = async (task: any, status: string) => {
    setSaving(task.id);
    setTasks((prev) => prev.map((t) => (t.id === task.id ? { ...t, status } : t)));
    await updateOrderStatus(task.id, status, { notes: notes[task.id] || "" });
    setSaving(null);
    toast.success("تم تحديث الحالة", { description: `${task.title} → ${status}` });
  };

  return (
    <PortalLayout title="تحديث الحالة" items={sidebarItems}>
      <div className="space-y-5 w-full max-w-3xl mx-auto pb-10">
        <div className="bg-primary-deep text-white p-5 sm:p-6 rounded-[1.75rem] shadow-elegant">
          <div className="text-xs opacity-70 mb-1">تحديث ميداني فوري</div>
          <h2 className="text-lg sm:text-xl font-black">{tasks.length} مهمة قيد المتابعة</h2>
        </div>

        {tasks.map((task) => (
          <Card key={task.id} className="border-none shadow-card-soft rounded-[1.5rem]">
            <CardContent className="p-4 sm:p-5 space-y-4">
              <div className="flex flex-wrap items-start justify-between gap-2">
                <h4 className="font-black text-base sm:text-lg text-primary-deep break-words">
                  {task.title}
                </h4>
                <Badge className="bg-primary/10 text-primary border-none">{task.status}</Badge>
              </div>

              <p className="text-xs text-muted-foreground break-words">
                {task.building || task.location || "—"}
              </p>

              <Textarea
                value={notes[task.id] || ""}
                onChange={(e) => setNotes((p) => ({ ...p, [task.id]: e.target.value }))}
                placeholder="ملاحظات الفني (اختياري)"
                className="rounded-2xl bg-white min-h-[80px] text-sm"
              />

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {STATUSES.map((s) => (
                  <Button
                    key={s}
                    variant={task.status === s ? "default" : "outline"}
                    disabled={saving === task.id}
                    className="rounded-xl h-11 text-xs font-bold"
                    onClick={() => handleUpdate(task, s)}
                  >
                    {saving === task.id ? <Loader2 className="h-4 w-4 animate-spin" /> : s}
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}

        {tasks.length === 0 && (
          <div className="text-center text-sm text-muted-foreground py-16">
            لا توجد مهام نشطة حالياً.
          </div>
        )}
      </div>
    </PortalLayout>
  );
}