# تنفيذ التوقيع الرقمي وخريطة المرافق التفاعلية ✍️📍

سنقوم بإضافة ميزتين احترافيتين للنظام لرفع مستوى التوثيق والرقابة الميدانية.

## Proposed Changes

### [1. التوقيع الرقمي (Digital Signature)]
سنقوم بإضافة نظام توثيق يلزم الفني/المقاول بأخذ توقيع مسؤول الموقع عند إنهاء المهمة.

#### [NEW] [SignatureModal.tsx](file:///C:/Projects/shqjubail-main/src/components/SignatureModal.tsx)
- استخدام مكتبة `react-signature-canvas`.
- نافذة منبثقة تحتوي على لوحة رسم للتوقيع.
- أزرار "مسح التوقيع" و "اعتماد الإنجاز".

#### [MODIFY] [assigned.tsx (Contractor)](file:///C:/Projects/shqjubail-main/src/routes/contractor/assigned.tsx)
- ربط زر "تأكيد الإنجاز" لفتح نافذة التوقيع قبل إغلاق الطلب.

#### [MODIFY] [index.tsx (Technician)](file:///C:/Projects/shqjubail-main/src/routes/technician/index.tsx)
- إضافة زر "تم الإصلاح" يفتح نافذة التوقيع.

---

### [2. خريطة المرافق التفاعلية (Building Map View)]
إضافة رؤية جغرافية لكافة مباني الجمعية في الجبيل لتسهيل المتابعة.

#### [NEW] [map.tsx](file:///C:/Projects/shqjubail-main/src/routes/employee/map.tsx)
- استخدام مكتبة `pigeon-maps` (خفيفة وتعمل بدون مفتاح API).
- عرض خريطة محافظة الجبيل.
- وضع علامات (Markers) تفاعلية لكل مبنى:
    - لون العلامة يتغير حسب الحالة (أخضر: سليم، أحمر: بلاغ عاجل).
    - عند الضغط على العلامة تظهر تفاصيل سريعة للمبنى.

#### [MODIFY] [PortalLayout.tsx](file:///C:/Projects/shqjubail-main/src/components/PortalLayout.tsx)
- إضافة رابط "خريطة المرافق" في القائمة الجانبية للموظف.

---

### [البيانات والمزامنة]
- تحديث `mock-data.ts` لإضافة إحداثيات (Latitude, Longitude) تقريبية لمباني الجمعية في الجبيل.

## Verification Plan

### Manual Verification
1. تسجيل الدخول كـ **فني** أو **مقاول** وإتمام مهمة -> التأكد من ظهور لوحة التوقيع وعملها.
2. تسجيل الدخول كـ **موظف** والضغط على "خريطة المرافق" -> التأكد من ظهور الخريطة وتوزع المباني عليها بشكل صحيح.
3. التأكد من أن الخريطة تدعم اللمس والتكبير (Zoom) بشكل سلس.
