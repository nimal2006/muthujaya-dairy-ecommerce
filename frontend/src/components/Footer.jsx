import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  FiPhone,
  FiMail,
  FiMapPin,
  FiInstagram,
  FiFacebook,
  FiTwitter,
  FiYoutube,
  FiHeart,
  FiArrowRight,
} from "react-icons/fi";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const footerLinks = {
    quickLinks: [
      { name: "Home", to: "/", type: "link" },
      { name: "Features", href: "#features", type: "anchor" },
      { name: "Products", href: "#products", type: "anchor" },
      { name: "About Us", href: "#about", type: "anchor" },
      { name: "Contact", href: "#contact", type: "anchor" },
    ],
    products: [
      "Fresh Cow Milk",
      "Buffalo Milk",
      "Fresh Curd",
      "Pure Ghee",
      "Buttermilk",
      "Fresh Paneer",
    ],
    legal: [
      { name: "Privacy Policy", href: "#" },
      { name: "Terms of Service", href: "#" },
      { name: "Refund Policy", href: "#" },
    ],
  };

  const socialLinks = [
    {
      icon: FiFacebook,
      href: "#",
      label: "Facebook",
      color: "hover:bg-blue-600",
    },
    {
      icon: FiInstagram,
      href: "#",
      label: "Instagram",
      color:
        "hover:bg-gradient-to-tr hover:from-yellow-400 hover:via-red-500 hover:to-purple-600",
    },
    { icon: FiTwitter, href: "#", label: "Twitter", color: "hover:bg-sky-500" },
    { icon: FiYoutube, href: "#", label: "YouTube", color: "hover:bg-red-600" },
  ];

  return (
    <footer className="relative overflow-hidden">
      {/* Premium Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-gray-900 via-gray-900 to-black" />
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary-500/50 to-transparent" />

      {/* Decorative elements */}
      <div className="absolute top-20 left-10 w-64 h-64 bg-primary-500/5 rounded-full blur-3xl" />
      <div className="absolute bottom-20 right-10 w-64 h-64 bg-nature-500/5 rounded-full blur-3xl" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-8">
        {/* Newsletter Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="glass-dark rounded-3xl p-8 md:p-10 mb-16"
        >
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div>
              <h3 className="text-2xl md:text-3xl font-bold text-white mb-3">
                Stay Fresh, Stay Updated
              </h3>
              <p className="text-gray-400">
                Subscribe to our newsletter for exclusive offers, recipes, and
                dairy tips!
              </p>
            </div>
            <div className="flex gap-3">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-5 py-4 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-primary-500 transition-colors"
              />
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="px-6 py-4 bg-gradient-to-r from-primary-500 to-nature-500 text-white font-semibold rounded-xl hover:shadow-lg hover:shadow-primary-500/30 transition-all flex items-center gap-2"
              >
                Subscribe
                <FiArrowRight className="w-5 h-5" />
              </motion.button>
            </div>
          </div>
        </motion.div>

        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          {/* Brand */}
          <div className="space-y-6">
            <Link to="/" className="inline-flex items-center gap-3 group">
              <motion.div
                whileHover={{ scale: 1.05, rotate: 5 }}
                className="w-14 h-14 bg-gradient-to-br from-primary-400 via-primary-500 to-nature-500 rounded-2xl flex items-center justify-center shadow-lg shadow-primary-500/30"
              >
                <span className="text-3xl">🥛</span>
              </motion.div>
              <div>
                <h3 className="font-bold text-white text-xl">Muthujaya</h3>
                <p className="text-sm text-gray-500 tracking-wider">
                  DAIRY FARM
                </p>
              </div>
            </Link>
            <p className="text-primary-400 font-medium italic">
              🥰 "Nambi vanga sandhosam ah ponga"
            </p>
            <p className="text-gray-400 text-sm leading-relaxed">
              Bringing farm-fresh dairy products to your doorstep every morning
              since 2003. Quality you can taste, service you can trust.
            </p>

            {/* Social Links */}
            <div className="flex gap-3">
              {socialLinks.map((social, index) => (
                <motion.a
                  key={index}
                  href={social.href}
                  whileHover={{ scale: 1.1, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  className={`w-11 h-11 bg-white/5 border border-white/10 rounded-xl flex items-center justify-center text-gray-400 hover:text-white hover:border-transparent transition-all duration-300 ${social.color}`}
                  aria-label={social.label}
                >
                  <social.icon className="w-5 h-5" />
                </motion.a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold text-white text-lg mb-6">
              Quick Links
            </h4>
            <ul className="space-y-3">
              {footerLinks.quickLinks.map((link, index) => (
                <li key={index}>
                  {link.type === "link" ? (
                    <Link
                      to={link.to}
                      className="text-gray-400 hover:text-primary-400 transition-colors inline-flex items-center gap-2 group"
                    >
                      <span className="w-1.5 h-1.5 bg-gray-600 rounded-full group-hover:bg-primary-400 transition-colors" />
                      {link.name}
                    </Link>
                  ) : (
                    <a
                      href={link.href}
                      className="text-gray-400 hover:text-primary-400 transition-colors inline-flex items-center gap-2 group"
                    >
                      <span className="w-1.5 h-1.5 bg-gray-600 rounded-full group-hover:bg-primary-400 transition-colors" />
                      {link.name}
                    </a>
                  )}
                </li>
              ))}
            </ul>
          </div>

          {/* Products */}
          <div>
            <h4 className="font-semibold text-white text-lg mb-6">
              Our Products
            </h4>
            <ul className="space-y-3">
              {footerLinks.products.map((product, index) => (
                <li
                  key={index}
                  className="text-gray-400 inline-flex items-center gap-2"
                >
                  <span className="w-1.5 h-1.5 bg-gray-600 rounded-full" />
                  {product}
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-semibold text-white text-lg mb-6">
              Contact Us
            </h4>
            <ul className="space-y-4">
              <li>
                <a
                  href="tel:+919876543210"
                  className="flex items-center gap-4 group"
                >
                  <div className="w-10 h-10 bg-primary-500/10 rounded-xl flex items-center justify-center group-hover:bg-primary-500/20 transition-colors">
                    <FiPhone className="w-5 h-5 text-primary-400" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Call us</p>
                    <p className="text-gray-300 group-hover:text-primary-400 transition-colors">
                      +91 98765 43210
                    </p>
                  </div>
                </a>
              </li>
              <li>
                <a
                  href="mailto:contact@muthujaya.com"
                  className="flex items-center gap-4 group"
                >
                  <div className="w-10 h-10 bg-nature-500/10 rounded-xl flex items-center justify-center group-hover:bg-nature-500/20 transition-colors">
                    <FiMail className="w-5 h-5 text-nature-400" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Email us</p>
                    <p className="text-gray-300 group-hover:text-nature-400 transition-colors">
                      contact@muthujaya.com
                    </p>
                  </div>
                </a>
              </li>
              <li>
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-sky-500/10 rounded-xl flex items-center justify-center flex-shrink-0">
                    <FiMapPin className="w-5 h-5 text-sky-400" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Visit us</p>
                    <p className="text-gray-300">
                      Muthujaya Dairy Farm,
                      <br />
                      Tamil Nadu, India
                    </p>
                  </div>
                </div>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-white/10 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-gray-500 flex items-center gap-1">
              © {currentYear} Muthujaya Dairy Farm. Made with{" "}
              <FiHeart className="w-4 h-4 text-red-500 fill-red-500" /> in Tamil
              Nadu
            </p>
            <div className="flex flex-wrap justify-center gap-6 text-sm text-gray-500">
              {footerLinks.legal.map((link, index) => (
                <a
                  key={index}
                  href={link.href}
                  className="hover:text-primary-400 transition-colors"
                >
                  {link.name}
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
