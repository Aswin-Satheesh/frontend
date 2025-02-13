import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Building2, User, UserCog, Pill, Phone, Mail, MapPin } from 'lucide-react';

const LandingPage = () => {
  return (
    
    <div className="min-h-screen max-w-7xl m-auto overflow-x-hidden bg-background">
      {/* Hero Section */}
      <section className="w-full bg-primary text-primary-foreground py-24">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center text-center space-y-4">
            <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none">
              Welcome to HMS Healthcare
            </h1>
            <p className="mx-auto max-w-[700px] text-lg text-primary-foreground/80 md:text-xl">
              Your trusted partner in modern healthcare management
            </p>
            <div className="flex flex-wrap gap-4">
              <Button asChild variant="ghost" size="lg">
                <Link to="/login">Get Started</Link>
              </Button>
              {/* <Button variant="ghost" asChild size="lg">
                <Link to="/signup">Sign Up</Link>
              </Button> */}
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="w-full py-20 bg-muted/50">
        <div className="container px-4 md:px-6">
          <h2 className="text-3xl font-bold tracking-tighter text-center mb-12">
            Our Features
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card>
              <CardHeader>
                <User className="w-10 h-10 text-primary mb-4" />
                <CardTitle>For Patients</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-muted-foreground">
                  <li>Book Appointments</li>
                  <li>View Medical Records</li>
                  <li>Online Consultations</li>
                  <li>Prescription Access</li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <UserCog className="w-10 h-10 text-primary mb-4" />
                <CardTitle>For Doctors</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-muted-foreground">
                  <li>Patient Management</li>
                  <li>Schedule Management</li>
                  <li>Digital Prescriptions</li>
                  <li>Medical History Access</li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <Building2 className="w-10 h-10 text-primary mb-4" />
                <CardTitle>For Admin</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-muted-foreground">
                  <li>Staff Management</li>
                  <li>Resource Allocation</li>
                  <li>Reports & Analytics</li>
                  <li>Billing Management</li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <Pill className="w-10 h-10 text-primary mb-4" />
                <CardTitle>For Pharmacy</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-muted-foreground">
                  <li>Inventory Management</li>
                  <li>Digital Prescriptions</li>
                  <li>Order Processing</li>
                  <li>Stock Analytics</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="w-full py-20">
        <div className="container px-4 md:px-6">
          <h2 className="text-3xl font-bold tracking-tighter text-center mb-12">
            Frequently Asked Questions
          </h2>
          <div className="max-w-3xl mx-auto">
            <Accordion type="single" collapsible className="w-full">
              {faqs.map((faq, index) => (
                <AccordionItem key={index} value={`item-${index}`}>
                  <AccordionTrigger>{faq.question}</AccordionTrigger>
                  <AccordionContent>{faq.answer}</AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="w-full py-20 bg-muted/50">
        <div className="container px-4 md:px-6">
          <h2 className="text-3xl font-bold tracking-tighter text-center mb-12">
            Contact Us
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 max-w-4xl mx-auto">
            <Card>
              <CardHeader>
                <CardTitle>Get in Touch</CardTitle>
                <CardDescription>
                  Send us a message and we'll get back to you as soon as possible.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Name</label>
                    <Input placeholder="Your name" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Email</label>
                    <Input type="email" placeholder="Your email" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Message</label>
                    <Textarea placeholder="Your message" />
                  </div>
                  <Button className="w-full">Send Message</Button>
                </form>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Contact Information</CardTitle>
                <CardDescription>
                  Find us at our location or reach out through our contact channels.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <Phone className="w-5 h-5 text-primary" />
                    <span>+1 (123) 456-7890</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Mail className="w-5 h-5 text-primary" />
                    <span>contact@hmshealthcare.com</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <MapPin className="w-5 h-5 text-primary" />
                    <span>123 Healthcare Street, Medical District</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </div>
    
  );
};

const faqs = [
  {
    question: "How do I book an appointment?",
    answer: "You can book an appointment through our online portal after logging in to your patient account, or call our reception directly."
  },
  {
    question: "What insurance plans do you accept?",
    answer: "We accept most major insurance plans. Please contact our billing department for specific information about your insurance coverage."
  },
  {
    question: "How can I access my medical records?",
    answer: "You can access your medical records through your patient portal account. For detailed records, please submit a request through the portal."
  },
  {
    question: "What are your working hours?",
    answer: "Our facility is open 24/7 for emergencies. Regular consultation hours are from 9:00 AM to 6:00 PM, Monday through Saturday."
  }
];

export default LandingPage;