import { Link } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { GraduationCap, BookOpen, ExternalLink } from "lucide-react";

export default function Certifications({ embedded }: { embedded?: boolean }) {
  const content = (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Government & Professional Certifications</h1>
        <p className="text-muted-foreground">
          Information on government and professional certifications that can boost your career after Class 10 or 12.
        </p>
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <GraduationCap className="h-8 w-8 text-primary mb-2" />
            <CardTitle>ITI & NCVT</CardTitle>
            <CardDescription>
              Industrial Training Institute (ITI) and NCVT certificates in trades like Electrician, Fitter, Mechanic, Welder. Recognised for government and private jobs.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <p className="text-sm text-muted-foreground">
              Check your state ITI board for admission and course details. Many courses are available after Class 10.
            </p>
            <a href="https://ncvt.nic.in" target="_blank" rel="noopener noreferrer">
              <Button variant="outline" size="sm" className="gap-1">
                <ExternalLink className="h-3 w-3" />
                Official Website (NCVT)
              </Button>
            </a>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <BookOpen className="h-8 w-8 text-primary mb-2" />
            <CardTitle>Skill India & NSDC</CardTitle>
            <CardDescription>
              Short-term skill certifications through Skill India and NSDC-approved centres. Digital literacy, retail, healthcare and more.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <p className="text-sm text-muted-foreground">
              Visit the Skill India portal for certified courses and placement support.
            </p>
            <a href="https://skillindia.gov.in" target="_blank" rel="noopener noreferrer">
              <Button variant="outline" size="sm" className="gap-1">
                <ExternalLink className="h-3 w-3" />
                Official Website (Skill India)
              </Button>
            </a>
          </CardContent>
        </Card>
      </div>
      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Preparation resources</CardTitle>
          <CardDescription>
            For exam-related certifications (SSC, Banking, Railway, etc.), use Preparation Resources and Entrance Exams in Career Gateway.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Link to="/dashboard/student/career-gateway/preparation-resources">
            <Button variant="outline">Open Preparation Resources</Button>
          </Link>
        </CardContent>
      </Card>
    </div>
  );
}
