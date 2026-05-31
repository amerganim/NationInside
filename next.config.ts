import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    // Keep already-visited pages in the browser's client-side Router Cache.
    // Re-navigating to a page within this window is instant (no skeleton, no
    // refetch). Your own mutations call revalidatePath(), which invalidates the
    // cache, and live screens (mobilisation) use realtime — so this only ever
    // serves slightly-stale OTHER-user data for a short window.
    staleTimes: {
      dynamic: 120, // seconds — dynamic pages (/app/*)
      static: 300,
    },
  },
};

export default nextConfig;
