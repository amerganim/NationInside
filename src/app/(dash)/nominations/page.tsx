import { getConstituencies } from "@/lib/data";
import NominationBoard from "@/components/NominationBoard";

export default function NominationsPage() {
  const constituencies = getConstituencies();
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Nomination Intelligence</h1>
        <p className="text-muted mt-1 max-w-2xl">
          Turn ticket distribution from gut-feel into data. Compare contenders for
          every seat on ground network, activity, events, complaint resolution and
          popularity — and back the candidate most likely to win.
        </p>
      </div>
      <NominationBoard constituencies={constituencies} />
    </div>
  );
}
