import React, { memo, useCallback } from "react";
import {
  Disclosure,
  DisclosureButton,
  DisclosurePanel,
} from "@headlessui/react";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";

const navigation = [
  { name: "Home", href: "#hero", current: true },
  { name: "Skills", href: "#skill2", current: false },
  { name: "About", href: "#about", current: false },
  { name: "Projects", href: "#project", current: false },
  { name: "Contact", href: "#contact", current: false },
];

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

function NavbarComponent() {
  // one shared smooth-scroll handler for all links
  const handleNavClick = useCallback((event) => {
    const href = event.currentTarget.getAttribute("href");
    if (!href || !href.startsWith("#")) return;

    event.preventDefault();
    const id = href.slice(1);
    const target = document.getElementById(id);
    if (target) {
      target.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, []);

  return (
    <Disclosure
      as="nav"
      className="sticky top-0 z-50 bg-background/30 backdrop-blur-md after:pointer-events-none after:absolute after:inset-x-0 after:bottom-0 after:h-px after:bg-white/10"
    >
      <div className="mx-auto max-w-7xl px-2 sm:px-6 lg:px-8">
        <div className="relative flex h-16 items-center justify-between">
          {/* Mobile menu button */}
          <div className="absolute inset-y-0 left-0 flex items-center sm:hidden">
            <DisclosureButton className="group relative inline-flex items-center justify-center rounded-md p-2 text-gray-400 hover:bg-white/5 hover:text-white focus:outline-2 focus:outline-offset-1 focus:outline-indigo-500">
              <span className="sr-only">Open main menu</span>
              <Bars3Icon
                aria-hidden="true"
                className="block h-6 w-6 group-data-open:hidden"
              />
              <XMarkIcon
                aria-hidden="true"
                className="hidden h-6 w-6 group-data-open:block"
              />
            </DisclosureButton>
          </div>

          {/* Logo */}
          <div className="flex flex-1 items-center justify-center sm:items-stretch sm:justify-start">
            <div className="flex shrink-0 items-center">
              <a
                href="#hero"
                onClick={handleNavClick}
                className="text-2xl font-heading gradient-text me-18 font-Agbalumo tracking-[1px]"
              >
                Saleem Bazhil
              </a>
            </div>

            {/* Desktop menu */}
            <div className="hidden sm:flex sm:absolute sm:inset-x-0 sm:justify-center">
              <div className="flex space-x-4 tagesschrift-regular tracking-widest">
                {navigation.map((item) => (
                  <a
                    key={item.name}
                    href={item.href}
                    aria-current={item.current ? "page" : undefined}
                    onClick={handleNavClick}
                    className={`nav-link ${
                      item.current ? "nav-link-active" : ""
                    }`}
                  >
                    {item.name}
                  </a>
                ))}
              </div>
            </div>
          </div>

          {/* Contact button */}
          <div className="absolute inset-y-0 right-0 flex items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0">
            <a
              href="#contact"
              onClick={handleNavClick}
              className="px-4 lg:py-2 py-1 rounded-md lg:rounded-xl border text-primary border-primary transition-all duration-300 ease-in-out hover:bg-primary hover:text-primary-foreground tagesschrift-regular tracking-widest"
            >
              Contact
            </a>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <DisclosurePanel className="sm:hidden bg-background/30 backdrop-blur-md">
        <div className="space-y-1 px-2 pt-2 pb-3">
          {navigation.map((item) => (
            <DisclosureButton
              key={item.name}
              as="a"
              href={item.href}
              onClick={handleNavClick}
              aria-current={item.current ? "page" : undefined}
              className={classNames(
                "nav-link block rounded-md px-3 py-2 text-base font-medium tagesschrift-regular tracking-widest",
                item.current ? "nav-link-active" : ""
              )}
            >
              {item.name}
            </DisclosureButton>
          ))}
        </div>
      </DisclosurePanel>
    </Disclosure>
  );
}

// memo so parent re-renders don’t re-render the whole navbar
const Navbar = memo(NavbarComponent);
export default Navbar;
