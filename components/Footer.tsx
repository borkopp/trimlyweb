import Link from "next/link";
import {Facebook, Twitter, Instagram, Linkedin, Mail} from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-secondary text-secondary-foreground">
      <div className="container mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="mb-8 md:mb-0">
            <Link href="/" className="text-4xl font-bold text-primary font-ff">
              fadely
            </Link>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/about" className="hover:text-primary transition-colors">
                  Features
                </Link>
              </li>
              <li>
                <Link href="/pricing" className="hover:text-primary transition-colors">
                  Pricing
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-primary transition-colors">
                  Contact
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4">Legal</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/privacy" className="hover:text-primary transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="hover:text-primary transition-colors">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link href="/cookies" className="hover:text-primary transition-colors">
                  Cookie Policy
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4">Connect</h3>
            <div className="flex space-x-4">
              <a href="#" className="text-secondary-foreground hover:text-primary transition-colors">
                <Facebook size={24} />
                <span className="sr-only">Facebook</span>
              </a>
              <a href="#" className="text-secondary-foreground hover:text-primary transition-colors">
                <Twitter size={24} />
                <span className="sr-only">Twitter</span>
              </a>
              <a href="#" className="text-secondary-foreground hover:text-primary transition-colors">
                <Instagram size={24} />
                <span className="sr-only">Instagram</span>
              </a>
              <a href="#" className="text-secondary-foreground hover:text-primary transition-colors">
                <Linkedin size={24} />
                <span className="sr-only">LinkedIn</span>
              </a>
            </div>
            <div className="mt-4">
              <a href="mailto:info@fadely.app" className="flex items-center text-sm hover:text-primary transition-colors">
                <Mail size={16} className="mr-2" />
                info@fadely.app
              </a>
            </div>
          </div>
        </div>
        <div className="border-t border-secondary-foreground/10 mt-12 pt-8 text-center text-sm">
          <p>&copy; {new Date().getFullYear()} fadely. All rights reserved.</p>
          <p className="text-xs text-secondary-foreground/50 mt-2">Website is currently under development.</p>
        </div>
      </div>
    </footer>
  );
}
