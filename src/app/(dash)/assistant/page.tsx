import AssistantChat from "@/components/AssistantChat";

export default function AssistantPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">AI Assistant</h1>
        <p className="text-muted mt-1 max-w-2xl">
          Ask questions in plain language and get instant answers from your party
          data — inactive districts, top volunteers, strategic recommendations, even
          draft speeches. <span className="text-foreground">A glimpse of the AI-powered Party OS.</span>
        </p>
      </div>
      <AssistantChat />
    </div>
  );
}
