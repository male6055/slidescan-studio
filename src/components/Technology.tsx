import { motion } from "framer-motion";
import { Zap, Target, Shield, Workflow } from "lucide-react";

const Technology = () => {
  const features = [
    {
      icon: Zap,
      title: "Ultra-Fast Scanning",
      description: "Capture entire slides in under 60 seconds with our proprietary rapid scanning technology.",
    },
    {
      icon: Target,
      title: "Precision Optics",
      description: "Sub-micrometer resolution ensures every cellular detail is captured with absolute clarity.",
    },
    {
      icon: Shield,
      title: "AI-Powered Quality",
      description: "Real-time quality assessment ensures consistent, diagnostic-grade images every time.",
    },
    {
      icon: Workflow,
      title: "Seamless Workflow",
      description: "Integrate effortlessly with existing lab systems and PACS infrastructure.",
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
              Revolutionary Technology
            </span>
          </div>
          <h2 className="text-4xl lg:text-5xl font-bold mb-6">
            Redefining Whole Slide{" "}
            <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              Imaging Standards
            </span>
          </h2>
          <p className="text-lg text-muted-foreground">
            Our cutting-edge platform combines advanced optics, intelligent
            automation, and cloud connectivity to deliver unmatched performance.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1, duration: 0.6 }}
              whileHover={{ y: -8 }}
              className="bg-card border border-border rounded-2xl p-6 shadow-card hover:shadow-glow transition-all duration-300"
            >
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                <feature.icon className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
              <p className="text-muted-foreground leading-relaxed">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>

        {/* Technology showcase */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4, duration: 0.6 }}
          className="mt-16 bg-gradient-to-br from-primary/5 to-accent/5 rounded-3xl p-8 lg:p-12 border border-primary/20"
        >
          <div className="grid lg:grid-cols-2 gap-8 items-center">
            <div>
              <h3 className="text-3xl font-bold mb-4">
                The Science Behind the Scan
              </h3>
              <p className="text-muted-foreground mb-6 leading-relaxed">
                Our proprietary multi-focal imaging technology captures multiple
                focal planes simultaneously, ensuring optimal focus across the
                entire tissue sample. Combined with advanced image processing
                algorithms, we deliver crisp, artifact-free digital slides.
              </p>
              <div className="space-y-3">
                {[
                  "40x optical magnification with digital zoom up to 400x",
                  "0.25 µm/pixel resolution for diagnostic precision",
                  "Automated tissue detection and focus optimization",
                  "HDR imaging for enhanced dynamic range",
                ].map((item, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <div className="w-2 h-2 rounded-full bg-primary mt-2 flex-shrink-0" />
                    <span className="text-foreground">{item}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="relative">
              <motion.div
                animate={{
                  scale: [1, 1.05, 1],
                }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                className="relative bg-gradient-to-br from-primary to-accent rounded-2xl p-1"
              >
                <div className="bg-background rounded-xl p-8">
                  <div className="text-center space-y-4">
                    <div className="text-6xl font-bold text-primary">
                      0.25µm
                    </div>
                    <div className="text-xl text-muted-foreground">
                      Pixel Resolution
                    </div>
                    <div className="h-1 w-32 mx-auto bg-gradient-to-r from-primary to-accent rounded-full" />
                    <div className="text-sm text-muted-foreground">
                      Industry-leading clarity
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Technology;
