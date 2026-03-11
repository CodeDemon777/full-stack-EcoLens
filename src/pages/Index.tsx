import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { 
  Factory, 
  ArrowRight, 
  Leaf, 
  Wind, 
  Zap, 
  Truck, 
  Database, 
  Building2, 
  ShoppingBag,
  Flame,
  Globe,
  TrendingDown,
  ShieldCheck,
  CheckCircle2,
  Cpu,
  Recycle,
  Droplets
} from "lucide-react";

const LandingPage = () => {
  const navigate = useNavigate();

  const navLinks = [
    { label: "What is Carbon?", href: "#what-is-carbon" },
    { label: "Sources", href: "#sources" },
    { label: "Scopes", href: "#scopes" },
    { label: "Reduce", href: "#reduce" },
  ];

  const stats = [
    { label: "CO₂ Concentration", value: "421.9 ppm", sub: "+2.4 from 2023" },
    { label: "Global Temp Rise", value: "1.2°C", sub: "Above pre-industrial" },
    { label: "Annual Emissions", value: "37.2 Gt", sub: "Global total 2023" },
    { label: "Net Zero Target", value: "2050", sub: "Global deadline" },
  ];

  const sources = [
    { icon: Zap, title: "Energy Production", desc: "Burning fossil fuels for electricity and heat remains the largest source." },
    { icon: Factory, title: "Manufacturing", desc: "Industrial processes and chemical production contribute significantly." },
    { icon: Truck, title: "Transportation", desc: "Fuel combustion from cars, planes, and ships across global supply chains." },
    { icon: Cpu, title: "IT & Data Centers", desc: "Digital infrastructure and high-performance computing energy demand." },
    { icon: Building2, title: "Buildings", desc: "Energy used for heating, cooling, and powering commercial structures." },
    { icon: ShoppingBag, title: "Supply Chain", desc: "Embedded emissions from raw material extraction to final delivery." },
  ];

  const causes = [
    { icon: Flame, title: "Fossil Fuel Dependency", desc: "Heavy reliance on coal, oil, and gas for industrial energy." },
    { icon: TrendingDown, title: "Inefficient Processes", desc: "Legacy machinery and outdated manufacturing workflows." },
    { icon: Globe, title: "Global Logistics", desc: "Long-distance shipping and complex international trade routes." },
    { icon: Database, title: "Operational Data Gaps", desc: "Lack of real-time visibility into energy leaks and waste." },
  ];

  const reductionTips = [
    { icon: Leaf, title: "Renewable Energy", desc: "Transition to solar, wind, or geothermal power sources." },
    { icon: Zap, title: "Energy Efficiency", desc: "Upgrade to LED lighting and high-efficiency HVAC systems." },
    { icon: Truck, title: "Green Logistics", desc: "Optimize routes and transition to electric vehicle fleets." },
    { icon: Recycle, title: "Circular Economy", desc: "Reduce waste through material recycling and reuse programs." },
    { icon: Droplets, title: "Water Conservation", desc: "Implement smart water management and recycling systems." },
    { icon: ShieldCheck, title: "Measurement", desc: "Use EcoLens for precise real-time emission tracking." },
  ];

  return (
    <div className="min-h-screen bg-background text-foreground selection:bg-primary/30">
      {/* Sticky Navbar */}
      <nav className="fixed top-0 z-50 w-full border-b border-border/50 bg-background/80 backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary">
              <Factory className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="font-display text-xl font-bold tracking-tight">EcoLens</span>
          </div>
          
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <a 
                key={link.label} 
                href={link.href} 
                className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
              >
                {link.label}
              </a>
            ))}
          </div>

          <div className="flex items-center gap-4">
            <button 
              onClick={() => navigate("/login")}
              className="hidden sm:block text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              Sign In
            </button>
            <button
              onClick={() => navigate("/login")}
              className="rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground hover:brightness-110 transition-all glow-green"
            >
              Open Dashboard
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative overflow-hidden pt-32 pb-20 lg:pt-48 lg:pb-32">
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_50%_120%,rgba(16,185,129,0.1),transparent_50%)]" />
        <div className="mx-auto max-w-7xl px-6">
          <div className="text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <span className="inline-block rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-primary mb-6">
                Sustainable Industrial Intelligence
              </span>
              <h1 className="font-display text-5xl font-extrabold tracking-tight sm:text-7xl lg:text-8xl">
                Measure what <span className="text-primary italic">matters</span>.
              </h1>
              <p className="mx-auto mt-8 max-w-2xl text-lg text-muted-foreground sm:text-xl">
                EcoLens provides high-precision carbon tracking for the modern enterprise. 
                Turn environmental data into actionable insights and lead the transition to Net Zero.
              </p>
              <div className="mt-10 flex flex-wrap justify-center gap-4">
                <button
                  onClick={() => navigate("/login")}
                  className="group flex items-center gap-2 rounded-full bg-primary px-8 py-4 text-base font-bold text-primary-foreground hover:brightness-110 transition-all glow-green"
                >
                  Start Monitoring
                  <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
                </button>
                <button
                  onClick={() => navigate("/login")}
                  className="rounded-full border border-border bg-muted/50 px-8 py-4 text-base font-bold text-foreground hover:bg-muted transition-all"
                >
                  View Demo
                </button>
              </div>
            </motion.div>

            {/* Stats row */}
            <motion.div 
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="mt-24 grid grid-cols-2 gap-8 lg:grid-cols-4"
            >
              {stats.map((stat) => (
                <div key={stat.label} className="flex flex-col items-center">
                  <span className="font-display text-3xl font-bold sm:text-4xl">{stat.value}</span>
                  <span className="mt-1 text-sm font-medium text-primary">{stat.label}</span>
                  <span className="mt-1 text-[10px] uppercase tracking-wider text-muted-foreground">{stat.sub}</span>
                </div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* What is Carbon Emission */}
      <section id="what-is-carbon" className="py-24 border-t border-border/50">
        <div className="mx-auto max-w-7xl px-6">
          <div className="grid grid-cols-1 gap-16 lg:grid-cols-2 lg:items-center">
            <div>
              <h2 className="font-display text-4xl font-bold sm:text-5xl">What is Carbon Emission?</h2>
              <p className="mt-6 text-lg text-muted-foreground leading-relaxed">
                Carbon emissions are the release of carbon dioxide (CO₂) into the atmosphere, primarily from human activities like burning fossil fuels. They are the leading cause of global warming and climate change.
              </p>
              
              <div className="mt-10 space-y-6">
                <div className="flex gap-4 p-6 rounded-2xl border border-border bg-card shadow-sm">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                    <Globe className="h-6 w-6" />
                  </div>
                  <div>
                    <h4 className="font-bold">Atmospheric Impact</h4>
                    <p className="mt-1 text-sm text-muted-foreground">CO₂ traps heat in the atmosphere, creating a greenhouse effect that raises global temperatures.</p>
                  </div>
                </div>
                <div className="flex gap-4 p-6 rounded-2xl border border-border bg-card shadow-sm">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                    <ShieldCheck className="h-6 w-6" />
                  </div>
                  <div>
                    <h4 className="font-bold">Corporate Responsibility</h4>
                    <p className="mt-1 text-sm text-muted-foreground">Every organization has a footprint. Measuring it is the first step towards accountability and regulatory compliance.</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="relative">
              <div className="aspect-square rounded-3xl bg-gradient-to-tr from-primary/20 to-secondary/20 p-8 flex flex-col justify-center border border-primary/10">
                <div className="space-y-4">
                  <div className="rounded-xl bg-background/80 backdrop-blur p-6 border border-border">
                    <p className="text-sm font-medium text-primary mb-2 uppercase tracking-wider">Fact Check</p>
                    <p className="text-xl font-display font-semibold italic">"We cannot manage what we do not measure."</p>
                    <p className="mt-4 text-sm text-muted-foreground leading-relaxed">
                      To reach Net Zero, organizations must first establish an accurate baseline of their Scope 1, 2, and 3 emissions. EcoLens automates this complex data collection.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Sources of Carbon Emission */}
      <section id="sources" className="py-24 bg-muted/30">
        <div className="mx-auto max-w-7xl px-6 text-center">
          <h2 className="font-display text-4xl font-bold sm:text-5xl">Major Sources of Emission</h2>
          <p className="mx-auto mt-4 max-w-2xl text-muted-foreground">Identifying where emissions originate is crucial for effective reduction strategies.</p>
          
          <div className="mt-16 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {sources.map((source, i) => (
              <motion.div 
                key={source.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="group flex flex-col items-start p-8 rounded-3xl border border-border bg-card text-left transition-all hover:border-primary/50 hover:shadow-lg hover:shadow-primary/5"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-muted group-hover:bg-primary transition-colors">
                  <source.icon className="h-6 w-6 text-foreground group-hover:text-primary-foreground" />
                </div>
                <h3 className="mt-6 text-xl font-bold">{source.title}</h3>
                <p className="mt-3 text-sm text-muted-foreground leading-relaxed">{source.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Emissions Occur in Industries */}
      <section className="py-24">
        <div className="mx-auto max-w-7xl px-6">
          <div className="text-center mb-16">
            <h2 className="font-display text-4xl font-bold sm:text-5xl">Why Emissions Occur in Industries</h2>
            <p className="mt-4 text-muted-foreground max-w-2xl mx-auto">Understanding the root causes of industrial environmental impact.</p>
          </div>
          
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
            {causes.map((cause) => (
              <div key={cause.title} className="p-8 rounded-2xl border border-border bg-card/50">
                <cause.icon className="h-8 w-8 text-primary mb-6" />
                <h4 className="text-lg font-bold mb-3">{cause.title}</h4>
                <p className="text-sm text-muted-foreground leading-relaxed">{cause.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Scope 1/2/3 Breakdown */}
      <section id="scopes" className="py-24 bg-background border-y border-border/50 overflow-hidden">
        <div className="mx-auto max-w-7xl px-6">
          <div className="text-center mb-20">
            <h2 className="font-display text-4xl font-bold sm:text-5xl">Understanding the Scopes</h2>
            <p className="mt-4 text-muted-foreground max-w-2xl mx-auto">Categorizing emissions for precise reporting and targeted action.</p>
          </div>

          <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
            {[
              { label: "Scope 1", color: "bg-primary", title: "Direct Emissions", desc: "Emissions from sources that an organization owns or controls directly. (e.g., burning fuel in company vehicles)." },
              { label: "Scope 2", color: "bg-blue-500", title: "Indirect Emissions", desc: "Emissions from the generation of purchased electricity, steam, heating, and cooling consumed by the organization." },
              { label: "Scope 3", color: "bg-purple-500", title: "Value Chain Emissions", desc: "All other indirect emissions that occur in the value chain, including both upstream and downstream activities." }
            ].map((scope) => (
              <div key={scope.label} className="relative p-8 rounded-3xl border border-border bg-card shadow-sm overflow-hidden group">
                <div className={`absolute top-0 right-0 h-1.5 w-full ${scope.color}`} />
                <span className={`text-xs font-bold uppercase tracking-wider mb-4 inline-block px-2 py-1 rounded ${scope.color.replace('bg-', 'text-')} bg-opacity-10`}>{scope.label}</span>
                <h4 className="text-2xl font-display font-bold mb-4">{scope.title}</h4>
                <p className="text-sm text-muted-foreground leading-relaxed">{scope.desc}</p>
              </div>
            ))}
          </div>

          {/* Visualization bar */}
          <div className="mt-20 p-10 rounded-3xl border border-border bg-muted/30">
            <p className="text-center text-xs font-bold uppercase tracking-widest text-muted-foreground mb-10">Typical Corporate Emission Distribution</p>
            <div className="h-6 w-full rounded-full bg-border/50 flex overflow-hidden shadow-inner">
              <div className="h-full bg-primary" style={{ width: '15%' }} />
              <div className="h-full bg-blue-500" style={{ width: '20%' }} />
              <div className="h-full bg-purple-500" style={{ width: '65%' }} />
            </div>
            <div className="mt-6 flex flex-wrap justify-center gap-8">
              <div className="flex items-center gap-2"><div className="h-3 w-3 rounded-full bg-primary" /><span className="text-xs font-medium">Scope 1 (15%)</span></div>
              <div className="flex items-center gap-2"><div className="h-3 w-3 rounded-full bg-blue-500" /><span className="text-xs font-medium">Scope 2 (20%)</span></div>
              <div className="flex items-center gap-2"><div className="h-3 w-3 rounded-full bg-purple-500" /><span className="text-xs font-medium">Scope 3 (65%)</span></div>
            </div>
          </div>
        </div>
      </section>

      {/* Tips to Reduce */}
      <section id="reduce" className="py-24">
        <div className="mx-auto max-w-7xl px-6 text-center">
          <h2 className="font-display text-4xl font-bold sm:text-5xl">How to Reduce Emissions</h2>
          <p className="mx-auto mt-4 max-w-2xl text-muted-foreground leading-relaxed">Strategic actions every industry can take to lower their environmental impact.</p>
          
          <div className="mt-16 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {reductionTips.map((tip, i) => (
              <motion.div 
                key={tip.title}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.05 }}
                className="flex items-start gap-5 p-8 rounded-3xl border border-border bg-card text-left transition-all hover:shadow-md"
              >
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                  <tip.icon className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="text-lg font-bold">{tip.title}</h3>
                  <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{tip.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24">
        <div className="mx-auto max-w-7xl px-6">
          <div className="relative overflow-hidden rounded-[3rem] bg-foreground px-10 py-24 text-center text-background">
            <div className="absolute inset-0 -z-10 opacity-20 bg-[radial-gradient(circle_at_50%_-20%,rgba(16,185,129,0.8),transparent_70%)]" />
            <h2 className="font-display text-4xl font-bold sm:text-6xl tracking-tight">Ready to lead the change?</h2>
            <p className="mx-auto mt-8 max-w-xl text-lg text-background/70">
              Join hundreds of organizations already using EcoLens to map their journey to Net Zero.
            </p>
            <div className="mt-10 flex flex-wrap justify-center gap-4">
              <button 
                onClick={() => navigate("/login")}
                className="rounded-full bg-primary px-8 py-4 text-base font-bold text-primary-foreground hover:brightness-110 transition-all glow-green"
              >
                Get Started for Free
              </button>
              <button 
                onClick={() => navigate("/login")}
                className="rounded-full border border-background/20 bg-background/10 px-8 py-4 text-base font-bold text-background hover:bg-background/20 transition-all"
              >
                Schedule a Consultation
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-16 border-t border-border/50 bg-muted/10">
        <div className="mx-auto max-w-7xl px-6">
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-4">
            <div className="lg:col-span-2">
              <div className="flex items-center gap-2.5 mb-6">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
                  <Factory className="h-4 w-4 text-primary-foreground" />
                </div>
                <span className="font-display text-lg font-bold tracking-tight">EcoLens</span>
              </div>
              <p className="text-sm text-muted-foreground max-w-xs leading-relaxed">
                Empowering industries with high-fidelity environmental data and predictive carbon intelligence since 2024.
              </p>
              <div className="mt-8 flex gap-4">
                {['Twitter', 'LinkedIn', 'GitHub'].map(social => (
                  <span key={social} className="text-xs font-semibold text-primary cursor-pointer hover:underline">{social}</span>
                ))}
              </div>
            </div>
            
            <div>
              <h5 className="font-bold mb-6 text-sm uppercase tracking-widest text-muted-foreground">Resources</h5>
              <ul className="space-y-4 text-sm font-medium">
                {['Documentation', 'API Reference', 'Case Studies', 'ESG Frameworks'].map(item => (
                  <li key={item} className="text-muted-foreground hover:text-primary cursor-pointer transition-colors">{item}</li>
                ))}
              </ul>
            </div>

            <div>
              <h5 className="font-bold mb-6 text-sm uppercase tracking-widest text-muted-foreground">Company</h5>
              <ul className="space-y-4 text-sm font-medium">
                {['About Us', 'Sustainability', 'Security', 'Privacy Policy'].map(item => (
                  <li key={item} className="text-muted-foreground hover:text-primary cursor-pointer transition-colors">{item}</li>
                ))}
              </ul>
            </div>
          </div>
          <div className="mt-20 pt-8 border-t border-border/30 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-xs text-muted-foreground">© 2024 EcoLens Intelligence Inc. Built for the future of our planet.</p>
            <div className="flex gap-6 items-center">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-primary" />
                <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">GDPR Compliant</span>
              </div>
              <div className="flex items-center gap-2">
                <ShieldCheck className="h-4 w-4 text-primary" />
                <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">SOC2 Type II</span>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
