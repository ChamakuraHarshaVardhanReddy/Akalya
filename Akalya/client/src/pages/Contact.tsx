import { LandingNav } from "@/components/LandingNav";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Mail, MessageSquare } from "lucide-react";

export default function Contact() {
  return (
    <div className="min-h-screen bg-background">
      <LandingNav />
      <main className="container mx-auto px-4 py-12">
        <div className="max-w-2xl mx-auto">
          <h1 className="text-3xl font-bold mb-2">Contact Us</h1>
          <p className="text-muted-foreground mb-8">
            Get in touch for support, feedback or partnership enquiries related to rural education.
          </p>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Mail className="h-5 w-5" />
                Email
              </CardTitle>
              <CardDescription>
                For general enquiries and support, write to us. We aim to respond within 2–3 working days.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <a href="mailto:support@akalya.edu" className="text-primary hover:underline">
                support@akalya.edu
              </a>
            </CardContent>
          </Card>
          <Card className="mt-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageSquare className="h-5 w-5" />
                Chatbot
              </CardTitle>
              <CardDescription>
                Use the chatbot on the site for quick answers. Log in to your dashboard for doubt clearance and course queries.
              </CardDescription>
            </CardHeader>
          </Card>
        </div>
      </main>
    </div>
  );
}
