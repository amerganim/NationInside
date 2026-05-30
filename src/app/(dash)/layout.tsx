import Sidebar from "@/components/Sidebar";
import { LiveDot } from "@/components/ui";

export default function DashLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex">
      <Sidebar />
      <div className="flex-1 min-w-0">
        <header className="sticky top-0 z-20 glass px-5 md:px-8 py-3 flex items-center justify-between border-b border-border">
          <div className="flex items-center gap-3">
            <span className="md:hidden font-bold">NationInside</span>
            <span className="hidden md:inline text-sm text-muted">
              Bangladesh · National Organisation
            </span>
          </div>
          <div className="flex items-center gap-4">
            <LiveDot label="LIVE · synced just now" />
            <div className="hidden sm:flex items-center gap-2 text-sm">
              <div className="w-8 h-8 rounded-full grid place-items-center text-white text-xs font-semibold"
                style={{ background: "linear-gradient(135deg,#2f80ed,#16c784)" }}>
                GA
              </div>
              <span className="text-muted">General Secretary</span>
            </div>
          </div>
        </header>
        <main className="px-5 md:px-8 py-6 max-w-[1400px] mx-auto">{children}</main>
      </div>
    </div>
  );
}
