export type Locale = "en" | "bn";

type Entry = { en: string; bn: string };

export const DICT: Record<string, Entry> = {
  // Language
  "lang.english": { en: "English", bn: "English" },
  "lang.bangla": { en: "বাংলা", bn: "বাংলা" },

  // Navigation
  "nav.home": { en: "Home", bn: "হোম" },
  "nav.notices": { en: "Notices", bn: "নোটিশ" },
  "nav.tasks": { en: "Tasks", bn: "কাজ" },
  "nav.events": { en: "Events", bn: "অনুষ্ঠান" },
  "nav.mobilize": { en: "Mobilise", bn: "সমাবেশ" },
  "nav.complaints": { en: "Complaints", bn: "অভিযোগ" },
  "nav.documents": { en: "Documents", bn: "নথিপত্র" },
  "nav.insights": { en: "Leader Dashboard", bn: "ড্যাশবোর্ড" },
  "nav.search": { en: "Smart Search", bn: "অনুসন্ধান" },
  "nav.verify": { en: "Verify Members", bn: "সদস্য যাচাই" },

  // Chrome
  "chrome.memberPortal": { en: "Member Portal", bn: "সদস্য পোর্টাল" },
  "chrome.administration": { en: "Administration", bn: "প্রশাসন" },
  "chrome.signOut": { en: "Sign out", bn: "লগ আউট" },
  "chrome.editProfile": { en: "Edit profile & photo", bn: "প্রোফাইল ও ছবি সম্পাদনা" },

  // Home
  "home.welcome": { en: "Welcome", bn: "স্বাগতম" },
  "home.subtitle": { en: "Your party dashboard.", bn: "আপনার দলীয় ড্যাশবোর্ড।" },
  "home.activityScore": { en: "Your Activity Score", bn: "আপনার কার্যকলাপ স্কোর" },
  "home.activityScoreSub": { en: "Earned from attendance, missions and mobilisation", bn: "উপস্থিতি, মিশন ও সমাবেশ থেকে অর্জিত" },
  "home.achievements": { en: "Achievements", bn: "অর্জন" },
  "home.achievementsSub": { en: "Earn badges by getting active", bn: "সক্রিয় হয়ে ব্যাজ অর্জন করুন" },
  "home.towards": { en: "towards", bn: "অভিমুখে" },
  "home.maxRank": { en: "Highest rank reached 🎉", bn: "সর্বোচ্চ র‍্যাঙ্ক অর্জিত 🎉" },
  "home.myTasks": { en: "My Tasks", bn: "আমার কাজ" },
  "home.myTasksDesc": { en: "Missions assigned to you", bn: "আপনাকে দেওয়া মিশন" },
  "home.eventsDesc": { en: "Check in with QR", bn: "QR দিয়ে চেক-ইন" },
  "home.mobilizeDesc": { en: "Respond to call-ups", bn: "ডাকে সাড়া দিন" },
  "home.pendingTitle": { en: "Your account is awaiting verification", bn: "আপনার অ্যাকাউন্ট যাচাইয়ের অপেক্ষায়" },
  "home.pendingBody": {
    en: "A district admin will review and approve your membership shortly. Some features unlock once you are verified. You can still set up your profile.",
    bn: "একজন জেলা অ্যাডমিন শীঘ্রই আপনার সদস্যপদ পর্যালোচনা করে অনুমোদন করবেন। যাচাই হলে কিছু সুবিধা চালু হবে। আপনি এখন প্রোফাইল সেট করতে পারেন।",
  },
};

export function t(key: string, locale: Locale): string {
  const e = DICT[key];
  if (!e) return key;
  return e[locale] || e.en;
}
