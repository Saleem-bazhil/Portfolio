const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="py-8 px-4 sm:px-6 lg:px-8 border-t border-border bg-background">
      <div className="container mx-auto text-center">
        <p className="text-muted-foreground">
          © {currentYear} Fullstack  Developer. Built with React, Django , RestAPI  & TailwindCSS.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
