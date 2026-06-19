"use client";

import { useEffect, useState } from "react";

const translations = {
  Home: "الرئيسية",
  Browse: "تصفح",
  Categories: "التصنيفات",
  "How It Works": "كيف يعمل",
  "Become a Chef": "انضم كطاهٍ",
  "Become A Chef": "انضم كطاهٍ",
  About: "من نحن",
  "Contact": "تواصل معنا",
  "Sign in": "تسجيل الدخول",
  "Sign In": "تسجيل الدخول",
  "Log in": "تسجيل الدخول",
  Login: "تسجيل الدخول",
  "Log out": "تسجيل الخروج",
  Logout: "تسجيل الخروج",
  Register: "إنشاء حساب",
  "Create Account": "إنشاء حساب",
  "Email Address": "البريد الإلكتروني",
  "Administrator Email": "البريد الإلكتروني للمسؤول",
  Password: "كلمة المرور",
  "Secure Password": "كلمة المرور الآمنة",
  "Confirm Password": "تأكيد كلمة المرور",
  "First Name": "الاسم الأول",
  "Last Name": "اسم العائلة",
  "Phone Number": "رقم الهاتف",
  "Forgot Password?": "هل نسيت كلمة المرور؟",
  "Remember me": "تذكرني",
  "Or continue with": "أو تابع باستخدام",
  "or continue with": "أو تابع باستخدام",
  Submit: "إرسال",
  Save: "حفظ",
  "Save Changes": "حفظ التغييرات",
  Cancel: "إلغاء",
  Close: "إغلاق",
  Delete: "حذف",
  Edit: "تعديل",
  Update: "تحديث",
  Confirm: "تأكيد",
  Continue: "متابعة",
  Back: "رجوع",
  "Back to Home": "العودة للرئيسية",
  Next: "التالي",
  Previous: "السابق",
  Search: "بحث",
  "Search...": "بحث...",
  "Search dishes...": "ابحث عن أطباق...",
  "Search your kitchen...": "ابحث في مطبخك...",
  "Search for meals, cuisines or chefs...": "ابحث عن وجبات أو مطابخ أو طهاة...",
  "Search meals, cuisines or chefs...": "ابحث عن وجبات أو مطابخ أو طهاة...",
  "Search by chef name or specialty...": "ابحث باسم الطاهي أو التخصص...",
  "Search for more meals or chefs...": "ابحث عن المزيد من الوجبات أو الطهاة...",
  "Loading...": "جارٍ التحميل...",
  "Searching...": "جارٍ البحث...",
  "No meals found": "لم يتم العثور على وجبات",
  "Try adjusting your filters.": "جرّب تعديل خيارات التصفية.",
  "No meals found matching your search.": "لا توجد وجبات مطابقة لبحثك.",
  "No chefs found matching your search.": "لا يوجد طهاة مطابقون لبحثك.",
  "Meal not found": "الوجبة غير موجودة",
  "Chef not found": "الطاهي غير موجود",
  "Page not found.": "الصفحة غير موجودة.",
  "This meal is unavailable right now.": "هذه الوجبة غير متاحة حاليًا.",
  "This chef profile is unavailable right now.":
    "ملف هذا الطاهي غير متاح حاليًا.",
  "Discover home-cooked meals": "اكتشف وجبات منزلية",
  "Browse CloudKitchen picks": "تصفح اختيارات كلاود كيتشن",
  Ingredients: "المكونات",
  "Community Reviews": "تقييمات المجتمع",
  "Signature Offerings": "الأطباق المميزة",
  "No reviews yet for this meal. Be the first to try it!":
    "لا توجد تقييمات لهذه الوجبة بعد. كن أول من يجربها!",
  "Freshly prepared favorites from the same kitchen.":
    "أطباق مفضلة محضرة طازجة من نفس المطبخ.",
  "Loading meals...": "جارٍ تحميل الوجبات...",
  "Loading featured chefs...": "جارٍ تحميل الطهاة المميزين...",
  "Explore Cuisines": "استكشف المطابخ",
  "See All": "عرض الكل",
  "Top-Rated Local Chefs": "أفضل الطهاة المحليين تقييمًا",
  "Loading cuisines...": "جارٍ تحميل المطابخ...",
  "Loading chefs...": "جارٍ تحميل الطهاة...",
  "Loading recommendations...": "جارٍ تحميل الترشيحات...",
  "No categories available right now.": "لا توجد تصنيفات متاحة حاليًا.",
  "No verified chefs available right now.":
    "لا يوجد طهاة موثقون متاحون حاليًا.",
  "No meal recommendations available right now.":
    "لا توجد ترشيحات وجبات متاحة حاليًا.",
  "What are you craving today?": "ماذا تشتهي اليوم؟",
  "Add to Cart": "أضف إلى السلة",
  Cart: "السلة",
  Checkout: "إتمام الطلب",
  Order: "اطلب",
  Orders: "الطلبات",
  "Order Items": "عناصر الطلب",
  "Order Summary": "ملخص الطلب",
  "Delivery Information": "معلومات التوصيل",
  "Shipping Address": "عنوان التوصيل",
  "Contact Phone": "رقم التواصل",
  Subtotal: "المجموع الفرعي",
  Shipping: "التوصيل",
  FREE: "مجانًا",
  "Total Paid": "إجمالي المدفوع",
  Favorites: "المفضلة",
  Notifications: "الإشعارات",
  Profile: "الملف الشخصي",
  Settings: "الإعدادات",
  Dashboard: "لوحة التحكم",
  Analytics: "التحليلات",
  Revenue: "الإيرادات",
  Meals: "الوجبات",
  Users: "المستخدمون",
  Chefs: "الطهاة",
  Verifications: "طلبات التوثيق",
  Status: "الحالة",
  "Next Step": "الخطوة التالية",
  Updates: "التحديثات",
  Verify: "توثيق",
  Pending: "قيد الانتظار",
  Completed: "مكتمل",
  Active: "نشط",
  Flagged: "معلّم",
  "Pending Review": "قيد المراجعة",
  "All Categories": "كل التصنيفات",
  "All Statuses": "كل الحالات",
  "Pending Audit": "بانتظار التدقيق",
  "Flagged Today": "المعلّمة اليوم",
  "Chef Readiness": "جاهزية الطهاة",
  "Orders Overview": "نظرة عامة على الطلبات",
  "Weekly performance comparison": "مقارنة الأداء الأسبوعي",
  "User Acquisition Growth": "نمو اكتساب المستخدمين",
  "Active Users": "المستخدمون النشطون",
  "Chef Partners": "الطهاة الشركاء",
  "Chef Portal": "بوابة الطاهي",
  "KITCHEN LOAD": "ضغط المطبخ",
  "AVG. PREP TIME": "متوسط وقت التحضير",
  "Brand Identity": "هوية العلامة",
  "Kitchen Name": "اسم المطبخ",
  "Kitchen Slogan": "شعار المطبخ",
  "Brand Bio": "نبذة عن العلامة",
  "Enter chef name": "أدخل اسم الطاهي",
  "Enter phone number": "أدخل رقم الهاتف",
  "Admin Access": "دخول المسؤول",
  "Authorized personnel only.": "للمصرح لهم فقط.",
  Platform: "المنصة",
  Legal: "القانونية",
  Community: "المجتمع",
  "Safety & Trust": "الأمان والثقة",
  "Privacy Policy": "سياسة الخصوصية",
  "Terms Of Service": "شروط الخدمة",
  "Help Center": "مركز المساعدة",
  Blog: "المدونة",
  "All services operational": "جميع الخدمات تعمل",
  "Chat with Us": "تحدث معنا",
  "Email Support": "الدعم عبر البريد",
  "Join the Community": "انضم إلى المجتمع",
  "Quick Help": "مساعدة سريعة",
  "Please fill in all fields": "يرجى ملء جميع الحقول",
  "Message sent successfully!": "تم إرسال الرسالة بنجاح!",
  "Please select a rating": "يرجى اختيار تقييم",
  "Please enter a comment": "يرجى كتابة تعليق",
  "Review submitted successfully!": "تم إرسال التقييم بنجاح!",
  "How was your meal?": "كيف كانت وجبتك؟",
  "Share your experience with this meal...": "شارك تجربتك مع هذه الوجبة...",
  "Verification request submitted successfully.": "تم إرسال طلب التوثيق بنجاح.",
  "Your verification has been approved.": "تمت الموافقة على طلب التوثيق.",
  "Your verification needs updates.": "طلب التوثيق يحتاج إلى تحديثات.",
  "National ID Front": "الوجه الأمامي للبطاقة",
  "National ID Back": "الوجه الخلفي للبطاقة",
  "Upload current Health Certificate": "ارفع الشهادة الصحية الحالية",
  "Criminal Record Verification": "صحيفة الحالة الجنائية",
  "The Sufra Story": "قصة سفرة",
  "The Spark": "البداية",
  "Sustainable Impact": "أثر مستدام",
  "Verified Home Kitchens": "مطابخ منزلية موثقة",
  "Cooked with care": "مطهو بعناية",
  "Community Over Everything": "المجتمع أولًا",
  "Empowering Through Excellence": "تمكين من خلال التميز",
  "Meals Served": "وجبات تم تقديمها",
  "Chef Earnings": "أرباح الطهاة",
  "Taste the difference of home.": "تذوق الفرق في أكل البيت.",
  "Decrease quantity": "تقليل الكمية",
  "Increase quantity": "زيادة الكمية",
  "Open Menu": "فتح القائمة",
  English: "الإنجليزية",
  Arabic: "العربية",
  "Switch to English": "التبديل إلى الإنجليزية",
  "Switch to Arabic": "التبديل إلى العربية",
  Enjoy: "استمتع",
  "Weekly menus tailored for you.": "قوائم أسبوعية مصممة لك.",
  "Discover your next favorite dish.": "اكتشف طبقك المفضل القادم.",
  "Loading categories...": "جارٍ تحميل التصنيفات...",
  "Loading customer dashboard...": "جارٍ تحميل لوحة تحكم العميل...",
  "Loading Chefs data...": "جارٍ تحميل بيانات الطهاة...",
  "TODAY'S REVENUE": "إيرادات اليوم",
  "Available Balance": "الرصيد المتاح",
  "Total Earned": "إجمالي الأرباح",
  "Earnings History": "سجل الأرباح",
  "Withdrawal History": "سجل السحب",
  "Request Withdrawal": "طلب سحب",
  "Current Balance": "الرصيد الحالي",
  Amount: "المبلغ",
  Date: "التاريخ",
  "Order #": "رقم الطلب",
  "No earnings yet": "لا توجد أرباح بعد",
  "No withdrawals yet": "لا توجد عمليات سحب بعد",
  "Keep up the great work, Chef!": "استمر في العمل الرائع يا شيف!",
  "Lifetime earnings from orders": "إجمالي الأرباح من الطلبات",
  "Once you complete orders, your earnings will appear here.":
    "ستظهر أرباحك هنا بعد إكمال الطلبات.",
  "When you request a payout, it will show up here for tracking.":
    "ستظهر طلبات السحب هنا للمتابعة.",
  "Please enter a valid amount greater than zero":
    "يرجى إدخال مبلغ صحيح أكبر من صفر",
  "Withdrawal amount cannot exceed available balance":
    "لا يمكن أن يتجاوز مبلغ السحب الرصيد المتاح",
  "Withdrawal request submitted successfully!": "تم إرسال طلب السحب بنجاح!",
  "Failed to load revenue data. Please try again later.":
    "تعذر تحميل بيانات الإيرادات. حاول مرة أخرى لاحقًا.",
  "Order Number": "رقم الطلب",
  "Date Placed": "تاريخ الطلب",
  "Total Amount": "المبلغ الإجمالي",
  "Ordered Items": "العناصر المطلوبة",
  "Address:": "العنوان:",
  "Phone:": "الهاتف:",
  "Order Total": "إجمالي الطلب",
  Total: "الإجمالي",
  "Shipping estimate": "تكلفة التوصيل المتوقعة",
  "Order total": "إجمالي الطلب",
  "Items in your shopping cart": "العناصر الموجودة في سلة التسوق",
  Remove: "إزالة",
  "Please provide shipping address and contact phone":
    "يرجى إدخال عنوان التوصيل ورقم الهاتف",
  "Order placed successfully!": "تم تقديم الطلب بنجاح!",
  "Credit Card / Wallet (Paymob)": "بطاقة ائتمان / محفظة إلكترونية (Paymob)",
  "Secure payment via Paymob": "دفع آمن عبر Paymob",
  "Cash on Delivery": "الدفع عند الاستلام",
  "Currently unavailable": "غير متاح حاليًا",
  "Street name, Building number, Apartment...":
    "اسم الشارع، رقم المبنى، الشقة...",
  "7-Day AI Meal Planner": "مخطط وجبات ذكي لمدة 7 أيام",
  "Weekly Budget": "الميزانية الأسبوعية",
  "Meals Per Day": "وجبات يوميًا",
  Allergies: "الحساسية",
  "Favorite Categories": "التصنيفات المفضلة",
  "Daily plan": "الخطة اليومية",
  "Category:": "التصنيف:",
  "Access Error": "خطأ في الوصول",
  "Error Loading Meals": "خطأ في تحميل الوجبات",
  "Main Dish": "طبق رئيسي",
  Italian: "إيطالي",
  Dessert: "حلويات",
  Premium: "مميز",
  Banned: "محظور",
  Inactive: "غير نشط",
  Finished: "منتهٍ",
  "Status: All": "الحالة: الكل",
  "Status: All Categories": "الحالة: كل التصنيفات",
  "Sort: Join Date": "ترتيب: تاريخ الانضمام",
  "Sort: Name": "ترتيب: الاسم",
  "View user": "عرض المستخدم",
  "Ban user": "حظر المستخدم",
  "Unban user": "إلغاء حظر المستخدم",
  "More options": "المزيد من الخيارات",
  "View chef": "عرض الطاهي",
  "View message": "عرض الرسالة",
  "Mark as finished": "تحديد كمنتهٍ",
  "Message marked as finished": "تم تحديد الرسالة كمنتهية",
  "Failed to update message": "تعذر تحديث الرسالة",
  "Clear search": "مسح البحث",
  "Previous page": "الصفحة السابقة",
  "Next page": "الصفحة التالية",
  "Edit category": "تعديل التصنيف",
  "Delete category": "حذف التصنيف",
  "Delete Category": "حذف التصنيف",
  "Remove image": "إزالة الصورة",
  "Audit Logs": "سجلات التدقيق",
  "System Status:": "حالة النظام:",
  "System Alert:": "تنبيه النظام:",
  "All caught up!": "لا توجد طلبات جديدة!",
  "Chef verifications": "توثيق الطهاة",
  "Support messages": "رسائل الدعم",
  "Hidden categories": "التصنيفات المخفية",
  "Active customers": "العملاء النشطون",
  "Verified chefs": "الطهاة الموثقون",
  "Visible meals": "الوجبات الظاهرة",
  "Active categories": "التصنيفات النشطة",
  "Verification Inbox": "صندوق طلبات التوثيق",
  "Support Inbox": "صندوق رسائل الدعم",
  Identity: "الهوية",
  Branding: "العلامة التجارية",
  Listings: "القوائم",
  Payouts: "المدفوعات",
  "AI Brand Generation": "إنشاء العلامة التجارية بالذكاء الاصطناعي",
  "Chef Onboarding": "إعداد حساب الطاهي",
  "Describe your kitchen": "صف مطبخك",
  "Cooking Style": "أسلوب الطهي",
  "Your Signature Dish": "طبقك المميز",
  "Who is your food for?": "لمن تقدم طعامك؟",
  "Select your target audience": "اختر جمهورك المستهدف",
  Families: "العائلات",
  Students: "الطلاب",
  Professionals: "المحترفون",
  "Fitness Enthusiasts": "محبو اللياقة",
  "The Story Behind Your Food": "القصة وراء طعامك",
  "Min 60 characters": "الحد الأدنى 60 حرفًا",
  "Save as Draft": "حفظ كمسودة",
  "Your passion, our platform.": "شغفك، منصتنا.",
  "Chef Tip": "نصيحة للطاهي",
  "Add New Meal": "إضافة وجبة جديدة",
  "Meal Name *": "اسم الوجبة *",
  "Description *": "الوصف *",
  "Price (EGP) *": "السعر (جنيه) *",
  "Category *": "التصنيف *",
  "Ingredients (Separated by comma or Enter)":
    "المكونات (افصل بفاصلة أو Enter)",
  "Add ingredient...": "أضف مكونًا...",
  "Dietary & Allergens": "النظام الغذائي ومسببات الحساسية",
  "Verified home chef - view profile": "طاهٍ منزلي موثق - عرض الملف",
  "Google Login Failed": "فشل تسجيل الدخول عبر Google",
  "Bringing the Soul of": "نقدم روح",
  "Home Cooking": "الطهي المنزلي",
  "to Your Table.": "إلى مائدتك.",
  "Celebrating home-cooked heritage and authentic flavors from local chefs around the world.":
    "نحتفي بتراث الأكل البيتي والنكهات الأصيلة من الطهاة المحليين.",
  "© 2026 Sufra. All Rights Reserved.": "© 2026 سفرة. جميع الحقوق محفوظة.",
  "Taste The Love Of Home": "تذوق حب أكل البيت",
  "Discover authentic home-cooked meals prepared by talented local chefs and delivered fresh to your door.":
    "اكتشف وجبات منزلية أصيلة يحضرها طهاة محليون موهوبون وتصل طازجة إلى بابك.",
  "How Sufra Works": "كيف تعمل سفرة",
  "Explore hundreds of home-cooked dishes from local chefs.":
    "استكشف مئات الأطباق المنزلية من طهاة محليين.",
  "Securely place your order and choose delivery or pickup.":
    "اطلب بأمان واختر التوصيل أو الاستلام.",
  "Experience authentic homemade meals with every bite.":
    "استمتع بوجبات منزلية أصيلة مع كل لقمة.",
  "Powered by Sufra AI": "مدعوم بذكاء مطبخنا الاصطناعي",
  "Your Smart Culinary Assistant": "مساعدك الذكي للطهي",
  "Our AI Meal Planner learns your tastes and suggests perfect home-cooked meals based on your dietary needs and history. Get smart recommendations that feel like they were made just for you.":
    "يتعلم مخطط الوجبات الذكي ذوقك ويقترح وجبات منزلية مثالية بناءً على احتياجاتك الغذائية وتفضيلاتك. احصل على ترشيحات ذكية مصممة خصيصًا لك.",
  "Meal Planner": "مخطط الوجبات",
  "Smart Picks": "اختيارات ذكية",
  "AI Recommendation": "ترشيح ذكي",
  "Add To Cart": "أضف إلى السلة",
  "From Our Community": "من مجتمعنا",
  "Ready To Experience Real Food?": "هل أنت مستعد لتجربة أكل حقيقي؟",
  "Start Your Journey": "ابدأ رحلتك",
  "Food Enthusiast": "محبة للطعام",
  "Partner Chef": "طاهية شريكة",
  "Regular Customer": "عميل دائم",
  "Finally, food that actually tastes like my grandmother's cooking. No commercial restaurant can replicate this level of soul and tradition.":
    "أخيرًا، طعام يشبه فعلًا طهي جدتي. لا يستطيع أي مطعم تجاري تقديم هذا القدر من الروح والأصالة.",
  "Becoming a chef on Sufra changed my life. I can share my heritage and support my family from my own kitchen.":
    "الانضمام كطاهية على مطبخنا غيّر حياتي. أستطيع مشاركة تراثي ودعم أسرتي من مطبخي.",
  "The AI planner is surprisingly accurate! It introduced me to dishes I'd never tried before but now absolutely love.":
    "مخطط الوجبات الذكي دقيق بشكل مدهش! عرّفني على أطباق لم أجربها من قبل وأصبحت أحبها جدًا.",
  "Authentic & Community-led": "أصيل ويقوده المجتمع",
  "Bringing the Soul of Home Cooking to Your Table.":
    "نقدم روح أكل البيت إلى مائدتك.",
  "Sufra lets talented home chefs share their heritage through fresh, soulful meals. We bring neighbors together around food that feels personal, warm, and full of care.":
    "تتيح سفرة للطهاة المنزليين الموهوبين مشاركة تراثهم من خلال وجبات طازجة ومليئة بالروح. نجمع الجيران حول طعام شخصي ودافئ ومحضّر بكل عناية.",
  "Meet Our Chefs": "تعرّف على طهاتنا",
  "Join Our Mission": "انضم إلى رسالتنا",
  "From a small family table to a trusted local movement, our journey began with one simple idea: food made at home carries memory.":
    "من مائدة عائلية صغيرة إلى مجتمع محلي موثوق، بدأت رحلتنا بفكرة بسيطة: الطعام المصنوع في البيت يحمل الذكريات.",
  "We started when our founders, realized how many gifted home cooks were preparing extraordinary meals without a platform to reach nearby food lovers. Sufra became that bridge.":
    "بدأنا عندما أدرك مؤسسونا أن كثيرًا من الطهاة المنزليين الموهوبين يقدمون وجبات رائعة دون منصة تصلهم بمحبي الطعام القريبين. أصبحت سفرة هذا الجسر.",
  "Local sourcing and home-based kitchens reduce waste and support neighborhood economies.":
    "المكونات المحلية والمطابخ المنزلية تقلل الهدر وتدعم اقتصاد الأحياء.",
  "2,000+ Chefs": "أكثر من 2,000 طاهٍ",
  "Empowering passionate cooks to earn from the recipes they love most.":
    "نساعد الطهاة الشغوفين على تحقيق دخل من الوصفات التي يحبونها.",
  "Every order helps preserve culture, support cooks, and build local connection.":
    "كل طلب يساعد في حفظ الثقافة ودعم الطهاة وبناء روابط محلية.",
  "Strict Vetting": "مراجعة دقيقة",
  "Every chef completes our kitchen, food-safety, and authenticity review before joining the community.":
    "يخضع كل طاهٍ لمراجعة المطبخ وسلامة الغذاء والأصالة قبل الانضمام إلى المجتمع.",
  "Heritage Recipes": "وصفات تراثية",
  "We celebrate family recipes, local ingredients, and the traditions that make every dish personal.":
    "نحتفي بوصفات العائلة والمكونات المحلية والتقاليد التي تجعل كل طبق مميزًا.",
  "Safety First": "السلامة أولًا",
  "Transparent profiles, verified cooks, and careful handling standards keep every order dependable.":
    "الملفات الواضحة والطهاة الموثقون ومعايير التعامل الدقيقة تجعل كل طلب موثوقًا.",
  '"We are building a world where every kitchen is a gateway to a different culture."':
    '"نبني عالمًا يصبح فيه كل مطبخ بوابة إلى ثقافة مختلفة."',
  "- Mustafa, Founder & CEO": "- مصطفى، المؤسس والرئيس التنفيذي",
  "Sufra was founded on the belief that the best meals are cooked by people who carry stories, tradition, and pride into every dish.":
    "تأسست سفرة على إيمان بأن أفضل الوجبات يصنعها أشخاص يضعون القصص والتقاليد والفخر في كل طبق.",
  "Join our community of local chefs and neighbors discovering food made with heritage, care, and soul.":
    "انضم إلى مجتمعنا من الطهاة المحليين والجيران لاكتشاف طعام مصنوع بالتراث والعناية والروح.",
  "Start Browsing Today": "ابدأ التصفح اليوم",
  "Get in Touch": "تواصل معنا",
  "Questions, partnerships, or support? Our community team is here to help.":
    "لديك أسئلة أو شراكة أو تحتاج دعمًا؟ فريق المجتمع هنا لمساعدتك.",
  "Need help navigating Sufra or managing an order? Send us a message.":
    "تحتاج مساعدة في استخدام مطبخنا أو إدارة طلب؟ أرسل لنا رسالة.",
  "Questions about chef partnerships, feedback, or general inquiries.":
    "أسئلة عن شراكات الطهاة أو الملاحظات أو الاستفسارات العامة.",
  "Full Name": "الاسم الكامل",
  Subject: "الموضوع",
  Message: "الرسالة",
  "Subject of your message": "موضوع رسالتك",
  "How can we help you today?": "كيف يمكننا مساعدتك اليوم؟",
  "Sending...": "جارٍ الإرسال...",
  "Send Message": "إرسال الرسالة",
  "Find answers to the most common questions from our community.":
    "اعثر على إجابات لأكثر أسئلة مجتمعنا شيوعًا.",
  "How do I join as a Chef?": "كيف أنضم كطاهٍ؟",
  "Apply online, share your food story, and our team will guide you through kitchen verification.":
    "قدم طلبك عبر الإنترنت وشارك قصة طعامك، وسيرشدك فريقنا خلال توثيق المطبخ.",
  "Is the food safety guaranteed?": "هل سلامة الطعام مضمونة؟",
  "We review chef profiles, kitchen standards, and customer feedback to keep trust at the center.":
    "نراجع ملفات الطهاة ومعايير المطابخ وآراء العملاء للحفاظ على الثقة.",
  "What is your response time?": "ما مدة الرد؟",
  "Most messages receive a response within one business day from our community support team.":
    "يتم الرد على معظم الرسائل خلال يوم عمل واحد من فريق دعم المجتمع.",
  "Can I visit your office?": "هل يمكنني زيارة مكتبكم؟",
  "Visits are available by appointment at ITI Cairo University for partners and community members.":
    "الزيارات متاحة بموعد مسبق في ITI بجامعة القاهرة للشركاء وأعضاء المجتمع.",
  "Failed to send message": "تعذر إرسال الرسالة",
  "Sufra social channel": "قناة مطبخنا الاجتماعية",
  "ITI Cairo University map": "خريطة ITI جامعة القاهرة",
  "Total Users": "إجمالي المستخدمين",
  "Total Chefs": "إجمالي الطهاة",
  "Total Meals": "إجمالي الوجبات",
  "Total Orders": "إجمالي الطلبات",
  "Active listings": "القوائم النشطة",
  Moderation: "الإشراف",
  "Authentic home-cooked meals from the best chefs in your neighborhood.":
    "وجبات منزلية أصيلة من أفضل الطهاة في منطقتك.",
  Cuisine: "المطبخ",
  Price: "السعر",
  Rating: "التقييم",
  Levantine: "شامي",
  Asian: "آسيوي",
  Bakery: "مخبوزات",
  Pakistani: "باكستاني",
  Maghrebi: "مغاربي",
  More: "المزيد",
  "Home chefs trusted by Sarah and your neighbors":
    "طهاة منزليون تثق بهم سارة وجيرانك",
  "View Menu": "عرض القائمة",
  "Levantine Specialist": "متخصصة في المطبخ الشامي",
  "Traditional Flavors": "نكهات تقليدية",
  "Modern Fusion": "مزج عصري",
  "Authentic Heritage": "تراث أصيل",
  "Popular Today": "الأكثر طلبًا اليوم",
  "View Details": "عرض التفاصيل",
  "Nearby Kitchens": "مطابخ قريبة",
  "View Map": "عرض الخريطة",
  Open: "مفتوح",
  New: "جديد",
  "Monthly Revenue": "الإيرادات الشهرية",
  "Active Meals": "الوجبات النشطة",
  "Average Rating": "متوسط التقييم",
  Dishes: "أطباق",
  Preparing: "قيد التحضير",
  Ready: "جاهز",
  Delivering: "قيد التوصيل",
  "#1 Top Seller": "الأكثر مبيعًا رقم 1",
  "Search Results for": "نتائج البحث عن",
  "More from": "المزيد من",
  "Back to meals": "العودة إلى الوجبات",
  "View Meal": "عرض الوجبة",
  Review: "تقييم",
  Comment: "التعليق",
  "Terms and Conditions": "الشروط والأحكام",
  "Already have an account?": "لديك حساب بالفعل؟",
  "Don't have an account?": "ليس لديك حساب؟",
  "Create your account": "أنشئ حسابك",
  Customer: "عميل",
  Chef: "طاهٍ",
  "Total Customers": "إجمالي العملاء",
  "New Today": "الجدد اليوم",
  "Export Data": "تصدير البيانات",
  "No users found": "لم يتم العثور على مستخدمين",
  "No categories found": "لم يتم العثور على تصنيفات",
  "No orders found": "لم يتم العثور على طلبات",
  "No messages found": "لم يتم العثور على رسائل",
  New: "جديد",
  "In Progress": "قيد التنفيذ",
  Cancelled: "ملغي",
  "All Chefs": "كل الطهاة",
  Filter: "تصفية",
  "Apply Filters": "تطبيق التصفية",
  Reset: "إعادة ضبط",
  "Create Category": "إنشاء تصنيف",
  "Add Category": "إضافة تصنيف",
  "Category Name": "اسم التصنيف",
  "Category Image": "صورة التصنيف",
  Image: "الصورة",
  Description: "الوصف",
  Actions: "الإجراءات",
  Name: "الاسم",
  Email: "البريد الإلكتروني",
  Phone: "الهاتف",
  Role: "الدور",
  Joined: "تاريخ الانضمام",
  "Chef Name": "اسم الطاهي",
  Kitchen: "المطبخ",
  "Customer Name": "اسم العميل",
  "Order ID": "رقم الطلب",
  Payment: "الدفع",
  "Payment Status": "حالة الدفع",
  Paid: "مدفوع",
  Unpaid: "غير مدفوع",
  Approve: "موافقة",
  Reject: "رفض",
  Approved: "تمت الموافقة",
  Rejected: "مرفوض",
  Download: "تنزيل",
  View: "عرض",
  Details: "التفاصيل",
  Showing: "عرض",
  of: "من",
  items: "عنصر",
  "Profile Settings": "إعدادات الملف الشخصي",
  "Contact Information": "معلومات التواصل",
  "Kitchen Settings": "إعدادات المطبخ",
  "Business Hours": "ساعات العمل",
  "Delivery Radius": "نطاق التوصيل",
  Account: "الحساب",
  Support: "الدعم",
  "Mon - Fri": "الإثنين - الجمعة",
  "Sat - Sun": "السبت - الأحد",
};

