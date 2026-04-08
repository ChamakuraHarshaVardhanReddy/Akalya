import { Link } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Award,
  FileQuestion,
  Briefcase,
  GraduationCap,
  BookOpen,
  ClipboardList,
  Map,
  FolderOpen,
  ArrowRight,
} from "lucide-react";

const base = "/dashboard/student/career-gateway";

const modules = [
  { to: `${base}/scholarships`, label: "Scholarships", description: "Merit and need-based scholarships with eligibility and deadlines.", icon: Award },
  { to: `${base}/entrance-exams`, label: "Entrance Exams", description: "National and state exam details: JEE, NEET, CUET, CLAT and more.", icon: FileQuestion },
  { to: `${base}/jobs-after-10th`, label: "Jobs After 10th", description: "Government and skill-based career options after Class 10.", icon: Briefcase },
  { to: `${base}/jobs-after-12th`, label: "Jobs After 12th", description: "Government and private sector options after Class 12.", icon: Briefcase },
  { to: `${base}/certifications`, label: "Certifications", description: "Government and professional certifications for career growth.", icon: GraduationCap },
  { to: `${base}/practice`, label: "Practice (6–12)", description: "MCQ practice with timer and auto evaluation.", icon: BookOpen },
  { to: `${base}/test-series`, label: "Test Series", description: "Full-length and subject-wise mock tests with score analysis.", icon: ClipboardList },
  { to: `${base}/career-roadmap`, label: "Career Roadmap", description: "Personalised path based on class, interests and financial background.", icon: Map },
  { to: `${base}/preparation-resources`, label: "Preparation Resources", description: "Books, YouTube, previous papers and strategy tips.", icon: BookOpen },
  { to: `${base}/locker`, label: "My Locker", description: "Store and manage your certificates securely (100 MB).", icon: FolderOpen },
];

export default function CareerGatewayHub() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Career Gateway</h1>
        <p className="text-muted-foreground">
          Your hub for scholarships, entrance exams, jobs, practice tests and career planning. Choose a module below.
        </p>
      </div>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {modules.map((m) => (
          <Link key={m.to} to={m.to}>
            <Card className="h-full hover:shadow-md transition-shadow border-border">
              <CardHeader className="pb-2">
                <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center mb-2">
                  <m.icon className="h-5 w-5 text-primary" />
                </div>
                <CardTitle className="text-lg flex items-center justify-between gap-2">
                  {m.label}
                  <ArrowRight className="h-4 w-4 shrink-0 text-muted-foreground" />
                </CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>{m.description}</CardDescription>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
