import { Link } from "react-router-dom";
import { FaFacebook, FaInstagram, FaGithub, FaLinkedin, FaYoutube, FaSnapchat } from "react-icons/fa";

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="relative mt-20">

      {/* Soft Gradient Background */}
      <div className="absolute inset-0 bg-linear-to-br from-purple-100 via-pink-100 to-blue-100 
                      opacity-70 blur-2xl rounded-t-3xl"></div>

      <div className="relative max-w-7xl mx-auto px-6 py-12">

        {/* ========== TOP GRID ========== */}
        <div className="grid sm:grid-cols-3 gap-12">

          {/* BRAND */}
          <div>
            <h2
              className="text-3xl font-extrabold 
              bg-gradient-to-r from-purple-600 via-pink-500 to-blue-500
              bg-clip-text text-transparent"
            >
              Blogify
            </h2>

            <p className="mt-3 text-gray-600 text-sm leading-relaxed">
              A modern blogging platform crafted to share ideas, stories, and creativity.
            </p>
          </div>

          {/* QUICK LINKS */}
          <div>
            <h3 className="text-lg font-semibold text-gray-700 mb-3">Quick Links</h3>

            <ul className="space-y-2 text-sm">
              <li><Link to="/" className="hover:text-purple-600 transition">Home</Link></li>
              <li><Link to="/create" className="hover:text-purple-600 transition">Create Post</Link></li>
              <li><Link to="/profile" className="hover:text-purple-600 transition">Profile</Link></li>
              <li><Link to="/admin" className="hover:text-purple-600 transition">Admin Panel</Link></li>
            </ul>
          </div>

          {/* SOCIAL / YOUR ACCOUNTS */}
          <div>
            <h3 className="text-lg font-semibold text-gray-700 mb-3">Follow Me</h3>

            <div className="flex gap-4 text-purple-600 text-3xl">

              <a
                href="https://www.youtube.com/@nomiii013"
                target="_blank"
                rel="noreferrer"
                className="hover:scale-110 transition-transform"
              >
                <FaYoutube />
              </a>

              <a
                href="https://www.facebook.com/share/1CtooPYzBt/?mibextid=wwXIfr"
                target="_blank"
                rel="noreferrer"
                className="hover:scale-110 transition-transform"
              >
                <FaFacebook />
              </a>

              <a
                href="https://www.instagram.com/muhammad_nouman_arshad_013?igsh=aGRndHpoNGY0dnZs&utm_source=qr"
                target="_blank"
                rel="noreferrer"
                className="hover:scale-110 transition-transform"
              >
                <FaInstagram />
              </a>

              <a
                href="https://snapchat.com/t/sk0fqtWl"
                target="_blank"
                rel="noreferrer"
                className="hover:scale-110 transition-transform"
              >
                <FaSnapchat />
              </a>

            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="text-center mt-10 pt-6 border-t border-gray-300 text-gray-600 text-sm">
          © {year} Blogify — Made with 💜 by nomiii013
        </div>

      </div>
    </footer>
  );
}