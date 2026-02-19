export default function Footer() {
  return (
    <footer className="w-full bg-midnight py-12 text-white/80">
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
          <a href="#" className="text-sm text-white/60 hover:text-accent">Features</a>
          <a href="#" className="text-sm text-white/60 hover:text-accent">Security</a>
          <a href="#" className="text-sm text-white/60 hover:text-accent">Pricing</a>
          <a href="#" className="text-sm text-white/60 hover:text-accent">Case Studies</a>
        </div>

        {/* Links Column 2 */}
        <div className="flex flex-col gap-4">
          <h3 className="text-sm font-semibold text-white">Company</h3>
          <a href="#" className="text-sm text-white/60 hover:text-accent">About Us</a>
          <a href="#" className="text-sm text-white/60 hover:text-accent">Careers</a>
          <a href="#" className="text-sm text-white/60 hover:text-accent">Legal Database</a>
          <a href="#" className="text-sm text-white/60 hover:text-accent">Contact</a>
        </div>
      </div>

      <div className="mx-auto mt-12 max-w-7xl border-t border-white/10 px-6 pt-8 text-center text-xs text-white/40 lg:px-8">
        &copy; {new Date().getFullYear()} Advyon. All rights reserved.
      </div>
    </footer>
  );
}
