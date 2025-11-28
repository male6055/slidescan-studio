import { motion } from "framer-motion";
import { Microscope, GraduationCap, FlaskConical, Users } from "lucide-react";

const Applications = () => {
  const applications = [
    {
      icon: Microscope,
      title: "Clinical Diagnosis",
      description:
        "Accelerate diagnostic workflows with instant digital access to slides. Enable remote consultations and second opinions without physical slide shipment.",
      benefits: [
        "Faster turnaround times",
        "Enhanced collaboration",
        "Reduced operational costs",
      ],
      color: "from-cyan-500 to-blue-500",
    },
    {
      icon: GraduationCap,
      title: "Medical Education",
      description:
        "Transform pathology education with interactive digital slides. Enable simultaneous viewing by entire classes and create comprehensive slide libraries.",
      benefits: [
        "Unlimited concurrent access",
        "Build digital teaching sets",
        "Interactive annotations",
      ],
      color: "from-blue-500 to-indigo-500",
    },
    {
      icon: FlaskConical,
      title: "Research & Development",
      description:
        "Advance research with high-resolution digital archives. Facilitate multi-center studies and leverage AI for automated analysis and discovery.",
      benefits: [
        "Large-scale data analysis",
        "AI-ready image format",
        "Reproducible results",
      ],
      color: "from-indigo-500 to-purple-500",
    },
    {
      icon: Users,
      title: "Telepathology",
      description:
        "Connect pathologists globally with real-time slide sharing. Provide expert consultations to remote locations and underserved communities.",
      benefits: [
        "Global expert network",
        "Real-time collaboration",
        "Bridge geographic gaps",
      ],
      color: "from-purple-500 to-pink-500",
    },
  ];

  return (
    <section className="py-24 bg-muted/30">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-3xl mx-auto mb-16"
        >
          <div className="inline-block px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-4">
            <span className="text-sm font-medium text-primary">
              Versatile Applications
            </span>
          </div>
          <h2 className="text-4xl lg:text-5xl font-bold mb-6">
            Transforming Healthcare{" "}
            <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              Across Disciplines
            </span>
          </h2>
          <p className="text-lg text-muted-foreground">
            From diagnosis to research, our whole slide imaging platform serves
            diverse needs across the healthcare ecosystem.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-8">
          {applications.map((app, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1, duration: 0.6 }}
              className="group"
            >
              <div className="bg-card border border-border rounded-3xl p-8 shadow-card hover:shadow-glow transition-all duration-500 h-full">
                {/* Icon with gradient background */}
                <motion.div
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${app.color} flex items-center justify-center mb-6 shadow-glow`}
                >
                  <app.icon className="w-8 h-8 text-white" />
                </motion.div>

                <h3 className="text-2xl font-bold mb-3">{app.title}</h3>
                
                <p className="text-muted-foreground mb-6 leading-relaxed">
                  {app.description}
                </p>

                {/* Benefits list */}
                <div className="space-y-3">
                  {app.benefits.map((benefit, idx) => (
                    <motion.div
                      key={idx}
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: 0.1 * idx + 0.3, duration: 0.4 }}
                      className="flex items-center gap-3"
                    >
                      <div className="w-1.5 h-1.5 rounded-full bg-primary flex-shrink-0" />
                      <span className="text-sm text-foreground">{benefit}</span>
                    </motion.div>
                  ))}
                </div>

                {/* Decorative element */}
                <div className="mt-8 pt-6 border-t border-border/50">
                  <motion.div
                    initial={{ width: 0 }}
                    whileInView={{ width: "100%" }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.5, duration: 0.8 }}
                    className={`h-1 rounded-full bg-gradient-to-r ${app.color}`}
                  />
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Stats section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4, duration: 0.6 }}
          className="mt-16 grid grid-cols-2 lg:grid-cols-4 gap-6"
        >
          {[
            { value: "2000+", label: "Healthcare Facilities" },
            { value: "50M+", label: "Slides Digitized" },
            { value: "100+", label: "Countries Served" },
            { value: "24/7", label: "Support Available" },
          ].map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1, duration: 0.4 }}
              className="text-center bg-card border border-border rounded-2xl p-6 shadow-card"
            >
              <div className="text-3xl lg:text-4xl font-bold text-primary mb-2">
                {stat.value}
              </div>
              <div className="text-sm text-muted-foreground">{stat.label}</div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default Applications;
