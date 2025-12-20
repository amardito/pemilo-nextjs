import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, Lock, Users, Zap, BarChart3, Shield } from 'lucide-react';
import Link from 'next/link';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 text-white">
      {/* Header */}
      <header className="border-b border-slate-700 bg-slate-900/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-blue-600 rounded-lg flex items-center justify-center font-bold text-lg">
              P
            </div>
            <span className="text-xl font-bold">Pemilo</span>
          </div>
          <div className="flex gap-3">
            <Link href="/admin-login">
              <Button 
                className="border border-slate-600 bg-slate-800 text-white hover:bg-slate-700"
              >
                Admin Login
              </Button>
            </Link>
            <Link href="/voter">
              <Button className="bg-blue-600 hover:bg-blue-700">
                Vote Now
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center space-y-6">
          <Badge className="mx-auto bg-blue-500/20 text-blue-300 border-blue-400">
            Secure Democratic Voting Platform
          </Badge>
          <h1 className="text-5xl md:text-7xl font-bold tracking-tight">
            Fair, Transparent Voting
          </h1>
          <p className="text-xl text-slate-400 max-w-2xl mx-auto">
            Pemilo is a modern, secure voting platform designed for organizations, communities, and institutions. 
            Simple to use, impossible to manipulate.
          </p>
          <div className="flex gap-4 justify-center pt-6">
            <Link href="/admin-login">
              <Button className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-6 text-lg">
                Launch Admin Panel
              </Button>
            </Link>
            <Link href="/voter">
              <Button 
                className="bg-slate-700 hover:bg-slate-600 text-white px-8 py-6 text-lg border border-slate-600"
              >
                Vote as Guest
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 border-t border-slate-700">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-16">Key Features</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* Feature 1 */}
          <Card className="bg-slate-800/50 border-slate-700 hover:border-blue-500 transition-colors">
            <CardHeader>
              <Lock className="w-8 h-8 text-blue-400 mb-2" />
              <CardTitle className="text-white">Military-Grade Security</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-slate-400">
                End-to-end encryption ensures votes are secure and anonymous. Only authorized administrators can manage voting sessions.
              </p>
            </CardContent>
          </Card>

          {/* Feature 2 */}
          <Card className="bg-slate-800/50 border-slate-700 hover:border-blue-500 transition-colors">
            <CardHeader>
              <Users className="w-8 h-8 text-green-400 mb-2" />
              <CardTitle className="text-white">Multi-Candidate Support</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-slate-400">
                Support for single candidates and tickets with running mates. Perfect for presidential elections, board selections, and more.
              </p>
            </CardContent>
          </Card>

          {/* Feature 3 */}
          <Card className="bg-slate-800/50 border-slate-700 hover:border-blue-500 transition-colors">
            <CardHeader>
              <BarChart3 className="w-8 h-8 text-purple-400 mb-2" />
              <CardTitle className="text-white">Real-Time Analytics</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-slate-400">
                Live voting statistics and results. Watch votes come in real-time with detailed breakdowns by candidate.
              </p>
            </CardContent>
          </Card>

          {/* Feature 4 */}
          <Card className="bg-slate-800/50 border-slate-700 hover:border-blue-500 transition-colors">
            <CardHeader>
              <Zap className="w-8 h-8 text-yellow-400 mb-2" />
              <CardTitle className="text-white">Multiple Voting Methods</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-slate-400">
                Support for open voting, ticket-based voting, and time-limited sessions. Flexible to your organization's needs.
              </p>
            </CardContent>
          </Card>

          {/* Feature 5 */}
          <Card className="bg-slate-800/50 border-slate-700 hover:border-blue-500 transition-colors">
            <CardHeader>
              <Shield className="w-8 h-8 text-red-400 mb-2" />
              <CardTitle className="text-white">Admin Control</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-slate-400">
                Full administrative control over voting rooms, candidates, and voter tickets. Manage everything from one dashboard.
              </p>
            </CardContent>
          </Card>

          {/* Feature 6 */}
          <Card className="bg-slate-800/50 border-slate-700 hover:border-blue-500 transition-colors">
            <CardHeader>
              <CheckCircle className="w-8 h-8 text-cyan-400 mb-2" />
              <CardTitle className="text-white">Easy Integration</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-slate-400">
                Simple APIs for integration. Bulk import voter tickets, manage multiple voting sessions, and export results.
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* How It Works */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 border-t border-slate-700">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-16">How It Works</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="text-center">
            <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold">
              1
            </div>
            <h3 className="text-lg font-semibold mb-2">Create Room</h3>
            <p className="text-slate-400">Set up a new voting session and add candidates with their details and photos.</p>
          </div>
          <div className="text-center">
            <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold">
              2
            </div>
            <h3 className="text-lg font-semibold mb-2">Generate Tickets</h3>
            <p className="text-slate-400">Create voting tickets in bulk or individually for secure voter authentication.</p>
          </div>
          <div className="text-center">
            <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold">
              3
            </div>
            <h3 className="text-lg font-semibold mb-2">Share & Vote</h3>
            <p className="text-slate-400">Distribute voting links and tickets to participants. They vote securely online.</p>
          </div>
          <div className="text-center">
            <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold">
              4
            </div>
            <h3 className="text-lg font-semibold mb-2">View Results</h3>
            <p className="text-slate-400">Get real-time voting results and detailed analytics as votes come in.</p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 border-t border-slate-700 text-center">
        <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to Start Voting?</h2>
        <p className="text-xl text-slate-400 mb-8 max-w-2xl mx-auto">
          Join thousands of organizations using Pemilo for fair and transparent voting.
        </p>
        <Link href="/admin-login">
          <Button className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-6 text-lg">
            Get Started as Admin
          </Button>
        </Link>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-700 bg-slate-900/50 mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 text-center text-slate-400">
          <p>&copy; 2024 Pemilo. Secure voting for everyone.</p>
        </div>
      </footer>
    </div>
  );
}
