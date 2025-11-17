// ----- إعدادات المشروع -----
// ضع بيانات تهيئة Firebase هنا (ستأخذها من لوحة Firebase بعد إنشاء المشروع)
// مثال:
// const firebaseConfig = {
//   apiKey: "AIza...",
//   authDomain: "abdo-store.firebaseapp.com",
//   projectId: "abdo-store",
//   storageBucket: "abdo-store.appspot.com",
//   messagingSenderId: "1234567890",
//   appId: "1:1234567890:web:abcdefg"
// };

const firebaseConfig = {
  /* ضع هنا بياناتك */
};

const WHATSAPP_NUMBER = "+218931122226"; // رقمك كما طلبت (تم تحويله للصيغة الدولية)
if(!firebaseConfig.apiKey){
  console.warn('Firebase config is فارغ — افتح README وتابع خطوات إنشاء مشروع Firebase ثم ضع بيانات التهيئة هنا في config.js');
}
firebase.initializeApp(firebaseConfig);
