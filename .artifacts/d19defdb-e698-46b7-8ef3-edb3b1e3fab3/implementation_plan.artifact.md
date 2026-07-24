# تفعيل بوابات الموظفين والمقاولين

تفعيل البوابات يتطلب إنشاء مسارات (Routes) جديدة، صفحات تسجيل دخول، ولوحات تحكم (Dashboards) لكل دور. سنقوم بإنشاء هيكل برمجي يدعم هذه الوظائف بشكل تجريبي (Mock) مع إمكانية التوسع مستقبلاً.

## User Review Required

> [!IMPORTANT]
> سيتم تنفيذ تسجيل الدخول بشكل تجريبي (Client-side only) في هذه المرحلة، حيث لا يوجد قاعدة بيانات فعلية مربوطة حالياً. هل ترغب في استخدام بيانات دخول ثابتة (مثلاً: admin/admin) للتجربة؟

## Proposed Changes

### [إدارة المسارات (Routing)]

سنقوم بإضافة مسارات جديدة باستخدام TanStack Router:

#### [NEW] [employee/login.tsx](file:///C:/Projects/shqjubail-main/src/routes/employee/login.tsx)
صفحة تسجيل دخول الموظفين بتصميم متوافق مع هوية الجمعية.

#### [NEW] [employee/index.tsx](file:///C:/Projects/shqjubail-main/src/routes/employee/index.tsx)
لوحة تحكم الموظف: عرض أوامر العمل، حالة المباني، وإحصائيات سريعة.

#### [NEW] [contractor/login.tsx](file:///C:/Projects/shqjubail-main/src/routes/contractor/login.tsx)
صفحة تسجيل دخول المقاولين.

#### [NEW] [contractor/index.tsx](file:///C:/Projects/shqjubail-main/src/routes/contractor/index.tsx)
لوحة تحكم المقاول: عرض الأوامر المسندة، تحديث الحالة، ورفع صور الإنجاز.

---

### [تعديل الصفحة الرئيسية]

#### [MODIFY] [index.tsx](file:///C:/Projects/shqjubail-main/src/routes/index.tsx)
تحديث الروابط في القائمة العلوية (Navbar) وقسم البوابات (Portals Section) لتوجه المستخدم إلى صفحات تسجيل الدخول الجديدة.

---

### [المكونات المشتركة]

#### [NEW] `src/components/PortalLayout.tsx`
قالب مشترك للوحات التحكم يحتوي على القائمة الجانبية (Sidebar) وهيدر المستخدم.

## Verification Plan

### Automated Tests
- التأكد من أن المسارات الجديدة تعمل ولا تسبب أخطاء في الـ Router.

### Manual Verification
1. الضغط على زر "دخول الموظفين" من الصفحة الرئيسية والتأكد من الانتقال لصفحة تسجيل الدخول.
2. تجربة "تسجيل الدخول" (Mock) والانتقال للوحة التحكم.
3. التأكد من ظهور أوامر العمل التجريبية في لوحة تحكم الموظف والمقاول.
