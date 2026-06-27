import React from "react";
import { Link } from "react-router-dom";
import { Landmark, Shield, Clock, BarChart3, ArrowRight, CheckCircle, Mail, Phone, MapPin } from "lucide-react";

export const LandingPage: React.FC = () => {
  return (
    <div className="flex min-h-screen flex-col bg-white">
      {/* Navbar */}
      <header className="sticky top-0 z-50 border-b border-slate-100 bg-white/80 backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl h-16 items-center justify-between px-6">
          <div className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-indigo-600 text-white font-bold text-lg">
              BL
            </div>
            <span className="text-xl font-bold tracking-tight text-slate-900">
              BankLite
            </span>
          </div>

          <nav className="hidden md:flex items-center gap-8">
            <a href="#features" className="text-sm font-semibold text-slate-600 hover:text-indigo-600 transition-colors">
              Features
            </a>
            <a href="#about" className="text-sm font-semibold text-slate-600 hover:text-indigo-600 transition-colors">
              About Us
            </a>
            <a href="#contact" className="text-sm font-semibold text-slate-600 hover:text-indigo-600 transition-colors">
              Contact
            </a>
          </nav>

          <div>
            <Link
              to="/select-role"
              className="inline-flex items-center gap-2 rounded-lg bg-slate-900 px-4 py-2.5 text-sm font-bold text-white hover:bg-slate-800 transition-all shadow-xs"
            >
              Access System
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-slate-50 py-20 lg:py-32">
        <div className="mx-auto max-w-7xl px-6 grid gap-12 lg:grid-cols-2 lg:items-center">
          <div className="space-y-6 text-center lg:text-left">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-indigo-50 px-3 py-1 text-xs font-semibold text-indigo-700">
              Introducing BankLite LOS v1.0
            </span>
            <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 sm:text-5xl lg:text-6xl leading-tight">
              Lending workflows, <br />
              <span className="text-indigo-600">reimagined for speed.</span>
            </h1>
            <p className="mx-auto lg:mx-0 max-w-md text-lg text-slate-600 font-medium">
              A comprehensive, secure, role-based Loan Origination System enabling rapid applicant underwriting, credit risk modeling, and full audit logging.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center lg:justify-start pt-4">
              <Link
                to="/select-role"
                className="inline-flex items-center justify-center rounded-lg bg-indigo-600 px-5 py-3 text-base font-bold text-white hover:bg-indigo-700 transition-all shadow-md"
              >
                Launch Portal
              </Link>
              <a
                href="#features"
                className="inline-flex items-center justify-center rounded-lg border border-slate-300 bg-white px-5 py-3 text-base font-bold text-slate-700 hover:bg-slate-50 transition-all"
              >
                Learn More
              </a>
            </div>
          </div>
          {/* Visual Showcase Card */}
          <div className="relative mx-auto lg:ml-auto w-full max-w-lg bg-white rounded-2xl border border-slate-200 shadow-xl p-8 space-y-6">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div className="flex items-center gap-3">
                <div className="h-3 w-3 rounded-full bg-red-400"></div>
                <div className="h-3 w-3 rounded-full bg-amber-400"></div>
                <div className="h-3 w-3 rounded-full bg-green-400"></div>
              </div>
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-widest">
                Underwriting Console
              </span>
            </div>
            <div className="space-y-4">
              <div className="flex items-center justify-between rounded-lg bg-slate-50 p-4 border border-slate-100">
                <div>
                  <p className="text-xs font-bold text-slate-400 uppercase">Applicant</p>
                  <p className="text-sm font-bold text-slate-900">Sarah Jenkins</p>
                </div>
                <div className="text-right">
                  <p className="text-xs font-bold text-slate-400 uppercase">Amount</p>
                  <p className="text-sm font-bold text-slate-900">₹250,000</p>
                </div>
              </div>
              <div className="flex items-center justify-between rounded-lg bg-slate-50 p-4 border border-slate-100">
                <div>
                  <p className="text-xs font-bold text-slate-400 uppercase">Credit Score</p>
                  <p className="text-sm font-bold text-emerald-600 font-mono">790 (Low Risk)</p>
                </div>
                <div className="text-right">
                  <p className="text-xs font-bold text-slate-400 uppercase">Status</p>
                  <span className="inline-flex rounded-full bg-emerald-50 px-2.5 py-0.5 text-xs font-semibold text-emerald-700">
                    Auto-Verified
                  </span>
                </div>
              </div>
              <div className="rounded-lg border border-slate-100 p-4 space-y-2">
                <p className="text-xs font-semibold text-slate-500">Underwriting Activity Logs</p>
                <div className="space-y-1.5 font-mono text-[10px] text-slate-500">
                  <p className="flex items-center gap-1.5">
                    <span className="text-emerald-500">✔</span> [14:32:01] Application submitted by customer_id=12
                  </p>
                  <p className="flex items-center gap-1.5">
                    <span className="text-emerald-500">✔</span> [14:32:02] Credit Score fetched dynamically score=790
                  </p>
                  <p className="flex items-center gap-1.5">
                    <span className="text-indigo-500">ℹ</span> [14:34:40] Underwriting review initiated by Officer_ID=4
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section id="features" className="py-20 lg:py-28">
        <div className="mx-auto max-w-7xl px-6 text-center">
          <h2 className="text-xs font-bold uppercase tracking-widest text-indigo-600">Enterprise Capability</h2>
          <h3 className="mt-2 text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
            Designed for secure lending operations.
          </h3>
          <p className="mx-auto mt-4 max-w-xl text-slate-600 font-medium">
            Deploying high-reliability banking infrastructure requires zero tolerance for audit gaps and unauthorized privilege access.
          </p>

          <div className="mt-16 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            <div className="rounded-xl border border-slate-200 bg-white p-8 text-left space-y-4 hover:shadow-md transition-shadow">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600">
                <Shield className="h-6 w-6" />
              </div>
              <h4 className="text-lg font-bold text-slate-900">Role Boundaries</h4>
              <p className="text-sm text-slate-500 leading-relaxed">
                Strict separation of concerns. Customers submit loan files; Credit Officers analyze risk matrices and provide compliance approvals.
              </p>
            </div>

            <div className="rounded-xl border border-slate-200 bg-white p-8 text-left space-y-4 hover:shadow-md transition-shadow">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600">
                <Clock className="h-6 w-6" />
              </div>
              <h4 className="text-lg font-bold text-slate-900">Real-Time Scoring</h4>
              <p className="text-sm text-slate-500 leading-relaxed">
                Simulated real-time credit bureau integrations immediately fetch scoring matrices upon customer submission.
              </p>
            </div>

            <div className="rounded-xl border border-slate-200 bg-white p-8 text-left space-y-4 hover:shadow-md transition-shadow">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600">
                <BarChart3 className="h-6 w-6" />
              </div>
              <h4 className="text-lg font-bold text-slate-900">Executive Analytics</h4>
              <p className="text-sm text-slate-500 leading-relaxed">
                Comprehensive analytics dashboards visualising risk distribution, monthly applications, and approval trend ratios.
              </p>
            </div>

            <div className="rounded-xl border border-slate-200 bg-white p-8 text-left space-y-4 hover:shadow-md transition-shadow">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600">
                <Landmark className="h-6 w-6" />
              </div>
              <h4 className="text-lg font-bold text-slate-900">Audit Compliance</h4>
              <p className="text-sm text-slate-500 leading-relaxed">
                Every action taken by underwriters generates a tamper-proof audit trail mapping timestamps, decisions, and comments.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* About Us Section */}
      <section id="about" className="bg-slate-50 py-20 lg:py-28">
        <div className="mx-auto max-w-7xl px-6 grid gap-12 lg:grid-cols-2 lg:items-center">
          <div className="space-y-6">
            <h2 className="text-xs font-bold uppercase tracking-widest text-indigo-600">Security & Integrity</h2>
            <h3 className="text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
              Engineered with modern engineering standards.
            </h3>
            <p className="text-slate-600 leading-relaxed">
              At BankLite, we believe that software integrity is paramount when handling financial applications. Our team builds systems focused on performance, modularity, and SOLID design principles.
            </p>
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-indigo-600" />
                <span className="font-semibold text-slate-800">Clean backend API layer using FastAPI</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-indigo-600" />
                <span className="font-semibold text-slate-800">Robust type safety with TypeScript & Zod schemas</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-indigo-600" />
                <span className="font-semibold text-slate-800">Modern components engineered for performance</span>
              </div>
            </div>
          </div>
          <div className="rounded-xl border border-slate-200 bg-white p-8 space-y-4">
            <h4 className="text-lg font-bold text-slate-900 border-b border-slate-100 pb-3">Technical Stack Breakdown</h4>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="font-bold text-slate-400">Backend Core</p>
                <p className="font-semibold text-slate-800">FastAPI, Python</p>
              </div>
              <div>
                <p className="font-bold text-slate-400">Database & ORM</p>
                <p className="font-semibold text-slate-800">SQLAlchemy, MySQL/SQLite</p>
              </div>
              <div>
                <p className="font-bold text-slate-400">Frontend UI</p>
                <p className="font-semibold text-slate-800">React 19, TypeScript</p>
              </div>
              <div>
                <p className="font-bold text-slate-400">Styling Core</p>
                <p className="font-semibold text-slate-800">Tailwind CSS v4</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-20 lg:py-28">
        <div className="mx-auto max-w-3xl px-6 text-center space-y-8">
          <div className="space-y-3">
            <h2 className="text-xs font-bold uppercase tracking-widest text-indigo-600">Get in Touch</h2>
            <h3 className="text-3xl font-extrabold tracking-tight text-slate-900">Have questions about BankLite?</h3>
            <p className="text-slate-600 max-w-lg mx-auto">
              Our engineering and client integration teams are available to demonstrate deployment scenarios and system integration.
            </p>
          </div>

          <div className="grid gap-6 sm:grid-cols-3 max-w-2xl mx-auto pt-6 text-left">
            <div className="flex items-center gap-3 p-4 rounded-xl border border-slate-200">
              <Mail className="h-6 w-6 text-indigo-600 shrink-0" />
              <div>
                <p className="text-xs font-bold text-slate-400 uppercase">Email Support</p>
                <p className="text-sm font-semibold text-slate-800">support@banklite.com</p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-4 rounded-xl border border-slate-200">
              <Phone className="h-6 w-6 text-indigo-600 shrink-0" />
              <div>
                <p className="text-xs font-bold text-slate-400 uppercase">Call Center</p>
                <p className="text-sm font-semibold text-slate-800">+1 (800) 555-0199</p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-4 rounded-xl border border-slate-200">
              <MapPin className="h-6 w-6 text-indigo-600 shrink-0" />
              <div>
                <p className="text-xs font-bold text-slate-400 uppercase">Headquarters</p>
                <p className="text-sm font-semibold text-slate-800">New York, NY</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-slate-50 py-12">
        <div className="mx-auto max-w-7xl px-6 flex flex-col md:flex-row items-center justify-between gap-6 text-sm text-slate-500">
          <div className="flex items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-md bg-indigo-600 text-white font-bold text-xs">
              BL
            </div>
            <span className="font-bold tracking-tight text-slate-900">
              BankLite
            </span>
          </div>
          <p>© 2026 BankLite Corporation. All rights reserved. Secure Banking Application.</p>
          <div className="flex gap-6">
            <a href="#" className="hover:text-indigo-600">Privacy Policy</a>
            <a href="#" className="hover:text-indigo-600">Terms of Service</a>
          </div>
        </div>
      </footer>
    </div>
  );
};
export default LandingPage;
