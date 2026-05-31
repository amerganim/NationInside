import MobilizeConsole from "@/components/MobilizeConsole";

export default function MobilizePage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">One-Tap Mobilisation</h1>
        <p className="text-muted mt-1 max-w-2xl">
          Turn the organisation tree into action. Select a target, press once, and
          a notification cascades down every tier — while confirmations flow back
          in real time. <span className="text-foreground">Put thousands on the street within hours.</span>
        </p>
      </div>
      <MobilizeConsole />
    </div>
  );
}
