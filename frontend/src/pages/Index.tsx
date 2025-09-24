import { Navigation } from "@/components/navigation"
import { HeroSection } from "@/components/hero-section"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Banner } from "@/components/ui/banner"
import { Button } from "@/components/ui/button"
import { Shield, Zap, Users, Star } from "lucide-react"

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <main>
        <HeroSection />
        
        {/* Features Section */}
        <section id="features" className="py-20 bg-muted/30">
          <div className="container">
            <div className="text-center mb-16">
              <h2 className="text-3xl lg:text-4xl font-bold mb-4">Powerful Features</h2>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                Everything you need to build and scale your application
              </p>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card>
                <CardHeader>
                  <Shield className="h-10 w-10 text-primary mb-2" />
                  <CardTitle>Secure</CardTitle>
                  <CardDescription>
                    Enterprise-grade security built into every feature
                  </CardDescription>
                </CardHeader>
              </Card>
              <Card>
                <CardHeader>
                  <Zap className="h-10 w-10 text-primary mb-2" />
                  <CardTitle>Fast</CardTitle>
                  <CardDescription>
                    Lightning-fast performance for optimal user experience
                  </CardDescription>
                </CardHeader>
              </Card>
              <Card>
                <CardHeader>
                  <Users className="h-10 w-10 text-primary mb-2" />
                  <CardTitle>Collaborative</CardTitle>
                  <CardDescription>
                    Work together with your team seamlessly
                  </CardDescription>
                </CardHeader>
              </Card>
              <Card>
                <CardHeader>
                  <Star className="h-10 w-10 text-primary mb-2" />
                  <CardTitle>Premium</CardTitle>
                  <CardDescription>
                    Premium features and support for your success
                  </CardDescription>
                </CardHeader>
              </Card>
            </div>
          </div>
        </section>

        {/* Services Section */}
        <section className="py-20">
          <div className="container">
            <div className="text-center mb-16">
              <h2 className="text-3xl lg:text-4xl font-bold mb-4">Our Services</h2>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                Comprehensive solutions for your business needs
              </p>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              <Card>
                <CardHeader>
                  <CardTitle>Web Development</CardTitle>
                  <CardDescription>
                    Custom web applications built with modern technologies
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Button variant="outline" className="w-full">Learn More</Button>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Cloud Solutions</CardTitle>
                  <CardDescription>
                    Scalable cloud infrastructure and deployment services
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Button variant="outline" className="w-full">Learn More</Button>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Consulting</CardTitle>
                  <CardDescription>
                    Expert advice and strategic planning for your projects
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Button variant="outline" className="w-full">Learn More</Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* About Section */}
        <section className="py-20 bg-muted/30">
          <div className="container">
            <div className="max-w-4xl mx-auto text-center">
              <h2 className="text-3xl lg:text-4xl font-bold mb-8">About NavyApp</h2>
              <p className="text-lg text-muted-foreground mb-8">
                We're a team of passionate developers and designers dedicated to creating 
                exceptional digital experiences. Our mission is to help businesses succeed 
                in the digital world through innovative solutions and cutting-edge technology.
              </p>
              <Banner variant="primary">
                <h3 className="text-2xl font-bold mb-4">Ready to Get Started?</h3>
                <p className="mb-6">Join thousands of satisfied customers who trust NavyApp</p>
                <Button size="lg" variant="secondary">
                  Contact Us Today
                </Button>
              </Banner>
            </div>
          </div>
        </section>

        {/* Contact Section */}
        <section className="py-20">
          <div className="container">
            <div className="text-center mb-16">
              <h2 className="text-3xl lg:text-4xl font-bold mb-4">Get In Touch</h2>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                Have questions? We'd love to hear from you
              </p>
            </div>
            <div className="max-w-2xl mx-auto">
              <Card>
                <CardHeader>
                  <CardTitle>Contact Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h4 className="font-semibold">Email</h4>
                    <p className="text-muted-foreground">hello@navyapp.com</p>
                  </div>
                  <div>
                    <h4 className="font-semibold">Phone</h4>
                    <p className="text-muted-foreground">+1 (555) 123-4567</p>
                  </div>
                  <div>
                    <h4 className="font-semibold">Address</h4>
                    <p className="text-muted-foreground">123 Navy Street, Tech City, TC 12345</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
      </main>
      
      {/* Footer */}
      <footer className="border-t py-8">
        <div className="container text-center text-muted-foreground">
          <p>&copy; 2024 NavyApp. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
