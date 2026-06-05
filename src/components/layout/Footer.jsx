import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGlobe, faEnvelope } from "@fortawesome/free-solid-svg-icons";

export default function Footer() {
  return (
    <footer className="bg-secondary-container border-t border-outline/20 mt-20">
      <div className="container mx-auto px-4 lg:px-8 py-14">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Brand */}

          <div>
            <h2 className="text-2xl font-bold text-primary mb-4">SUFRA</h2>

            <p className="text-text-secondary leading-7">
              Celebrating home-cooked heritage and authentic flavors from local
              chefs around the world.
            </p>

            <div className="flex gap-4 mt-5">
              <FontAwesomeIcon icon={faGlobe} className="text-lg" />

              <FontAwesomeIcon icon={faEnvelope} className="text-lg" />
            </div>
          </div>

          {/* Platform */}

          <div>
            <h3 className="font-semibold mb-4">Platform</h3>

            <ul className="space-y-3">
              <li>
                <Link href="/how-it-works">How It Works</Link>
              </li>

              <li>
                <Link href="/become-chef">Become A Chef</Link>
              </li>

              <li>
                <Link href="/">Safety & Trust</Link>
              </li>
            </ul>
          </div>

          {/* Legal */}

          <div>
            <h3 className="font-semibold mb-4">Legal</h3>

            <ul className="space-y-3">
              <li>
                <Link href="/">Privacy Policy</Link>
              </li>

              <li>
                <Link href="/">Terms Of Service</Link>
              </li>
            </ul>
          </div>

          {/* Community */}

          <div>
            <h3 className="font-semibold mb-4">Community</h3>

            <ul className="space-y-3">
              <li>
                <Link href="/">Help Center</Link>
              </li>

              <li>
                <Link href="/">Blog</Link>
              </li>

              <li>
                <Link href="/">Contact Us</Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-outline/20 mt-10 pt-6 text-center text-sm text-text-secondary">
          © 2026 Sufra. All Rights Reserved.
        </div>
      </div>
    </footer>
  );
}