const dynamicTranslations = [
  [/^Welcome back,\s*(.+)$/i, "مرحبًا بعودتك، $1"],
  [/^Welcome\s+(.+)$/i, "مرحبًا $1"],
  [/^Recommended for\s+(.+)$/i, "مقترح لـ $1"],
  [/^Review\s+(.+)$/i, "تقييم $1"],
  [/^Save\s+(.+)$/i, "حفظ $1"],
  [/^Order\s+(.+)$/i, "اطلب $1"],
  [/^Search\s+(.+)\s+meals\.\.\.$/i, "ابحث عن وجبات $1..."],
  [
    /^Home chefs trusted by\s+(.+)\s+and your neighbors$/i,
    "طهاة منزليون يثق بهم $1 وجيرانك",
  ],
  [/^(\d+(?:\.\d+)?)\s+km away$/i, "يبعد $1 كم"],
  [/^by\s+(.+)$/i, "بواسطة $1"],
  [/^Remove\s+(.+)$/i, "إزالة $1"],
  [/^Upload\s+(.+)$/i, "رفع $1"],
  [
    /^Welcome back to control center,\s*(.+)$/i,
    "مرحبًا بعودتك إلى مركز التحكم، $1",
  ],
  [/^More from\s+(.+)$/i, "المزيد من $1"],
  [/^Search Results for\s+(.+)$/i, "نتائج البحث عن $1"],
  [/^Showing\s+(.+)\s+of\s+(.+)\s+items$/i, "عرض $1 من $2 عنصر"],
];

