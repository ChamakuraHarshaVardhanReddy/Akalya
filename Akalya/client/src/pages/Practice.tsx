import { useEffect, useState } from "react";
import { AppLayout } from "@/components/AppLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/hooks/useAuth";
import { practiceAPI } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";
import { BookOpen, Clock, CheckCircle, XCircle } from "lucide-react";

const CLASSES = [6, 7, 8, 9, 10, 11, 12];
const SUBJECTS = ["Mathematics", "Science", "Social Studies", "English", "Physics", "Chemistry", "Biology"];

export default function Practice({ embedded }: { embedded?: boolean }) {
  const { user } = useAuth();
  const { toast } = useToast();
  const [classLevel, setClassLevel] = useState<number>(10);
  const [subject, setSubject] = useState<string>("Mathematics");
  const [questions, setQuestions] = useState<any[]>([]);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(false);
  const [started, setStarted] = useState(false);
  const [timeSeconds, setTimeSeconds] = useState(0);
  const [submitted, setSubmitted] = useState<any>(null);
  const [history, setHistory] = useState<any[]>([]);

  useEffect(() => {
    if (!user) return;
    practiceAPI.getMyHistory().then((data) => setHistory(Array.isArray(data) ? data : [])).catch(() => {});
  }, [user]);

  const startPractice = async () => {
    setLoading(true);
    setQuestions([]);
    setAnswers({});
    setSubmitted(null);
    setTimeSeconds(0);
    setStarted(false);
    try {
      const data = await practiceAPI.getQuestions(classLevel, subject, 10);
      setQuestions(Array.isArray(data) ? data : []);
      setStarted(true);
    } catch (e: any) {
      toast({ title: "Error", description: e?.message || "Failed to load questions" });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!started || submitted || questions.length === 0) return;
    const t = setInterval(() => setTimeSeconds((s) => s + 1), 1000);
    return () => clearInterval(t);
  }, [started, submitted, questions.length]);

  const handleSubmit = async () => {
    if (!user) {
      toast({ title: "Login required", description: "Sign in to save your attempt." });
      return;
    }
    const answerList = questions.map((q) => ({
      questionId: q.id || q._id,
      selectedIndex: answers[q.id || q._id] ?? -1,
    }));
    try {
      const result = await practiceAPI.submit({
        answers: answerList,
        timeSpentSeconds: timeSeconds,
        classLevel,
        subject,
      });
      setSubmitted(result);
    } catch (e: any) {
      toast({ title: "Error", description: e?.message || "Submit failed" });
    }
  };

  if (!user) {
    const msg = (
      <div className="container mx-auto px-4 py-8">
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-muted-foreground">Please log in as a student to attempt practice tests and save your performance history.</p>
          </CardContent>
        </Card>
      </div>
    );
    if (embedded) return msg;
    return <AppLayout>{msg}</AppLayout>;
  }

  const content = (
    <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-2">Practice (Class 6–12)</h1>
        <p className="text-muted-foreground mb-6">MCQ-based practice with timer and auto evaluation. Your attempts are saved.</p>

        {!started && !submitted && (
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2"><BookOpen className="h-5 w-5" /> Start practice</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-wrap gap-4 items-end">
              <div className="space-y-2">
                <Label>Class</Label>
                <Select value={String(classLevel)} onValueChange={(v) => setClassLevel(parseInt(v, 10))}>
                  <SelectTrigger className="w-32">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {CLASSES.map((c) => (
                      <SelectItem key={c} value={String(c)}>Class {c}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Subject</Label>
                <Select value={subject} onValueChange={setSubject}>
                  <SelectTrigger className="w-44">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {SUBJECTS.map((s) => (
                      <SelectItem key={s} value={s}>{s}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <Button onClick={startPractice} disabled={loading}>{loading ? "Loading..." : "Start 10 questions"}</Button>
            </CardContent>
          </Card>
        )}

        {started && questions.length > 0 && !submitted && (
          <Card className="mb-6">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between mb-4">
                <span className="flex items-center gap-2 text-muted-foreground">
                  <Clock className="h-4 w-4" /> {Math.floor(timeSeconds / 60)}:{(timeSeconds % 60).toString().padStart(2, "0")}
                </span>
                <Button onClick={handleSubmit}>Submit</Button>
              </div>
              <div className="space-y-6">
                {questions.map((q, i) => (
                  <div key={q.id || q._id} className="space-y-2">
                    <p className="font-medium">Q{i + 1}. {q.question}</p>
                    <RadioGroup
                      value={String(answers[q.id || q._id] ?? "")}
                      onValueChange={(v) => setAnswers((prev) => ({ ...prev, [q.id || q._id]: parseInt(v, 10) }))}
                    >
                      {(q.options || []).map((opt: string, idx: number) => (
                        <div key={idx} className="flex items-center space-x-2">
                          <RadioGroupItem value={String(idx)} id={`q-${q.id}-${idx}`} />
                          <Label htmlFor={`q-${q.id}-${idx}`}>{opt}</Label>
                        </div>
                      ))}
                    </RadioGroup>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {submitted && (
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-green-600" />
                Result
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <p>Score: <strong>{submitted.correctCount}</strong> / {submitted.total}</p>
              <p>Time: {Math.floor((submitted.timeSpentSeconds || timeSeconds) / 60)} min</p>
              <Button variant="outline" onClick={() => { setSubmitted(null); setStarted(false); }}>Try again</Button>
            </CardContent>
          </Card>
        )}

        {history.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Recent attempts</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm text-muted-foreground">
                {history.slice(0, 10).map((h) => (
                  <li key={h._id}>
                    Class {h.classLevel} – {h.subject}: {h.correctCount}/{h.totalQuestions} in {Math.floor(h.timeSpentSeconds / 60)} min
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        )}
      </div>
  );
  if (embedded) return content;
  return <AppLayout>{content}</AppLayout>;
}
