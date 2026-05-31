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

Object.assign(DICT, {
  // Common
  "common.cancel": { en: "Cancel", bn: "বাতিল" },
  "common.submit": { en: "Submit", bn: "জমা দিন" },
  "common.download": { en: "Download", bn: "ডাউনলোড" },

  // Notices
  "notices.title": { en: "Notices", bn: "নোটিশ" },
  "notices.subtitle": { en: "Official announcements from party leadership.", bn: "দলীয় নেতৃত্বের অফিসিয়াল ঘোষণা।" },
  "notices.empty": { en: "No notices yet.", bn: "এখনও কোনো নোটিশ নেই।" },
  "notices.new": { en: "New notice", bn: "নতুন নোটিশ" },
  "notices.pinned": { en: "Pinned", bn: "পিন করা" },

  // Tasks
  "tasks.title": { en: "Tasks & Missions", bn: "কাজ ও মিশন" },
  "tasks.subtitle": { en: "Accept missions, complete them with geo-tagged proof, and earn points.", bn: "মিশন গ্রহণ করুন, জিও-ট্যাগ প্রমাণসহ সম্পন্ন করুন এবং পয়েন্ট অর্জন করুন।" },
  "tasks.empty": { en: "No tasks yet.", bn: "এখনও কোনো কাজ নেই।" },
  "tasks.new": { en: "New task", bn: "নতুন কাজ" },
  "tasks.accept": { en: "Accept mission", bn: "মিশন গ্রহণ করুন" },
  "tasks.submitProof": { en: "Submit proof", bn: "প্রমাণ জমা দিন" },
  "tasks.reviewQueue": { en: "Submissions to review", bn: "যাচাইয়ের জন্য জমা" },
  "tasks.verifyTake": { en: "Verify your membership to take tasks.", bn: "কাজ নিতে সদস্যপদ যাচাই করুন।" },
  "tasks.describe": { en: "Describe what you did…", bn: "আপনি যা করেছেন তা লিখুন…" },
  "tasks.attachPhoto": { en: "Attach photo (optional)", bn: "ছবি যুক্ত করুন (ঐচ্ছিক)" },
  "tasks.locationNote": { en: "Your location is captured on submit", bn: "জমা দেওয়ার সময় আপনার অবস্থান নেওয়া হবে" },
  "status.accepted": { en: "Accepted", bn: "গৃহীত" },
  "status.in_progress": { en: "In progress", bn: "চলমান" },
  "status.submitted": { en: "Awaiting review", bn: "যাচাইয়ের অপেক্ষায়" },
  "status.approved": { en: "Approved", bn: "অনুমোদিত" },
  "status.rejected": { en: "Rejected", bn: "প্রত্যাখ্যাত" },

  // Events
  "events.title": { en: "Events", bn: "অনুষ্ঠান" },
  "events.subtitle": { en: "Rallies and meetings — check in to record your attendance.", bn: "সমাবেশ ও সভা — উপস্থিতি রেকর্ড করতে চেক-ইন করুন।" },
  "events.empty": { en: "No events yet.", bn: "এখনও কোনো অনুষ্ঠান নেই।" },
  "events.new": { en: "New event", bn: "নতুন অনুষ্ঠান" },
  "events.checkin": { en: "Check in", bn: "চেক-ইন" },
  "events.checkedIn": { en: "Checked in", bn: "চেক-ইন হয়েছে" },
  "events.recorded": { en: "Attendance recorded", bn: "উপস্থিতি রেকর্ড হয়েছে" },
  "events.checkedInCount": { en: "checked in", bn: "চেক-ইন" },
  "events.expected": { en: "expected", bn: "প্রত্যাশিত" },

  // Mobilise
  "mobilize.title": { en: "Mobilisation", bn: "সমাবেশ" },
  "mobilize.subtitle": { en: "Respond to call-ups in one tap — responses update live for everyone.", bn: "এক ট্যাপে ডাকে সাড়া দিন — সবার জন্য লাইভ আপডেট হয়।" },
  "mobilize.empty": { en: "No active call-ups.", bn: "কোনো সক্রিয় ডাক নেই।" },
  "mobilize.new": { en: "New call-up", bn: "নতুন ডাক" },
  "mobilize.coming": { en: "I'm coming", bn: "আসছি" },
  "mobilize.enroute": { en: "En route", bn: "পথে আছি" },
  "mobilize.cant": { en: "Can't make it", bn: "পারছি না" },
  "mobilize.statComing": { en: "Coming", bn: "আসছে" },
  "mobilize.statEnroute": { en: "En route", bn: "পথে" },
  "mobilize.statResponded": { en: "Responded", bn: "সাড়া দিয়েছে" },
  "mobilize.verifyRespond": { en: "Verify your membership to respond.", bn: "সাড়া দিতে সদস্যপদ যাচাই করুন।" },

  // Complaints
  "complaints.title": { en: "Community Complaints", bn: "কমিউনিটি অভিযোগ" },
  "complaints.subtitle": { en: "Report local issues with a photo and location — and track them to resolution.", bn: "ছবি ও অবস্থানসহ স্থানীয় সমস্যা জানান — সমাধান পর্যন্ত ট্র্যাক করুন।" },
  "complaints.empty": { en: "No complaints yet.", bn: "এখনও কোনো অভিযোগ নেই।" },
  "complaints.report": { en: "Report an issue", bn: "সমস্যা জানান" },
  "complaints.you": { en: "You", bn: "আপনি" },
  "cstatus.submitted": { en: "Submitted", bn: "জমা হয়েছে" },
  "cstatus.assigned": { en: "Assigned", bn: "বরাদ্দকৃত" },
  "cstatus.in_progress": { en: "In Progress", bn: "চলমান" },
  "cstatus.solved": { en: "Solved", bn: "সমাধান হয়েছে" },
  "cstatus.rejected": { en: "Rejected", bn: "প্রত্যাখ্যাত" },

  // Documents
  "documents.title": { en: "Documents", bn: "নথিপত্র" },
  "documents.subtitle": { en: "Party constitution, circulars and official files.", bn: "দলীয় গঠনতন্ত্র, সার্কুলার ও অফিসিয়াল ফাইল।" },
  "documents.empty": { en: "No documents yet.", bn: "এখনও কোনো নথি নেই।" },
  "documents.upload": { en: "Upload document", bn: "নথি আপলোড" },

  // Profile
  "profile.title": { en: "Edit Profile", bn: "প্রোফাইল সম্পাদনা" },
  "profile.subtitle": { en: "Your name, photo and contact details. Your designation and committee are set by your admin.", bn: "আপনার নাম, ছবি ও যোগাযোগের তথ্য। পদবি ও কমিটি অ্যাডমিন নির্ধারণ করেন।" },
  "profile.back": { en: "Back", bn: "ফিরে যান" },
  "profile.fullName": { en: "Full name", bn: "পূর্ণ নাম" },
  "profile.nameBn": { en: "Name in Bangla", bn: "বাংলায় নাম" },
  "profile.phone": { en: "Phone", bn: "ফোন" },
  "profile.save": { en: "Save changes", bn: "পরিবর্তন সংরক্ষণ" },
  "profile.saved": { en: "Saved", bn: "সংরক্ষিত" },
  "profile.photoHint": { en: "Tap the camera to set your profile photo. It appears on your Digital ID.", bn: "প্রোফাইল ছবি সেট করতে ক্যামেরায় ট্যাপ করুন। এটি আপনার ডিজিটাল আইডিতে দেখাবে।" },
  "profile.notifications": { en: "Notifications", bn: "বিজ্ঞপ্তি" },
  "profile.notificationsSub": { en: "Get push alerts for notices and mobilisation call-ups", bn: "নোটিশ ও সমাবেশের ডাকে পুশ অ্যালার্ট পান" },
  "notif.enable": { en: "Enable notifications", bn: "বিজ্ঞপ্তি চালু করুন" },
  "notif.on": { en: "Notifications are on", bn: "বিজ্ঞপ্তি চালু আছে" },
  "notif.blocked": { en: "Notifications blocked — enable them in your browser settings.", bn: "বিজ্ঞপ্তি ব্লক করা — ব্রাউজার সেটিংসে চালু করুন।" },

  // Admin pages
  "insights.title": { en: "Leader Dashboard", bn: "নেতৃত্ব ড্যাশবোর্ড" },
  "insights.subtitle": { en: "Live organisational intelligence — computed from real member activity.", bn: "লাইভ সাংগঠনিক বুদ্ধিমত্তা — বাস্তব সদস্য কার্যকলাপ থেকে।" },
  "search.title": { en: "Smart Search", bn: "স্মার্ট অনুসন্ধান" },
  "search.subtitle": { en: "Ask in plain language — e.g. “inactive members in Gazipur”.", bn: "সহজ ভাষায় জিজ্ঞাসা করুন — যেমন “গাজীপুরে নিষ্ক্রিয় সদস্য”।" },
  "search.placeholder": { en: "Search members by district, status, role…", bn: "জেলা, স্ট্যাটাস, ভূমিকা দিয়ে সদস্য খুঁজুন…" },
  "admin.title": { en: "Admin · Member Verification", bn: "অ্যাডমিন · সদস্য যাচাই" },
  "admin.subtitle": { en: "Approve new members and manage the roster.", bn: "নতুন সদস্য অনুমোদন করুন এবং তালিকা পরিচালনা করুন।" },

  // Shared form fields
  "form.title": { en: "Title", bn: "শিরোনাম" },
  "form.description": { en: "Description", bn: "বিবরণ" },
  "form.committee": { en: "Committee", bn: "কমিটি" },
  "form.national": { en: "National", bn: "জাতীয়" },
  "form.category": { en: "Category", bn: "বিভাগ" },
  "form.points": { en: "Points", bn: "পয়েন্ট" },
  "form.dueDate": { en: "Due date", bn: "শেষ তারিখ" },
  "form.dateTime": { en: "Date & time", bn: "তারিখ ও সময়" },
  "form.expectedAttendance": { en: "Expected attendance", bn: "প্রত্যাশিত উপস্থিতি" },
  "form.location": { en: "Location", bn: "অবস্থান" },
  "form.message": { en: "Message", bn: "বার্তা" },
  "form.audience": { en: "Audience", bn: "শ্রোতা" },
  "form.nationalEveryone": { en: "National (everyone)", bn: "জাতীয় (সবাই)" },
  "form.pinTop": { en: "Pin to top", bn: "উপরে পিন করুন" },
  "form.chooseFile": { en: "Choose file (PDF, image, doc…)", bn: "ফাইল বাছুন (PDF, ছবি, ডক…)" },
  "form.creating": { en: "Creating…", bn: "তৈরি হচ্ছে…" },

  // Event form
  "eventForm.heading": { en: "Create event", bn: "অনুষ্ঠান তৈরি করুন" },
  // Task form
  "taskForm.heading": { en: "Create task / mission", bn: "কাজ / মিশন তৈরি করুন" },
  "taskForm.submit": { en: "Create task", bn: "কাজ তৈরি করুন" },
  // Mobilise form
  "mobForm.heading": { en: "Issue a mobilisation", bn: "সমাবেশের ডাক দিন" },
  "mobForm.target": { en: "Target committee", bn: "লক্ষ্য কমিটি" },
  "mobForm.submit": { en: "Issue call-up", bn: "ডাক দিন" },
  "mobForm.sending": { en: "Sending…", bn: "পাঠানো হচ্ছে…" },
  // Notice form
  "noticeForm.heading": { en: "Post a notice", bn: "নোটিশ পোস্ট করুন" },
  "noticeForm.submit": { en: "Post notice", bn: "নোটিশ পোস্ট করুন" },
  "noticeForm.posting": { en: "Posting…", bn: "পোস্ট হচ্ছে…" },
  // Document form
  "docForm.heading": { en: "Upload a document", bn: "নথি আপলোড করুন" },
  "docForm.publish": { en: "Publish", bn: "প্রকাশ করুন" },
  "docForm.uploading": { en: "Uploading…", bn: "আপলোড হচ্ছে…" },

  // Verify Members (admin)
  "verify.pending": { en: "Pending Verification", bn: "যাচাইয়ের অপেক্ষায়" },
  "verify.pendingSub": { en: "Assign a committee and approve", bn: "কমিটি নির্ধারণ করে অনুমোদন করুন" },
  "verify.active": { en: "Active Members", bn: "সক্রিয় সদস্য" },
  "verify.activeSub": { en: "Top of the roster by activity score", bn: "কার্যকলাপ স্কোর অনুযায়ী শীর্ষ তালিকা" },
  "verify.approve": { en: "Approve", bn: "অনুমোদন" },
  "verify.selectDistrict": { en: "Select district…", bn: "জেলা নির্বাচন করুন…" },
  "verify.designation": { en: "Designation", bn: "পদবি" },
  "verify.noPending": { en: "No members awaiting approval. 🎉", bn: "অনুমোদনের অপেক্ষায় কোনো সদস্য নেই। 🎉" },
  "verify.noActive": { en: "No active members yet.", bn: "এখনও কোনো সক্রিয় সদস্য নেই।" },
  "verify.pendingBadge": { en: "pending", bn: "অপেক্ষমাণ" },

  // Landing
  "landing.viewDemo": { en: "View demo", bn: "ডেমো দেখুন" },
  "landing.login": { en: "Login", bn: "লগইন" },
  "landing.register": { en: "Register", bn: "নিবন্ধন" },
  "landing.badge": { en: "Secure · members verified by your admins", bn: "নিরাপদ · সদস্য আপনার অ্যাডমিন দ্বারা যাচাইকৃত" },
  "landing.h1a": { en: "Your party,", bn: "আপনার দল," },
  "landing.h1b": { en: "organised and mobilised.", bn: "সংগঠিত ও সক্রিয়।" },
  "landing.subtitle": { en: "A digital operating system for political organisations — membership, events, missions, scoring and real-time mobilisation, all in one place.", bn: "রাজনৈতিক সংগঠনের জন্য একটি ডিজিটাল অপারেটিং সিস্টেম — সদস্যপদ, অনুষ্ঠান, মিশন, স্কোরিং এবং রিয়েল-টাইম সমাবেশ, সবকিছু এক জায়গায়।" },
  "landing.becomeMember": { en: "Become a member", bn: "সদস্য হোন" },
  "landing.memberLogin": { en: "Member login", bn: "সদস্য লগইন" },
  "landing.exploreDemo": { en: "Or explore the interactive demo →", bn: "অথবা ইন্টারেক্টিভ ডেমো দেখুন →" },
  "landing.footer": { en: "Nation Inside · Party Operating System · built for Bangladesh", bn: "Nation Inside · পার্টি অপারেটিং সিস্টেম · বাংলাদেশের জন্য নির্মিত" },
  "feat.id.t": { en: "Digital Member ID", bn: "ডিজিটাল সদস্য আইডি" },
  "feat.id.d": { en: "Every member carries a verifiable QR ID, approved by your committee admins.", bn: "প্রত্যেক সদস্যের যাচাইযোগ্য QR আইডি, কমিটি অ্যাডমিন অনুমোদিত।" },
  "feat.events.t": { en: "Events & Attendance", bn: "অনুষ্ঠান ও উপস্থিতি" },
  "feat.events.d": { en: "Create rallies and meetings; members check in with a QR scan.", bn: "সমাবেশ ও সভা তৈরি করুন; সদস্যরা QR স্ক্যানে চেক-ইন করেন।" },
  "feat.missions.t": { en: "Missions & Scoring", bn: "মিশন ও স্কোরিং" },
  "feat.missions.d": { en: "Assign tasks, collect geo-tagged proof, and reward real activity.", bn: "কাজ বরাদ্দ করুন, জিও-ট্যাগ প্রমাণ সংগ্রহ করুন এবং প্রকৃত কার্যকলাপ পুরস্কৃত করুন।" },
  "feat.mobilize.t": { en: "Live Mobilisation", bn: "লাইভ সমাবেশ" },
  "feat.mobilize.d": { en: "Issue a call-up; watch members respond in real time.", bn: "ডাক দিন; সদস্যদের রিয়েল-টাইম সাড়া দেখুন।" },
  "feat.dashboard.t": { en: "Leader Dashboard", bn: "নেতৃত্ব ড্যাশবোর্ড" },
  "feat.dashboard.d": { en: "Live intelligence on membership, activity and reach.", bn: "সদস্যপদ, কার্যকলাপ ও পরিধির লাইভ বুদ্ধিমত্তা।" },
  "feat.tree.t": { en: "Organisation Tree", bn: "সংগঠন কাঠামো" },
  "feat.tree.d": { en: "Your full structure — national down to ward — in one place.", bn: "জাতীয় থেকে ওয়ার্ড পর্যন্ত আপনার পূর্ণ কাঠামো এক জায়গায়।" },
});

export function t(key: string, locale: Locale): string {
  const e = DICT[key];
  if (!e) return key;
  return e[locale] || e.en;
}
