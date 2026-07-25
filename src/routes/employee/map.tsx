import { createFileRoute, redirect } from "@tanstack/react-router";
import { PortalLayout } from "@/components/PortalLayout";
import { LayoutDashboard, ClipboardList, Wrench, Building2, BarChart3, Map as MapIcon, MapPin, AlertCircle, CheckCircle2 } from "lucide-react";
import { Map, Marker, Overlay } from "pigeon-maps";
import React from "react";
import { getBuildings } from "@/lib/data-service";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export const Route = createFileRoute("/employee/map")({
  beforeLoad: () => {
    if (typeof window !== "undefined") {
      const savedUser = localStorage.getItem("shq_user");
      const user = savedUser ? JSON.parse(savedUser) : null;
      if (!user || user.role !== "employee") {
        throw redirect({ to: "/employee/login" });
      }
    }
  },
  component: EmployeeMap,
});

const sidebarItems = [
  { title: "لوحة التحكم", icon: LayoutDashboard, href: "/employee" },
  { title: "أوامر العمل", icon: ClipboardList, href: "/employee/orders" },
  { title: "خريطة المرافق", icon: MapIcon, href: "/employee/map" },
  { title: "الصيانة الوقائية", icon: Wrench, href: "/employee/preventive" },
  { title: "إدارة المباني", icon: Building2, href: "/employee/buildings" },
  { title: "التقارير", icon: BarChart3, href: "/employee/reports" },
];

function EmployeeMap() {
  const [buildings, setBuildings] = React.useState<any[]>([]);
  const [selectedBuilding, setSelectedBuilding] = React.useState<any>(null);

  React.useEffect(() => {
    setBuildings(getBuildings());
  }, []);

  return (
    <PortalLayout title="خريطة المرافق التفاعلية" items={sidebarItems}>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-primary-deep flex items-center gap-2">
            <MapIcon className="h-6 w-6 text-primary" />
            التوزيع الجغرافي لمباني الجمعية بالجبيل
          </h2>
          <div className="flex gap-4">
             <div className="flex items-center gap-2 text-xs font-bold text-muted-foreground">
                <span className="h-3 w-3 rounded-full bg-green-500" /> سليم
             </div>
             <div className="flex items-center gap-2 text-xs font-bold text-muted-foreground">
                <span className="h-3 w-3 rounded-full bg-red-500" /> بلاغ عاجل
             </div>
          </div>
        </div>

        <div className="relative h-[650px] w-full rounded-3xl overflow-hidden border-4 border-white shadow-elegant">
          <Map
            height={650}
            defaultCenter={[27.0112, 49.6583]}
            defaultZoom={13}
            metaWheelZoom={true}
          >
            {buildings.map((b) => (
              <Marker
                key={b.id}
                width={40}
                anchor={[b.lat, b.lng]}
                color={b.activeOrders > 0 ? "#ef4444" : "#22c55e"}
                onClick={() => setSelectedBuilding(b)}
              />
            ))}

            {selectedBuilding && (
              <Overlay anchor={[selectedBuilding.lat, selectedBuilding.lng]} offset={[0, 160]}>
                <Card className="w-64 border-none shadow-elegant animate-in zoom-in-95 duration-200">
                  <CardContent className="p-0 overflow-hidden rounded-xl">
                    <img src={selectedBuilding.image} alt="" className="h-24 w-full object-cover" />
                    <div className="p-4 text-right">
                      <h4 className="font-bold text-sm mb-1">{selectedBuilding.name}</h4>
                      <p className="text-[10px] text-muted-foreground mb-3">{selectedBuilding.type}</p>

                      <div className="flex items-center justify-between">
                        <Badge className={selectedBuilding.activeOrders > 0 ? "bg-red-100 text-red-600 border-none" : "bg-green-100 text-green-600 border-none"}>
                          {selectedBuilding.activeOrders > 0 ? `${selectedBuilding.activeOrders} بلاغات` : "سليم"}
                        </Badge>
                        <Button variant="ghost" size="sm" className="h-7 text-[10px] font-bold text-primary" onClick={() => setSelectedBuilding(null)}>إغلاق</Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Overlay>
            )}
          </Map>
        </div>

        {/* Legend / Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
           <Card className="border-none shadow-card-soft">
              <CardContent className="p-5 flex items-center gap-4">
                 <div className="h-12 w-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
                    <MapPin className="h-6 w-6" />
                 </div>
                 <div>
                    <div className="text-xs text-muted-foreground">إجمالي المرافق</div>
                    <div className="text-xl font-black">{buildings.length} مبنى ومنشأة</div>
                 </div>
              </CardContent>
           </Card>
           <Card className="border-none shadow-card-soft">
              <CardContent className="p-5 flex items-center gap-4">
                 <div className="h-12 w-12 rounded-2xl bg-red-50 flex items-center justify-center text-red-600">
                    <AlertCircle className="h-6 w-6" />
                 </div>
                 <div>
                    <div className="text-xs text-muted-foreground">تحتاج لتدخل فوري</div>
                    <div className="text-xl font-black">{buildings.filter(b => b.activeOrders > 1).length} مواقع حيوية</div>
                 </div>
              </CardContent>
           </Card>
        </div>
      </div>
    </PortalLayout>
  );
}
