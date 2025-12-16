import React, { memo, useCallback, useEffect, useState } from "react";
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

function NavbarComponent() {
  const [active, setActive] = useState("Home");
  const [scrolled, setScrolled] = useState(false);

  /* Smooth scroll */
  const handleNavClick = useCallback((event) => {
    const href = event.currentTarget.getAttribute("href");
    if (!href?.startsWith("#")) return;

    event.preventDefault();
    document.querySelector(href)?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  }, []);

  /* Scroll spy */
  useEffect(() => {
    const sections = navigation.map((n) =>
      document.querySelector(n.href)
    );

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const match = navigation.find(
              (n) => n.href === `#${entry.target.id}`
            );
            if (match) setActive(match.name);
          }
        });
      },
      { threshold: 0.6 }
    );

    sections.forEach((sec) => sec && observer.observe(sec));
    return () => observer.disconnect();
  }, []);

  /* Scroll shadow */
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <Disclosure
      as="nav"
      className={`
        sticky top-0 z-50
        bg-background/50 backdrop-blur-xl
        border-b border-white/10
        transition-shadow duration-300
        ${scrolled ? "shadow-lg shadow-black/20" : ""}
      `}
    >
      {({ open }) => (
        <>
          {/* Top Bar */}
          <motion.div
            initial={{ y: -24, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.45, ease: "easeOut" }}
            className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8"
          >
            <div className="flex h-16 items-center justify-between">
              {/* Mobile Menu Button */}
              <Disclosure.Button className="sm:hidden rounded-md p-2 text-muted-foreground hover:text-white hover:bg-white/5 transition">
                {open ? (
                  <XMarkIcon className="h-6 w-6" />
                ) : (
                  <Bars3Icon className="h-6 w-6" />
                )}
              </Disclosure.Button>

              {/* Logo (Centered on Mobile) */}
              <div className="flex-1 flex justify-center sm:justify-start">
                <a
                  href="#hero"
                  onClick={handleNavClick}
                  className="text-2xl font-heading gradient-text tracking-wide space-grotesk hover:drop-shadow-[0_0_12px_rgba(56,189,248,0.6)] transition"
                >
                  Saleem Bazhil
                </a>
              </div>

              {/* Desktop Links */}
              <div className="hidden sm:flex gap-10">
                {navigation.map((item) => (
                  <motion.button
                    key={item.name}
                    onClick={handleNavClick}
                    href={item.href}
                    aria-current={active === item.name ? "page" : undefined}
                    whileHover={{ y: -2 }}
                    className="relative text-sm tracking-widest text-muted-foreground hover:text-white transition"
                  >
                    {item.name}

                    {active === item.name && (
                      <motion.span
                        layoutId="nav-underline"
                        transition={{
                          type: "spring",
                          stiffness: 420,
                          damping: 28,
                        }}
                        className="
                          absolute left-0 -bottom-2 h-[2px] w-full
                          bg-gradient-to-r from-cyan-400 to-purple-500
                          shadow-[0_0_10px_rgba(56,189,248,0.6)]
                        "
                      />
                    )}
                  </motion.button>
                ))}
              </div>

              {/* Contact Button */}
              <motion.a
                href="#contact"
                onClick={handleNavClick}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="
                  hidden sm:inline-flex px-4 py-2 rounded-xl
                  border border-primary text-primary
                  hover:bg-primary hover:text-primary-foreground
                  transition neon-glow md:ms-8
                "
              >
                Contact
              </motion.a>
            </div>
          </motion.div>

          {/* Mobile Menu */}
          <AnimatePresence>
            {open && (
              <Disclosure.Panel
                as={motion.div}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
                className="sm:hidden bg-background/70 backdrop-blur-xl border-t border-white/10"
              >
                <motion.div
                  initial="hidden"
                  animate="show"
                  variants={{
                    show: { transition: { staggerChildren: 0.08 } },
                  }}
                  className="px-4 py-6 space-y-4 text-center"
                >
                  {navigation.map((item) => (
                    <Disclosure.Button
                      key={item.name}
                      as={motion.a}
                      href={item.href}
                      onClick={handleNavClick}
                      variants={{
                        hidden: { opacity: 0, y: 10 },
                        show: { opacity: 1, y: 0 },
                      }}
                      className={`block text-lg tracking-widest transition ${
                        active === item.name
                          ? "text-primary"
                          : "text-muted-foreground hover:text-white"
                      }`}
                    >
                      {item.name}
                    </Disclosure.Button>
                  ))}
                </motion.div>
              </Disclosure.Panel>
            )}
          </AnimatePresence>
        </>
      )}
    </Disclosure>
  );
}

export default memo(NavbarComponent);
