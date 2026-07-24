# تنفيذ بوابة الفني الداخلي (Internal Technician Portal)

سنقوم بإضافة دور وظيفي جديد "فني داخلي" مع واجهة مستخدم مبسطة ومحسنة للجوال، تتيح للفنيين استلام المهام الميدانية وتحديث حالاتها مباشرة.

## Proposed Changes

### [إدارة الهوية والأدوار]

#### [MODIFY] [use-auth.tsx](file:///C:/Projects/shqjubail-main/src/hooks/use-auth.tsx)
- تحديث نوع `UserRole` ليشمل `technician`.

### [المسارات الجديدة]

#### [NEW] [technician/login.tsx](file:///C:/Projects/shqjubail-main/src/routes/technician/login.tsx)
- صفحة تسجيل دخول مخصصة للفنيين باستخدام الرقم الوظيفي.

#### [NEW] [technician/index.tsx](file:///C:/Projects/shqjubail-main/src/routes/technician/index.tsx)
- لوحة تحكم الفني (تصميم يشبه التطبيق):
    - قائمة "مهامي اليوم".
    - بطاقات مهام تحتوي على: اسم المبنى، الغرفة/الموقع، وصف العطل.
    - أزرار سريعة: "بدء العمل"، "تم الإصلاح"، "طلب قطع غيار".

### [تحسين الواجهة الرئيسية]

#### [MODIFY] [src/routes/index.tsx](file:///C:/Projects/shqjubail-main/src/routes/index.tsx)
- إضافة "بوابة الفنيين" إلى قسم البوابات (Portals Section) لسهولة الوصول.

### [البيانات والمزامنة]

#### [MODIFY] [data-service.ts](file:///C:/Projects/shqjubail-service.ts) و [mock-data.ts](file:///C:/Projects/shqjubail-main/src/lib/mock-data.ts)
- إضافة مهام مخصصة للفنيين الداخليين (مثل: "تغيير لمبات ممر A"، "إصلاح صنبور الوضوء").

## بيانات الدخول للتجربة

> [!NOTE]
> **الفني الداخلي:** اسم المستخدم `tech` وكلمة المرور `tech`.

## Verification Plan

### Manual Verification
1. الدخول بـ `tech/tech`.
2. التأكد من أن الواجهة مريحة للاستخدام من الجوال.
3. تجربة الضغط على "بدء العمل" والتأكد من تغير حالة المهمة.
4. التأكد من أن الموظف (admin) يمكنه رؤية إنجازات الفني في لوحته.
