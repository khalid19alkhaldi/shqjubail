export const MOCK_ORDERS = [
  { id: "WO-5521", title: "صيانة مكيفات — مدرسة الفرقان", building: "مدرسة الفرقان", priority: "عالية", status: "نشط", date: "2026-07-24", category: "تكييف", contractor: "مؤسسة صيانة الشرق" },
  { id: "WO-5600", title: "إصلاح عطل كهربائي مفاجئ", building: "مبنى الأوقاف", priority: "عالية", status: "بانتظار قبول المقاول", date: "2026-07-24", category: "كهرباء", contractor: "مؤسسة صيانة الشرق" },
  { id: "WO-5601", title: "ترميم دهانات الممرات", building: "مدرسة الفرقان", priority: "متوسطة", status: "تم تقديم خطة تنفيذ", date: "2026-07-24", category: "دهانات", contractor: "مؤسسة صيانة الشرق", plan: "يومان عمل — فنيان" },
  { id: "WO-5519", title: "إصلاح تسرب مياه — مسجد الفاروق", building: "مسجد الفاروق", priority: "متوسطة", status: "قيد التنفيذ", date: "2026-07-24", category: "سباكة", contractor: "مؤسسة صيانة الشرق" },
  { id: "WO-5518", title: "فحص مصعد — مبنى الإدارة", building: "المبنى الإداري", priority: "عالية", status: "مكتمل", date: "2026-07-23", category: "مصاعد", contractor: "مؤسسة صيانة الشرق" },
];

export const MOCK_BUILDINGS = [
  {
    id: "B1",
    name: "مدرسة الفرقان",
    type: "تعليمي",
    assets: 42,
    activeOrders: 3,
    image: "https://images.unsplash.com/photo-1519741497674-611481863552?w=800&auto=format&fit=crop",
    lat: 27.0112,
    lng: 49.6583,
    details: {
      splitAC: 30,
      concealedAC: 12,
      fireSystem: "نشط",
      otherContents: "ملاعب عشبية، مظلات سيارات"
    }
  },
  {
    id: "B2",
    name: "مسجد الفاروق",
    type: "ديني",
    assets: 15,
    activeOrders: 1,
    image: "https://images.unsplash.com/photo-1584551246679-0daf3d275d0f?w=800&auto=format&fit=crop",
    lat: 27.0155,
    lng: 49.6650,
    details: {
      splitAC: 10,
      concealedAC: 5,
      fireSystem: "نشط",
      otherContents: "ساحة خارجية، مكتبة مصغرة"
    }
  },
  {
    id: "B3",
    name: "المبنى الإداري",
    type: "إداري",
    assets: 28,
    activeOrders: 0,
    image: "https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&auto=format&fit=crop",
    lat: 27.0200,
    lng: 49.6500,
    details: {
      splitAC: 20,
      concealedAC: 8,
      fireSystem: "نشط",
      otherContents: "غرفة خوادم، مواقف قبو"
    }
  },
  {
    id: "B4",
    name: "مبنى الأوقاف",
    type: "استثماري",
    assets: 60,
    activeOrders: 2,
    image: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800&auto=format&fit=crop",
    lat: 27.0050,
    lng: 49.6450,
    details: {
      splitAC: 40,
      concealedAC: 20,
      fireSystem: "نشط",
      otherContents: "محلات تجارية، مستودعات"
    }
  },
];

export const PREVENTIVE_TASKS = [
  { id: "P1", title: "صيانة تكييف دورية", frequency: "كل 3 أشهر", nextDate: "2026-08-01", status: "قادم" },
  { id: "P2", title: "تفتيش المصاعد", frequency: "شهري", nextDate: "2026-07-28", status: "عاجل" },
  { id: "P3", title: "تنظيف خزانات المياه", frequency: "كل 6 أشهر", nextDate: "2026-09-15", status: "مجدول" },
];

export const MOCK_NOTIFICATIONS = [
  // For Employees
  { id: "N1", role: "employee", title: "خطة تنفيذ جديدة", desc: "قدمت مؤسسة الشرق خطة تنفيذ للطلب WO-5601", time: "منذ 10 دقائق", unread: true },
  { id: "N2", role: "employee", title: "تأخر تنفيذ", desc: "الطلب WO-5400 تجاوز الوقت المحدد", time: "منذ ساعتين", unread: true },
  { id: "N3", role: "employee", title: "بلاغ عاجل", desc: "تسرب مياه في مدرسة الفرقان", time: "أمس", unread: false },
  // For Contractors
  { id: "N4", role: "contractor", title: "أمر عمل جديد", desc: "تم إسناد صيانة مكيفات لك", time: "منذ 5 دقائق", unread: true },
  { id: "N5", role: "contractor", title: "اعتماد خطة", desc: "تم اعتماد خطة التنفيذ للطلب WO-5519", time: "منذ ساعة", unread: true },
  { id: "N6", role: "contractor", title: "توثيق إنجاز", desc: "تم استلام صور الإنجاز للطلب WO-5480", time: "أمس", unread: false },
  // For Technicians
  { id: "N7", role: "technician", title: "مهمة جديدة", desc: "تغيير إضاءة ممر الإدارة", time: "الآن", unread: true },
];

export const TECH_TASKS = [
  { id: "T1", title: "إصلاح تسرب صنبور", location: "مسجد الفاروق - الوضوء", priority: "عالية", status: "نشط", time: "09:00 ص" },
  { id: "T2", title: "تغيير لمبات ليد", location: "مدرسة الفرقان - ممر A", priority: "متوسطة", status: "مجدول", time: "11:00 ص" },
  { id: "T3", title: "فحص عداد الكهرباء", location: "مبنى الأوقاف", priority: "منخفضة", status: "نشط", time: "01:00 م" },
];
