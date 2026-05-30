import { getMembers } from "@/lib/data";
import MembersBrowser from "@/components/MembersBrowser";

export default function MembersPage() {
  const members = getMembers();
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Members &amp; Digital ID</h1>
        <p className="text-muted mt-1">
          Every member carries a verifiable digital ID with a QR code — scannable
          at rallies, checkpoints, and event entry.
        </p>
      </div>
      <MembersBrowser members={members} />
    </div>
  );
}
