export const MOCK_ORDERS = [
  { id: "WO-5521", title: "صيانة مكيفات — مدرسة الفرقان", building: "مدرسة الفرقان", priority: "عالية", status: "نشط", date: "2026-07-24", category: "تكييف" },
  { id: "WO-5519", title: "إصلاح تسرب مياه — مسجد الفاروق", building: "مسجد الفاروق", priority: "متوسطة", status: "قيد التنفيذ", date: "2026-07-24", category: "سباكة" },
  { id: "WO-5518", title: "فحص مصعد — مبنى الإدارة", building: "المبنى الإداري", priority: "عالية", status: "مكتمل", date: "2026-07-23", category: "مصاعد" },
  { id: "WO-5515", title: "تغيير إضاءة القاعات — مدرسة خديجة", building: "مدرسة خديجة", priority: "منخفضة", status: "نشط", date: "2026-07-22", category: "كهرباء" },
  { id: "WO-5510", title: "صيانة نظام الحريق — مبنى الأوقاف", building: "مبنى الأوقاف", priority: "عالية", status: "متأخر", date: "2026-07-20", category: "أمن وسلامة" },
];

export const MOCK_BUILDINGS = [
  { id: "B1", name: "مدرسة الفرقان", type: "تعليمي", assets: 42, activeOrders: 3, image: "https://images.unsplash.com/photo-1519741497674-611481863552?w=800&auto=format&fit=crop" },
  { id: "B2", name: "مسجد الفاروق", type: "ديني", assets: 15, activeOrders: 1, image: "https://images.unsplash.com/photo-1584551246679-0daf3d275d0f?w=800&auto=format&fit=crop" },
  { id: "B3", name: "المبنى الإداري", type: "إداري", assets: 28, activeOrders: 0, image: "https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&auto=format&fit=crop" },
  { id: "B4", name: "مبنى الأوقاف", type: "استثماري", assets: 60, activeOrders: 2, image: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800&auto=format&fit=crop" },
];

export const PREVENTIVE_TASKS = [
  { id: "P1", title: "صيانة تكييف دورية", frequency: "كل 3 أشهر", nextDate: "2026-08-01", status: "قادم" },
  { id: "P2", title: "تفتيش المصاعد", frequency: "شهري", nextDate: "2026-07-28", status: "عاجل" },
  { id: "P3", title: "تنظيف خزانات المياه", frequency: "كل 6 أشهر", nextDate: "2026-09-15", status: "مجدول" },
];

export const CONTRACTOR_INVOICES = [
  { id: "INV-2026-01", amount: "4,500 ر.س", date: "2026-07-10", status: "مدفوعة" },
  { id: "INV-2026-05", amount: "1,200 ر.س", date: "2026-07-20", status: "قيد المعالجة" },
  { id: "INV-2026-08", amount: "3,800 ر.س", date: "2026-07-22", status: "بانتظار الاعتماد" },
];
