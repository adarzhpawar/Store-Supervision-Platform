import Link from "next/link";
import { PlayCircle, LayoutDashboard, TrendingUp, Users, Package, Receipt, FileText, Store } from "lucide-react";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background font-body text-foreground selection:bg-primary/20 selection:text-primary">
      {/* Header */}
      <header className="flex justify-between items-center px-8 md:px-16 py-6 border-b border-border/10">
        <div className="flex items-center gap-2 text-primary font-bold text-xl tracking-tight">
          <Store className="w-6 h-6" />
          StoreSync
        </div>
        <nav className="hidden md:flex gap-8 font-mono text-xs uppercase tracking-widest text-secondary">
          <Link href="#features" className="hover:text-foreground transition-colors">Features</Link>
          <Link href="#creators" className="hover:text-foreground transition-colors">Creators</Link>
          <Link href="#about" className="hover:text-foreground transition-colors">About</Link>
        </nav>
        <div className="flex items-center gap-4 font-mono text-xs uppercase tracking-widest">
          <Link href="/dashboard" className="btn-primary">Get Started</Link>
        </div>
      </header>

      {/* Hero Section */}
      <section className="px-8 md:px-16 py-32 flex flex-col items-center text-center max-w-4xl mx-auto space-y-8">
        <div className="flex items-center gap-2 text-primary font-mono text-xs uppercase tracking-widest">
          <span className="w-2 h-2 rounded-full bg-primary"></span>
          Store Management SaaS
        </div>
        <h1 className="text-5xl md:text-7xl font-display font-medium leading-tight tracking-tight">
          Manage Your Entire Store From One <span className="text-primary">Powerful</span> Dashboard
        </h1>
        <p className="text-lg text-secondary max-w-xl leading-relaxed">
          Track inventory, manage workers, monitor revenue and generate bills instantly. A minimalist approach to complex operational data.
        </p>
        <div className="flex flex-wrap justify-center gap-4 pt-4">
          <Link href="/dashboard" className="coral-action">Start Managing</Link>
          <button className="btn-secondary flex items-center gap-2">
            <PlayCircle className="w-4 h-4" /> Watch Demo
          </button>
        </div>
      </section>

      {/* Capabilities Section */}
      <section id="features" className="px-8 md:px-16 py-24 bg-surface-container-low/50 border-y border-border/10">
        <div className="mb-16 max-w-2xl mx-auto text-center">
          <h2 className="text-4xl font-display font-medium mb-4">Core Capabilities</h2>
          <p className="text-secondary text-lg">Everything you need to run your store efficiently, stripped of unnecessary complexity.</p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-6 max-w-6xl mx-auto">
          <FeatureCard 
            icon={<LayoutDashboard />}
            title="Dashboard Overview"
            desc="A unified view of your entire operation. Monitor key metrics, alerts, and daily summaries at a glance."
          />
          <FeatureCard 
            icon={<TrendingUp />}
            title="Revenue Analytics"
            desc="Deep dive into sales trends, profit margins, and peak hours with beautiful, minimalist charts."
            highlight
          />
          <FeatureCard 
            icon={<Users />}
            title="Worker Management"
            desc="Track shifts, manage payroll, and monitor staff performance seamlessly within the same platform."
          />
          <FeatureCard 
            icon={<Package />}
            title="Inventory Tracking"
            desc="Real-time stock levels, automated reorder alerts, and shrinkage reporting to keep shelves stocked."
          />
          <FeatureCard 
            icon={<Receipt />}
            title="Fast Billing"
            desc="Lightning-fast checkout process, digital receipts, and integrated payment gateway support."
          />
          <FeatureCard 
            icon={<FileText />}
            title="Store Reports"
            desc="Generate comprehensive PDF reports for accounting, auditing, and stakeholder meetings with one click."
          />
        </div>
      </section>

      {/* Stats Section */}
      <section className="px-8 md:px-16 py-24 flex flex-col md:flex-row justify-center items-center gap-16 md:gap-32 border-b border-border/10 text-center">
        <div>
          <div className="text-6xl md:text-8xl font-display font-medium text-primary mb-2 tracking-tighter">10k+</div>
          <div className="font-mono text-xs text-secondary uppercase tracking-widest">Bills Generated</div>
        </div>
        <div className="hidden md:block w-px h-24 bg-border/20"></div>
        <div>
          <div className="text-6xl md:text-8xl font-display font-medium mb-2 tracking-tighter">500+</div>
          <div className="font-mono text-xs text-secondary uppercase tracking-widest">Stores Managed</div>
        </div>
        <div className="hidden md:block w-px h-24 bg-border/20"></div>
        <div>
          <div className="text-6xl md:text-8xl font-display font-medium mb-2 tracking-tighter">99.9%</div>
          <div className="font-mono text-xs text-secondary uppercase tracking-widest">Uptime Guarantee</div>
        </div>
      </section>

      {/* Creators Section */}
      <section id="creators" className="px-8 md:px-16 py-24 max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-display font-medium mb-4">Meet The Creators</h2>
          <p className="text-secondary text-lg">The team behind StoreSync's Scandinavian precision.</p>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          <CreatorCard name="Adarsh" role="Lead Developer" />
          <CreatorCard name="Krish" role="UI/UX Designer" />
          <CreatorCard name="Mayur" role="Backend Engineer" />
          <CreatorCard name="Anmol" role="Product Manager" />
        </div>
      </section>

      {/* Footer */}
      <footer className="px-8 md:px-16 py-12 border-t border-border/10 bg-surface-container-lowest grid md:grid-cols-4 gap-8">
        <div className="md:col-span-1">
          <div className="flex items-center gap-2 text-primary font-bold text-xl tracking-tight mb-4">
            <Store className="w-5 h-5" />
            StoreSync
          </div>
          <p className="text-secondary text-sm">
            © 2026 StoreSync. Designed for Scandinavian precision.
          </p>
        </div>
        <div className="flex flex-col gap-3 text-sm">
          <span className="font-mono text-[10px] uppercase tracking-widest text-secondary mb-2">Legal</span>
          <Link href="#" className="hover:text-primary transition-colors">Privacy Policy</Link>
          <Link href="#" className="hover:text-primary transition-colors">Terms of Service</Link>
        </div>
        <div className="flex flex-col gap-3 text-sm">
          <span className="font-mono text-[10px] uppercase tracking-widest text-secondary mb-2">Company</span>
          <Link href="#" className="hover:text-primary transition-colors">Contact</Link>
        </div>
        <div className="flex flex-col gap-3 text-sm">
          <span className="font-mono text-[10px] uppercase tracking-widest text-secondary mb-2">Social</span>
          <Link href="#" className="hover:text-primary transition-colors">LinkedIn</Link>
          <Link href="#" className="hover:text-primary transition-colors">X</Link>
        </div>
      </footer>
    </div>
  );
}

function FeatureCard({ icon, title, desc, highlight = false }: { icon: React.ReactNode, title: string, desc: string, highlight?: boolean }) {
  return (
    <div className="premium-card bg-transparent flex flex-col items-start text-left h-full">
      <div className={`w-12 h-12 rounded-full flex items-center justify-center mb-6 ${highlight ? 'bg-primary text-primary-foreground' : 'bg-foreground text-background'}`}>
        {icon}
      </div>
      <h3 className="text-xl font-medium mb-3">{title}</h3>
      <p className="text-secondary text-sm leading-relaxed">{desc}</p>
    </div>
  );
}

function CreatorCard({ name, role }: { name: string, role: string }) {
  return (
    <div className="premium-card bg-transparent flex flex-col items-center text-center p-8 transition-transform hover:-translate-y-2 duration-300">
      <div className="w-20 h-20 rounded-full bg-surface-container-high border border-outline/10 mb-4 flex items-center justify-center text-3xl font-display text-secondary">
        {name.charAt(0)}
      </div>
      <h3 className="text-xl font-medium mb-1">{name}</h3>
      <p className="text-secondary font-mono text-[10px] uppercase tracking-widest">{role}</p>
    </div>
  );
}
