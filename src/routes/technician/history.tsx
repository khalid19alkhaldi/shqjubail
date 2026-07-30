import { createFileRoute, redirect } from "@tanstack/react-router";
import React from "react";
import { PortalLayout } from "@/components/PortalLayout";
import { CheckCircle2, Wrench, History, MapPin, Calendar, Search } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { getOrders } from "@/lib/data-service";

export const Route = createFileRoute("/technician/history")({
  beforeLoad: () => {
    if (typeof window !== "undefined") {
      const savedUser = localStorage.getItem("shq_user");
      const user = savedUser ? JSON.parse(savedUser) : null;
      if (!user || user.role !== "technician") {
        throw redirect({ to: "/technician/login" });
      }
    }
  },
  component: TechnicianHistory,
});

const sidebarItems = [
  { title: "مهامي اليوم", icon: Wrench, href: "/technician" },
  { title: "المهام السابقة", icon: History, href: "/technician/history" },
  { title: "تحديث الحالة", icon: CheckCircle2, href: "/technician/status" },
];

function TechnicianHistory() {
  const [orders, setOrders] = React.useState<any[]>([]);
  const [query, setQuery] = React.useState("");

  React.useEffect(() => {
    (async () => setOrders(await getOrders()))();
  }, []);

  const completed = orders.filter(
    (o: any) =>
      o.status === "مكتمل" &&
      (o.title || "").toLowerCase().includes(query.toLowerCase())
  );

  return (
    <PortalLayout title="المهام السابقة" items={sidebarItems}>
      <div className="space-y-5 w-full max-w-3xl mx-auto">
        <div className="bg-primary-deep text-white p-5 sm:p-6 rounded-[1.75rem] shadow-elegant">
          <div className="text-xs opacity-70 mb-1">سجل الأعمال المنجزة</div>
          <h2 className="text-lg sm:text-xl font-black">{completed.length} مهمة مكتملة</h2>
        </div>

        <div className="relative">
          <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="ابحث في المهام السابقة..."
            className="pr-10 h-12 rounded-2xl bg-white"
          />
        </div>

        <div className="space-y-4 pb-10">
          {completed.map((task: any) => (
            <Card key={task.id} className="border-none shadow-card-soft rounded-[1.5rem]">
              <CardContent className="p-4 sm:p-5">
                <div className="flex flex-wrap items-start justify-between gap-2 mb-3">
                  <Badge className="bg-green-50 text-green-600 border-none">مكتمل</Badge>
                  <span className="text-[10px] font-bold text-muted-foreground bg-secondary px-2 py-0.5 rounded-full">
                    {task.id}
                  </span>
                </div>
                <h4 className="font-black text-base sm:text-lg mb-2 text-primary-deep break-words">
                  {task.title}
                </h4>
                <div className="space-y-1.5 text-sm text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-primary shrink-0" />
                    <span className="break-words">{task.building || task.location || "—"}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-primary shrink-0" />
                    {(task.created_at || task.date || "").toString().slice(0, 10) || "—"}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}

          {completed.length === 0 && (
            <div className="text-center text-sm text-muted-foreground py-16">
              لا توجد مهام سابقة حتى الآن.
            </div>
          )}
        </div>
      </div>
    </PortalLayout>
  );
}