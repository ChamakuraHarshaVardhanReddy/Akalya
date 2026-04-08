import { useState } from "react";
import { AppLayout } from "@/components/AppLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Map, GraduationCap, BookOpen, Award, Briefcase } from "lucide-react";

const CLASS_OPTIONS = [6, 7, 8, 9, 10, 11, 12].map((c) => ({ value: String(c), label: `Class ${c}` }));
const INTERESTS = [
  { value: "science", label: "Science (PCM/PCB)" },
  { value: "commerce", label: "Commerce" },
  { value: "arts", label: "Arts / Humanities" },
  { value: "vocational", label: "Vocational / ITI" },
  { value: "undecided", label: "Not sure yet" },
];
const FINANCE = [
  { value: "low", label: "Need financial support" },
  { value: "medium", label: "Some support possible" },
  { value: "high", label: "Can afford coaching / degree" },
];

export default function CareerRoadmap({ embedded }: { embedded?: boolean }) {
  const [currentClass, setCurrentClass] = useState<string>("10");
  const [interest, setInterest] = useState<string>("");
  const [finance, setFinance] = useState<string>("");
  const [generated, setGenerated] = useState(false);

  const handleGenerate = () => setGenerated(true);

  const content = (
    <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Career Roadmap Generator</h1>
          <p className="text-muted-foreground">
            Select your current class, interests and financial background. Get a suggested academic path, entrance exams, skill development and scholarship ideas.
          </p>
        </div>
        <div className="grid lg:grid-cols-3 gap-8">
          <Card className="lg:col-span-1">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Map className="h-5 w-5" />
                Your choices
              </CardTitle>
              <CardDescription>We use these to suggest a roadmap.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Current class</Label>
                <Select value={currentClass} onValueChange={setCurrentClass}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {CLASS_OPTIONS.map((o) => (
                      <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Interests</Label>
                <Select value={interest} onValueChange={setInterest}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select" />
                  </SelectTrigger>
                  <SelectContent>
                    {INTERESTS.map((o) => (
                      <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Financial background</Label>
                <Select value={finance} onValueChange={setFinance}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select" />
                  </SelectTrigger>
                  <SelectContent>
                    {FINANCE.map((o) => (
                      <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <Button onClick={handleGenerate} className="w-full">Generate roadmap</Button>
            </CardContent>
          </Card>
          <div className="lg:col-span-2 space-y-4">
            {generated ? (
              <>
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <GraduationCap className="h-5 w-5" />
                      Academic path
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2 text-muted-foreground">
                    <p>Complete Class {currentClass} with strong focus on board syllabus. For Class 11–12, choose stream based on interest: Science (JEE/NEET), Commerce (CA/CS), or Arts (CLAT/humanities). Use free NCERT and state board resources.</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <BookOpen className="h-5 w-5" />
                      Entrance exams to plan for
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2 text-muted-foreground">
                    <p>After 12th: JEE Main, NEET, CUET, CLAT, or state CETs depending on stream. Start basic preparation in Class 11; focus on NCERT and previous papers. Check exam dates on official NTA/state sites.</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Award className="h-5 w-5" />
                      Scholarship suggestions
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2 text-muted-foreground">
                    <p>{finance === "low" ? "Apply for National Scholarship Portal (NSP), state merit-cum-means, and caste/category scholarships. Check Scholarships section on Akalya for deadlines and eligibility." : "Merit scholarships and partial fee waivers are available; explore NSP and university-specific schemes."}</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Briefcase className="h-5 w-5" />
                      Skill development & timeline
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2 text-muted-foreground">
                    <p>Class 10–12: Focus on board exams and basic exam pattern (MCQ practice). After 12th: Enrol in degree or ITI as per interest; use free YouTube and government skill portals (e.g. Skill India) for certifications. Revisit roadmap each year and adjust based on results.</p>
                  </CardContent>
                </Card>
              </>
            ) : (
              <Card>
                <CardContent className="py-12 text-center text-muted-foreground">
                  Select your class, interests and financial background, then click &quot;Generate roadmap&quot; to see your personalised academic path, exam suggestions and scholarship tips.
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
  );
  if (embedded) return content;
  return <AppLayout>{content}</AppLayout>;
}
