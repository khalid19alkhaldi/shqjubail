import { LayoutDashboard, ClipboardList, Wrench, Building2, BarChart3, Map as MapIcon, Boxes, HardHat, Wallet } from "lucide-react";

export const employeeSidebarItems = [
  { title: "لوحة التحكم", icon: LayoutDashboard, href: "/employee" },
  { title: "أوامر العمل", icon: ClipboardList, href: "/employee/orders" },
  { title: "خريطة المرافق", icon: MapIcon, href: "/employee/map" },
  { title: "الصيانة الوقائية", icon: Wrench, href: "/employee/preventive" },
  { title: "إدارة المباني", icon: Building2, href: "/employee/buildings" },
  { title: "مستودع قطع الغيار", icon: Boxes, href: "/employee/inventory" },
  { title: "المقاولون والتقييم", icon: HardHat, href: "/employee/vendors" },
  { title: "الميزانية والتكاليف", icon: Wallet, href: "/employee/costs" },
  { title: "التقارير", icon: BarChart3, href: "/employee/reports" },
];
