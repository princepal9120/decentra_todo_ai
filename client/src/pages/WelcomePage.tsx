import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Check, ListTodo, Brain, Shield, ArrowRight } from 'lucide-react';
import {
  Card,
  CardContent,
} from "@/components/ui/card";

const WelcomePage: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-purple-50 to-indigo-50">
      <header className="bg-white/80 backdrop-blur-sm border-b border-gray-200 py-4 px-6 sticky top-0 z-50">
        <div className="container mx-auto flex justify-between items-center">
          <div className="text-2xl font-bold bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
            TaskVerse
          </div>
          <div className="space-x-2">
            <Button asChild variant="ghost" className="hover:scale-105 transition-transform">
              <Link to="/login">Login</Link>
            </Button>
            <Button asChild className="hover:scale-105 transition-transform">
              <Link to="/register">Sign Up</Link>
            </Button>
          </div>
        </div>
      </header>

      <main className="flex-1">
        <section className="py-20 px-6">
          <div className="container mx-auto max-w-6xl">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div className="space-y-8 animate-fade-in">
                <h1 className="text-4xl md:text-5xl font-bold text-gray-900 leading-tight">
                  Manage Tasks with{' '}
                  <span className="bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
                    AI
                  </span>{' '}
                  and{' '}
                  <span className="bg-gradient-to-r from-orange-500 to-accent bg-clip-text text-transparent">
                    Blockchain
                  </span>
                </h1>
                <p className="text-xl text-gray-600">
                  TaskVerse helps you organize and prioritize your tasks with
                  AI while providing blockchain verification for completed tasks.
                </p>
                <div className="flex flex-col sm:flex-row gap-4">
                  <Button asChild size="lg" className="group px-8 hover:scale-105 transition-all">
                    <Link to="/register">
                      Get Started
                      <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                    </Link>
                  </Button>
                  <Button asChild variant="outline" size="lg" className="hover:scale-105 transition-all">
                    <Link to="/login">Log In</Link>
                  </Button>
                </div>
              </div>
              <div className="relative animate-slide-in-right">
                <div className="w-full h-[400px] bg-gradient-to-r from-purple-100/50 to-indigo-100/50 rounded-2xl p-8 backdrop-blur-sm">
                  <Card className="absolute top-8 left-8 right-8 bottom-8 bg-white/90 backdrop-blur-sm shadow-xl hover:shadow-2xl transition-all duration-300">
                    <CardContent className="p-6">
                      <div className="flex items-center gap-2 text-xl font-semibold mb-4 text-primary">
                        <ListTodo /> Task Manager
                      </div>
                      <div className="space-y-4">
                        <div className="p-3 bg-white rounded-lg border border-gray-200 shadow-sm flex items-start gap-2">
                          <input type="checkbox" className="mt-1" />
                          <div>
                            <h3 className="font-medium">Complete DApp MVP</h3>
                            <p className="text-sm text-gray-500">Finish the initial version of the decentralized todo app</p>
                          </div>
                        </div>
                        <div className="p-3 bg-white rounded-lg border border-gray-200 shadow-sm flex items-start gap-2">
                          <input type="checkbox" className="mt-1" checked />
                          <div>
                            <h3 className="font-medium line-through">Design Analytics Dashboard</h3>
                            <p className="text-sm text-gray-500 line-through">Create UI for the task completion analytics dashboard</p>
                          </div>
                        </div>
                        <div className="p-3 bg-white rounded-lg border-l-4 border border-yellow-500 shadow-sm flex items-start gap-2">
                          <input type="checkbox" className="mt-1" />
                          <div>
                            <h3 className="font-medium">Write Smart Contract Tests</h3>
                            <p className="text-sm text-gray-500">Create comprehensive test suite for the TaskManager contract</p>
                            <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded mt-1 inline-block">Medium Priority</span>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="py-16 px-6 bg-gradient-to-br from-gray-50 to-purple-50">
          <div className="container mx-auto max-w-6xl">
            <h2 className="text-3xl font-bold text-center mb-12 bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
              Key Features
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                {
                  icon: <ListTodo className="text-primary" size={24} />,
                  title: "Task Management",
                  description: "Create, organize, and track your tasks with an intuitive interface."
                },
                {
                  icon: <Brain className="text-secondary" size={24} />,
                  title: "AI Prioritization",
                  description: "Our AI analyzes your tasks and helps you prioritize them effectively."
                },
                {
                  icon: <Shield className="text-accent" size={24} />,
                  title: "Blockchain Verification",
                  description: "Verify task completion on the blockchain with MetaMask integration."
                }
              ].map((feature, index) => (
                <div
                  key={index}
                  className="bg-white/70 backdrop-blur-sm p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-lg hover:scale-105 transition-all duration-300"
                >
                  <div className="w-12 h-12 bg-gradient-to-br from-primary/10 to-purple-100 rounded-lg flex items-center justify-center mb-4">
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                  <p className="text-gray-600">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      <footer className="bg-gray-900 text-white py-12 px-6">
        <div className="container mx-auto max-w-6xl">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-6 md:mb-0">
              <div className="text-2xl font-bold">TaskVerse</div>
              <p className="text-gray-400 mt-2">
                Decentralized Task Management Platform
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div>
                <h3 className="font-semibold mb-3">Features</h3>
                <ul className="space-y-2 text-gray-400">
                  <li>Task Management</li>
                  <li>AI Prioritization</li>
                  <li>Blockchain Integration</li>
                  <li>Analytics Dashboard</li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold mb-3">Resources</h3>
                <ul className="space-y-2 text-gray-400">
                  <li>Documentation</li>
                  <li>API Reference</li>
                  <li>Tutorials</li>
                  <li>Blog</li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold mb-3">Company</h3>
                <ul className="space-y-2 text-gray-400">
                  <li>About Us</li>
                  <li>Careers</li>
                  <li>Contact</li>
                  <li>Privacy Policy</li>
                </ul>
              </div>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-500">
            <p>© 2025 TaskVerse. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default WelcomePage;
