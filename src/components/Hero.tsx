import { motion } from "framer-motion";
import { Button } from "./ui/button";
import { ArrowRight, Microscope } from "lucide-react";
import { useNavigate } from "react-router-dom";
import heroImage from "@/assets/hero-microscope.jpg";

const Hero = () => {
  const navigate = useNavigate();

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-background via-secondary/20 to-background">
      {/* Animated background circles */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute -top-1/2 -right-1/4 w-[800px] h-[800px] rounded-full bg-primary/20 blur-3xl"
        />
        <motion.div
          animate={{
            scale: [1.2, 1, 1.2],
            opacity: [0.2, 0.4, 0.2],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute -bottom-1/2 -left-1/4 w-[600px] h-[600px] rounded-full bg-accent/20 blur-3xl"
        />
      </div>

      <div className="container mx-auto px-4 py-20 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left content */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="space-y-8"
          >
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.6 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20"
            >
              <Microscope className="w-4 h-4 text-primary" />
              <span className="text-sm font-medium text-primary">
                Next-Gen Digital Pathology
              </span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.6 }}
              className="text-5xl lg:text-7xl font-bold leading-tight"
            >
              Transform Pathology with{" "}
              <span className="bg-gradient-to-r from-primary via-primary-glow to-accent bg-clip-text text-transparent">
                Precision Scanning
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.6 }}
              className="text-xl text-muted-foreground leading-relaxed"
            >
              Experience unparalleled clarity in whole slide imaging. Our
              advanced scanning technology delivers microscopic detail at digital
              scale, revolutionizing diagnosis, research, and education.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.6 }}
              className="flex flex-wrap gap-4"
            >
              <Button
                size="lg"
                className="bg-primary hover:bg-primary-dark text-primary-foreground shadow-glow hover:shadow-lg hover:scale-105 transition-all duration-300 group"
                onClick={() => navigate("/viewer")}
              >
                Explore Scanner
                <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Button>
              {/*<Button
                size="lg"
                variant="outline"
                className="border-primary/30 hover:bg-primary/5 hover:border-primary transition-all duration-300"
              >
                Learn More
              </Button>*/}
            </motion.div>

            {/* Stats */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.6 }}
              className="grid grid-cols-3 gap-6 pt-8 border-t border-border/50"
            >
              {[
                { value: "40x", label: "Magnification" },
                { value: "0.25µm", label: "Resolution" },
                { value: "<300s", label: "Scan Time" },
              ].map((stat, index) => (
                <div key={index} className="text-center lg:text-left">
                  <div className="text-3xl font-bold text-primary">
                    {stat.value}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {stat.label}
                  </div>
                </div>
              ))}
            </motion.div>
          </motion.div>

          {/* Right content - Image with zoom animation */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4, duration: 0.8 }}
            className="relative"
          >
            <div className="relative rounded-3xl overflow-hidden shadow-card">
              <motion.img
                src={heroImage}
                alt="Whole slide microscopy visualization"
                className="w-full h-auto"
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.6 }}
              />
              
              {/* Scanning animation overlay */}
              <motion.div
                initial={{ x: "-100%" }}
                animate={{ x: "200%" }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  repeatDelay: 2,
                  ease: "easeInOut",
                }}
                className="absolute inset-0 w-1/3 bg-gradient-to-r from-transparent via-primary/30 to-transparent"
              />
              
              {/* Corner indicators */}
              <div className="absolute top-4 left-4 bg-background/90 backdrop-blur-sm px-3 py-2 rounded-lg border border-primary/20">
                <div className="text-xs font-medium text-primary">
                  SCANNING...
                </div>
              </div>
              
              <motion.div
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="absolute bottom-4 right-4 w-3 h-3 rounded-full bg-primary shadow-glow"
              />
            </div>

            {/* Floating cards */}
            {/*<motion.div
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 4, repeat: Infinity }}
              className="absolute -top-6 -right-6 bg-card border border-border rounded-2xl p-4 shadow-card backdrop-blur-sm"
            >
              <div className="text-2xl font-bold text-primary">100K+</div>
              <div className="text-xs text-muted-foreground">Scans Daily</div>
            </motion.div>*/}

            <motion.div
              animate={{ y: [0, 10, 0] }}
              transition={{ duration: 5, repeat: Infinity, delay: 0.5 }}
              className="absolute -bottom-6 -left-6 bg-card border border-border rounded-2xl p-4 shadow-card backdrop-blur-sm"
            >
              <div className="text-2xl font-bold text-primary">99.9%</div>
              <div className="text-xs text-muted-foreground">Accuracy</div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
