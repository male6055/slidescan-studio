import { motion } from "framer-motion";
import { useState, useEffect, useRef, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import {
  ZoomIn,
  ZoomOut,
  Home,
  RotateCw,
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
import MiniMap from "@/components/viewer/MiniMap";
import MeasurementTool from "@/components/viewer/MeasurementTool";
import AnnotationTools, { type Annotation, type AnnotationType, ANNOTATION_COLORS } from "@/components/viewer/AnnotationTools";
import AnnotationOverlay from "@/components/viewer/AnnotationOverlay";

// --- CONFIGURATION ---
const SLIDE_ID = "Image";
const USE_LOCAL_MODE = true;
const FILE_EXTENSION = ".jpg";
const MICRONS_PER_PIXEL = 0.25; // 40x magnification

interface Point {
  x: number;
  y: number;
}

interface Measurement {
  id: string;
  start: Point;
  end: Point;
  distance: number;
}

const fetchPatch = async (row: number, col: number) => {
  if (USE_LOCAL_MODE) {
    const fileName = `Tile_R${row}_C${col}${FILE_EXTENSION}`;
    const url = `/slides/${SLIDE_ID}/patches/${fileName}`;
    await new Promise((resolve) => setTimeout(resolve, 300));
    return url;
  }
  return "";
};

const Viewer = () => {
  const navigate = useNavigate();
  const viewerRef = useRef<HTMLDivElement>(null);

  // --- MAIN SLIDE STATE ---
  const [zoom, setZoom] = useState([100]);
  const [rotation, setRotation] = useState(0);
  const [showGrid, setShowGrid] = useState(false);
  const [resetKey, setResetKey] = useState(0);
  const [panOffset, setPanOffset] = useState({ x: 0, y: 0 });

  // --- PATCH SIDEBAR STATE ---
  const [selectedPatch, setSelectedPatch] = useState<{ row: number; col: number; url: string | null } | null>(null);
  const [isLoadingPatch, setIsLoadingPatch] = useState(false);
  const [patchZoom, setPatchZoom] = useState(1);
  const patchContainerRef = useRef<HTMLDivElement>(null);
  const [sidebarKey, setSidebarKey] = useState(0);

  // --- FULLSCREEN PATCH STATE ---
  const [isPatchFullscreen, setIsPatchFullscreen] = useState(false);
  const [fullPatchZoom, setFullPatchZoom] = useState([100]);

  // --- ANNOTATION STATE ---
  const [annotations, setAnnotations] = useState<Annotation[]>([]);
  const [activeAnnotationTool, setActiveAnnotationTool] = useState<AnnotationType | null>(null);
  const [showAnnotations, setShowAnnotations] = useState(true);
  const [selectedColor, setSelectedColor] = useState(ANNOTATION_COLORS[0]);
  const [drawingAnnotation, setDrawingAnnotation] = useState<{
    startX: number;
    startY: number;
    type: AnnotationType;
  } | null>(null);

  // --- MEASUREMENT STATE ---
  const [measurements, setMeasurements] = useState<Measurement[]>([]);
  const [isMeasuring, setIsMeasuring] = useState(false);
  const [measureStart, setMeasureStart] = useState<Point | null>(null);

  const GRID_ROWS = 4;
  const GRID_COLS = 4;

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

    const handleWheel = (e: WheelEvent) => {
      e.preventDefault();
      e.stopPropagation();
      
      const direction = e.deltaY < 0 ? 1 : -1;
      const step = 0.2;
      setPatchZoom((current) => Math.min(Math.max(current + (direction * step), 1), 5));
    };

    container.addEventListener('wheel', handleWheel, { passive: false });

    return () => {
      container.removeEventListener('wheel', handleWheel);
    };
  }, [selectedPatch]);

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
    setResetKey((prev) => prev + 1);
    setPanOffset({ x: 0, y: 0 });

    if (isPatchFullscreen) {
      setFullPatchZoom([100]);
      setRotation(0);
    } else {
      setZoom([100]);
      setRotation(0);
      setSelectedPatch(null);
    }
  };

  const handleGridClick = async (r: number, c: number) => {
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

  const handleViewerWheel = (e: React.WheelEvent) => {
    if (activeAnnotationTool || isMeasuring) return;
    
    e.preventDefault();
    const direction = e.deltaY < 0 ? 1 : -1;
    const step = 25;

    if (isPatchFullscreen) {
      setFullPatchZoom(([current]) => [Math.min(Math.max(current + (direction * step), 25), 500)]);
    } else {
      setZoom(([current]) => [Math.min(Math.max(current + (direction * step), 25), 400)]);
    }
  };

  const handleMiniPatchWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    const direction = e.deltaY < 0 ? 1 : -1;
    const step = 0.2;

    setPatchZoom((current) => Math.min(Math.max(current + (direction * step), 1), 5));
  };

  const handlePatchZoomIn = (e: React.MouseEvent) => { 
    e.stopPropagation(); 
    setPatchZoom((p) => Math.min(p + 0.5, 5)); 
  };
  
  const handlePatchZoomOut = (e: React.MouseEvent) => { 
    e.stopPropagation(); 
    setPatchZoom((p) => Math.max(p - 0.5, 1)); 
  };
  
  const handlePatchReset = (e: React.MouseEvent) => { 
    e.stopPropagation(); 
    setPatchZoom(1); 
    setSidebarKey(prev => prev + 1);
  };

  const togglePatchFullscreen = () => {
    setIsPatchFullscreen(!isPatchFullscreen);
    setRotation(0);
  };

  // --- MINIMAP NAVIGATION ---
  const handleMiniMapNavigate = useCallback((x: number, y: number) => {
    setPanOffset({ x, y });
  }, []);

  // --- VIEWER CLICK HANDLER (for annotations and measurements) ---
  const handleViewerClick = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (isPatchFullscreen) return;
    
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    // Handle measurement tool
    if (isMeasuring) {
      if (!measureStart) {
        setMeasureStart({ x, y });
      } else {
        const distance = Math.sqrt(
          Math.pow(x - measureStart.x, 2) + Math.pow(y - measureStart.y, 2)
        );
        const newMeasurement: Measurement = {
          id: `m-${Date.now()}`,
          start: measureStart,
          end: { x, y },
          distance,
        };
        setMeasurements((prev) => [...prev, newMeasurement]);
        setMeasureStart(null);
      }
      return;
    }

    // Handle annotation tools
    if (activeAnnotationTool === "point") {
      const newAnnotation: Annotation = {
        id: `a-${Date.now()}`,
        type: "point",
        x,
        y,
        color: selectedColor,
      };
      setAnnotations((prev) => [...prev, newAnnotation]);
    } else if (activeAnnotationTool === "text") {
      const text = prompt("Enter annotation text:");
      if (text) {
        const newAnnotation: Annotation = {
          id: `a-${Date.now()}`,
          type: "text",
          x,
          y,
          text,
          color: selectedColor,
        };
        setAnnotations((prev) => [...prev, newAnnotation]);
      }
    }
  }, [activeAnnotationTool, selectedColor, isMeasuring, measureStart, isPatchFullscreen]);

  const handleViewerMouseDown = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (isPatchFullscreen) return;
    if (activeAnnotationTool !== "circle" && activeAnnotationTool !== "rectangle") return;

    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    setDrawingAnnotation({
      startX: x,
      startY: y,
      type: activeAnnotationTool,
    });
  }, [activeAnnotationTool, isPatchFullscreen]);

  const handleViewerMouseUp = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!drawingAnnotation) return;

    const rect = e.currentTarget.getBoundingClientRect();
    const endX = e.clientX - rect.left;
    const endY = e.clientY - rect.top;

    if (drawingAnnotation.type === "circle") {
      const radius = Math.sqrt(
        Math.pow(endX - drawingAnnotation.startX, 2) + 
        Math.pow(endY - drawingAnnotation.startY, 2)
      );
      if (radius > 5) {
        const newAnnotation: Annotation = {
          id: `a-${Date.now()}`,
          type: "circle",
          x: drawingAnnotation.startX,
          y: drawingAnnotation.startY,
          radius,
          color: selectedColor,
        };
        setAnnotations((prev) => [...prev, newAnnotation]);
      }
    } else if (drawingAnnotation.type === "rectangle") {
      const width = Math.abs(endX - drawingAnnotation.startX);
      const height = Math.abs(endY - drawingAnnotation.startY);
      if (width > 5 && height > 5) {
        const newAnnotation: Annotation = {
          id: `a-${Date.now()}`,
          type: "rectangle",
          x: Math.min(drawingAnnotation.startX, endX),
          y: Math.min(drawingAnnotation.startY, endY),
          width,
          height,
          color: selectedColor,
        };
        setAnnotations((prev) => [...prev, newAnnotation]);
      }
    }

    setDrawingAnnotation(null);
  }, [drawingAnnotation, selectedColor]);

  const handleDeleteAnnotation = useCallback((id: string) => {
    setAnnotations((prev) => prev.filter((a) => a.id !== id));
  }, []);

  // Get cursor style based on active tool
  const getViewerCursor = () => {
    if (isMeasuring) return measureStart ? "crosshair" : "crosshair";
    if (activeAnnotationTool) return "crosshair";
    if (zoom[0] > 100) return "grab";
    return "default";
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
          
          {/* === THE VIEWER WINDOW === */}
          <motion.div
            ref={viewerRef}
            className="bg-muted/30 rounded-2xl border border-border shadow-card overflow-hidden relative"
            style={{ height: "calc(100vh - 140px)", cursor: getViewerCursor() }}
            onWheel={handleViewerWheel}
            onClick={handleViewerClick}
            onMouseDown={handleViewerMouseDown}
            onMouseUp={handleViewerMouseUp}
          >
            {/* VIEW MODE 1: THE FULL PATCH (Fullscreen) */}
            {isPatchFullscreen && selectedPatch ? (
              <div className="relative w-full h-full flex items-center justify-center overflow-hidden bg-black/5">
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
                    src={selectedPatch.url || ""}
                    alt="Full Patch View"
                    className="max-w-none h-[600px] object-contain select-none pointer-events-none"
                    draggable={false}
                    onError={(e) => { e.currentTarget.src = "https://placehold.co/800x800?text=No+Data"; }}
                  />
                </motion.div>
                
                <div className="absolute bottom-4 left-4 bg-primary text-primary-foreground px-4 py-2 rounded-lg text-sm font-medium z-10 shadow-lg">
                  Patch View: Row {selectedPatch.row}, Col {selectedPatch.col}
                </div>
              </div>
            ) : (
              /* VIEW MODE 2: THE WHOLE SLIDE (Standard) */
              <div className="relative w-full h-full flex items-center justify-center overflow-hidden">
                <motion.div
                  key={`slide-${resetKey}`}
                  animate={{ 
                    scale: zoom[0] / 100, 
                    rotate: rotation,
                    x: panOffset.x,
                    y: panOffset.y,
                  }}
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  className="relative shadow-2xl"
                  drag={zoom[0] > 100 && !activeAnnotationTool && !isMeasuring}
                  dragConstraints={{ left: -500, right: 500, top: -500, bottom: 500 }}
                  dragElastic={0.1}
                  onDrag={(_, info) => {
                    setPanOffset({ x: info.offset.x, y: info.offset.y });
                  }}
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
                
                {/* Annotation Overlay */}
                <AnnotationOverlay
                  annotations={annotations}
                  measurements={measurements}
                  showAnnotations={showAnnotations}
                  zoom={zoom[0]}
                  onDeleteAnnotation={handleDeleteAnnotation}
                  micronsPerPixel={MICRONS_PER_PIXEL}
                />

                {/* Measurement preview line */}
                {measureStart && (
                  <div className="absolute inset-0 pointer-events-none">
                    <svg className="w-full h-full">
                      <circle
                        cx={measureStart.x}
                        cy={measureStart.y}
                        r="6"
                        fill="hsl(var(--primary))"
                        stroke="white"
                        strokeWidth="2"
                      />
                    </svg>
                  </div>
                )}
                
                {/* Stats Badge */}
                <div className="absolute top-4 left-4 bg-background/90 backdrop-blur-sm px-4 py-2 rounded-lg border border-border z-10">
                  <div className="text-xs text-muted-foreground">Zoom Level</div>
                  <div className="text-lg font-bold text-primary">{zoom[0]}%</div>
                </div>

                {/* Tool active indicator */}
                {(activeAnnotationTool || isMeasuring) && (
                  <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-primary text-primary-foreground px-4 py-2 rounded-lg text-sm font-medium shadow-lg"
                  >
                    {isMeasuring && (measureStart ? "Click second point to complete measurement" : "Click first point to start measuring")}
                    {activeAnnotationTool === "point" && "Click to place marker"}
                    {activeAnnotationTool === "circle" && "Click and drag to draw circle"}
                    {activeAnnotationTool === "rectangle" && "Click and drag to draw rectangle"}
                    {activeAnnotationTool === "text" && "Click to add text annotation"}
                  </motion.div>
                )}
              </div>
            )}
          </motion.div>

          {/* === RIGHT SIDEBAR === */}
          <motion.div className="space-y-4 overflow-y-auto h-[calc(100vh-140px)] pr-2">
            
            {/* MINI MAP NAVIGATOR */}
            {!isPatchFullscreen && (
              <MiniMap
                slideImage={tissueSample}
                zoom={zoom[0]}
                panOffset={panOffset}
                containerSize={{ width: 600, height: 400 }}
                onNavigate={handleMiniMapNavigate}
              />
            )}

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
                        src={selectedPatch.url || ""}
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

            {/* MEASUREMENT TOOL */}
            {!isPatchFullscreen && (
              <MeasurementTool
                isActive={isMeasuring}
                onToggle={() => {
                  setIsMeasuring(!isMeasuring);
                  setMeasureStart(null);
                  setActiveAnnotationTool(null);
                }}
                measurements={measurements}
                onAddMeasurement={(m) => setMeasurements((prev) => [...prev, m])}
                onClearMeasurements={() => setMeasurements([])}
                micronsPerPixel={MICRONS_PER_PIXEL}
              />
            )}

            {/* ANNOTATION TOOLS */}
            {!isPatchFullscreen && (
              <AnnotationTools
                activeToolType={activeAnnotationTool}
                onSelectTool={(tool) => {
                  setActiveAnnotationTool(tool);
                  setIsMeasuring(false);
                  setMeasureStart(null);
                }}
                annotations={annotations}
                onClearAnnotations={() => setAnnotations([])}
                showAnnotations={showAnnotations}
                onToggleVisibility={() => setShowAnnotations(!showAnnotations)}
              />
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
