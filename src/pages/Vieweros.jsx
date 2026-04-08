import { motion } from "framer-motion";
import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import {
  ZoomIn,
  ZoomOut,
  Home,
  RotateCw,
  RotateCcw,
  Maximize,
  Minimize,
  Download,
  ArrowLeft,
  Grid3X3,
  X,
  RefreshCcw,
  Move,
  Expand,
  Camera,
  MoreHorizontal,
  Square,
  Circle as CircleIcon,
  MousePointer2,
  PenTool
} from "lucide-react";
import { useNavigate } from "react-router-dom";

// --- NEW OPENSEADRAGON IMPORTS ---
import OpenSeadragon from "openseadragon";
import Annotorious from '@recogito/annotorious-openseadragon';
import '@recogito/annotorious-openseadragon/dist/annotorious.min.css';

// --- CONFIGURATION ---
const SLIDE_ID = "Image";
const USE_LOCAL_MODE = true;
const FILE_EXTENSION = ".jpg";
const GRID_ROWS = 4;
const GRID_COLS = 4;

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
  const [isToolbarExpanded, setIsToolbarExpanded] = useState(false);

  // --- ANNOTATION STATE ---
  const [drawingMode, setDrawingMode] = useState("select"); 
  
  // --- REFS ---
  const osdViewerRef = useRef(null); 
  const annoRef = useRef(null); 

  // --- PATCH SIDEBAR STATE ---
  const [selectedPatch, setSelectedPatch] = useState(null);
  const [isLoadingPatch, setIsLoadingPatch] = useState(false);
  const [patchZoom, setPatchZoom] = useState(1);
  const patchContainerRef = useRef(null);
  const [sidebarKey, setSidebarKey] = useState(0);

  // --- FULLSCREEN PATCH STATE ---
  const [isPatchFullscreen, setIsPatchFullscreen] = useState(false);
  const [fullPatchZoom, setFullPatchZoom] = useState([100]); 
  const fullscreenContainerRef = useRef(null); 

  // --- EFFECTS ---
  useEffect(() => {
    if (selectedPatch) {
      setPatchZoom(1);
      setFullPatchZoom([100]); 
    }
  }, [selectedPatch]);

  useEffect(() => {
    const container = patchContainerRef.current;
    if (!container) return;

    const handleWheel = (e) => {
      e.preventDefault(); 
      e.stopPropagation();
      const direction = e.deltaY < 0 ? 1 : -1;
      const step = 0.2;
      setPatchZoom((current) => Math.min(Math.max(current + (direction * step), 1), 5));
    };

    container.addEventListener('wheel', handleWheel, { passive: false });
    return () => container.removeEventListener('wheel', handleWheel);
  }, [patchContainerRef, selectedPatch]); 

  // --- OPENSEADRAGON INITIALIZATION ---
  useEffect(() => {
    if (!isPatchFullscreen) {
      // 1. Initialize OpenSeadragon pointing to Flask
      const viewer = OpenSeadragon({
        id: "osd-viewer",
        prefixUrl: "//openseadragon.github.io/openseadragon/images/",
        tileSources: "http://localhost:5000/slide.dzi", // Your Flask endpoint
        showNavigationControl: false, // We use your custom UI instead
        crossOriginPolicy: "Anonymous",// this line
        animationTime: 0.5,
        blendTime: 0.1,
        constrainDuringPan: true,
        maxZoomPixelRatio: 10,// org was 2
      });
      
      osdViewerRef.current = viewer;

      // Update React state when OSD is zoomed manually via mouse
      viewer.addHandler('zoom', (e) => {
        // Convert OSD zoom ratio to a percentage roughly matching your slider
        const currentZoom = Math.round(e.zoom * 100);
        setZoom([currentZoom]);
      });

      // 2. Initialize Annotorious
      const anno = Annotorious(viewer, {
        disableEditor: true, 
      });
      annoRef.current = anno;

      // Optional: Log when an annotation is drawn
      anno.on('createAnnotation', (annotation) => {
        console.log('Saved Annotation:', annotation);
      });

      return () => {
        if (annoRef.current) annoRef.current.destroy();
        if (osdViewerRef.current) osdViewerRef.current.destroy();
      };
    }
  }, [isPatchFullscreen, resetKey]); 

  // --- HANDLERS ---
  const handleZoomIn = () => {
    if (isPatchFullscreen) {
      setFullPatchZoom([Math.min(fullPatchZoom[0] + 25, 500)]);
    } else if (osdViewerRef.current) {
      const currentZoom = osdViewerRef.current.viewport.getZoom();
      osdViewerRef.current.viewport.zoomTo(currentZoom * 1.2);
    }
  };

  const handleZoomOut = () => {
    if (isPatchFullscreen) {
      setFullPatchZoom([Math.max(fullPatchZoom[0] - 25, 25)]);
    } else if (osdViewerRef.current) {
      const currentZoom = osdViewerRef.current.viewport.getZoom();
      osdViewerRef.current.viewport.zoomTo(currentZoom / 1.2);
    }
  };

  // Sync Slider to OSD
  const handleSliderZoom = (val) => {
    if (isPatchFullscreen) {
      setFullPatchZoom(val);
    } else {
      setZoom(val);
      if (osdViewerRef.current) {
        // Convert percentage back to OSD ratio
        osdViewerRef.current.viewport.zoomTo(val[0] / 100);
      }
    }
  };

  const handleRotateCw = () => {
    const newRot = rotation + 90;
    setRotation(newRot);
    if (!isPatchFullscreen && osdViewerRef.current) {
      osdViewerRef.current.viewport.setRotation(newRot);
    }
  };

  const handleRotateCcw = () => {
    const newRot = rotation - 90;
    setRotation(newRot);
    if (!isPatchFullscreen && osdViewerRef.current) {
      osdViewerRef.current.viewport.setRotation(newRot);
    }
  };
  
  const handleReset = () => {
    setResetKey((prev) => prev + 1); 
    if (isPatchFullscreen) {
      setFullPatchZoom([100]);
      setRotation(0);
    } else {
      setZoom([100]);
      setRotation(0);
      setSelectedPatch(null);
      if (osdViewerRef.current) {
        osdViewerRef.current.viewport.goHome();
        osdViewerRef.current.viewport.setRotation(0);
      }
      if (annoRef.current) {
        annoRef.current.clearAnnotations();
      }
    }
  };

  const handleModeChange = (mode) => {
    setDrawingMode(mode);
    if (!annoRef.current) return;

    if (mode === "select") {
      annoRef.current.setDrawingEnabled(false); 
    } else if (mode === "rect") {
      annoRef.current.setDrawingTool("rect");
      annoRef.current.setDrawingEnabled(true);
    } else if (mode === "point") {
      annoRef.current.setDrawingTool("polygon"); 
      annoRef.current.setDrawingEnabled(true);
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

  const handleMiniPatchWheel = (e) => {
    e.preventDefault(); 
    e.stopPropagation(); 
    const direction = e.deltaY < 0 ? 1 : -1;
    const step = 0.2; 
    setPatchZoom((current) => Math.min(Math.max(current + (direction * step), 1), 5));
  };

  const handlePatchZoomIn = (e) => { e.stopPropagation(); setPatchZoom((p) => Math.min(p + 0.5, 5)); };
  const handlePatchZoomOut = (e) => { e.stopPropagation(); setPatchZoom((p) => Math.max(p - 0.5, 1)); };
  const handlePatchReset = (e) => { e.stopPropagation(); setPatchZoom(1); setSidebarKey(prev => prev + 1);};

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
              <h1 className="text-xl font-bold">WSI Slide Viewer</h1>
              <p className="text-sm text-muted-foreground">Blood_Smear_Analysis.tif</p>
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
          
          {/* === THE VIEWER WINDOW === */}
          <motion.div
            className="bg-muted/30 rounded-2xl border border-border shadow-card overflow-hidden relative group" 
            style={{ height: "calc(100vh - 140px)" }}
          >
            {/* --- LEFT TOOLBAR --- */}
            <div className="absolute left-4 top-1/2 -translate-y-1/2 z-20 flex flex-col bg-white/90 backdrop-blur-sm rounded-full shadow-lg border border-border/50 transition-all duration-300">
              <div className="p-2">
                <Button 
                  variant="ghost" size="icon" 
                  className={`rounded-full h-10 w-10 transition-colors ${!isToolbarExpanded ? 'bg-primary/10 text-primary' : 'hover:bg-primary/10'}`}
                  onClick={() => setIsToolbarExpanded(!isToolbarExpanded)}
                  title={isToolbarExpanded ? "Collapse Toolbar" : "Expand Toolbar"}
                >
                  {isToolbarExpanded ? <X className="w-5 h-5" /> : <MoreHorizontal className="w-5 h-5" />}
                </Button>
              </div>

              <motion.div 
                initial={false}
                animate={{ height: isToolbarExpanded ? 'auto' : 0, opacity: isToolbarExpanded ? 1 : 0 }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
                className="flex flex-col items-center overflow-hidden"
              >
                <div className="flex flex-col gap-2 pb-2 px-2">
                  <div className="h-px w-6 bg-border mx-auto my-1"></div>
                  
                  {/* ANNOTATION TOOLS */}
                  <Button 
                    variant={drawingMode === 'select' ? "default" : "ghost"} 
                    size="icon" className="rounded-full h-10 w-10"
                    onClick={() => handleModeChange('select')} title="Select / Pan"
                  >
                    <MousePointer2 className="w-5 h-5" />
                  </Button>
                  <Button 
                    variant={drawingMode === 'rect' ? "default" : "ghost"} 
                    size="icon" className="rounded-full h-10 w-10"
                    onClick={() => handleModeChange('rect')} title="Draw Rectangle"
                  >
                    <Square className="w-5 h-5" />
                  </Button>
                  <Button 
                    variant={drawingMode === 'point' ? "default" : "ghost"} 
                    size="icon" className="rounded-full h-10 w-10"
                    onClick={() => handleModeChange('point')} title="Place Point"
                  >
                    <CircleIcon className="w-5 h-5" />
                  </Button>

                  <div className="h-px w-6 bg-border mx-auto my-1"></div>

                  <Button variant="ghost" size="icon" className="rounded-full hover:bg-primary/10 h-10 w-10" onClick={handleReset}>
                    <Home className="w-5 h-5 text-primary" />
                  </Button>
                  <Button variant="ghost" size="icon" className="rounded-full hover:bg-primary/10 h-10 w-10" onClick={handleZoomIn}>
                    <ZoomIn className="w-5 h-5" />
                  </Button>
                  <Button variant="ghost" size="icon" className="rounded-full hover:bg-primary/10 h-10 w-10" onClick={handleZoomOut}>
                    <ZoomOut className="w-5 h-5" />
                  </Button>

                  <div className="h-px w-6 bg-border mx-auto my-1"></div>

                  <Button variant="ghost" size="icon" className="rounded-full hover:bg-primary/10 h-10 w-10" onClick={handleRotateCcw}>
                    <RotateCcw className="w-5 h-5" />
                  </Button>
                  <Button variant="ghost" size="icon" className="rounded-full hover:bg-primary/10 h-10 w-10" onClick={handleRotateCw}>
                    <RotateCw className="w-5 h-5" />
                  </Button>

                  <div className="h-px w-6 bg-border mx-auto my-1"></div>

                  <Button variant="ghost" size="icon" className="rounded-full hover:bg-primary/10 h-10 w-10">
                    <Camera className="w-5 h-5" />
                  </Button>
                </div>
              </motion.div>
            </div>

            {/* VIEW MODE 1: FULLSCREEN PATCH */}
            {isPatchFullscreen && selectedPatch ? (
              <div ref={fullscreenContainerRef} className="relative w-full h-full flex items-center justify-center overflow-hidden bg-black/5">
                <div className="absolute top-4 left-4 z-20 ml-16">
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
                  dragConstraints={fullscreenContainerRef} 
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
                
                <div className="absolute bottom-4 left-4 bg-primary text-primary-foreground px-4 py-2 rounded-lg text-sm font-medium z-10 shadow-lg ml-16">
                  Patch View: Row {selectedPatch.row}, Col {selectedPatch.col}
                </div>
              </div>
            ) : (
              /* VIEW MODE 2: OPENSEADRAGON WSI VIEWER */
              <div className="relative w-full h-full flex items-center justify-center overflow-hidden bg-black/5">
                
                {/* OSD Canvas */}
                <div id="osd-viewer" className="w-full h-full" />
                
                {/* 5. GRID OVERLAY */}
                {showGrid && (
                  <div
                    className="absolute inset-0 grid pointer-events-none"
                    style={{
                      gridTemplateColumns: `repeat(${GRID_COLS}, 1fr)`,
                      gridTemplateRows: `repeat(${GRID_ROWS}, 1fr)`,
                      zIndex: 10
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
                            border border-white/40 transition-all duration-200 cursor-pointer pointer-events-auto
                            hover:bg-primary/20 hover:border-primary/50
                            ${isSelected ? "bg-primary/40 border-primary ring-2 ring-primary" : ""}
                          `}
                        />
                      );
                    })}
                  </div>
                )}
                
                <div className="absolute top-4 left-4 bg-background/90 backdrop-blur-sm px-4 py-2 rounded-lg border border-border z-10 ml-16">
                  <div className="text-xs text-muted-foreground">Mode</div>
                  <div className="text-lg font-bold text-primary capitalize">{drawingMode}</div>
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
                    <Button variant="ghost" size="icon" className="h-6 w-6 text-primary hover:bg-primary/20" onClick={togglePatchFullscreen}>
                      <Expand className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => setSelectedPatch(null)}>
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                </div>

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
                    onValueChange={handleSliderZoom} 
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
                <Button variant="outline" className="w-full justify-start" onClick={handleRotateCw}>
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