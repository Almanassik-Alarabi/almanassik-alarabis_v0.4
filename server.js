// تحميل متغيرات البيئة من ملف .env
require('dotenv').config();

// استيراد مكتبة إكسبريس
const express = require('express');
const cors = require('cors');
const app = express();

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));


app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// دعم استقبال البيانات بصيغة form-data (ملفات وصور)
// const multer = require('multer');
// const upload = multer();
// app.use(upload.any()); // تم التعليق حتى لا يتعارض مع multer في الراوترات

// استيراد عميل supabase الخاص بالإدارة (صلاحيات admin فقط لمسارات الإدارة)
const supabaseAdmin = require('./supabaseAdmin');
// استيراد عميل supabase العادي (anon/public key لمسارات المستخدم)
const supabaseClient = require('./supabaseClient');

// استيراد ملفات المسارات (routes)
const adminRoutes = require('./routes/admin/admin'); // مسارات الإدارة
const agenciesRoutes = require('./routes/admin/agencies'); // مسارات الوكالات
const bookingsRoutes = require('./routes/admin/bookings'); // مسارات الحجوزات
const chatRoutes = require('./routes/admin/chat'); // مسارات الدردشة
const offersRoutes = require('./routes/admin/offers'); // مسارات العروض
const statsRoutes = require('./routes/admin/stats'); // مسارات الإحصائيات
const airlinesRoutes = require('./routes/admin/airlines'); // مسارات شركات الطيران
const uploadRoutes = require('./routes/admin/upload'); // رفع الملفات
const siteStatsRoutes = require('./routes/admin/siteStats'); // مسارات إحصائيات الموقع
// مسارات المستخدم (user)
const viewAgenciesRoutes = require('./routes/user/view_agencies');
const viewOfferRoutes = require('./routes/user/offer');

// نقطة فحص صحة الاتصال بقاعدة البيانات (يمكنك اختيار أي واحد حسب الحاجة)
app.get('/health', async (req, res) => {
  const { data, error } = await supabaseClient.from('agencies').select('*').limit(1);
  if (error) {
    return res.status(500).json({ status: 'error', error: error.message });
  }
  res.json({ status: 'ok', data });
});

// ربط المسارات الرئيسية للتطبيق
app.use('/api/admin', (req, res, next) => { req.supabase = supabaseAdmin; next(); }, adminRoutes);      // مسارات الإدارة
app.use('/api/agencies', (req, res, next) => { req.supabase = supabaseAdmin; next(); }, agenciesRoutes); // مسارات الوكالات
app.use('/api/bookings', (req, res, next) => { req.supabase = supabaseAdmin; next(); }, bookingsRoutes); // مسارات الحجوزات
app.use('/api/chat', (req, res, next) => { req.supabase = supabaseAdmin; next(); }, chatRoutes);         // مسارات الدردشة
app.use('/api/offers', (req, res, next) => { req.supabase = supabaseAdmin; next(); }, offersRoutes);     // مسارات العروض (بما فيها toggle-golden)
app.use('/api/stats', (req, res, next) => { req.supabase = supabaseAdmin; next(); }, statsRoutes);      // مسارات الإحصائيات
app.use('/api/airlines', (req, res, next) => { req.supabase = supabaseAdmin; next(); }, airlinesRoutes);      // مسارات شركات الطيران
app.use('/api/upload', (req, res, next) => { req.supabase = supabaseAdmin; next(); }, uploadRoutes); // رفع الملفات
app.use('/api/site-stats', (req, res, next) => { req.supabase = supabaseAdmin; next(); }, siteStatsRoutes); // مسارات إحصائيات الموقع
// ربط مسارات المستخدم (user) بمفتاح public فقط
app.use('/api/user', (req, res, next) => { req.supabase = supabaseClient; next(); }, viewAgenciesRoutes);
app.use('/api/user/agency', (req, res, next) => { req.supabase = supabaseClient; next(); }, viewAgenciesRoutes);
app.use('/api/user/offers', (req, res, next) => { req.supabase = supabaseClient; next(); }, viewOfferRoutes);
app.use('/api/user/with-offers-and-airports', (req, res, next) => { req.supabase = supabaseClient; next(); }, viewOfferRoutes);
// تشغيل السيرفر على المنفذ المحدد في ملف البيئة أو 3001 افتراضيًا
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});