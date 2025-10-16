import React, { useEffect } from "react";
import { Send, Mail, Github, Linkedin } from "lucide-react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import emailjs from "@emailjs/browser";

const Contact = () => {

  useEffect(() => {
    emailjs.init(import.meta.env.VITE_APP_EMAILJS_PUBLIC_KEY);
  }, []);

  const validationSchema = Yup.object({
    name: Yup.string().required("Name is required"),
    email: Yup.string().email("Invalid email").required("Email is required"),
    message: Yup.string().required("Message is required"),
  });

  const socialLinks = [
    { icon: Mail, label: "Email", href: "mailto:hello@example.com" },
    { icon: Github, label: "GitHub", href: "https://github.com" },
    { icon: Linkedin, label: "LinkedIn", href: "https://linkedin.com" },
  ];

  const handleSubmit = (values, { resetForm, setSubmitting }) => {
    const templateParams = {
      from_name: values.name,
      from_email: values.email,
      message: values.message,
      to_name: "Your Name",
    };

    emailjs
      .send(
        import.meta.env.VITE_APP_EMAILJS_SERVICE_ID,
        import.meta.env.VITE_APP_EMAILJS_TEMPLATE_ID,
        templateParams
      )
      .then(
        (response) => {
          console.log("SUCCESS!", response.status, response.text);
          alert("Message sent! Thanks for reaching out.");
          resetForm();
          setSubmitting(false);
        },
        (error) => {
          console.error("FAILED...", error);
          alert("invalid message");
          setSubmitting(false);
        }
      );
  };

  return (
    <section
      id="contact"
      className="py-24 px-4 sm:px-6 lg:px-8 bg-background min-h-screen"
    >
      <div className="container mx-auto max-w-4xl">
        <h2 className="text-5xl sm:text-6xl md:text-7xl font-heading mb-4 text-center gradient-text">
          Get In Touch
        </h2>
        <p className="text-center text-muted-foreground text-lg sm:text-xl mb-12">
          Have a project in mind? Let's work together to create something amazing.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-6">
          {/* Contact Form */}
          <div className="card bg-card bg-gradient-card border border-border p-8 shadow-lg rounded-xl">
            <Formik
              initialValues={{ name: "", email: "", message: "" }}
              validationSchema={validationSchema}
              onSubmit={handleSubmit}
            >
              {({ isSubmitting }) => (
                <Form className="space-y-6">
                  <div>
                    <label
                      htmlFor="name"
                      className="block text-sm font-medium mb-2 text-foreground"
                    >
                      Name
                    </label>
                    <Field
                      id="name"
                      name="name"
                      placeholder="Your name"
                      className="input-box"
                    />
                    <ErrorMessage
                      name="name"
                      component="div"
                      className="text-red-500 mt-3 text-sm"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="email"
                      className="block text-sm font-medium mb-2"
                    >
                      Email
                    </label>
                    <Field
                      id="email"
                      name="email"
                      type="email"
                      placeholder="your@email.com"
                      className="input-box"
                    />
                    <ErrorMessage
                      name="email"
                      component="div"
                      className="text-red-500 mt-3 text-sm"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="message"
                      className="block text-sm font-medium mb-2"
                    >
                      Message
                    </label>
                    <Field
                      as="textarea"
                      id="message"
                      name="message"
                      rows={6}
                      placeholder="Tell me about your project..."
                      className="textarea textarea-bordered w-full resize-none input-box"
                    />
                    <ErrorMessage
                      name="message"
                      component="div"
                      className="text-red-500 mt-3 text-sm"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full flex justify-center items-center bg-primary text-primary-foreground px-5 py-3 rounded-xl hover:bg-primary/90 neon-glow font-heading text-lg bebas-neue-regular tracking-wide"
                  >
                    Send Message <Send size={18} className="ms-3" />
                  </button>
                </Form>
              )}
            </Formik>
          </div>

          {/* Social Links */}
          <div className="flex flex-col justify-center space-y-6">
            <h3 className="text-2xl font-heading mb-6 text-foreground ms-2">
              Connect With Me
            </h3>
            <div className="space-y-4">
              {socialLinks.map((link, index) => (
                <a
                  key={index}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-4 p-4 bg-card bg-gradient-card border border-border rounded-xl hover:border-primary transition-all duration-300 group"
                >
                  <div className="p-3 bg-muted rounded-lg group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                    <link.icon size={24} />
                  </div>
                  <span className="text-lg font-medium text-muted-foreground group-hover:text-primary transition-colors">
                    {link.label}
                  </span>
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
