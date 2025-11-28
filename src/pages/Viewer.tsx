import { motion } from "framer-motion";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import {
  ZoomIn,
  ZoomOut,
  Home,
  RotateCw,
  Maximize,
  Download,
  ArrowLeft,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import tissueSample from "@/assets/tissue-sample.jpg";

const Viewer = () => {
  const navigate = useNavigate();
  const [zoom, setZoom] = useState([100]);
  const [rotation, setRotation] = useState(0);

  const handleZoomIn = () => {
    setZoom([(Math.min(zoom[0] + 25, 400))]);
  };

  const handleZoomOut = () => {
    setZoom([(Math.max(zoom[0] - 25, 25))]);
  };

  const handleRotate = () => {
    setRotation((prev) => (prev + 90) % 360);
  };

  const handleReset = () => {
    setZoom([100]);
    setRotation(0);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <motion.header
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.4 }}
        className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50"
      >
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate("/")}
                className="hover:bg-primary/10"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back
              </Button>
              <div>
                <h1 className="text-xl font-bold">Slide Viewer</h1>
                <p className="text-sm text-muted-foreground">
                  Sample_Tissue_H&E_40x.svs
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm">
                <Download className="w-4 h-4 mr-2" />
                Export
              </Button>
              <Button variant="outline" size="sm">
                <Maximize className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </motion.header>

      {/* Main viewer area */}
      <div className="container mx-auto px-4 py-6">
        <div className="grid lg:grid-cols-[1fr_300px] gap-6">
          {/* Viewer */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
            className="bg-muted/30 rounded-2xl border border-border shadow-card overflow-hidden"
            style={{ height: "calc(100vh - 200px)" }}
          >
            <div className="relative w-full h-full flex items-center justify-center overflow-hidden">
              {/* Image with zoom and rotation */}
              <motion.div
                animate={{
                  scale: zoom[0] / 100,
                  rotate: rotation,
                }}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
                className="relative"
                drag
                dragConstraints={{ left: -500, right: 500, top: -500, bottom: 500 }}
                dragElastic={0.1}
              >
                <img
                  src={tissueSample}
                  alt="Tissue sample"
                  className="max-w-full h-auto select-none"
                  draggable={false}
                />
                
                {/* Scanning line animation */}
                <motion.div
                  initial={{ x: "-100%" }}
                  animate={{ x: "200%" }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    repeatDelay: 3,
                    ease: "easeInOut",
                  }}
                  className="absolute inset-0 w-1/4 bg-gradient-to-r from-transparent via-primary/30 to-transparent pointer-events-none"
                />
              </motion.div>

              {/* Zoom indicator */}
              <div className="absolute top-4 left-4 bg-background/90 backdrop-blur-sm px-4 py-2 rounded-lg border border-border">
                <div className="text-xs text-muted-foreground">Zoom Level</div>
                <div className="text-lg font-bold text-primary">{zoom[0]}%</div>
              </div>

              {/* Instructions */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1 }}
                className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-background/90 backdrop-blur-sm px-4 py-2 rounded-lg border border-border"
              >
                <p className="text-xs text-muted-foreground text-center">
                  Drag to pan • Use controls to zoom and rotate
                </p>
              </motion.div>
            </div>
          </motion.div>

          {/* Controls sidebar */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="space-y-6"
          >
            {/* Zoom controls */}
            <div className="bg-card border border-border rounded-2xl p-6 shadow-card">
              <h3 className="font-semibold mb-4">Zoom Control</h3>
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={handleZoomOut}
                    disabled={zoom[0] <= 25}
                  >
                    <ZoomOut className="w-4 h-4" />
                  </Button>
                  <Slider
                    value={zoom}
                    onValueChange={setZoom}
                    min={25}
                    max={400}
                    step={25}
                    className="flex-1"
                  />
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={handleZoomIn}
                    disabled={zoom[0] >= 400}
                  >
                    <ZoomIn className="w-4 h-4" />
                  </Button>
                </div>
                <div className="text-sm text-center text-muted-foreground">
                  {zoom[0]}% magnification
                </div>
              </div>
            </div>

            {/* View controls */}
            <div className="bg-card border border-border rounded-2xl p-6 shadow-card">
              <h3 className="font-semibold mb-4">View Controls</h3>
              <div className="space-y-2">
                <Button
                  variant="outline"
                  className="w-full justify-start"
                  onClick={handleRotate}
                >
                  <RotateCw className="w-4 h-4 mr-2" />
                  Rotate 90°
                </Button>
                <Button
                  variant="outline"
                  className="w-full justify-start"
                  onClick={handleReset}
                >
                  <Home className="w-4 h-4 mr-2" />
                  Reset View
                </Button>
              </div>
            </div>

            {/* Slide information */}
            <div className="bg-card border border-border rounded-2xl p-6 shadow-card">
              <h3 className="font-semibold mb-4">Slide Information</h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Format:</span>
                  <span className="font-medium">SVS</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Magnification:</span>
                  <span className="font-medium">40x</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Resolution:</span>
                  <span className="font-medium">0.25 µm/pixel</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Staining:</span>
                  <span className="font-medium">H&E</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Dimensions:</span>
                  <span className="font-medium">50,000 x 40,000</span>
                </div>
              </div>
            </div>

            {/* Quick actions */}
            <div className="bg-gradient-to-br from-primary/10 to-accent/10 border border-primary/20 rounded-2xl p-6">
              <h3 className="font-semibold mb-2">Need Help?</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Explore our documentation for advanced features and tips.
              </p>
              <Button variant="outline" className="w-full">
                View Documentation
              </Button>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Viewer;
