import Link from "next/link";

export function Footer() {
  return (
    <footer className="border-t border-slate-800 bg-slate-950 py-12 text-slate-400">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div className="md:col-span-2">
            <Link href="/" className="inline-block mb-4">
              <span className="text-2xl font-bold bg-gradient-to-r from-teal-400 to-cyan-500 bg-clip-text text-transparent">
                JobPulse
              </span>
            </Link>
            <p className="text-sm max-w-sm mb-4">
              India's Real-Time Job Engine. We monitor thousands of career pages so you never miss a fresh opportunity.
            </p>
          </div>
          
          <div>
            <h3 className="text-slate-200 font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              <li><Link href="/" className="hover:text-white transition-colors">Jobs</Link></li>
              <li><Link href="/companies" className="hover:text-white transition-colors">Companies</Link></li>
              <li><Link href="#" className="hover:text-white transition-colors">About Us</Link></li>
              <li><Link href="#" className="hover:text-white transition-colors">Contact</Link></li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-slate-200 font-semibold mb-4">Legal</h3>
            <ul className="space-y-2 text-sm">
              <li><Link href="#" className="hover:text-white transition-colors">Privacy Policy</Link></li>
              <li><Link href="#" className="hover:text-white transition-colors">Terms of Service</Link></li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-slate-800 pt-8 flex flex-col md:flex-row items-center justify-between text-sm">
          <p>© {new Date().getFullYear()} JobPulse. All rights reserved.</p>
          <p className="mt-4 md:mt-0">Made with ❤️ in India</p>
        </div>
      </div>
    </footer>
  );
}