function translate(value) {
  const trimmed = value.trim();
  if (!trimmed) return value;

  let translated = translations[trimmed];
  if (!translated) {
    for (const [pattern, replacement] of dynamicTranslations) {
      if (pattern.test(trimmed)) {
        translated = trimmed.replace(pattern, replacement);
        break;
      }
    }
  }
  if (!translated) return value;

  return value.replace(trimmed, translated);
}

const originalText = new WeakMap();
const originalAttributes = new WeakMap();

function renderText(node, language) {
  if (!originalText.has(node)) originalText.set(node, node.nodeValue);
  const original = originalText.get(node);
  const nextValue = language === "ar" ? translate(original) : original;
  if (node.nodeValue !== nextValue) node.nodeValue = nextValue;
}

function renderElement(element, language) {
  const stored = originalAttributes.get(element) || {};
  ["placeholder", "aria-label", "title", "alt"].forEach((attribute) => {
    const value = element.getAttribute(attribute);
    if (value && stored[attribute] === undefined) stored[attribute] = value;
    if (stored[attribute] !== undefined) {
      element.setAttribute(
        attribute,
        language === "ar" ? translate(stored[attribute]) : stored[attribute],
      );
    }
  });
  originalAttributes.set(element, stored);
}

function localize(root, language) {
  const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
  const nodes = [];
  while (walker.nextNode()) nodes.push(walker.currentNode);

  nodes.forEach((node) => {
    if (node.parentElement?.closest("script, style, code, pre")) return;
    renderText(node, language);
  });

  const elements = root.querySelectorAll?.(
    "[placeholder], [aria-label], [title], [alt]",
  );
  elements?.forEach((element) => renderElement(element, language));
}

