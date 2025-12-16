import { motion } from "framer-motion";
import { Button } from "./ui/button";
import { ArrowRight, Mail, Phone } from "lucide-react";
import { useNavigate } from "react-router-dom";

const CTA = () => {
  const navigate = useNavigate();

  return (
    <section className="py-24 bg-gradient-to-br from-background via-primary/5 to-background relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          animate={{
            scale: [1, 1.3, 1],
            opacity: [0.2, 0.4, 0.2],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute top-0 left-1/4 w-[600px] h-[600px] rounded-full bg-primary/20 blur-3xl"
        />
        <motion.div
          animate={{
            scale: [1.3, 1, 1.3],
            opacity: [0.2, 0.3, 0.2],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1,
          }}
          className="absolute bottom-0 right-1/4 w-[500px] h-[500px] rounded-full bg-accent/20 blur-3xl"
        />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="max-w-4xl mx-auto text-center"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="inline-block px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-6"
          >
            <span className="text-sm font-medium text-primary">
              Ready to Transform Your Lab?
            </span>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="text-4xl lg:text-6xl font-bold mb-6"
          >
            Experience the Future of{" "}
            <span className="bg-gradient-to-r from-primary via-primary-glow to-accent bg-clip-text text-transparent">
              Digital Pathology
            </span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4, duration: 0.6 }}
            className="text-xl text-muted-foreground mb-12 leading-relaxed"
          >
            Join thousands of healthcare professionals who have elevated their
            diagnostic capabilities with our advanced whole slide imaging
            technology. Schedule a demo today and see the difference.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.5, duration: 0.6 }}
            className="flex flex-wrap gap-4 justify-center mb-12"
          >
            <Button
              size="lg"
              className="bg-primary hover:bg-primary-dark text-primary-foreground shadow-glow hover:shadow-lg hover:scale-105 transition-all duration-300 group"
              onClick={() => navigate("/viewer")}
            >
              Try Interactive Demo
              <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Button>
            {/*<Button
              size="lg"
              variant="outline"
              className="border-primary/30 hover:bg-primary/5 hover:border-primary transition-all duration-300"
            >
              Schedule Consultation
            </Button>*/}
          </motion.div>

          {/* Contact cards */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.6, duration: 0.6 }}
            className="grid md:grid-cols-2 gap-6 max-w-2xl mx-auto"
          >
            <motion.div
              whileHover={{ y: -4 }}
              className="bg-card border border-border rounded-2xl p-6 shadow-card"
            >
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
                <Mail className="w-6 h-6 text-primary" />
              </div>
              <h3 className="font-semibold mb-2">Email Us</h3>
              <p className="text-sm text-muted-foreground mb-3">
                Get detailed information about our solutions
              </p>
              <a
                href="mailto:muhammadali6055@gmail.com"
                className="text-primary hover:text-primary-dark font-medium text-sm transition-colors"
              >
                muhammadali6055@gmail.com
              </a>
            </motion.div>

            <motion.div
              whileHover={{ y: -4 }}
              className="bg-card border border-border rounded-2xl p-6 shadow-card"
            >
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
                <Phone className="w-6 h-6 text-primary" />
              </div>
              <h3 className="font-semibold mb-2">Call Us</h3>
              <p className="text-sm text-muted-foreground mb-3">
                Speak with our product specialists
              </p>
              <a
                href="tel:+923336055774"
                className="text-primary hover:text-primary-dark font-medium text-sm transition-colors"
              >
                +92 333-6055774
              </a>
            </motion.div>
          </motion.div>
        </motion.div>

        {/* Footer */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.8, duration: 0.6 }}
          className="mt-20 pt-12 border-t border-border/50 text-center"
        >
          <p className="text-sm text-muted-foreground">
            © 2024 ScanVision. All rights reserved. | Advancing Digital Pathology Worldwide
          </p>
        </motion.div>
      </div>
    </section>
  );
};

export default CTA;
