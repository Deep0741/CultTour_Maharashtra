import { Link } from 'react-router-dom';
import { FiMapPin, FiMail, FiPhone } from 'react-icons/fi';
import { FaFacebookF, FaTwitter, FaInstagram, FaLinkedinIn } from 'react-icons/fa';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="relative bg-dark-gradient text-white mt-auto overflow-hidden">
      {/* Decorative top gradient line */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary-400 via-primary-500 to-accent-500" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">

          {/* Brand */}
          <div className="lg:col-span-1">
            <Link to="/" className="inline-flex items-center gap-1.5 mb-4">
              <span className="text-2xl font-extrabold bg-gradient-to-r from-primary-400 to-primary-300 bg-clip-text text-transparent">CulTour</span>
              <span className="text-lg font-semibold text-surface-400">Maharashtra</span>
            </Link>
            <p className="text-surface-400 text-sm leading-relaxed mb-6">
              Explore the rich cultural heritage, historic forts, and authentic cuisine of Maharashtra with expert local guides.
            </p>
            <div className="flex gap-3">
              {[
                { icon: <FaFacebookF size={14} />, href: '#' },
                { icon: <FaTwitter size={14} />, href: '#' },
                { icon: <FaInstagram size={14} />, href: '#' },
                { icon: <FaLinkedinIn size={14} />, href: '#' },
              ].map((social, i) => (
                <a
                  key={i}
                  href={social.href}
                  className="w-9 h-9 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-surface-400 hover:bg-primary-500 hover:text-white hover:border-primary-500 transition-all duration-300 hover:scale-110"
                >
                  {social.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wider text-surface-300 mb-5">Explore</h4>
            <ul className="space-y-3">
              {[
                { to: '/destinations', label: 'Destinations' },
                { to: '/cuisines', label: 'Cuisines' },
                { to: '/guides', label: 'Expert Guides' },
                { to: '/register', label: 'Get Started' },
              ].map(link => (
                <li key={link.to}>
                  <Link
                    to={link.to}
                    className="text-surface-400 hover:text-primary-400 transition-colors duration-300 text-sm inline-flex items-center gap-2 group"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-surface-600 group-hover:bg-primary-400 transition-colors" />
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wider text-surface-300 mb-5">Support</h4>
            <ul className="space-y-3">
              {['Contact Us', 'FAQ', 'Terms of Service', 'Privacy Policy'].map(item => (
                <li key={item}>
                  <a
                    href="#"
                    className="text-surface-400 hover:text-primary-400 transition-colors duration-300 text-sm inline-flex items-center gap-2 group"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-surface-600 group-hover:bg-primary-400 transition-colors" />
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wider text-surface-300 mb-5">Contact</h4>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <FiMapPin className="text-primary-400 mt-0.5 flex-shrink-0" size={16} />
                <span className="text-surface-400 text-sm">Mumbai, Maharashtra, India</span>
              </li>
              <li className="flex items-center gap-3">
                <FiMail className="text-primary-400 flex-shrink-0" size={16} />
                <span className="text-surface-400 text-sm">hello@cultour.in</span>
              </li>
              <li className="flex items-center gap-3">
                <FiPhone className="text-primary-400 flex-shrink-0" size={16} />
                <span className="text-surface-400 text-sm">+91 98765 43210</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="border-t border-white/10 mt-12 pt-8 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-surface-500 text-sm">
            &copy; {currentYear} CulTour Maharashtra. All rights reserved.
          </p>
          <p className="text-surface-600 text-xs">
            Made with ❤️ for Maharashtra's Heritage
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
