---

## 📊 الإحصائيات (Stats)

| الطريقة | المسار | الوصف |
|---------|--------|-------|
| GET     | `/api/stats/total-agencies`         | إجمالي عدد الوكالات (يتطلب توكن) |
| GET     | `/api/stats/total-pilgrims`         | إجمالي عدد المعتمرين (الحجوزات المقبولة status="مقبول") (يتطلب توكن) |
| GET     | `/api/stats/total-offers`           | إجمالي عدد العروض (يتطلب توكن) |
| GET     | `/api/stats/pending-requests`       | عدد الطلبات المعلقة (يتطلب توكن) |
| GET     | `/api/stats/pending-agencies`       | قائمة الوكالات المعلقة (يتطلب توكن) |
| GET     | `/api/stats/monthly-bookings`       | إحصائيات الحجوزات الشهرية (آخر 12 شهر) (يتطلب توكن) |
| GET     | `/api/stats/agencies-by-wilaya`     | توزيع الوكالات حسب الولاية (Top 6) (يتطلب توكن) |
| GET     | `/api/stats/agency/:id`             | تفاصيل وكالة واحدة حسب المعرف (يتطلب توكن) |
| GET     | `/api/stats/admin-activity`         | سجل نشاطات المدراء (يتطلب توكن، فقط المدير العام) |
| GET     | `/api/admin/active-now`             | عدد المدراء النشطين الآن (is_active=true وlast_seen خلال آخر 5 دقائق) |
| POST    | `/api/admin/update-activity-status` | تحديث أو إدراج حالة النشاط للمدير الحالي (body: { is_active }) |
---

## 📑 الحجوزات (Bookings)

# قائمة عناوين الـ API (Umrah API)

| الطريقة | المسار | الوصف | مثال الـ Body |
|---------|--------|-------|---------------|
| POST    | `/api/bookings/add`                | إنشاء حجز جديد (status=قيد الانتظار) | `{ "offer_id": "<معرف العرض>", "full_name": "اسم المعتمر", "phone": "0555555555", "passport_image_url": "رابط الصورة", "room_type": "مزدوج" }` |
| PUT     | `/api/bookings/approve-by-admin/:id` | موافقة المدير أو المدير الفرعي المسؤول عن إدارة الطلبيات (status→بانتظار موافقة الوكالة) |  |
| PUT     | `/api/bookings/approve-by-agency/:id`| موافقة الوكالة (status→مقبول، إرسال بيانات المعتمر) |  |
| PUT     | `/api/bookings/reject/:id`           | رفض الحجز (من المدير أو الوكالة) مع حذف الطلب نهائياً |  |
| GET     | `/api/bookings/all`                  | جلب جميع الحجوزات (فقط المدير العام أو المدير الفرعي المسؤول عن إدارة الطلبيات) |  |
| GET     | `/api/bookings/by-offer/:offer_id`  | جلب جميع الحجوزات حسب العرض |  |
| GET     | `/api/bookings/by-agency/:agency_id`| جلب جميع الحجوزات حسب الوكالة |  |
# قائمة عناوين الـ API (Umrah API)

---

## 🛡️ الإدارة (Admins)

| الطريقة | المسار | الوصف | مثال الـ Body |
|---------|--------|-------|---------------|
| POST    | `/api/admin/add-admin`         | إنشاء مدير عام جديد | `{ "email": "admin@email.com", "password": "yourPassword", "full_name": "اسم المدير" }` |
| POST    | `/api/admin/login-admin`       | تسجيل دخول مدير | `{ "email": "admin@email.com", "password": "yourPassword" }` |
| GET     | `/api/admin/all`               | جلب جميع المدراء |  |
| GET     | `/api/admin/activity-logs`     | جلب سجل نشاطات المدراء |  |
| POST    | `/api/admin/add-sub-admin`     | إضافة مدير فرعي جديد | `{ "email": "subadmin@email.com", "password": "yourPassword", "full_name": "مدير فرعي", "role": "sub", "permissions": { "can_approve_agencies": true, "manage_agencies": true, "manage_offers": true }, "created_by": "معرف_المدير_العام" }` |
| PUT     | `/api/admin/update/:id`        | تعديل بيانات مدير فرعي أو مميز | `{ "full_name": "اسم جديد", "permissions": { "can_approve_agencies": false, "manage_agencies": true, "manage_offers": false } }` |
| DELETE  | `/api/admin/delete/:id`        | حذف مدير فرعي أو مميز |  |

