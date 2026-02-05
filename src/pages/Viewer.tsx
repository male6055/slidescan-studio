import { motion } from "framer-motion";
import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import {
  ZoomIn,
  ZoomOut,
  Home,
  RotateCw,
  Maximize, 
  Minimize, 
  Download,
  ArrowLeft,
  Grid3X3,
  X,
  RefreshCcw,
  Move,
  Expand,   
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import tissueSample from "@/assets/Final_Stitched_WSI.jpg";

// --- CONFIGURATION ---
const SLIDE_ID = "Image";
const USE_LOCAL_MODE = true;
const FILE_EXTENSION = ".jpg";

const fetchPatch = async (row, col) => {
  if (USE_LOCAL_MODE) {
    const fileName = `Tile_R${row}_C${col}${FILE_EXTENSION}`;
    const url = `/slides/${SLIDE_ID}/patches/${fileName}`;
    await new Promise((resolve) => setTimeout(resolve, 300));
    return url;
  }
};

const Viewer = () => {
  const navigate = useNavigate();

  // --- MAIN SLIDE STATE ---
  const [zoom, setZoom] = useState([100]);
  const [rotation, setRotation] = useState(0);
  const [showGrid, setShowGrid] = useState(false);
  const [resetKey, setResetKey] = useState(0);

  // --- PATCH SIDEBAR STATE ---
  const [selectedPatch, setSelectedPatch] = useState(null);
  const [isLoadingPatch, setIsLoadingPatch] = useState(false);
  const [patchZoom, setPatchZoom] = useState(1);
  const patchContainerRef = useRef(null);
  const viewerRef = useRef(null);
  const [sidebarKey, setSidebarKey] = useState(0);

  // --- NEW: FULLSCREEN PATCH STATE ---
  const [isPatchFullscreen, setIsPatchFullscreen] = useState(false);
  const [fullPatchZoom, setFullPatchZoom] = useState([100]); 

  const GRID_ROWS = 4;
  const GRID_COLS = 4;

  // --- EFFECTS ---
  useEffect(() => {
    if (selectedPatch) {
      setPatchZoom(1);
      setFullPatchZoom([100]); // Reset fullscreen zoom when patch changes
    }
  }, [selectedPatch]);


  // Add this inside your component (before return)
  useEffect(() => {
    const container = patchContainerRef.current;
    if (!container) return;

    const handleWheel = (e) => {
      e.preventDefault(); // This is guaranteed to work here
      e.stopPropagation();
      
      const direction = e.deltaY < 0 ? 1 : -1;
      const step = 0.2;
      setPatchZoom((current) => Math.min(Math.max(current + (direction * step), 1), 5));
    };

    // { passive: false } is the key to allowing preventDefault
    container.addEventListener('wheel', handleWheel, { passive: false });

    return () => {
      container.removeEventListener('wheel', handleWheel);
    };
  }, [patchContainerRef, selectedPatch]); // Re-run if patch changes



  // --- HANDLERS ---
  const handleZoomIn = () => {
    if (isPatchFullscreen) setFullPatchZoom([Math.min(fullPatchZoom[0] + 25, 500)]);
    else setZoom([Math.min(zoom[0] + 25, 400)]);
  };

  const handleZoomOut = () => {
    if (isPatchFullscreen) setFullPatchZoom([Math.max(fullPatchZoom[0] - 25, 25)]);
    else setZoom([Math.max(zoom[0] - 25, 25)]);
  };

  const handleRotate = () => setRotation((prev) => (prev + 90) % 360);
  
  const handleReset = () => {
    setResetKey((prev) => prev + 1); // handles reset

    if (isPatchFullscreen) {
      setFullPatchZoom([100]);
      setRotation(0);
    } else {
      setZoom([100]);
      setRotation(0);
      setSelectedPatch(null);
    }
  };

  const handleGridClick = async (r, c) => {
    setSelectedPatch({ row: r, col: c, url: null });
    setIsLoadingPatch(true);
    try {
      const url = await fetchPatch(r, c);
      setSelectedPatch({ row: r, col: c, url });
    } catch (error) {
      console.error("Failed to load patch", error);
    } finally {
      setIsLoadingPatch(false);
    }
  };

  // --- NEW: SCROLL/WHEEL HANDLERS ---
  
  // 1. Handle Scroll for Main Viewer (Slide & Fullscreen Patch)
  const handleViewerWheel = (e) => {
    e.preventDefault(); // <--- STOPS PAGE SCROLL
    
    // Determine direction: negative deltaY is scrolling UP (Zoom In)
    const direction = e.deltaY < 0 ? 1 : -1;
    const step = 25; // 5% increment for smoother scroll than buttons

    if (isPatchFullscreen) {
      setFullPatchZoom(([current]) => [
        Math.min(Math.max(current + (direction * step), 25), 500)
      ]);
    } else {
      setZoom(([current]) => [
        Math.min(Math.max(current + (direction * step), 25), 400)
      ]);
    }
  };

  // 2. Handle Scroll for Sidebar Mini Patch
  const handleMiniPatchWheel = (e) => {
    // Optional: stopPropagation prevents the sidebar itself from scrolling 
    e.preventDefault(); // <--- STOPS PAGE SCROLL
    // if the mouse is strictly over the image
    e.stopPropagation(); 
    
    const direction = e.deltaY < 0 ? 1 : -1;
    const step = 0.2; // 0.2x increment

    setPatchZoom((current) => Math.min(Math.max(current + (direction * step), 1), 5));
  };

  // --- SIDEBAR PATCH BUTTON HANDLERS ---
  const handlePatchZoomIn = (e) => { e.stopPropagation(); setPatchZoom((p) => Math.min(p + 0.5, 5)); };
  const handlePatchZoomOut = (e) => { e.stopPropagation(); setPatchZoom((p) => Math.max(p - 0.5, 1)); };
  const handlePatchReset = (e) => { e.stopPropagation(); setPatchZoom(1); setSidebarKey(prev => prev + 1);};

  // --- FULLSCREEN HANDLERS ---
  const togglePatchFullscreen = () => {
    setIsPatchFullscreen(!isPatchFullscreen);
    setRotation(0); 
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* HEADER */}
      <motion.header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50 shrink-0">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
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
            {!isPatchFullscreen && (
              <Button variant={showGrid ? "default" : "outline"} size="sm" onClick={() => setShowGrid(!showGrid)}>
                <Grid3X3 className="w-4 h-4 mr-2" />
                {showGrid ? "Hide Grid" : "Show Grid"}
              </Button>
            )}
            <Button variant="outline" size="sm"><Download className="w-4 h-4 mr-2" /> Export</Button>
          </div>
        </div>
      </motion.header>

      {/* MAIN CONTENT */}
      <div className="flex-1 container mx-auto px-4 py-6 overflow-hidden">
        <div className="grid lg:grid-cols-[1fr_300px] gap-6 h-full">
          
          {/* === THE VIEWER WINDOW (Dynamic Content) === */}
          {/* Added onWheel handler here to capture scroll events inside the viewer */}
          <motion.div
            className="bg-muted/30 rounded-2xl border border-border shadow-card overflow-hidden relative"
            style={{ height: "calc(100vh - 140px)" }}
            onWheel={handleViewerWheel}
          >
            {/* VIEW MODE 1: THE FULL PATCH (Fullscreen) */}
            {isPatchFullscreen && selectedPatch ? (
              <div className="relative w-full h-full flex items-center justify-center overflow-hidden bg-black/5">
                {/* Back Button Overlay */}
                <div className="absolute top-4 left-4 z-20">
                  <Button onClick={togglePatchFullscreen} variant="secondary" className="shadow-lg gap-2">
                    <ArrowLeft className="w-4 h-4" /> Return to Slide
                  </Button>
                </div>

                <motion.div
                  key={`patch-${resetKey}`}
                  animate={{ scale: fullPatchZoom[0] / 100, rotate: rotation }}
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  className="relative shadow-2xl cursor-grab active:cursor-grabbing"
                  drag={fullPatchZoom[0] > 100}
                  dragElastic={0.1}
                >
                  <img
                    src={selectedPatch.url}
                    alt="Full Patch View"
                    className="max-w-none h-[600px] object-contain select-none pointer-events-none"
                    draggable={false}
                    onError={(e) => { e.currentTarget.src = "https://placehold.co/800x800?text=No+Data"; }}
                  />
                </motion.div>
                
                {/* Fullscreen Badge */}
                <div className="absolute bottom-4 left-4 bg-primary text-primary-foreground px-4 py-2 rounded-lg text-sm font-medium z-10 shadow-lg">
                  Patch View: Row {selectedPatch.row}, Col {selectedPatch.col}
                </div>
              </div>
            ) : (
              /* VIEW MODE 2: THE WHOLE SLIDE (Standard) */
              <div className="relative w-full h-full flex items-center justify-center overflow-hidden">
                <motion.div
                  key={`slide-${resetKey}`}
                  animate={{ scale: zoom[0] / 100, rotate: rotation }}
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  className="relative shadow-2xl"
                  drag={zoom[0] !== 100}
                  dragConstraints={{ left: -500, right: 500, top: -500, bottom: 500 }}
                  dragElastic={0.1}
                >
                  <img
                    src={tissueSample}
                    alt="Tissue sample"
                    className="max-w-none w-[600px] select-none pointer-events-none"
                    draggable={false}
                  />
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
                            onClick={(e) => { e.stopPropagation(); handleGridClick(r, c); }}
                            className={`
                              border border-white/20 transition-all duration-200 cursor-pointer
                              hover:bg-primary/20 hover:border-primary/50
                              ${isSelected ? "bg-primary/40 border-primary ring-2 ring-primary" : ""}
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
            )}
          </motion.div>

          {/* === RIGHT SIDEBAR === */}
          <motion.div className="space-y-4 overflow-y-auto h-[calc(100vh-140px)] pr-2">
            
            {/* PATCH PREVIEW PANEL */}
            {selectedPatch && !isPatchFullscreen && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                className="bg-primary/5 border border-primary/20 rounded-2xl p-4 shadow-sm"
              >
                <div className="flex justify-between items-center mb-2">
                  <h3 className="font-semibold text-primary">Selected Region</h3>
                  <div className="flex gap-1">
                    <Button 
                        variant="ghost" size="icon" className="h-6 w-6 text-primary hover:bg-primary/20" 
                        onClick={togglePatchFullscreen}
                        title="View Fullscreen"
                    >
                      <Expand className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => setSelectedPatch(null)}>
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                </div>

                {/* Sidebar Mini Viewer */}
                {/* Added onWheel handler here */}
                <div 
                    ref={patchContainerRef} 
                    className="aspect-square bg-black/10 rounded-lg overflow-hidden relative group"
                    onWheel={handleMiniPatchWheel}
                >
                  {isLoadingPatch ? (
                    <div className="flex items-center justify-center w-full h-full">
                      <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
                    </div>
                  ) : (
                    <>
                      <motion.img
                        key={sidebarKey}
                        src={selectedPatch.url}
                        alt="High Res Patch"
                        className={`w-full h-full object-cover transition-colors ${patchZoom > 1 ? 'cursor-grab active:cursor-grabbing' : 'cursor-default'}`}
                        
                        drag={patchZoom > 1}
                        
                        dragConstraints={{
                          left: -150 * (patchZoom - 1),
                          right: 150 * (patchZoom - 1),
                          top: -150 * (patchZoom - 1),
                          bottom: 150 * (patchZoom - 1),
                        }}
                        
                        dragElastic={0.2}
                        animate={{ scale: patchZoom }}
                        transition={{ type: "spring", stiffness: 300, damping: 20 }}
                        onError={(e) => { e.currentTarget.src = "https://placehold.co/400x400?text=No+Data"; }}
                      />

                      {/* Sidebar HUD Controls */}
                      <div className="absolute bottom-2 right-2 flex gap-1 bg-black/50 backdrop-blur-md p-1 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                        <Button variant="ghost" size="icon" className="h-6 w-6 text-white hover:bg-white/20" onClick={handlePatchZoomOut}>
                          <ZoomOut className="w-3 h-3" />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-6 w-6 text-white hover:bg-white/20" onClick={handlePatchZoomIn}>
                          <ZoomIn className="w-3 h-3" />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-6 w-6 text-white hover:bg-white/20" onClick={handlePatchReset}>
                          <RefreshCcw className="w-3 h-3" />
                        </Button>
                      </div>

                      {/* Visual Hint for Panning (Only when zoomed) */}
                      {patchZoom > 1 && (
                         <div className="absolute top-2 left-2 pointer-events-none opacity-50 bg-black/50 p-1 rounded">
                            <Move className="w-3 h-3 text-white" />
                         </div>
                      )}
                    </>
                  )}
                </div>
              </motion.div>
            )}

            {/* UNIFIED CONTROLS */}
            <div className="bg-card border border-border rounded-2xl p-6 shadow-card">
              <h3 className="font-semibold mb-4">
                {isPatchFullscreen ? "Patch Controls" : "Slide Controls"}
              </h3>
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="icon" onClick={handleZoomOut}>
                    <ZoomOut className="w-4 h-4" />
                  </Button>
                  <Slider 
                    value={isPatchFullscreen ? fullPatchZoom : zoom} 
                    onValueChange={isPatchFullscreen ? setFullPatchZoom : setZoom} 
                    min={25} max={isPatchFullscreen ? 500 : 400} 
                    step={25} className="flex-1" 
                  />
                  <Button variant="outline" size="icon" onClick={handleZoomIn}>
                    <ZoomIn className="w-4 h-4" />
                  </Button>
                </div>
                <div className="text-center text-sm text-muted-foreground">
                    Current Zoom: {isPatchFullscreen ? fullPatchZoom[0] : zoom[0]}%
                </div>
              </div>
            </div>

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

            {isPatchFullscreen && (
               <div className="bg-primary/10 border border-primary/20 rounded-2xl p-6">
                 <p className="text-sm text-primary">
                   You are currently viewing a high-resolution patch. 
                   Click "Return to Slide" to view the whole slide image.
                 </p>
               </div>
            )}

          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Viewer;