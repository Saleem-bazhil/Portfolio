import skillHighlights from "../constants/skill";

const About = () => {
  return (
    <section className="min-h-screen py-24 px-4 sm:px-6 lg:px-18" id="about">
      <div className="container mx-auto">
        <h1 className="text-5xl md:text-6xl lg:text-7xl font-heading gradient-text text-center mb-4">
          About Me
        </h1>
        <p className="text-center text-muted-foreground text-lg sm:text-xl max-w-3xl mx-auto mb-16">
          I build modern web applications with a focus on user experience,
          performance, and pixel-perfect design.
        </p>

        {/* Small cards from skills array */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 p-8 lg:p-6 mb-16">
          {skillHighlights.map((ski, index) => (
            <div
              key={index}
              className="card bg-card bg-gradient-card border border-border card-hover group p-8 rounded-xl flex flex-col"
            >
              <div className="mb-4">
                <ski.icon size={40} className="text-primary group-hover:text-secondary transition-colors duration-300" />
              </div>
              <h3 className="text-2xl font-semibold mb-2 lg:text-left">{ski.title}</h3>
              <p className="text-muted-foreground text-sm">{ski.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default About;
