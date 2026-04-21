import { useMemo, useState } from "react";
import { Bot, MessageSquare, Send } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

type ChatMessage = { role: "user" | "bot"; text: string };

const WEBSITE_SCOPE_NOTE =
  "I can help only with Akalya website features like scholarships, entrance exams, courses, assignments, practice, test series, locker, and dashboard navigation.";

function getWebsiteReply(query: string): string {
  const q = query.toLowerCase();
  if (!q.trim()) return "Please type your question.";

  if (q.includes("scholarship")) {
    return "Open Career Gateway -> Scholarships from your student dashboard to see eligibility and deadline details.";
  }
  if (q.includes("entrance") || q.includes("exam")) {
    return "Open Career Gateway -> Entrance Exams to view exam info pages and details.";
  }
  if (q.includes("assignment")) {
    return "Go to Student Dashboard -> Assignments to view pending tasks and submit your work.";
  }
  if (q.includes("course") || q.includes("enroll")) {
    return "Use Student Dashboard -> Explore to enroll in courses, then check My Courses to continue learning.";
  }
  if (q.includes("practice") || q.includes("mock") || q.includes("test series")) {
    return "Use Career Gateway -> Practice or Test Series for MCQs, timed tests, and score review.";
  }
  if (q.includes("locker") || q.includes("certificate")) {
    return "Use Career Gateway -> My Locker to upload and manage certificates securely.";
  }
  if (q.includes("login") || q.includes("sign in") || q.includes("auth")) {
    return "Use the Login page to sign in, then open your student dashboard for all features.";
  }
  if (q.includes("career roadmap") || q.includes("roadmap") || q.includes("job")) {
    return "Use Career Gateway -> Career Roadmap for guidance and Jobs modules for post-10th/post-12th options.";
  }
  if (q.includes("contact") || q.includes("support")) {
    return "For support, open the Contact page from the website navigation.";
  }

  return WEBSITE_SCOPE_NOTE;
}

export function StudentWebsiteChatbot() {
  const [messages, setMessages] = useState<ChatMessage[]>([
    { role: "bot", text: "Hi! Ask me about Akalya website features and navigation." },
  ]);
  const [input, setInput] = useState("");

  const canSend = useMemo(() => input.trim().length > 0, [input]);

  const sendMessage = () => {
    const text = input.trim();
    if (!text) return;

    const reply = getWebsiteReply(text);
    setMessages((prev) => [...prev, { role: "user", text }, { role: "bot", text: reply }]);
    setInput("");
  };

  return (
    <Card className="mt-6">
      <CardHeader className="pb-3">
        <CardTitle className="text-base flex items-center gap-2">
          <MessageSquare className="h-4 w-4" />
          Student Help Bot
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="max-h-56 overflow-y-auto space-y-2 rounded-md border p-3 bg-muted/30">
          {messages.map((msg, index) => (
            <div key={`${msg.role}-${index}`} className={msg.role === "user" ? "text-right" : "text-left"}>
              <span
                className={`inline-flex max-w-[90%] rounded-lg px-3 py-2 text-sm ${
                  msg.role === "user" ? "bg-primary text-primary-foreground" : "bg-background border"
                }`}
              >
                {msg.role === "bot" && <Bot className="h-3.5 w-3.5 mr-1 mt-0.5 shrink-0" />}
                {msg.text}
              </span>
            </div>
          ))}
        </div>
        <form
          className="flex gap-2"
          onSubmit={(e) => {
            e.preventDefault();
            sendMessage();
          }}
        >
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask about this website..."
          />
          <Button type="submit" size="icon" disabled={!canSend} aria-label="Send message">
            <Send className="h-4 w-4" />
          </Button>
        </form>
        <p className="text-xs text-muted-foreground">{WEBSITE_SCOPE_NOTE}</p>
      </CardContent>
    </Card>
  );
}
