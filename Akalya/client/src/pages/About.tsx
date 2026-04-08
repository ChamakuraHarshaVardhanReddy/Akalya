import { LandingNav } from "@/components/LandingNav";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { GraduationCap, Target, Heart } from "lucide-react";

export default function About() {
  return (
    <div className="min-h-screen bg-background">
      <LandingNav />
      <main className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-2">About Akalya</h1>
        <p className="text-muted-foreground mb-8">
          Rural Student Empowerment Ecosystem — scholarships, exams, jobs, practice and career guidance for students in rural and remote areas.
        </p>
        <div className="grid gap-6 md:grid-cols-3">
          <Card>
            <CardHeader>
              <GraduationCap className="h-10 w-10 text-primary mb-2" />
              <CardTitle>Our mission</CardTitle>
              <CardDescription>
                To make quality information on scholarships, entrance exams, government and skill-based jobs, and preparation resources accessible to every rural student.
              </CardDescription>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader>
              <Target className="h-10 w-10 text-primary mb-2" />
              <CardTitle>What we offer</CardTitle>
              <CardDescription>
                Scholarships with filters and deadlines; national and state entrance exam details; jobs after 10th and 12th; practice tests for classes 6–12; competitive test series; career roadmap generator; and a secure digital locker for certificates.
              </CardDescription>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader>
              <Heart className="h-10 w-10 text-primary mb-2" />
              <CardTitle>For rural education</CardTitle>
              <CardDescription>
                Content and features are designed with rural students in mind: clear eligibility, official links, and step-by-step guidance so that distance and lack of coaching do not hold anyone back.
              </CardDescription>
            </CardHeader>
          </Card>
        </div>
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Contact & support</CardTitle>
            <CardDescription>
              For queries or feedback, use the chatbot on the site or reach out through your institution. We are committed to keeping the platform secure, scalable and easy to use.
            </CardDescription>
          </CardHeader>
        </Card>
      </main>
    </div>
  );
}
