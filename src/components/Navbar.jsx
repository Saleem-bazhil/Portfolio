import React, { memo, useCallback, useEffect, useRef, useState } from "react";
import { Disclosure } from "@headlessui/react";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";
import { motion, AnimatePresence } from "framer-motion";

const navigation = [
  { name: "Home", href: "#hero" },
  { name: "Skills", href: "#skill2" },
  { name: "About", href: "#about" },
  { name: "Projects", href: "#project" },
  { name: "Experience", href: "#contact" },
];

const SECTION_MAP = {
  hero: "Home",
  skill2: "Skills",
  about: "About",
  project: "Projects",
  contact: "Experience",
};

function NavbarComponent() {
  const [active, setActive] = useState("Home");
  const [scrolled, setScrolled] = useState(false);

  const isAutoScrolling = useRef(false);
  const scrollTimeout = useRef(null);

  /* ---------- Smooth scroll (NO LAYOUT JANK) ---------- */
  const handleNavClick = useCallback((e) => {
    const href = e.currentTarget.getAttribute("href");
    if (!href?.startsWith("#")) return;

    e.preventDefault();
    const target = document.querySelector(href);
    if (!target) return;

    isAutoScrolling.current = true;
    clearTimeout(scrollTimeout.current);

    setActive(SECTION_MAP[target.id]);

    window.scrollTo({
      top: target.offsetTop - 64,
      behavior: "smooth",
    });

    scrollTimeout.current = setTimeout(() => {
      isAutoScrolling.current = false;
    }, 500);
  }, []);

  /* ---------- Ultra-light scroll spy ---------- */
  useEffect(() => {
    const sections = Object.keys(SECTION_MAP)
      .map((id) => document.getElementById(id))
      .filter(Boolean);

    const observer = new IntersectionObserver(
      (entries) => {
        if (isAutoScrolling.current) return;

        for (const entry of entries) {
          if (entry.isIntersecting) {
            const name = SECTION_MAP[entry.target.id];
            if (name) setActive(name);
          }
        }
      },
      {
        threshold: 0.5,
        rootMargin: "-30% 0px -40% 0px",
      }
    );

    sections.forEach((sec) => observer.observe(sec));
    return () => observer.disconnect();
  }, []);

  /* ---------- Navbar shadow (RAF optimized) ---------- */
  useEffect(() => {
    let ticking = false;

    const onScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          setScrolled(window.scrollY > 10);
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <Disclosure
      as="nav"
      className={`sticky top-0 z-50 h-16
        bg-background/60 backdrop-blur-xl
        border-b border-white/10
        ${scrolled ? "shadow-lg shadow-black/20" : ""}`}
    >
      {({ open }) => (
        <>
          {/* Top Bar (NO scale / NO layout animation) */}
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="flex h-16 items-center justify-between">
              {/* Mobile Button */}
              <Disclosure.Button className="sm:hidden p-2 rounded-md text-muted-foreground hover:text-white">
                {open ? <XMarkIcon className="h-6 w-6" /> : <Bars3Icon className="h-6 w-6" />}
              </Disclosure.Button>

              {/* Logo (NO motion) */}
              <div className="flex-1 flex justify-center sm:justify-start">
                <a
                  href="#hero"
                  onClick={handleNavClick}
                  className="text-2xl font-heading gradient-text tracking-wide"
                >
                  Saleem Bazhil
                </a>
              </div>

              {/* Desktop Nav */}
              <div className="hidden sm:flex gap-10">
                {navigation.map((item) => (
                  <button
                    key={item.name}
                    onClick={handleNavClick}
                    href={item.href}
                    className={`relative text-sm tracking-widest transition-colors
                      ${
                        active === item.name
                          ? "text-white"
                          : "text-muted-foreground hover:text-white"
                      }`}
                  >
                    {item.name}

                    {/* Underline (ABSOLUTE → NO LAYOUT SHIFT) */}
                    {active === item.name && (
                      <span
                        className="absolute left-0 -bottom-2 h-[2px] w-full
                        bg-gradient-to-r from-cyan-400 to-purple-500"
                      />
                    )}
                  </button>
                ))}
              </div>

              {/* Contact */}
              <a
                href="#contact"
                onClick={handleNavClick}
                className="                  hidden sm:inline-flex px-4 py-2 rounded-xl
                  border border-primary text-primary
                  hover:bg-primary hover:text-primary-foreground
                  transition neon-glow md:ms-8
"
              >
                Contact
              </a>
            </div>
          </div>

          {/* Mobile Menu */}
          <AnimatePresence>
            {open && (
              <Disclosure.Panel
                as={motion.div}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="sm:hidden bg-background/70 backdrop-blur-xl"
              >
                <div className="px-4 py-6 space-y-4 text-center">
                  {navigation.map((item) => (
                    <Disclosure.Button
                      key={item.name}
                      as="a"
                      href={item.href}
                      onClick={handleNavClick}
                      className={`block text-lg tracking-widest ${
                        active === item.name
                          ? "text-primary"
                          : "text-muted-foreground"
                      }`}
                    >
                      {item.name}
                    </Disclosure.Button>
                  ))}
                </div>
              </Disclosure.Panel>
            )}
          </AnimatePresence>
        </>
      )}
    </Disclosure>
  );
}

export default memo(NavbarComponent);
