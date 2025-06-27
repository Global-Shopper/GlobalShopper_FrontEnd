import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  ArrowRight,
  CheckCircle,
  ShoppingCart,
  Users,
  BarChart3,
  Shield,
  Clock,
  Zap,
  FileText,
  Settings,
  Star,
  ChevronRight,
  Package,
  Search,
  UserCheck,
} from "lucide-react"
import { Link } from "react-router-dom"

export default function Homepage() {
  return (
    <div className="min-h-screen bg-white">
      <main>
        {/* Hero Section */}
        <section className="py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6">
            <div className="grid gap-6 lg:grid-cols-[1fr_400px] lg:gap-12 xl:grid-cols-[1fr_600px]">
              <div className="flex flex-col justify-center space-y-4">
                <div className="space-y-2">
                  <Badge variant="secondary" className="w-fit">
                    🚀 Streamlined Procurement Platform
                  </Badge>
                  <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none">
                    Transform Your Purchase Request Process
                  </h1>
                  <p className="max-w-[600px] text-muted-foreground md:text-xl">
                    Simplify procurement with our intelligent request management system. Enable seamless collaboration
                    between employees and administrators for efficient purchasing workflows.
                  </p>
                </div>
                <div className="flex flex-col gap-2 min-[400px]:flex-row">
                  <Button size="lg" className="h-12 px-8" asChild>
                    <Link to="/app">
                      Explore Platform
                      <ArrowRight className="ml-2 h-5 w-5" />
                    </Link>
                  </Button>
                  <Button variant="outline" size="lg" className="h-12 px-8 bg-white text-black" asChild>
                    <Link to="#how-it-works">Learn More</Link>
                  </Button>
                </div>
                <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                  <div className="flex items-center">
                    <CheckCircle className="mr-2 h-4 w-4 text-green-500" />
                    No setup required
                  </div>
                  <div className="flex items-center">
                    <CheckCircle className="mr-2 h-4 w-4 text-green-500" />
                    Instant deployment
                  </div>
                  <div className="flex items-center">
                    <CheckCircle className="mr-2 h-4 w-4 text-green-500" />
                    Full admin control
                  </div>
                </div>
              </div>
              <div className="flex items-center justify-center">
                <img
                  src="/placeholder.svg?height=400&width=600"
                  width={600}
                  height={400}
                  alt="GlobalShopper Dashboard Preview"
                  className="aspect-video overflow-hidden rounded-xl object-cover shadow-2xl"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Quick Access Section */}
        <section className="py-12 bg-muted/50">
          <div className="container px-4 md:px-6">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold mb-2">Quick Access</h2>
              <p className="text-muted-foreground">Jump directly to the features you need</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
              <Card className="hover:shadow-lg transition-shadow cursor-pointer" asChild>
                <Link to="/app">
                  <CardHeader className="text-center">
                    <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-lg bg-blue-100">
                      <Search className="h-6 w-6 text-blue-600" />
                    </div>
                    <CardTitle className="text-lg">Browse Products</CardTitle>
                    <CardDescription>Explore our comprehensive product catalog</CardDescription>
                  </CardHeader>
                  <CardContent className="text-center">
                    <Button variant="ghost" className="w-full">
                      Start Browsing
                      <ChevronRight className="ml-2 h-4 w-4" />
                    </Button>
                  </CardContent>
                </Link>
              </Card>

              <Card className="hover:shadow-lg transition-shadow cursor-pointer" asChild>
                <Link to="/app?tab=requests">
                  <CardHeader className="text-center">
                    <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-lg bg-green-100">
                      <FileText className="h-6 w-6 text-green-600" />
                    </div>
                    <CardTitle className="text-lg">My Requests</CardTitle>
                    <CardDescription>Track your submitted purchase requests</CardDescription>
                  </CardHeader>
                  <CardContent className="text-center">
                    <Button variant="ghost" className="w-full">
                      View Requests
                      <ChevronRight className="ml-2 h-4 w-4" />
                    </Button>
                  </CardContent>
                </Link>
              </Card>

              <Card className="hover:shadow-lg transition-shadow cursor-pointer" asChild>
                <Link to="/app?tab=admin">
                  <CardHeader className="text-center">
                    <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-lg bg-purple-100">
                      <Settings className="h-6 w-6 text-purple-600" />
                    </div>
                    <CardTitle className="text-lg">Admin Panel</CardTitle>
                    <CardDescription>Manage requests and create orders</CardDescription>
                  </CardHeader>
                  <CardContent className="text-center">
                    <Button variant="ghost" className="w-full">
                      Access Admin
                      <ChevronRight className="ml-2 h-4 w-4" />
                    </Button>
                  </CardContent>
                </Link>
              </Card>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <Badge variant="secondary">Core Features</Badge>
                <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">Everything you need for procurement</h2>
                <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Comprehensive tools designed to streamline your entire purchase request workflow.
                </p>
              </div>
            </div>
            <div className="mx-auto grid max-w-6xl items-start gap-6 py-12 lg:grid-cols-2 lg:gap-12">
              <div className="grid gap-6">
                <Card className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-center space-x-2">
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-100">
                        <Search className="h-5 w-5 text-blue-600" />
                      </div>
                      <CardTitle>Smart Product Catalog</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="mb-4">
                      Browse through an organized product catalog with advanced search and filtering capabilities. Find
                      exactly what you need quickly and efficiently.
                    </CardDescription>
                    <Button variant="outline" size="sm" asChild>
                      <Link to="/app">
                        Explore Catalog
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Link>
                    </Button>
                  </CardContent>
                </Card>

                <Card className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-center space-x-2">
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-100">
                        <ShoppingCart className="h-5 w-5 text-green-600" />
                      </div>
                      <CardTitle>Request Cart System</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="mb-4">
                      Add items to your request cart, specify quantities, and submit comprehensive purchase requests
                      with detailed information.
                    </CardDescription>
                    <Button variant="outline" size="sm" asChild>
                      <Link to="/app">
                        Try Request Cart
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Link>
                    </Button>
                  </CardContent>
                </Card>

                <Card className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-center space-x-2">
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-orange-100">
                        <Clock className="h-5 w-5 text-orange-600" />
                      </div>
                      <CardTitle>Real-time Status Tracking</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="mb-4">
                      Monitor your requests in real-time with detailed status updates from submission to order
                      completion.
                    </CardDescription>
                    <Button variant="outline" size="sm" asChild>
                      <Link to="/app?tab=requests">
                        Track Requests
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Link>
                    </Button>
                  </CardContent>
                </Card>
              </div>

              <div className="grid gap-6">
                <Card className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-center space-x-2">
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-purple-100">
                        <UserCheck className="h-5 w-5 text-purple-600" />
                      </div>
                      <CardTitle>Admin Approval Workflow</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="mb-4">
                      Streamlined approval process with admin controls for reviewing, approving, or rejecting purchase
                      requests with detailed notes.
                    </CardDescription>
                    <Button variant="outline" size="sm" asChild>
                      <Link to="/app?tab=admin">
                        Admin Dashboard
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Link>
                    </Button>
                  </CardContent>
                </Card>

                <Card className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-center space-x-2">
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-red-100">
                        <Package className="h-5 w-5 text-red-600" />
                      </div>
                      <CardTitle>Order Management</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="mb-4">
                      Convert approved requests into orders seamlessly with comprehensive order tracking and management
                      capabilities.
                    </CardDescription>
                    <Button variant="outline" size="sm" asChild>
                      <Link to="/app?tab=admin">
                        Manage Orders
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Link>
                    </Button>
                  </CardContent>
                </Card>

                <Card className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-center space-x-2">
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-teal-100">
                        <BarChart3 className="h-5 w-5 text-teal-600" />
                      </div>
                      <CardTitle>Department Integration</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="mb-4">
                      Organize requests by department with role-based access and budget tracking for better
                      organizational control.
                    </CardDescription>
                    <Button variant="outline" size="sm" asChild>
                      <Link to="/app">
                        Department Setup
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Link>
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </section>

        {/* Benefits Section */}
        <section id="benefits" className="py-12 md:py-24 lg:py-32 bg-muted/50">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <Badge variant="secondary">Key Benefits</Badge>
                <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">Why choose GlobalShopper?</h2>
                <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Transform your procurement process with measurable improvements.
                </p>
              </div>
            </div>
            <div className="mx-auto grid max-w-5xl items-center gap-6 py-12 lg:grid-cols-3 lg:gap-12">
              <Card className="text-center">
                <CardHeader>
                  <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-lg bg-green-100 mb-4">
                    <Zap className="h-6 w-6 text-green-600" />
                  </div>
                  <CardTitle>75% Faster Processing</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription>
                    Streamlined workflows reduce request processing time from days to hours, improving overall
                    efficiency.
                  </CardDescription>
                </CardContent>
              </Card>

              <Card className="text-center">
                <CardHeader>
                  <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-lg bg-blue-100 mb-4">
                    <Shield className="h-6 w-6 text-blue-600" />
                  </div>
                  <CardTitle>Enhanced Control</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription>
                    Complete visibility and control over all purchase requests with detailed approval workflows and
                    audit trails.
                  </CardDescription>
                </CardContent>
              </Card>

              <Card className="text-center">
                <CardHeader>
                  <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-lg bg-purple-100 mb-4">
                    <Users className="h-6 w-6 text-purple-600" />
                  </div>
                  <CardTitle>Better Collaboration</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription>
                    Seamless communication between requesters and administrators with real-time updates and
                    notifications.
                  </CardDescription>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* How It Works Section */}
        <section id="how-it-works" className="py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <Badge variant="secondary">Process Flow</Badge>
                <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">How GlobalShopper works</h2>
                <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Simple, intuitive workflow that anyone can follow.
                </p>
              </div>
            </div>
            <div className="mx-auto grid max-w-5xl items-start gap-8 py-12 lg:grid-cols-4">
              <div className="text-center space-y-4">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-blue-100 text-blue-600 font-bold text-xl">
                  1
                </div>
                <h3 className="text-lg font-semibold">Browse & Select</h3>
                <p className="text-sm text-muted-foreground">
                  Explore the product catalog and add items to your request cart with desired quantities.
                </p>
                <Button variant="outline" size="sm" asChild>
                  <Link to="/app">Try Now</Link>
                </Button>
              </div>

              <div className="text-center space-y-4">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-green-100 text-green-600 font-bold text-xl">
                  2
                </div>
                <h3 className="text-lg font-semibold">Submit Request</h3>
                <p className="text-sm text-muted-foreground">
                  Fill out the request form with your details and submit for administrative review.
                </p>
                <Button variant="outline" size="sm" asChild>
                  <Link to="/app">Submit Request</Link>
                </Button>
              </div>

              <div className="text-center space-y-4">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-orange-100 text-orange-600 font-bold text-xl">
                  3
                </div>
                <h3 className="text-lg font-semibold">Admin Review</h3>
                <p className="text-sm text-muted-foreground">
                  Administrators review, approve, or request modifications to your purchase request.
                </p>
                <Button variant="outline" size="sm" asChild>
                  <Link to="/app?tab=admin">Admin Panel</Link>
                </Button>
              </div>

              <div className="text-center space-y-4">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-purple-100 text-purple-600 font-bold text-xl">
                  4
                </div>
                <h3 className="text-lg font-semibold">Order Created</h3>
                <p className="text-sm text-muted-foreground">
                  Approved requests are converted to orders and processed for fulfillment.
                </p>
                <Button variant="outline" size="sm" asChild>
                  <Link to="/app?tab=requests">Track Orders</Link>
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Testimonials Section */}
        <section id="testimonials" className="py-12 md:py-24 lg:py-32 bg-muted/50">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <Badge variant="secondary">Success Stories</Badge>
                <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">What our users say</h2>
                <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Real feedback from organizations using GlobalShopper.
                </p>
              </div>
            </div>
            <div className="mx-auto grid max-w-5xl items-center gap-6 py-12 lg:grid-cols-3 lg:gap-12">
              <Card>
                <CardHeader>
                  <div className="flex items-center space-x-1">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                </CardHeader>
                <CardContent>
                  <blockquote className="text-lg">
                    "GlobalShopper has revolutionized our procurement process. What used to take weeks now takes days, and
                    our approval workflow is crystal clear."
                  </blockquote>
                  <div className="mt-4">
                    <div className="font-semibold">Sarah Mitchell</div>
                    <div className="text-sm text-muted-foreground">Operations Manager, TechFlow Inc.</div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <div className="flex items-center space-x-1">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                </CardHeader>
                <CardContent>
                  <blockquote className="text-lg">
                    "The admin dashboard gives us complete control over our procurement budget. We can track everything
                    in real-time."
                  </blockquote>
                  <div className="mt-4">
                    <div className="font-semibold">David Chen</div>
                    <div className="text-sm text-muted-foreground">Finance Director, Global Solutions</div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <div className="flex items-center space-x-1">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                </CardHeader>
                <CardContent>
                  <blockquote className="text-lg">
                    "Our employees love how easy it is to submit requests. The interface is intuitive and the process is
                    transparent."
                  </blockquote>
                  <div className="mt-4">
                    <div className="font-semibold">Maria Rodriguez</div>
                    <div className="text-sm text-muted-foreground">HR Manager, InnovateCorp</div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Final CTA Section */}
        <section className="py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">
                  Ready to transform your procurement?
                </h2>
                <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Join organizations worldwide who have streamlined their purchase request process with GlobalShopper.
                </p>
              </div>
              <div className="flex flex-col gap-2 min-[400px]:flex-row">
                <Button size="lg" className="h-12 px-8" asChild>
                  <Link to="/app">
                    Start Using GlobalShopper
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
                <Button variant="outline" size="lg" className="h-12 px-8 bg-white text-black" asChild>
                  <Link to="/app?tab=admin">View Admin Demo</Link>
                </Button>
              </div>
              <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                <div className="flex items-center">
                  <CheckCircle className="mr-2 h-4 w-4 text-green-500" />
                  Instant access
                </div>
                <div className="flex items-center">
                  <CheckCircle className="mr-2 h-4 w-4 text-green-500" />
                  No installation required
                </div>
                <div className="flex items-center">
                  <CheckCircle className="mr-2 h-4 w-4 text-green-500" />
                  Full feature access
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t bg-muted/50">
        <div className="container px-4 py-12 md:px-6">
          <div className="grid gap-8 lg:grid-cols-4">
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
                  <ShoppingCart className="h-5 w-5 text-primary-foreground" />
                </div>
                <span className="text-xl font-bold">GlobalShopper</span>
              </div>
              <p className="text-sm text-muted-foreground">
                Streamline your procurement process with intelligent request management and seamless approval workflows.
              </p>
            </div>
            <div className="space-y-4">
              <h4 className="text-sm font-semibold">Platform</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link to="/app" className="text-muted-foreground hover:text-primary">
                    Product Catalog
                  </Link>
                </li>
                <li>
                  <Link to="/app?tab=requests" className="text-muted-foreground hover:text-primary">
                    Request Tracking
                  </Link>
                </li>
                <li>
                  <Link to="/app?tab=admin" className="text-muted-foreground hover:text-primary">
                    Admin Dashboard
                  </Link>
                </li>
              </ul>
            </div>
            <div className="space-y-4">
              <h4 className="text-sm font-semibold">Features</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link to="#features" className="text-muted-foreground hover:text-primary">
                    Smart Catalog
                  </Link>
                </li>
                <li>
                  <Link to="#features" className="text-muted-foreground hover:text-primary">
                    Approval Workflow
                  </Link>
                </li>
                <li>
                  <Link to="#features" className="text-muted-foreground hover:text-primary">
                    Order Management
                  </Link>
                </li>
              </ul>
            </div>
            <div className="space-y-4">
              <h4 className="text-sm font-semibold">Support</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link to="#how-it-works" className="text-muted-foreground hover:text-primary">
                    How It Works
                  </Link>
                </li>
                <li>
                  <Link to="#testimonials" className="text-muted-foreground hover:text-primary">
                    Success Stories
                  </Link>
                </li>
                <li>
                  <Link to="/app" className="text-muted-foreground hover:text-primary">
                    Live Demo
                  </Link>
                </li>
              </ul>
            </div>
          </div>
          <div className="mt-8 border-t pt-8 text-center text-sm text-muted-foreground">
            <p>&copy; {new Date().getFullYear()} GlobalShopper. Streamlining procurement worldwide.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