export default function ArabicLocalizationProvider({ children }) {
  const [language, setLanguage] = useState("ar");

  useEffect(() => {
    const savedLanguage = localStorage.getItem("sufra-language");
    queueMicrotask(() => setLanguage(savedLanguage === "en" ? "en" : "ar"));
  }, []);

  useEffect(() => {
    document.documentElement.lang = language === "ar" ? "ar-EG" : "en";
    document.documentElement.dir = language === "ar" ? "rtl" : "ltr";
    localStorage.setItem("sufra-language", language);
    localize(document.body, language);

    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.type === "characterData") {
          const original = originalText.get(mutation.target);
          const expected =
            original && language === "ar" ? translate(original) : original;
          if (!original || mutation.target.nodeValue !== expected) {
            originalText.set(mutation.target, mutation.target.nodeValue);
          }
          renderText(mutation.target, language);
          return;
        }
        mutation.addedNodes.forEach((node) => {
          if (node.nodeType === Node.ELEMENT_NODE) localize(node, language);
          if (node.nodeType === Node.TEXT_NODE) renderText(node, language);
        });
      });
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true,
      characterData: true,
    });
    return () => observer.disconnect();
  }, [language]);

  return (
    <>
      {children}
      <button
        type="button"
        className="language-switcher"
        onClick={() =>
          setLanguage((current) => (current === "ar" ? "en" : "ar"))
        }
        aria-label={
          language === "ar" ? "Switch to English" : "Switch to Arabic"
        }
      >
        <span
          className={
            language === "ar" ? "language-option active" : "language-option"
          }
        >
          العربية
        </span>
        <span className="language-divider" aria-hidden="true" />
        <span
          className={
            language === "en" ? "language-option active" : "language-option"
          }
        >
          English
        </span>
      </button>
    </>
  );
}
