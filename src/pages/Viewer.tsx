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
  Grid3X3, 
  X,       
} from "lucide-react";
import { useNavigate } from "react-router-dom";
// Make sure this path is correct in your project
import tissueSample from "@/assets/Final_Stitched_WSI.jpg"; 

// --- CONFIGURATION ---
const SLIDE_ID = "Image";
const USE_LOCAL_MODE = true; 
const FILE_EXTENSION = ".jpg"; 

// --- THE ABSTRACTION LAYER ---
const fetchPatch = async (row, col) => {
  if (USE_LOCAL_MODE) {
    // 1. LOCAL LOGIC: Construct path to public folder
    const fileName = `Tile_R${row}_C${col}${FILE_EXTENSION}`;
    
    // React/Vite looks for this path starting from the 'public' folder
    const url = `/slides/${SLIDE_ID}/patches/${fileName}`;

    console.log("Requesting patch:", url);
    
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 300));
    
    return url;
  } else {
    // 2. FUTURE DB LOGIC
    // return "https://your-api.com/..."
  }
};

const Viewer = () => {
  const navigate = useNavigate();
  
  // Viewer State
  const [zoom, setZoom] = useState([100]);
  const [rotation, setRotation] = useState(0);
  
  // Grid & Patch State
  const [showGrid, setShowGrid] = useState(false);
  const [selectedPatch, setSelectedPatch] = useState(null); // {row, col, url}
  const [isLoadingPatch, setIsLoadingPatch] = useState(false);

  // Configuration
  const GRID_ROWS = 4;
  const GRID_COLS = 4;

  const handleZoomIn = () => setZoom([(Math.min(zoom[0] + 25, 400))]);
  const handleZoomOut = () => setZoom([(Math.max(zoom[0] - 25, 25))]);
  const handleRotate = () => setRotation((prev) => (prev + 90) % 360);
  
  const handleReset = () => {
    setZoom([100]);
    setRotation(0);
    setSelectedPatch(null);
  };

  const handleGridClick = async (r, c) => {
    // 1. Set selection immediately to highlight the box
    setSelectedPatch({ row: r, col: c, url: null });
    setIsLoadingPatch(true);

    // 2. Fetch data 
    try {
      const url = await fetchPatch(r, c);
      setSelectedPatch({ row: r, col: c, url });
    } catch (error) {
      console.error("Failed to load patch", error);
    } finally {
      setIsLoadingPatch(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* --- HEADER --- */}
      <motion.header
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.4 }}
        className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50 shrink-0"
      >
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="sm" onClick={() => navigate("/")} className="hover:bg-primary/10">
                <ArrowLeft className="w-4 h-4 mr-2" /> Back
              </Button>
              <div>
                <h1 className="text-xl font-bold">Slide Viewer</h1>
                <p className="text-sm text-muted-foreground">Sample_Tissue_H&E_40x.svs</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
               <Button 
                variant={showGrid ? "default" : "outline"} 
                size="sm"
                onClick={() => setShowGrid(!showGrid)}
              >
                <Grid3X3 className="w-4 h-4 mr-2" />
                {showGrid ? "Hide Grid" : "Show Grid"}
              </Button>
              <Button variant="outline" size="sm">
                <Download className="w-4 h-4 mr-2" /> Export
              </Button>
            </div>
          </div>
        </div>
      </motion.header>

      {/* --- MAIN CONTENT --- */}
      <div className="flex-1 container mx-auto px-4 py-6 overflow-hidden">
        <div className="grid lg:grid-cols-[1fr_300px] gap-6 h-full">
          
          {/* --- LEFT: VIEWER WINDOW --- */}
          <motion.div
            className="bg-muted/30 rounded-2xl border border-border shadow-card overflow-hidden relative"
            style={{ height: "calc(100vh - 140px)" }}
          >
            <div className="relative w-full h-full flex items-center justify-center overflow-hidden">
              <motion.div
                animate={{ scale: zoom[0] / 100, rotate: rotation }}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
                className="relative shadow-2xl" 
                drag
                dragConstraints={{ left: -500, right: 500, top: -500, bottom: 500 }}
                dragElastic={0.1}
              >
                {/* 1. Main Stitched Image */}
                <img
                  src={tissueSample}
                  alt="Tissue sample"
                  className="max-w-none w-[800px] select-none pointer-events-none" 
                  draggable={false}
                />

                {/* 2. Grid Overlay */}
                {showGrid && (
                  <div 
                    className="absolute inset-0 grid"
                    style={{
                      gridTemplateColumns: `repeat(${GRID_COLS}, 1fr)`,
                      gridTemplateRows: `repeat(${GRID_ROWS}, 1fr)`,
                    }}
                  >
                    {Array.from({ length: GRID_ROWS * GRID_COLS }).map((_, i) => {
                      const r = Math.floor(i / GRID_COLS);
                      const c = i % GRID_COLS;
                      const isSelected = selectedPatch?.row === r && selectedPatch?.col === c;

                      return (
                        <div
                          key={i}
                          onClick={(e) => {
                             e.stopPropagation(); 
                             handleGridClick(r, c);
                          }}
                          className={`
                            border border-black/20 transition-all duration-200 cursor-pointer
                            hover:bg-primary/20 hover:border-primary/50
                            ${isSelected ? 'bg-primary/40 border-primary ring-2 ring-primary' : ''}
                          `}
                        />
                      );
                    })}
                  </div>
                )}
              </motion.div>

              {/* Stats Badge */}
              <div className="absolute top-4 left-4 bg-background/90 backdrop-blur-sm px-4 py-2 rounded-lg border border-border z-10">
                <div className="text-xs text-muted-foreground">Zoom Level</div>
                <div className="text-lg font-bold text-primary">{zoom[0]}%</div>
              </div>
            </div>
          </motion.div>

          {/* --- RIGHT: CONTROLS SIDEBAR --- */}
          <motion.div className="space-y-4 overflow-y-auto h-[calc(100vh-140px)] pr-2">
            
            {/* Dynamic Patch Preview */}
            {selectedPatch && (
              <motion.div 
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className="bg-primary/5 border border-primary/20 rounded-2xl p-4 shadow-sm"
              >
                <div className="flex justify-between items-center mb-2">
                  <h3 className="font-semibold text-primary">Selected Region</h3>
                  <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => setSelectedPatch(null)}>
                    <X className="w-4 h-4" />
                  </Button>
                </div>
                
                <div className="aspect-square bg-black/10 rounded-lg overflow-hidden flex items-center justify-center mb-2 relative">
                  {isLoadingPatch ? (
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
                  ) : (
                    <img 
                      src={selectedPatch.url} 
                      alt="High Res Patch" 
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        const target = e.currentTarget; 
                        target.onerror = null; 
                        target.src = "https://placehold.co/400x400?text=No+Tissue+Data";
                        target.style.opacity = "0.5"; 
                      }}
                    />
                  )}
                </div>
                
                <div className="grid grid-cols-2 gap-2 text-xs">
                   <div className="bg-background/50 p-2 rounded">Row: <span className="font-mono">{selectedPatch.row}</span></div>
                   <div className="bg-background/50 p-2 rounded">Col: <span className="font-mono">{selectedPatch.col}</span></div>
                </div>
              </motion.div>
            )}

            {/* Zoom Controls */}
            <div className="bg-card border border-border rounded-2xl p-6 shadow-card">
              <h3 className="font-semibold mb-4">Zoom Control</h3>
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="icon" onClick={handleZoomOut} disabled={zoom[0] <= 25}>
                    <ZoomOut className="w-4 h-4" />
                  </Button>
                  <Slider value={zoom} onValueChange={setZoom} min={25} max={400} step={25} className="flex-1" />
                  <Button variant="outline" size="icon" onClick={handleZoomIn} disabled={zoom[0] >= 400}>
                    <ZoomIn className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>

            {/* View Controls */}
            <div className="bg-card border border-border rounded-2xl p-6 shadow-card">
              <h3 className="font-semibold mb-4">View Controls</h3>
              <div className="space-y-2">
                <Button variant="outline" className="w-full justify-start" onClick={handleRotate}>
                  <RotateCw className="w-4 h-4 mr-2" /> Rotate 90°
                </Button>
                <Button variant="outline" className="w-full justify-start" onClick={handleReset}>
                  <Home className="w-4 h-4 mr-2" /> Reset View
                </Button>
              </div>
            </div>
            
            {/* Info Panel */}
            <div className="bg-card border border-border rounded-2xl p-6 shadow-card">
              <h3 className="font-semibold mb-4">Slide Information</h3>
              <div className="space-y-3 text-sm">
                 <div className="flex justify-between"><span className="text-muted-foreground">Dimensions:</span><span className="font-medium">50k x 40k</span></div>
                 <div className="flex justify-between"><span className="text-muted-foreground">Grid Size:</span><span className="font-medium">10 x 10</span></div>
              </div>
            </div>

          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Viewer;