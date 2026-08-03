import { createFileRoute, redirect } from "@tanstack/react-router";
import { PortalLayout } from "@/components/PortalLayout";
import { employeeSidebarItems } from "@/lib/employee-nav";
import { LayoutDashboard, ClipboardList, Wrench, Building2, BarChart3, Calendar, Clock, CheckCircle2, Plus, Map as MapIcon } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { getPreventiveTasks, approvePreventiveTask, savePreventiveTask } from "@/lib/data-service";
import React from "react";
import { toast } from "sonner";

export const Route = createFileRoute("/employee/preventive")({
  beforeLoad: () => {
    if (typeof window !== "undefined") {
      const savedUser = localStorage.getItem("shq_user");
      const user = savedUser ? JSON.parse(savedUser) : null;
      if (!user || user.role !== "employee") {
        throw redirect({ to: "/employee/login" });
      }
    }
  },
  component: EmployeePreventive,
});

const sidebarItems = employeeSidebarItems;

function EmployeePreventive() {
  const [tasks, setTasks] = React.useState<any[]>([]);
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [loading, setLoading] = React.useState(false);

  const refreshTasks = async () => {
    const data = await getPreventiveTasks();
    setTasks(data);
  };

  React.useEffect(() => {
    refreshTasks();
  }, []);

  const handleApprove = async (taskId: string) => {
    await approvePreventiveTask(taskId);
    toast.success("تم تعميد المهمة وتحديث التاريخ القادم بنجاح");
    refreshTasks();
  };

  const handleCreateTask = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const newTask = {
      id: `P-${Math.floor(Math.random() * 1000)}`,
      title: "صيانة مجدولة جديدة",
      frequency: "كل 6 أشهر",
      nextDate: "2026-10-01",
      status: "مجدول"
    };

    try {
      await savePreventiveTask(newTask);
      setLoading(false);
      setIsModalOpen(false);
      toast.success("تمت إضافة مهمة الصيانة الوقائية بنجاح");
      refreshTasks();
    } catch (error) {
      setLoading(false);
      toast.error("خطأ في حفظ المهمة");
    }
  };

  return (
    <PortalLayout title="الصيانة الوقائية" items={sidebarItems}>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-primary-deep">جدول الصيانة الدورية</h2>
          <Button className="rounded-xl gap-2" onClick={() => setIsModalOpen(true)}>
            <Plus className="h-4 w-4" />
            جدولة مهمة جديدة
          </Button>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {tasks.map((task) => (
            <Card key={task.id} className="border-none shadow-card-soft hover:shadow-elegant transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-lg font-bold">{task.title}</CardTitle>
                <Wrench className="h-5 w-5 text-primary/40" />
              </CardHeader>
              <CardContent>
                <div className="space-y-4 mt-2">
                  <div className="flex items-center gap-3 text-sm">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <span className="text-muted-foreground">التكرار:</span>
                    <span className="font-semibold">{task.frequency}</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span className="text-muted-foreground">التاريخ القادم:</span>
                    <span className={`font-bold ${task.status === "عاجل" ? "text-red-600" : "text-primary-deep"}`}>
                      {task.nextDate}
                    </span>
                  </div>
                  <div className="pt-4 flex items-center justify-between border-t border-dashed">
                    <span className={`px-2 py-1 rounded-lg text-xs font-bold ${
                      task.status === "عاجل" ? "bg-red-100 text-red-700" :
                      task.status === "تم التعميد" ? "bg-blue-100 text-blue-700" : "bg-green-100 text-green-700"
                    }`}>
                      {task.status}
                    </span>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-primary gap-1 font-bold"
                      onClick={() => handleApprove(task.id)}
                    >
                      <CheckCircle2 className="h-4 w-4" />
                      تعميد الآن
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Create Task Modal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="sm:max-w-[450px]" dir="rtl">
          <DialogHeader>
            <DialogTitle className="text-right font-bold text-primary-deep">جدولة مهمة جديدة</DialogTitle>
            <DialogDescription className="text-right">أدخل تفاصيل الصيانة الوقائية المتكررة.</DialogDescription>
          </DialogHeader>
          <form onSubmit={handleCreateTask} className="space-y-5 py-4 text-right">
            <div className="space-y-2">
              <Label className="font-bold">اسم المهمة</Label>
              <Input placeholder="مثلاً: صيانة أنظمة الحريق" required className="rounded-xl" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="font-bold">التكرار</Label>
                <Select defaultValue="3">
                  <SelectTrigger className="rounded-xl">
                    <SelectValue placeholder="اختر المدة" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">شهري</SelectItem>
                    <SelectItem value="3">كل 3 أشهر</SelectItem>
                    <SelectItem value="6">كل 6 أشهر</SelectItem>
                    <SelectItem value="12">سنوي</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label className="font-bold">تاريخ البدء</Label>
                <Input type="date" required className="rounded-xl text-right" />
              </div>
            </div>
            <DialogFooter>
              <Button type="submit" className="w-full rounded-xl font-bold" disabled={loading}>
                {loading ? "جاري الحفظ..." : "حفظ المهمة المجدولة"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </PortalLayout>
  );
}
