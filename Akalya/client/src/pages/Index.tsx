import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Video,
  Award,
  FileQuestion,
  BookOpen,
  ClipboardList,
  Users,
  FolderOpen,
  ArrowRight,
  Sparkles,
} from "lucide-react";
import heroImage from "@/assets/hero-education.jpg";
import FeatureShowcase from "@/components/FeatureShowcase";
import { LandingNav } from "@/components/LandingNav";
import { useAuth } from "@/hooks/useAuth";

const Index = () => {
  const { user, getUserRole } = useAuth();
  const navigate = useNavigate();

  const handleFeatureClick = () => {
    if (!user) {
      navigate("/auth");
      return;
    }
    getUserRole?.()
      .then((r) => {
        if (r === "student") navigate("/dashboard/student/career-gateway");
        else navigate("/auth");
      })
      .catch(() => navigate("/auth"));
  };

  const features = [
    { icon: Award, title: "Explore Scholarships", description: "Discover merit and need-based scholarships with eligibility and deadline filters. Access from your dashboard after login." },
    { icon: FileQuestion, title: "Prepare for Entrance Exams", description: "National and state exam details: JEE, NEET, CUET, CLAT and state CETs. Syllabus, dates and official links." },
    { icon: Users, title: "Discover Career Opportunities", description: "Jobs after 10th and 12th — government and private. Eligibility, salary ranges and application links." },
    { icon: BookOpen, title: "Practice & Mock Tests", description: "MCQ practice for classes 6–12 and full-length test series with timer and score analysis. Available in Career Gateway." },
    { icon: FolderOpen, title: "Digital Certificate Locker", description: "Store and manage your certificates securely. Upload, rename and download from your student dashboard." },
    { icon: Video, title: "Live & Recorded Classes", description: "Attend live sessions or access recorded lectures with subtitles. Enrol in courses from your dashboard." },
  ];

  const steps = [
    { number: "01", title: "Register", description: "Create your account as a Student, Teacher or Admin in seconds." },
    { number: "02", title: "Log in", description: "Access your dashboard and the Career Gateway for scholarships, exams and jobs." },
    { number: "03", title: "Learn & Grow", description: "Enrol in courses, attempt practice tests and plan your career with our tools." },
  ];

  return (
    <div className="min-h-screen bg-background">
      <LandingNav />
      {/* Hero */}
      <section className="relative overflow-hidden py-16 sm:py-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full text-primary text-sm font-medium">
                <Sparkles className="h-4 w-4" />
                Rural Education Platform
              </div>
              <h1 className="text-4xl sm:text-5xl font-bold leading-tight">
                Empowering Rural Education through{" "}
                <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                  Smart Learning
                </span>
              </h1>
              <p className="text-lg text-muted-foreground max-w-xl">
                Quality learning, scholarships, entrance exams and career guidance — in one place for rural students.
              </p>
              <div className="flex flex-wrap gap-4">
                <Button size="lg" className="group" onClick={() => navigate("/auth")}>
                  Get Started
                  <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </Button>
                <Link to="/about">
                  <Button size="lg" variant="outline">About Us</Button>
                </Link>
              </div>
            </div>
            <div className="relative">
              <img
                src={heroImage}
                alt="Students learning"
                className="rounded-2xl shadow-xl w-full"
              />
            </div>
          </div>
        </div>
      </section>

      <FeatureShowcase />

      {/* Feature highlight cards — click redirects to Login if not authenticated */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-2">What we offer</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Log in to access the Career Gateway: scholarships, exams, jobs, practice tests and more.
            </p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <Card
                key={index}
                className="cursor-pointer border-border hover:shadow-md transition-all hover:-translate-y-1"
                onClick={handleFeatureClick}
              >
                <CardHeader>
                  <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-2">
                    <feature.icon className="h-6 w-6 text-primary" />
                  </div>
                  <CardTitle className="text-lg">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription>{feature.description}</CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-2">How it works</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Simple steps to start your journey.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {steps.map((step, index) => (
              <div key={index} className="text-center space-y-3">
                <div className="h-14 w-14 rounded-full bg-primary/20 flex items-center justify-center mx-auto text-xl font-bold text-primary">
                  {step.number}
                </div>
                <h3 className="text-xl font-semibold">{step.title}</h3>
                <p className="text-muted-foreground text-sm">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-gradient-to-r from-primary to-secondary">
        <div className="container mx-auto px-4 text-center text-white">
          <h2 className="text-2xl sm:text-3xl font-bold mb-4">Ready to get started?</h2>
          <p className="mb-6 opacity-90">Create your account and access the Career Gateway.</p>
          <Link to="/auth">
            <Button size="lg" variant="secondary" className="gap-2">
              Login or Register
              <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-muted/50 py-10 border-t border-border">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
            <div>
              <span className="text-lg font-bold text-primary">Akalya</span>
              <p className="text-muted-foreground mt-2 text-sm">
                Rural Student Empowerment — learning, scholarships and career guidance.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-3">Links</h4>
              <ul className="space-y-2 text-muted-foreground text-sm">
                <li><Link to="/" className="hover:text-primary">Home</Link></li>
                <li><Link to="/about" className="hover:text-primary">About</Link></li>
                <li><Link to="/contact" className="hover:text-primary">Contact</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-3">Account</h4>
              <ul className="space-y-2 text-muted-foreground text-sm">
                <li><Link to="/auth" className="hover:text-primary">Login</Link></li>
                <li><Link to="/auth" className="hover:text-primary">Register</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-3">Legal</h4>
              <ul className="space-y-2 text-muted-foreground text-sm">
                <li><Link to="/about" className="hover:text-primary">Privacy & Terms</Link></li>
              </ul>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t border-border text-center text-muted-foreground text-sm">
            &copy; 2025 Akalya. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
