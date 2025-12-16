import { motion } from "framer-motion";
import { Clock, Database, Cloud, Lock } from "lucide-react";
import tissueSample from "@/assets/tissue-sample.jpg";

const Features = () => {
  const features = [
    {
      icon: Clock,
      title: "Precision Automation",
      description: "Automates stage movement via stepper motors and timing belts, achieving ~0.00325 mm resolution for high-precision scanning.",
      stat: "~3.25",
      unit: "μm",
    },
    {
      icon: Database,
      title: "Intelligent Defect Mitigation",
      description: "Deploys Generative Adversarial Networks (GANs) to automatically restore image quality by correcting blur and lighting inconsistencies.",
      stat: "70%",
      unit: "saved",
    },
    {
      icon: Cloud,
      title: "Eco-Friendly Digital Staining",
      description: "Virtually stains tissue samples using deep learning, eliminating hazardous chemicals and saving up to 5000L of water annually.",
      stat: "24/7",
      unit: "access",
    },
    {
      icon: Lock,
      title: "Universal Retrofit Design",
      description: "Upgrades standard optical microscopes by modifying control knobs with 3D-printed gears, offering a low-cost alternative to commercial scanners.",
      stat: "100%",
      unit: "secure",
    },
  ];

  return (
    <section className="py-24 bg-background">
      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left side - Image */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="relative order-2 lg:order-1"
          >
            <div className="relative">
              {/* Main image with zoom effect */}
              <div className="relative rounded-3xl overflow-hidden shadow-card border border-border">
                <motion.img
                  src={tissueSample}
                  alt="Microscopic tissue sample"
                  className="w-full h-auto"
                />
                
                {/* Zoom indicator overlay */}
                <motion.div
                  initial={{ scale: 3, opacity: 0 }}
                  whileInView={{ scale: 1, opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 1, delay: 0.3 }}
                  className="absolute inset-0 bg-gradient-to-br from-primary/20 to-transparent"
                />
                
                {/* Zoom level indicator */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.5 }}
                  className="absolute bottom-4 left-4 bg-background/90 backdrop-blur-sm px-4 py-2 rounded-lg border border-primary/20"
                >
                  <div className="flex items-center gap-2">
                    <div className="text-xs font-medium text-muted-foreground">
                      Magnification:
                    </div>
                    <div className="text-sm font-bold text-primary">40x</div>
                  </div>
                </motion.div>
              </div>

              {/* Decorative elements */}
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                className="absolute -top-8 -left-8 w-24 h-24 border-4 border-primary/20 rounded-full"
              />
              <motion.div
                animate={{ rotate: -360 }}
                transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
                className="absolute -bottom-8 -right-8 w-32 h-32 border-4 border-accent/20 rounded-full"
              />
            </div>
          </motion.div>

          {/* Right side - Features */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="order-1 lg:order-2"
          >
            <div className="inline-block px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-4">
              <span className="text-sm font-medium text-primary">
                Built for Scale
              </span>
            </div>
            
            <h2 className="text-4xl lg:text-5xl font-bold mb-6">
              Features That{" "}
              <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                Drive Results
              </span>
            </h2>
            
            <p className="text-lg text-muted-foreground mb-8">
              From automating standard microscopes to applying deep learning for defect correction, our platform modernizes blood cell analysis with accessible hardware and advanced AI.
            </p>

            <div className="space-y-6">
              {features.map((feature, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: 30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1, duration: 0.6 }}
                  className="flex gap-4 group"
                >
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center group-hover:bg-primary group-hover:shadow-glow transition-all duration-300">
                      <feature.icon className="w-6 h-6 text-primary group-hover:text-white transition-colors" />
                    </div>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <h3 className="text-xl font-semibold">
                        {feature.title}
                      </h3>
                      <div className="text-right">
                        <div className="text-lg font-bold text-primary">
                          {feature.stat}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {feature.unit}
                        </div>
                      </div>
                    </div>
                    <p className="text-muted-foreground leading-relaxed">
                      {feature.description}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Features;
