import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="w-full bg-midnight py-12 text-white/80 border-t border-white/5 relative z-20">
      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-12 px-6 md:grid-cols-4 lg:px-8">
        
        {/* Brand */}
        <div className="col-span-1 md:col-span-2">
          <div className="mb-4 flex items-center gap-2">
            <span className="text-2xl font-bold tracking-tight text-white">ADVYON</span>
          </div>
          <p className="max-w-xs text-sm leading-relaxed text-white/60">
            Empowering legal professionals with AI-driven insights, secure collaboration, and seamless case management.
          </p>
        </div>

        {/* Links Column 1 */}
        <div className="flex flex-col gap-4">
          <h3 className="text-sm font-semibold text-white">Product</h3>
          <Link to="/how-to-use" className="text-sm text-white/60 hover:text-teal-300 transition-colors">How to Use</Link>
          <Link to="/security" className="text-sm text-white/60 hover:text-teal-300 transition-colors">Security</Link>
          <Link to="/" className="text-sm text-white/60 hover:text-teal-300 transition-colors">Pricing</Link>
          <Link to="/blog" className="text-sm text-white/60 hover:text-teal-300 transition-colors">Updates</Link>
        </div>

        {/* Links Column 2 */}
        <div className="flex flex-col gap-4">
          <h3 className="text-sm font-semibold text-white">Company</h3>
          <Link to="/about" className="text-sm text-white/60 hover:text-teal-300 transition-colors">About Us</Link>
          <Link to="/careers" className="text-sm text-white/60 hover:text-teal-300 transition-colors">Careers</Link>
          <Link to="/terms" className="text-sm text-white/60 hover:text-teal-300 transition-colors">Terms of Service</Link>
          <Link to="/privacy" className="text-sm text-white/60 hover:text-teal-300 transition-colors">Privacy Policy</Link>
        </div>
      </div>

      <div className="mx-auto mt-12 max-w-7xl border-t border-white/10 px-6 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-white/40 lg:px-8">
        <div>&copy; {new Date().getFullYear()} Advyon. All rights reserved.</div>
        <div className="flex gap-6">
            <Link to="/cookies" className="hover:text-white transition-colors">Cookie Policy</Link>
            <Link to="/accessibility" className="hover:text-white transition-colors">Accessibility</Link>
        </div>
      </div>
    </footer>
  );
}
