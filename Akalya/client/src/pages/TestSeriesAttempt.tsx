import { useEffect, useState } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { AppLayout } from "@/components/AppLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/hooks/useAuth";
import { mockTestsAPI } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";
import { Clock, CheckCircle } from "lucide-react";

export default function TestSeriesAttempt() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  const backPath = location.pathname.includes("career-gateway") ? "/dashboard/student/career-gateway/test-series" : "/test-series";
  const { toast } = useToast();
  const [test, setTest] = useState<any>(null);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [timeLeft, setTimeLeft] = useState(0);
  const [submitted, setSubmitted] = useState<any>(null);

  useEffect(() => {
    if (!id || !user) return;
    mockTestsAPI.getById(id).then(setTest).catch(() => setTest(null));
  }, [id, user]);

  useEffect(() => {
    if (!test?.durationMinutes) return;
    setTimeLeft(test.durationMinutes * 60);
  }, [test]);

  useEffect(() => {
    if (submitted || timeLeft <= 0) return;
    const t = setInterval(() => setTimeLeft((s) => Math.max(0, s - 1)), 1000);
    return () => clearInterval(t);
  }, [submitted, timeLeft]);

  const handleSubmit = async () => {
    if (!test || !user) return;
    const answerList = (test.questions || []).map((q: any) => ({
      questionId: q.id || q._id,
      selectedIndex: answers[q.id || q._id] ?? -1,
    }));
    try {
      const result = await mockTestsAPI.submit({
        mockTestId: test._id || test.id,
        answers: answerList,
        timeSpentSeconds: (test.durationMinutes || 0) * 60 - timeLeft,
      });
      setSubmitted(result);
    } catch (e: any) {
      toast({ title: "Error", description: e?.message || "Submit failed" });
    }
  };

  if (!user) {
    navigate("/auth");
    return null;
  }
  if (!test) return <AppLayout><div className="container py-8">Loading...</div></AppLayout>;

  const questions = test.questions || [];

  return (
    <AppLayout>
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold">{test.title}</h1>
          {!submitted && (
            <span className="flex items-center gap-2 font-mono">
              <Clock className="h-4 w-4" />
              {Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, "0")}
            </span>
          )}
        </div>
        {!submitted ? (
          <Card>
            <CardContent className="pt-6 space-y-6">
              {questions.map((q, i) => (
                <div key={q.id || q._id} className="space-y-2">
                  <p className="font-medium">Q{i + 1}. {q.question}</p>
                  <RadioGroup
                    value={String(answers[q.id || q._id] ?? "")}
                    onValueChange={(v) => setAnswers((prev) => ({ ...prev, [q.id || q._id]: parseInt(v, 10) }))}
                  >
                    {(q.options || []).map((opt: string, idx: number) => (
                      <div key={idx} className="flex items-center space-x-2">
                        <RadioGroupItem value={String(idx)} id={`t-${q.id}-${idx}`} />
                        <Label htmlFor={`t-${q.id}-${idx}`}>{opt}</Label>
                      </div>
                    ))}
                  </RadioGroup>
                </div>
              ))}
              <Button onClick={handleSubmit} className="w-full">Submit test</Button>
            </CardContent>
          </Card>
        ) : (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2"><CheckCircle className="h-5 w-5 text-green-600" /> Result</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <p>Score: <strong>{submitted.score}</strong> / {submitted.totalMarks}</p>
              {submitted.weakTopics?.length > 0 && <p>Weak topics: {submitted.weakTopics.join(", ")}</p>}
              {submitted.improvementSuggestions && <p className="text-muted-foreground">{submitted.improvementSuggestions}</p>}
              <Button variant="outline" onClick={() => navigate(backPath)}>Back to tests</Button>
            </CardContent>
          </Card>
        )}
      </div>
    </AppLayout>
  );
}