---

## 🏢 الوكالات (Agencies)

| الطريقة | المسار | الوصف | مثال الـ Body |
|---------|--------|-------|---------------|
| POST    | `/api/agencies/add`            | إضافة وكالة جديدة | `{ "email": "agency@email.com", "password": "yourPassword", "name": "اسم الوكالة", "wilaya": "الولاية", "license_number": "12345", "phone": "0555555555", "bank_account": "رقم الحساب", "logo_url": "رابط الشعار", "background_url": "رابط الخلفية", "location_name": "العنوان النصي", "latitude": 36.123, "longitude": 3.456 }` |
| GET     | `/api/agencies/all`            | جلب جميع الوكالات |  |
| GET     | `/api/agencies/by-wilaya/:wilaya` | جلب جميع الوكالات حسب الولاية |  |
| GET     | `/api/agencies/pending`        | جلب الوكالات المعلقة فقط (يتطلب صلاحية can_approve_agencies) |  |
| PUT     | `/api/agencies/status/:id`     | قبول أو تعليق وكالة (يتطلب صلاحية can_approve_agencies) | `{ "is_approved": true }` أو `{ "is_approved": false }` |

---

## 💼 العروض (Offers)

| الطريقة | المسار | الوصف | مثال الـ Body |
|---------|--------|-------|---------------|
| POST    | `/api/offers/add`              | إضافة عرض جديد (يتطلب صلاحية manage_offers) | `{ "agency_id": 1, "title": "عرض عمرة مميز", "description": "تفاصيل العرض...", "price": 1500, "start_date": "2025-07-10", "end_date": "2025-07-20" }` |
| GET     | `/api/offers/all`              | جلب جميع العروض |  |
| GET     | `/api/offers/by-agency/:agency_id` | جلب جميع العروض حسب الوكالة |  |
| PUT     | `/api/offers/update/:id`       | تعديل عرض (يتطلب صلاحية manage_offers) | `{ "title": "عنوان جديد", "price": 1200 }` |
| DELETE  | `/api/offers/delete/:id`       | حذف عرض (يتطلب صلاحية manage_offers) |  |

---

## 🛡️ الحماية والصلاحيات

- جميع العمليات (عدا تسجيل الدخول) تتطلب إرسال التوكن في الهيدر:
  - `Authorization: Bearer <access_token>`
- كل عملية مقيدة حسب الدور أو الصلاحية:
  - المدير العام (role: main) له جميع الصلاحيات.
  - المدير الفرعي (role: sub) يجب أن يمتلك الصلاحية المناسبة (manage_agencies, can_approve_agencies, manage_offers, **manage_bookings**).
- تم توحيد ميدلوير حماية التوكن JWT في جميع الملفات.
- جميع العمليات تتعامل مع قاعدة البيانات الجديدة (db.sql) وتدعم الحقول: created_by, permissions (jsonb), role (main/sub) وغيرها.
- لا يمكن حذف أو تعديل المدير العام (role = main).
- عند إضافة مدير فرعي يجب إرسال created_by (معرف المدير الحالي).
- جميع الردود البرمجية موحدة (status, error, message).

---

## ملاحظات
- يمكنك إضافة المزيد من المسارات حسب الحاجة (حجوزات، دردشة...)
- إذا أضفت جداول جديدة (مثل admin_activity_logs) أضف لها API مناسب.
