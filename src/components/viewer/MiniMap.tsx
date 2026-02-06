import { motion } from "framer-motion";
import { useRef, useEffect, useState } from "react";
import { Map } from "lucide-react";

interface MiniMapProps {
  slideImage: string;
  zoom: number;
  panOffset: { x: number; y: number };
  containerSize: { width: number; height: number };
  onNavigate?: (x: number, y: number) => void;
}

const MiniMap = ({ slideImage, zoom, panOffset, containerSize, onNavigate }: MiniMapProps) => {
  const miniMapRef = useRef<HTMLDivElement>(null);
  const [miniMapSize, setMiniMapSize] = useState({ width: 150, height: 100 });
  const [imageAspect, setImageAspect] = useState(1);

  // Calculate the viewport rectangle position and size
  const viewportScale = 100 / zoom;
  const viewportWidth = miniMapSize.width * viewportScale;
  const viewportHeight = miniMapSize.height * viewportScale;

  // Normalize pan offset to minimap coordinates
  const maxPan = 500; // matches dragConstraints
  const normalizedX = (panOffset.x / maxPan) * (miniMapSize.width / 2);
  const normalizedY = (panOffset.y / maxPan) * (miniMapSize.height / 2);

  const viewportX = (miniMapSize.width - viewportWidth) / 2 - normalizedX;
  const viewportY = (miniMapSize.height - viewportHeight) / 2 - normalizedY;

  const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!miniMapRef.current || !onNavigate) return;

    const rect = miniMapRef.current.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const clickY = e.clientY - rect.top;

    // Convert click position to pan offset
    const centerX = miniMapSize.width / 2;
    const centerY = miniMapSize.height / 2;

    const newPanX = ((centerX - clickX) / (miniMapSize.width / 2)) * maxPan;
    const newPanY = ((centerY - clickY) / (miniMapSize.height / 2)) * maxPan;

    onNavigate(newPanX, newPanY);
  };

  return (
    <div className="bg-card border border-border rounded-2xl p-4 shadow-card">
      <div className="flex items-center gap-2 mb-3">
        <Map className="w-4 h-4 text-primary" />
        <h3 className="font-semibold text-sm">Navigator</h3>
      </div>
      
      <div 
        ref={miniMapRef}
        className="relative w-full aspect-[3/2] bg-muted/50 rounded-lg overflow-hidden cursor-crosshair border border-border"
        onClick={handleClick}
      >
        {/* Slide thumbnail */}
        <img 
          src={slideImage} 
          alt="Slide thumbnail" 
          className="w-full h-full object-contain"
          draggable={false}
        />
        
        {/* Viewport rectangle */}
        <motion.div
          className="absolute border-2 border-primary bg-primary/20 pointer-events-none rounded-sm"
          animate={{
            width: Math.max(viewportWidth, 20),
            height: Math.max(viewportHeight, 15),
            x: Math.max(0, Math.min(viewportX, miniMapSize.width - viewportWidth)),
            y: Math.max(0, Math.min(viewportY, miniMapSize.height - viewportHeight)),
          }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
          style={{
            boxShadow: "0 0 10px rgba(var(--primary), 0.3)",
          }}
        />
        
        {/* Zoom level indicator */}
        <div className="absolute bottom-1 right-1 bg-background/80 backdrop-blur-sm text-xs px-1.5 py-0.5 rounded text-primary font-medium">
          {zoom}%
        </div>
      </div>
      
      <p className="text-xs text-muted-foreground mt-2 text-center">
        Click to navigate
      </p>
    </div>
  );
};

export default MiniMap;
