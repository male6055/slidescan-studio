// import { motion, AnimatePresence } from "framer-motion";
// import { useState, useEffect, useRef, useCallback } from "react";
// import { Button } from "@/components/ui/button";
// import { Slider } from "@/components/ui/slider";
// import {
//   ZoomIn, ZoomOut, Home, RotateCw, RotateCcw,
//   Download, ArrowLeft, Grid3X3, X, RefreshCcw,
//   Move, Expand, Camera, MoreHorizontal, Square,
//   Circle as CircleIcon, MousePointer2, ChevronDown,
//   Layers, FileImage, AlertCircle, Loader2
// } from "lucide-react";
// import { useNavigate } from "react-router-dom";
// import OpenSeadragon from "openseadragon";
// import Annotorious from "@recogito/annotorious-openseadragon";
// import "@recogito/annotorious-openseadragon/dist/annotorious.min.css";

// // ── CONFIG ────────────────────────────────────────────────────────────────────
// const API_BASE = "https://slide-viewer-api-569050139131.asia-south1.run.app";

// // ── SLIDE SELECTOR COMPONENT ──────────────────────────────────────────────────
// const SlideSelector = ({ slides, selectedSlide, onSelect, loading }) => {
//   const [open, setOpen] = useState(false);
//   const ref = useRef(null);

//   useEffect(() => {
//     const handler = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
//     document.addEventListener("mousedown", handler);
//     return () => document.removeEventListener("mousedown", handler);
//   }, []);

//   return (
//     <div className="relative" ref={ref}>
//       <button
//         onClick={() => setOpen(!open)}
//         className="flex items-center gap-2 px-4 py-2 rounded-xl border border-border bg-card hover:bg-muted/50 transition-colors text-sm font-medium min-w-[220px] justify-between"
//       >
//         <div className="flex items-center gap-2">
//           {loading ? (
//             <Loader2 className="w-4 h-4 animate-spin text-primary" />
//           ) : (
//             <Layers className="w-4 h-4 text-primary" />
//           )}
//           <span className="truncate">
//             {selectedSlide ? selectedSlide.name : "Select a slide…"}
//           </span>
//         </div>
//         <ChevronDown className={`w-4 h-4 text-muted-foreground transition-transform ${open ? "rotate-180" : ""}`} />
//       </button>

//       {/* <AnimatePresence>
//         {open && (
//           <motion.div
//             initial={{ opacity: 0, y: -8 }}
//             animate={{ opacity: 1, y: 0 }}
//             exit={{ opacity: 0, y: -8 }}
//             transition={{ duration: 0.15 }}
//             className="absolute top-full mt-2 left-0 w-full bg-card border border-border rounded-xl shadow-xl z-50 overflow-hidden"
//           >
//             {slides.length === 0 ? (
//               <div className="px-4 py-3 text-sm text-muted-foreground">No slides found</div>
//             ) : (
//               slides.map((slide) => (
//                 <button
//                   key={slide.name}
//                   onClick={() => { onSelect(slide); setOpen(false); }}
//                   className={`w-full flex items-center gap-3 px-4 py-3 text-sm hover:bg-muted/50 transition-colors text-left
//                     ${selectedSlide?.name === slide.name ? "bg-primary/10 text-primary" : ""}`}
//                 >
//                   <FileImage className="w-4 h-4 shrink-0" />
//                   <div className="flex-1 min-w-0">
//                     <div className="font-medium truncate">{slide.name}</div>
//                     <div className="text-xs text-muted-foreground flex gap-2 mt-0.5">
//                       {slide.has_dzi && <span className="bg-emerald-500/10 text-emerald-600 px-1.5 py-0.5 rounded-full">DZI</span>}
//                       {slide.has_tiles && <span className="bg-blue-500/10 text-blue-600 px-1.5 py-0.5 rounded-full">Tiles</span>}
//                     </div>
//                   </div>
//                   {selectedSlide?.name === slide.name && (
//                     <div className="w-2 h-2 rounded-full bg-primary shrink-0" />
//                   )}
//                 </button>
//               ))
//             )}
//           </motion.div>
//         )}
//       </AnimatePresence> */}
//       <AnimatePresence>
//   {open && (
//     <motion.div
//       initial={{ opacity: 0, y: -8 }}
//       animate={{ opacity: 1, y: 0 }}
//       exit={{ opacity: 0, y: -8 }}
//       transition={{ duration: 0.15 }}
//       className="absolute top-full mt-2 left-0 w-full bg-card border border-border rounded-xl shadow-xl z-50 overflow-hidden"
//     >
//       {slides.length === 0 ? (
//         <div className="px-4 py-3 text-sm text-muted-foreground">No slides found</div>
//       ) : (
//         slides
//           .filter((slide) => slide.has_dzi) // 1. Filters out slides that are Tiles-only
//           .map((slide) => (
//             <button
//               key={slide.name}
//               onClick={() => { onSelect(slide); setOpen(false); }}
//               className={`w-full flex items-center gap-3 px-4 py-3 text-sm hover:bg-muted/50 transition-colors text-left
//                 ${selectedSlide?.name === slide.name ? "bg-primary/10 text-primary" : ""}`}
//             >
//               <FileImage className="w-4 h-4 shrink-0" />
//               <div className="flex-1 min-w-0">
//                 <div className="font-medium truncate">{slide.name}</div>
//                 {/* 2. The DZI and Tiles badge div has been completely removed from here */}
//               </div>
//               {selectedSlide?.name === slide.name && (
//                 <div className="w-2 h-2 rounded-full bg-primary shrink-0" />
//               )}
//             </button>
//           ))
//       )}
//     </motion.div>
//   )}
// </AnimatePresence>
//     </div>
//   );
// };

// // ── MAIN VIEWER ───────────────────────────────────────────────────────────────
// const Viewer = () => {
//   const navigate = useNavigate();

//   // ── Slide selection state ──
//   const [slides, setSlides]               = useState([]);
//   const [slidesLoading, setSlidesLoading] = useState(true);
//   const [selectedSlide, setSelectedSlide] = useState(null);
//   const [viewMode, setViewMode]           = useState("dzi");

//   // ── OSD / viewer state ──
//   const [zoom, setZoom]                     = useState([100]);
//   const [rotation, setRotation]             = useState(0);
//   const [showGrid, setShowGrid]             = useState(false);
//   const [resetKey, setResetKey]             = useState(0);
//   const [isToolbarExpanded, setIsToolbarExpanded] = useState(false);
//   const [drawingMode, setDrawingMode]       = useState("select");
//   const osdViewerRef                        = useRef(null);
//   const canvasRef                           = useRef(null); // The synchronized canvas
//   const annoRef                             = useRef(null);
//   const drawingModeRef                      = useRef("select");

//   // ── Annotation state ──
//   const [annotations, setAnnotations]       = useState([]);

//   // ── Patch tile state ──
//   const [tileGrid, setTileGrid]           = useState(null);
//   const [tilesLoading, setTilesLoading]   = useState(false);
//   const [selectedPatch, setSelectedPatch] = useState(null);
//   const [hoveredTile, setHoveredTile]     = useState(null); // Active hover state
//   const [isLoadingPatch, setIsLoadingPatch] = useState(false);
//   const [patchZoom, setPatchZoom]         = useState(1);
//   const [sidebarKey, setSidebarKey]       = useState(0);
//   const patchContainerRef                 = useRef(null);

//   // ── Fullscreen patch state ──
//   const [isPatchFullscreen, setIsPatchFullscreen] = useState(false);
//   const [fullPatchZoom, setFullPatchZoom]         = useState([100]);
//   const fullscreenContainerRef                    = useRef(null);

//   const [error, setError] = useState(null);

//   // ── Fetch slide list on mount ──
//   useEffect(() => {
//     setSlidesLoading(true);
//     fetch(`${API_BASE}/api/slides`)
//       .then((r) => r.json())
//       .then((data) => {
//         setSlides(data);
//         const first = data.find((s) => s.has_dzi) || data[0];
//         if (first) handleSlideSelect(first);
//       })
//       .catch(() => setError("Could not connect to backend. Is Flask running on port 5000?"))
//       .finally(() => setSlidesLoading(false));
//   }, []);

//   const handleSlideSelect = (slide) => {
//     setSelectedSlide(slide);
//     setSelectedPatch(null);
//     setHoveredTile(null);
//     setTileGrid(null);
//     setError(null);
//     setResetKey((k) => k + 1);

//     if (slide.has_dzi) setViewMode("dzi");
//     else if (slide.has_tiles) setViewMode("tiles");

//     if (slide.has_tiles) {
//       setTilesLoading(true);
//       fetch(`${API_BASE}/api/slides/${slide.name}/tiles`)
//         .then((r) => r.json())
//         .then((data) => setTileGrid(data))
//         .catch(() => setError("Failed to load tile list"))
//         .finally(() => setTilesLoading(false));
//     }
//   };

//   // ── SYNCHRONIZED CANVAS GRID DRAWING LOGIC ──
//   const drawGrid = useCallback(() => {
//     if (!osdViewerRef.current || !canvasRef.current || viewMode !== "dzi") return;
    
//     const canvas = canvasRef.current;
//     const ctx = canvas.getContext("2d");
    
//     if (!showGrid || !tileGrid) {
//       ctx?.clearRect(0, 0, canvas.width, canvas.height);
//       return;
//     }

//     const viewer = osdViewerRef.current;
    
//     // Sync canvas resolution to physical element size
//     canvas.width = canvas.offsetWidth;
//     canvas.height = canvas.offsetHeight;
//     ctx.clearRect(0, 0, canvas.width, canvas.height);

//     const tiledImage = viewer.world.getItemAt(0);
//     if (!tiledImage) return;

//     // Get exact bounds of the image in OSD math space
//     const bounds = tiledImage.getBounds();
//     const rows = tileGrid.rows || 4;
//     const cols = tileGrid.cols || 4;

//     const cellWidth = bounds.width / cols;
//     const cellHeight = bounds.height / rows;

//     ctx.strokeStyle = "rgba(59, 130, 246, 0.4)"; // Tailwind Blue-500
//     ctx.lineWidth = 1;

//     // Draw horizontal lines
//     for (let r = 0; r <= rows; r++) {
//       const normY = bounds.y + (r * cellHeight);
//       const p1 = viewer.viewport.pixelFromPoint(new OpenSeadragon.Point(bounds.x, normY), true);
//       const p2 = viewer.viewport.pixelFromPoint(new OpenSeadragon.Point(bounds.x + bounds.width, normY), true);
//       ctx.beginPath(); ctx.moveTo(p1.x, p1.y); ctx.lineTo(p2.x, p2.y); ctx.stroke();
//     }

//     // Draw vertical lines
//     for (let c = 0; c <= cols; c++) {
//       const normX = bounds.x + (c * cellWidth);
//       const p1 = viewer.viewport.pixelFromPoint(new OpenSeadragon.Point(normX, bounds.y), true);
//       const p2 = viewer.viewport.pixelFromPoint(new OpenSeadragon.Point(normX, bounds.y + bounds.height), true);
//       ctx.beginPath(); ctx.moveTo(p1.x, p1.y); ctx.lineTo(p2.x, p2.y); ctx.stroke();
//     }

//     // Helper function to shade individual cells
//     const drawCellHighlight = (r, c, fillStr, strokeStr, textAlpha) => {
//       const normX = bounds.x + (c * cellWidth);
//       const normY = bounds.y + (r * cellHeight);
      
//       const p1 = viewer.viewport.pixelFromPoint(new OpenSeadragon.Point(normX, normY), true);
//       const p2 = viewer.viewport.pixelFromPoint(new OpenSeadragon.Point(normX + cellWidth, normY + cellHeight), true);
      
//       const w = p2.x - p1.x;
//       const h = p2.y - p1.y;

//       ctx.fillStyle = fillStr;
//       ctx.fillRect(p1.x, p1.y, w, h);
//       ctx.strokeStyle = strokeStr;
//       ctx.lineWidth = 2;
//       ctx.strokeRect(p1.x, p1.y, w, h);

//       // Draw coordinates text in center
//       ctx.fillStyle = `rgba(255, 255, 255, ${textAlpha})`;
//       ctx.font = "bold 13px monospace";
//       ctx.textAlign = "center";
//       ctx.textBaseline = "middle";
//       ctx.shadowColor = "rgba(0,0,0,0.6)";
//       ctx.shadowBlur = 4;
//       ctx.fillText(`${r},${c}`, p1.x + w/2, p1.y + h/2);
//       ctx.shadowBlur = 0;
//     };

//     // Draw active/hover highlights
//     if (hoveredTile && (!selectedPatch || hoveredTile.row !== selectedPatch.row || hoveredTile.col !== selectedPatch.col)) {
//       drawCellHighlight(hoveredTile.row, hoveredTile.col, "rgba(59, 130, 246, 0.2)", "rgba(59, 130, 246, 0.5)", 0.8);
//     }
    
//     if (selectedPatch) {
//       drawCellHighlight(selectedPatch.row, selectedPatch.col, "rgba(59, 130, 246, 0.4)", "rgba(59, 130, 246, 1)", 1);
//     }

//   }, [showGrid, tileGrid, viewMode, hoveredTile, selectedPatch]);

//   // Stable references for OSD event listeners
//   const stateRefs = useRef({ showGrid, tileGrid, drawGrid, handleGridClick: null });
//   useEffect(() => {
//     stateRefs.current.showGrid = showGrid;
//     stateRefs.current.tileGrid = tileGrid;
//     stateRefs.current.drawGrid = drawGrid;
//   }, [showGrid, tileGrid, drawGrid]);

//   const handleGridClick = useCallback((tile) => {
//     if (!selectedSlide) return;
//     setIsLoadingPatch(true);
//     const url = `${API_BASE}/api/slides/${selectedSlide.name}/tiles/${tile.filename}`;
//     setSelectedPatch({ row: tile.row, col: tile.col, url, filename: tile.filename });
//     setIsLoadingPatch(false);
//   }, [selectedSlide]);

//   useEffect(() => { stateRefs.current.handleGridClick = handleGridClick; }, [handleGridClick]);


//   // ── OSD Initialization & Event Hooks ──
//   useEffect(() => {
//     if (viewMode !== "dzi" || !selectedSlide?.has_dzi || isPatchFullscreen) return;

//     if (osdViewerRef.current) { osdViewerRef.current.destroy(); osdViewerRef.current = null; }
//     if (annoRef.current)      { annoRef.current.destroy();      annoRef.current = null; }

//     const viewer = OpenSeadragon({
//       id: "osd-viewer",
//       prefixUrl: "//openseadragon.github.io/openseadragon/images/",
//       tileSources: `${API_BASE}/api/slides/${selectedSlide.name}/slide.dzi`,
//       showNavigationControl: false,
//       crossOriginPolicy: "Anonymous",
//       animationTime: 0.5,
//       blendTime: 0.1,
//       constrainDuringPan: true,
//       maxZoomPixelRatio: 10,
//     });

//     osdViewerRef.current = viewer;

//     // Attach redraw hook to view movement events
//     const triggerDraw = () => stateRefs.current.drawGrid();
//     viewer.addHandler("open", triggerDraw);
//     viewer.addHandler("animation", triggerDraw);
//     viewer.addHandler("update-viewport", triggerDraw);
//     viewer.addHandler("resize", triggerDraw);
//     viewer.addHandler("zoom", (e) => setZoom([Math.round(e.zoom * 100)]));

//     // CLICK INTERCEPTOR
//     viewer.addHandler("canvas-click", (e) => {
//       const { showGrid, tileGrid, handleGridClick } = stateRefs.current;
//       if (!showGrid || !tileGrid || !handleGridClick) return;

//       const tiledImage = viewer.world.getItemAt(0);
//       if (!tiledImage) return;

//       const bounds = tiledImage.getBounds();
//       const rows = tileGrid.rows || 4;
//       const cols = tileGrid.cols || 4;
//       const normalizedPoint = viewer.viewport.pointFromPixel(e.position);

//       // Check if click was inside the actual image bounds
//       if (normalizedPoint.x >= bounds.x && normalizedPoint.x <= bounds.x + bounds.width &&
//           normalizedPoint.y >= bounds.y && normalizedPoint.y <= bounds.y + bounds.height) {
        
//         e.preventDefaultAction = true; // Stop zoom

//         const cellWidth = bounds.width / cols;
//         const cellHeight = bounds.height / rows;

//         const col = Math.floor((normalizedPoint.x - bounds.x) / cellWidth);
//         const row = Math.floor((normalizedPoint.y - bounds.y) / cellHeight);

//         if (row >= 0 && row < rows && col >= 0 && col < cols) {
//           const tile = tileGrid.tiles.find(t => t.row === row && t.col === col);
//           if (tile) handleGridClick(tile);
//         }
//       }
//     });

//     // HOVER TRACKER
//     const hoverTracker = new OpenSeadragon.MouseTracker({
//       element: viewer.element,
//       moveHandler: (e) => {
//         const { showGrid, tileGrid } = stateRefs.current;
//         if (!showGrid || !tileGrid) { setHoveredTile(null); return; }

//         const tiledImage = viewer.world.getItemAt(0);
//         if (!tiledImage) return;

//         const bounds = tiledImage.getBounds();
//         const rows = tileGrid.rows || 4;
//         const cols = tileGrid.cols || 4;
//         const normalizedPoint = viewer.viewport.pointFromPixel(e.position);

//         if (normalizedPoint.x >= bounds.x && normalizedPoint.x <= bounds.x + bounds.width &&
//             normalizedPoint.y >= bounds.y && normalizedPoint.y <= bounds.y + bounds.height) {
          
//           const cellWidth = bounds.width / cols;
//           const cellHeight = bounds.height / rows;

//           const col = Math.floor((normalizedPoint.x - bounds.x) / cellWidth);
//           const row = Math.floor((normalizedPoint.y - bounds.y) / cellHeight);

//           if (row >= 0 && row < rows && col >= 0 && col < cols) {
//             setHoveredTile((prev) => (prev?.row === row && prev?.col === col) ? prev : { row, col });
//           } else {
//             setHoveredTile(null);
//           }
//         } else {
//           setHoveredTile(null);
//         }
//       },
//       exitHandler: () => setHoveredTile(null)
//     });

//     const anno = Annotorious(viewer, { disableEditor: true, widgets: [] });
//     annoRef.current = anno;
//     const currentMode = drawingModeRef.current;
//     if (currentMode === "rect") { anno.setDrawingTool("rect"); anno.setDrawingEnabled(true); }
//     else if (currentMode === "circle") { anno.setDrawingTool("circle"); anno.setDrawingEnabled(true); }
//     else { anno.setDrawingEnabled(false); }

//     anno.on("createAnnotation", (annotation) => {
//       const shapeType = drawingModeRef.current === "circle" ? "circle" : "rect";
//       setAnnotations((prev) => [...prev, { id: annotation.id, label: `Region ${prev.length + 1}`, shape: shapeType, raw: annotation }]);
//     });
//     anno.on("deleteAnnotation", (annotation) => {
//       setAnnotations((prev) => prev.filter((a) => a.id !== annotation.id));
//     });

//     return () => {
//       hoverTracker.destroy();
//       if (annoRef.current)   { annoRef.current.destroy();   annoRef.current = null; }
//       if (osdViewerRef.current) { osdViewerRef.current.destroy(); osdViewerRef.current = null; }
//     };
//   }, [viewMode, selectedSlide, isPatchFullscreen, resetKey]);

//   useEffect(() => { drawGrid(); }, [showGrid, drawGrid, selectedPatch, hoveredTile]);

//   // ── Patch sidebar scroll-zoom ─────────────────────────────────────────────
//   useEffect(() => {
//     const container = patchContainerRef.current;
//     if (!container) return;
//     const handler = (e) => {
//       e.preventDefault();
//       const dir = e.deltaY < 0 ? 1 : -1;
//       setPatchZoom((p) => Math.min(Math.max(p + dir * 0.2, 1), 5));
//     };
//     container.addEventListener("wheel", handler, { passive: false });
//     return () => container.removeEventListener("wheel", handler);
//   }, [patchContainerRef, selectedPatch]);

//   useEffect(() => {
//     if (selectedPatch) { setPatchZoom(1); setFullPatchZoom([100]); }
//   }, [selectedPatch]);

//   // ── HANDLERS ─────────────────────────────────────────────────────────────
//   const handleZoomIn = () => {
//     if (isPatchFullscreen) { setFullPatchZoom([Math.min(fullPatchZoom[0] + 25, 500)]); return; }
//     if (osdViewerRef.current) osdViewerRef.current.viewport.zoomTo(osdViewerRef.current.viewport.getZoom() * 1.2);
//   };

//   const handleZoomOut = () => {
//     if (isPatchFullscreen) { setFullPatchZoom([Math.max(fullPatchZoom[0] - 25, 25)]); return; }
//     if (osdViewerRef.current) osdViewerRef.current.viewport.zoomTo(osdViewerRef.current.viewport.getZoom() / 1.2);
//   };

//   const handleSliderZoom = (val) => {
//     if (isPatchFullscreen) { setFullPatchZoom(val); return; }
//     setZoom(val);
//     if (osdViewerRef.current) osdViewerRef.current.viewport.zoomTo(val[0] / 100);
//   };

//   const handleRotateCw  = () => { const r = rotation + 90; setRotation(r); if (!isPatchFullscreen && osdViewerRef.current) osdViewerRef.current.viewport.setRotation(r); };
//   const handleRotateCcw = () => { const r = rotation - 90; setRotation(r); if (!isPatchFullscreen && osdViewerRef.current) osdViewerRef.current.viewport.setRotation(r); };

//   const handleReset = () => {
//     setResetKey((k) => k + 1);
//     setRotation(0);
//     if (isPatchFullscreen) { setFullPatchZoom([100]); return; }
//     setZoom([100]);
//     setSelectedPatch(null);
//     setHoveredTile(null);
//     if (osdViewerRef.current) { osdViewerRef.current.viewport.goHome(); osdViewerRef.current.viewport.setRotation(0); }
//     if (annoRef.current) annoRef.current.clearAnnotations();
//     setAnnotations([]);
//   };

//   const handleModeChange = (mode) => {
//     setDrawingMode(mode);
//     drawingModeRef.current = mode;
//     if (!annoRef.current) return;
//     if (mode === "select") { annoRef.current.setDrawingEnabled(false); }
//     else if (mode === "rect") { annoRef.current.setDrawingTool("rect"); annoRef.current.setDrawingEnabled(true); }
//     else if (mode === "circle") { annoRef.current.setDrawingTool("circle"); annoRef.current.setDrawingEnabled(true); }
//   };

//   const handlePatchZoomIn  = (e) => { e.stopPropagation(); setPatchZoom((p) => Math.min(p + 0.5, 5)); };
//   const handlePatchZoomOut = (e) => { e.stopPropagation(); setPatchZoom((p) => Math.max(p - 0.5, 1)); };
//   const handlePatchReset   = (e) => { e.stopPropagation(); setPatchZoom(1); setSidebarKey((k) => k + 1); };
//   const togglePatchFullscreen = () => { setIsPatchFullscreen(!isPatchFullscreen); setRotation(0); };

//   const gridRows = tileGrid?.rows || 4;
//   const gridCols = tileGrid?.cols || 4;

//   // ── RENDER ────────────────────────────────────────────────────────────────
//   return (
//     <div className="min-h-screen bg-background flex flex-col">
//       {/* HEADER */}
//       <motion.header
//         initial={{ y: -20, opacity: 0 }}
//         animate={{ y: 0, opacity: 1 }}
//         className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50 shrink-0"
//       >
//         <div className="container mx-auto px-4 py-3 flex items-center justify-between gap-4 flex-wrap">
//           <div className="flex items-center gap-4">
//             <Button variant="ghost" size="sm" onClick={() => navigate("/")} className="hover:bg-primary/90">
//               <ArrowLeft className="w-4 h-4 mr-2" /> Back
//             </Button>
//             <div>
//               <h1 className="text-xl font-bold">WSI Slide Viewer</h1>
//               {selectedSlide && <p className="text-xs text-muted-foreground">{selectedSlide.name}</p>}
//             </div>
//           </div>

//           <div className="flex items-center gap-3 flex-wrap">
//             <SlideSelector
//               slides={slides}
//               selectedSlide={selectedSlide}
//               onSelect={handleSlideSelect}
//               loading={slidesLoading}
//             />
//           </div>

//           <div className="flex items-center gap-2">
//             {!isPatchFullscreen && selectedSlide?.has_tiles && (
//               <Button variant={showGrid ? "default" : "outline"} size="sm" onClick={() => setShowGrid(!showGrid)}>
//                 <Grid3X3 className="w-4 h-4 mr-2" />
//                 {showGrid ? "Hide Grid" : "Show Grid"}
//               </Button>
//             )}
//             <Button variant="outline" size="sm">
//               <Download className="w-4 h-4 mr-2" /> Export
//             </Button>
//           </div>
//         </div>
//       </motion.header>

//       {/* MAIN */}
//       <div className="flex-1 container mx-auto px-4 py-6 overflow-hidden">
//         {/* ERROR BANNER */}
//         <AnimatePresence>
//           {error && (
//             <motion.div
//               initial={{ opacity: 0, height: 0 }}
//               animate={{ opacity: 1, height: "auto" }}
//               exit={{ opacity: 0, height: 0 }}
//               className="mb-4 flex items-center gap-3 bg-destructive/10 border border-destructive/20 text-destructive rounded-xl px-4 py-3 text-sm"
//             >
//               <AlertCircle className="w-4 h-4 shrink-0" />
//               {error}
//               <button className="ml-auto" onClick={() => setError(null)}><X className="w-4 h-4" /></button>
//             </motion.div>
//           )}
//         </AnimatePresence>

//         {!selectedSlide && !slidesLoading && (
//           <div className="flex flex-col items-center justify-center h-[60vh] gap-4 text-muted-foreground">
//             <Layers className="w-16 h-16 opacity-20" />
//             <p className="text-lg font-medium">Select a slide to begin</p>
//             <p className="text-sm">Use the dropdown in the header to choose a slide from your GCP bucket.</p>
//           </div>
//         )}

//         {selectedSlide && (
//           <div className="grid lg:grid-cols-[1fr_300px] gap-6 h-full">
//             {/* VIEWER WINDOW */}
//             <motion.div
//               className="bg-muted/30 rounded-2xl border border-border shadow-card overflow-hidden relative group"
//               style={{ height: "calc(100vh - 160px)" }}
//             >
//               {/* LEFT TOOLBAR */}
//               <div className="absolute left-4 top-1/2 -translate-y-1/2 z-20 flex flex-col bg-white/90 backdrop-blur-sm rounded-full shadow-lg border border-border/50">
//                 <div className="p-2">
//                   <Button variant="ghost" size="icon" className="rounded-full h-10 w-10" onClick={() => setIsToolbarExpanded(!isToolbarExpanded)}>
//                     {isToolbarExpanded ? <X className="w-5 h-5" /> : <MoreHorizontal className="w-5 h-5" />}
//                   </Button>
//                 </div>
//                 <motion.div
//                   initial={false}
//                   animate={{ height: isToolbarExpanded ? "auto" : 0, opacity: isToolbarExpanded ? 1 : 0 }}
//                   transition={{ duration: 0.3, ease: "easeInOut" }}
//                   className="flex flex-col items-center overflow-hidden"
//                 >
//                   <div className="flex flex-col gap-2 pb-2 px-2">
//                     <div className="h-px w-6 bg-border mx-auto my-1" />
//                     <Button variant={drawingMode === "select" ? "default" : "ghost"} size="icon" className="rounded-full h-10 w-10" onClick={() => handleModeChange("select")} title="Select / Pan"><MousePointer2 className="w-5 h-5" /></Button>
//                     <Button variant={drawingMode === "rect"   ? "default" : "ghost"} size="icon" className="rounded-full h-10 w-10" onClick={() => handleModeChange("rect")}   title="Draw Rectangle"><Square className="w-5 h-5" /></Button>
//                     <Button variant={drawingMode === "circle"  ? "default" : "ghost"} size="icon" className="rounded-full h-10 w-10" onClick={() => handleModeChange("circle")}  title="Draw Circle"><CircleIcon className="w-5 h-5" /></Button>
//                     <div className="h-px w-6 bg-border mx-auto my-1" />
//                     <Button variant="ghost" size="icon" className="rounded-full h-10 w-10 hover:bg-primary/10" onClick={handleReset}><Home className="w-5 h-5 text-primary" /></Button>
//                     <Button variant="ghost" size="icon" className="rounded-full h-10 w-10 hover:bg-primary/10" onClick={handleZoomIn}><ZoomIn className="w-5 h-5" /></Button>
//                     <Button variant="ghost" size="icon" className="rounded-full h-10 w-10 hover:bg-primary/10" onClick={handleZoomOut}><ZoomOut className="w-5 h-5" /></Button>
//                     <div className="h-px w-6 bg-border mx-auto my-1" />
//                     <Button variant="ghost" size="icon" className="rounded-full h-10 w-10 hover:bg-primary/10" onClick={handleRotateCcw}><RotateCcw className="w-5 h-5" /></Button>
//                     <Button variant="ghost" size="icon" className="rounded-full h-10 w-10 hover:bg-primary/10" onClick={handleRotateCw}><RotateCw  className="w-5 h-5" /></Button>
//                     <div className="h-px w-6 bg-border mx-auto my-1" />
//                     <Button variant="ghost" size="icon" className="rounded-full h-10 w-10 hover:bg-primary/10"><Camera className="w-5 h-5" /></Button>
//                   </div>
//                 </motion.div>
//               </div>

//               {/* FULLSCREEN PATCH VIEW */}
//               {isPatchFullscreen && selectedPatch ? (
//                 <div ref={fullscreenContainerRef} className="relative w-full h-full flex items-center justify-center overflow-hidden bg-black/5">
//                   <div className="absolute top-4 left-4 z-20 ml-16">
//                     <Button onClick={togglePatchFullscreen} variant="secondary" className="shadow-lg gap-2">
//                       <ArrowLeft className="w-4 h-4" /> Return to Slide
//                     </Button>
//                   </div>
//                   <motion.div
//                     key={`patch-${resetKey}`}
//                     animate={{ scale: fullPatchZoom[0] / 100, rotate: rotation }}
//                     transition={{ type: "spring", stiffness: 300, damping: 30 }}
//                     className="relative shadow-2xl cursor-grab active:cursor-grabbing"
//                     drag={fullPatchZoom[0] > 100}
//                     dragConstraints={fullscreenContainerRef}
//                     dragElastic={0.1}
//                   >
//                     <img
//                       src={selectedPatch.url}
//                       alt="Full Patch View"
//                       className="max-w-none h-[600px] object-contain select-none pointer-events-none"
//                       draggable={false}
//                       onError={(e) => { e.currentTarget.src = "https://placehold.co/800x800?text=No+Data"; }}
//                     />
//                   </motion.div>
//                   <div className="absolute bottom-4 left-4 bg-primary text-primary-foreground px-4 py-2 rounded-lg text-sm font-medium z-10 shadow-lg ml-16">
//                     Patch: Row {selectedPatch.row}, Col {selectedPatch.col}
//                   </div>
//                 </div>
//               ) : viewMode === "dzi" ? (
//                 /* DZI VIEW */
//                 <div className="relative w-full h-full">
//                   <div id="osd-viewer" className="w-full h-full" />
                  
//                   {/* CANVAS GRID OVERLAY */}
//                   <canvas 
//                     ref={canvasRef} 
//                     className="absolute inset-0 w-full h-full pointer-events-none"
//                     style={{ zIndex: 15 }} 
//                   />

//                   <div className="absolute top-4 left-4 bg-background/90 backdrop-blur-sm px-4 py-2 rounded-lg border border-border z-10 ml-16">
//                     <div className="text-xs text-muted-foreground">Mode</div>
//                     <div className="text-lg font-bold text-primary capitalize">{drawingMode}</div>
//                   </div>
//                   {showGrid && tileGrid && (
//                     <div className="absolute top-4 right-4 bg-primary text-primary-foreground px-3 py-1.5 rounded-lg text-xs font-medium z-10 shadow">
//                       Grid {gridRows} × {gridCols}
//                     </div>
//                   )}
//                 </div>
//               ) : (
//                 /* TILE GRID VIEW */
//                 <div className="relative w-full h-full flex items-center justify-center overflow-hidden bg-black/5">
//                   {tilesLoading ? (
//                     <div className="flex flex-col items-center gap-3 text-muted-foreground">
//                       <Loader2 className="w-8 h-8 animate-spin text-primary" />
//                       <span className="text-sm">Loading tile grid…</span>
//                     </div>
//                   ) : tileGrid ? (
//                     <>
//                       <div
//                         className="absolute inset-0 grid"
//                         style={{
//                           gridTemplateColumns: `repeat(${gridCols}, 1fr)`,
//                           gridTemplateRows: `repeat(${gridRows}, 1fr)`,
//                         }}
//                       >
//                         {tileGrid.tiles.map((tile) => {
//                           const isSelected = selectedPatch?.row === tile.row && selectedPatch?.col === tile.col;
//                           return (
//                             <div
//                               key={`tile-${tile.row}-${tile.col}`}
//                               data-tile-row={tile.row}
//                               data-tile-col={tile.col}
//                               className={`
//                                 relative overflow-hidden border border-white/10 cursor-pointer transition-all hover:brightness-110 hover:z-10
//                                 ${isSelected ? "ring-2 ring-primary ring-inset" : ""}
//                               `}
//                               onClick={() => handleGridClick(tile)}
//                             >
//                               <img
//                                 src={`${API_BASE}/api/slides/${selectedSlide.name}/tiles/${tile.filename}`}
//                                 alt={`Tile R${tile.row}C${tile.col}`}
//                                 className="w-full h-full object-cover"
//                                 loading="lazy"
//                                 onError={(e) => { e.currentTarget.style.background = "#334155"; }}
//                               />
//                               <div className="absolute bottom-1 right-1 bg-black/50 text-white text-[10px] px-1 rounded">
//                                 {tile.row},{tile.col}
//                               </div>
//                             </div>
//                           );
//                         })}
//                       </div>
//                       {showGrid && (
//                         <div
//                           className="absolute inset-0 grid pointer-events-none"
//                           style={{
//                             gridTemplateColumns: `repeat(${gridCols}, 1fr)`,
//                             gridTemplateRows: `repeat(${gridRows}, 1fr)`,
//                             zIndex: 10
//                           }}
//                         >
//                           {Array.from({ length: gridRows * gridCols }).map((_, i) => (
//                             <div key={i} className="border border-primary/30 flex items-center justify-center">
//                               <span className="text-[10px] text-white/50 font-mono">
//                                 {Math.floor(i / gridCols)},{i % gridCols}
//                               </span>
//                             </div>
//                           ))}
//                         </div>
//                       )}
//                     </>
//                   ) : (
//                     <div className="text-muted-foreground text-sm">No tiles available for this slide.</div>
//                   )}
//                 </div>
//               )}
//             </motion.div>

//             {/* RIGHT SIDEBAR */}
//             <motion.div className="space-y-4 overflow-y-auto h-[calc(100vh-160px)] pr-2">
//               {/* PATCH PREVIEW */}
//               <AnimatePresence>
//                 {selectedPatch && !isPatchFullscreen && (
//                   <motion.div
//                     initial={{ opacity: 0, height: 0 }}
//                     animate={{ opacity: 1, height: "auto" }}
//                     exit={{ opacity: 0, height: 0 }}
//                     className="bg-primary/5 border border-primary/20 rounded-2xl p-4 shadow-sm"
//                   >
//                     <div className="flex justify-between items-center mb-2">
//                       <h3 className="font-semibold text-primary">Selected Patch</h3>
//                       <div className="flex gap-1">
//                         <Button variant="ghost" size="icon" className="h-6 w-6 text-primary hover:bg-primary/20" onClick={togglePatchFullscreen}>
//                           <Expand className="w-4 h-4" />
//                         </Button>
//                         <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => setSelectedPatch(null)}>
//                           <X className="w-4 h-4" />
//                         </Button>
//                       </div>
//                     </div>
//                     <div ref={patchContainerRef} className="aspect-square bg-black/10 rounded-lg overflow-hidden relative group">
//                       {isLoadingPatch ? (
//                         <div className="flex items-center justify-center w-full h-full">
//                           <Loader2 className="w-6 h-6 animate-spin text-primary" />
//                         </div>
//                       ) : (
//                         <>
//                           <motion.img
//                             key={sidebarKey}
//                             src={selectedPatch.url}
//                             alt="High Res Patch"
//                             className={`w-full h-full object-cover ${patchZoom > 1 ? "cursor-grab active:cursor-grabbing" : "cursor-default"}`}
//                             drag={patchZoom > 1}
//                             dragConstraints={{ left: -150*(patchZoom-1), right: 150*(patchZoom-1), top: -150*(patchZoom-1), bottom: 150*(patchZoom-1) }}
//                             dragElastic={0.2}
//                             animate={{ scale: patchZoom }}
//                             transition={{ type: "spring", stiffness: 300, damping: 20 }}
//                             onError={(e) => { e.currentTarget.src = "https://placehold.co/400x400?text=No+Data"; }}
//                           />
//                           <div className="absolute bottom-2 right-2 flex gap-1 bg-black/50 backdrop-blur-md p-1 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity">
//                             <Button variant="ghost" size="icon" className="h-6 w-6 text-white hover:bg-white/20" onClick={handlePatchZoomOut}><ZoomOut className="w-3 h-3" /></Button>
//                             <Button variant="ghost" size="icon" className="h-6 w-6 text-white hover:bg-white/20" onClick={handlePatchZoomIn}><ZoomIn  className="w-3 h-3" /></Button>
//                             <Button variant="ghost" size="icon" className="h-6 w-6 text-white hover:bg-white/20" onClick={handlePatchReset}><RefreshCcw className="w-3 h-3" /></Button>
//                           </div>
//                         </>
//                       )}
//                     </div>
//                     <div className="mt-2 text-xs text-muted-foreground text-center">
//                       Row {selectedPatch.row} · Col {selectedPatch.col}
//                     </div>
//                   </motion.div>
//                 )}
//               </AnimatePresence>

//               {/* SLIDE INFO */}
//               {selectedSlide && (
//                 <div className="bg-card border border-border rounded-2xl p-4 shadow-card">
//                   <h3 className="font-semibold mb-3 text-sm">Slide Info</h3>
//                   <div className="space-y-1.5 text-xs text-muted-foreground">
//                     <div className="flex justify-between"><span>Name</span><span className="text-foreground font-medium truncate ml-2 max-w-[140px]">{selectedSlide.name}</span></div>
//                     <div className="flex justify-between"><span>DZI</span><span className={selectedSlide.has_dzi ? "text-emerald-500" : "text-muted-foreground"}>{selectedSlide.has_dzi ? "✓ Available" : "—"}</span></div>
//                     <div className="flex justify-between"><span>Tiles</span><span className={selectedSlide.has_tiles ? "text-blue-500" : "text-muted-foreground"}>{selectedSlide.has_tiles ? `✓ ${tileGrid ? `${tileGrid.rows}×${tileGrid.cols}` : "Available"}` : "—"}</span></div>
//                     <div className="flex justify-between"><span>View Mode</span><span className="text-foreground font-medium capitalize">{viewMode}</span></div>
//                   </div>
//                 </div>
//               )}

//               {/* CONTROLS */}
//               <div className="bg-card border border-border rounded-2xl p-6 shadow-card">
//                 <h3 className="font-semibold mb-4">{isPatchFullscreen ? "Patch Controls" : "Slide Controls"}</h3>
//                 <div className="space-y-4">
//                   <div className="flex items-center gap-2">
//                     <Button variant="outline" size="icon" onClick={handleZoomOut}><ZoomOut className="w-4 h-4" /></Button>
//                     <Slider
//                       value={isPatchFullscreen ? fullPatchZoom : zoom}
//                       onValueChange={handleSliderZoom}
//                       min={25} max={isPatchFullscreen ? 500 : 400} step={25}
//                       className="flex-1"
//                     />
//                     <Button variant="outline" size="icon" onClick={handleZoomIn}><ZoomIn className="w-4 h-4" /></Button>
//                   </div>
//                   <div className="text-center text-sm text-muted-foreground">
//                     Zoom: {isPatchFullscreen ? fullPatchZoom[0] : zoom[0]}%
//                   </div>
//                 </div>
//               </div>

//               <div className="bg-card border border-border rounded-2xl p-6 shadow-card">
//                 <h3 className="font-semibold mb-4">View Controls</h3>
//                 <div className="space-y-2">
//                   <Button variant="outline" className="w-full justify-start" onClick={handleRotateCw}><RotateCw className="w-4 h-4 mr-2" /> Rotate 90°</Button>
//                   <Button variant="outline" className="w-full justify-start" onClick={handleReset}><Home className="w-4 h-4 mr-2" /> Reset View</Button>
//                 </div>
//               </div>

//             </motion.div>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default Viewer;


import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect, useRef, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import {
  ZoomIn, ZoomOut, Home, RotateCw, RotateCcw,
  Download, ArrowLeft, Grid3X3, X, RefreshCcw,
  Move, Expand, Camera, MoreHorizontal, Square,
  Circle as CircleIcon, MousePointer2, ChevronDown,
  Layers, FileImage, AlertCircle, Loader2
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import OpenSeadragon from "openseadragon";
import Annotorious from "@recogito/annotorious-openseadragon";
import "@recogito/annotorious-openseadragon/dist/annotorious.min.css";

// ── CONFIG ────────────────────────────────────────────────────────────────────
const API_BASE = "https://slide-viewer-api-569050139131.asia-south1.run.app";

// ── AUTH HELPER ───────────────────────────────────────────────────────────────
const authFetch = (url: string, options: RequestInit = {}) => {
  const token = localStorage.getItem("auth_token");
  
  return fetch(url, {
    ...options,
    headers: {
      ...(options.headers || {}),
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  });
};

// ── SLIDE SELECTOR COMPONENT ──────────────────────────────────────────────────
const SlideSelector = ({ slides, selectedSlide, onSelect, loading }) => {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const handler = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 px-4 py-2 rounded-xl border border-border bg-card hover:bg-muted/50 transition-colors text-sm font-medium min-w-[220px] justify-between"
      >
        <div className="flex items-center gap-2">
          {loading ? (
            <Loader2 className="w-4 h-4 animate-spin text-primary" />
          ) : (
            <Layers className="w-4 h-4 text-primary" />
          )}
          <span className="truncate">
            {selectedSlide ? selectedSlide.name : "Select a slide…"}
          </span>
        </div>
        <ChevronDown className={`w-4 h-4 text-muted-foreground transition-transform ${open ? "rotate-180" : ""}`} />
      </button>

      {/* <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.15 }}
            className="absolute top-full mt-2 left-0 w-full bg-card border border-border rounded-xl shadow-xl z-50 overflow-hidden"
          >
            {slides.length === 0 ? (
              <div className="px-4 py-3 text-sm text-muted-foreground">No slides found</div>
            ) : (
              slides.map((slide) => (
                <button
                  key={slide.name}
                  onClick={() => { onSelect(slide); setOpen(false); }}
                  className={`w-full flex items-center gap-3 px-4 py-3 text-sm hover:bg-muted/50 transition-colors text-left
                    ${selectedSlide?.name === slide.name ? "bg-primary/10 text-primary" : ""}`}
                >
                  <FileImage className="w-4 h-4 shrink-0" />
                  <div className="flex-1 min-w-0">
                    <div className="font-medium truncate">{slide.name}</div>
                    <div className="text-xs text-muted-foreground flex gap-2 mt-0.5">
                      {slide.has_dzi && <span className="bg-emerald-500/10 text-emerald-600 px-1.5 py-0.5 rounded-full">DZI</span>}
                      {slide.has_tiles && <span className="bg-blue-500/10 text-blue-600 px-1.5 py-0.5 rounded-full">Tiles</span>}
                    </div>
                  </div>
                  {selectedSlide?.name === slide.name && (
                    <div className="w-2 h-2 rounded-full bg-primary shrink-0" />
                  )}
                </button>
              ))
            )}
          </motion.div>
        )}
      </AnimatePresence> */}
      <AnimatePresence>
  {open && (
    <motion.div
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ duration: 0.15 }}
      className="absolute top-full mt-2 left-0 w-full bg-card border border-border rounded-xl shadow-xl z-50 overflow-hidden"
    >
      {slides.length === 0 ? (
        <div className="px-4 py-3 text-sm text-muted-foreground">No slides found</div>
      ) : (
        slides
          .filter((slide) => slide.has_dzi) // 1. Filters out slides that are Tiles-only
          .map((slide) => (
            <button
              key={slide.name}
              onClick={() => { onSelect(slide); setOpen(false); }}
              className={`w-full flex items-center gap-3 px-4 py-3 text-sm hover:bg-muted/50 transition-colors text-left
                ${selectedSlide?.name === slide.name ? "bg-primary/10 text-primary" : ""}`}
            >
              <FileImage className="w-4 h-4 shrink-0" />
              <div className="flex-1 min-w-0">
                <div className="font-medium truncate">{slide.name}</div>
                {/* 2. The DZI and Tiles badge div has been completely removed from here */}
              </div>
              {selectedSlide?.name === slide.name && (
                <div className="w-2 h-2 rounded-full bg-primary shrink-0" />
              )}
            </button>
          ))
      )}
    </motion.div>
  )}
</AnimatePresence>
    </div>
  );
};

// ── MAIN VIEWER ───────────────────────────────────────────────────────────────
const Viewer = () => {
  const navigate = useNavigate();

  // ── Route Protection Check ──
  useEffect(() => {
    const token = localStorage.getItem("auth_token");
    if (!token) {
      navigate("/login"); // Kick them out if no token exists
    }
  }, [navigate]);

  // ── Slide selection state ──
  const [slides, setSlides]               = useState([]);
  const [slidesLoading, setSlidesLoading] = useState(true);
  const [selectedSlide, setSelectedSlide] = useState(null);
  const [viewMode, setViewMode]           = useState("dzi");

  // ── OSD / viewer state ──
  const [zoom, setZoom]                     = useState([100]);
  const [rotation, setRotation]             = useState(0);
  const [showGrid, setShowGrid]             = useState(false);
  const [resetKey, setResetKey]             = useState(0);
  const [isToolbarExpanded, setIsToolbarExpanded] = useState(false);
  const [drawingMode, setDrawingMode]       = useState("select");
  const osdViewerRef                        = useRef(null);
  const canvasRef                           = useRef(null); // The synchronized canvas
  const annoRef                             = useRef(null);
  const drawingModeRef                      = useRef("select");

  // ── Annotation state ──
  const [annotations, setAnnotations]       = useState([]);

  // ── Patch tile state ──
  const [tileGrid, setTileGrid]           = useState(null);
  const [tilesLoading, setTilesLoading]   = useState(false);
  const [selectedPatch, setSelectedPatch] = useState(null);
  const [hoveredTile, setHoveredTile]     = useState(null); // Active hover state
  const [isLoadingPatch, setIsLoadingPatch] = useState(false);
  const [patchZoom, setPatchZoom]         = useState(1);
  const [sidebarKey, setSidebarKey]       = useState(0);
  const patchContainerRef                 = useRef(null);

  // ── Fullscreen patch state ──
  const [isPatchFullscreen, setIsPatchFullscreen] = useState(false);
  const [fullPatchZoom, setFullPatchZoom]         = useState([100]);
  const fullscreenContainerRef                    = useRef(null);

  const [error, setError] = useState(null);

  // ── Fetch slide list on mount ──
  useEffect(() => {
    setSlidesLoading(true);
    authFetch(`${API_BASE}/api/slides`)                          // ← CHANGE 1
      .then((r) => r.json())
      .then((data) => {
        setSlides(data);
        const first = data.find((s) => s.has_dzi) || data[0];
        if (first) handleSlideSelect(first);
      })
      .catch(() => setError("Could not connect to backend. Is Flask running on port 5000?"))
      .finally(() => setSlidesLoading(false));
  }, []);

  const handleSlideSelect = (slide) => {
    setSelectedSlide(slide);
    setSelectedPatch(null);
    setHoveredTile(null);
    setTileGrid(null);
    setError(null);
    setResetKey((k) => k + 1);

    if (slide.has_dzi) setViewMode("dzi");
    else if (slide.has_tiles) setViewMode("tiles");

    if (slide.has_tiles) {
      setTilesLoading(true);
      authFetch(`${API_BASE}/api/slides/${slide.name}/tiles`)   // ← CHANGE 2
        .then((r) => r.json())
        .then((data) => setTileGrid(data))
        .catch(() => setError("Failed to load tile list"))
        .finally(() => setTilesLoading(false));
    }
  };

  // ── SYNCHRONIZED CANVAS GRID DRAWING LOGIC ──
  const drawGrid = useCallback(() => {
    if (!osdViewerRef.current || !canvasRef.current || viewMode !== "dzi") return;
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    
    if (!showGrid || !tileGrid) {
      ctx?.clearRect(0, 0, canvas.width, canvas.height);
      return;
    }

    const viewer = osdViewerRef.current;
    
    // Sync canvas resolution to physical element size
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const tiledImage = viewer.world.getItemAt(0);
    if (!tiledImage) return;

    // Get exact bounds of the image in OSD math space
    const bounds = tiledImage.getBounds();
    const rows = tileGrid.rows || 4;
    const cols = tileGrid.cols || 4;

    const cellWidth = bounds.width / cols;
    const cellHeight = bounds.height / rows;

    ctx.strokeStyle = "rgba(59, 130, 246, 0.4)"; // Tailwind Blue-500
    ctx.lineWidth = 1;

    // Draw horizontal lines
    for (let r = 0; r <= rows; r++) {
      const normY = bounds.y + (r * cellHeight);
      const p1 = viewer.viewport.pixelFromPoint(new OpenSeadragon.Point(bounds.x, normY), true);
      const p2 = viewer.viewport.pixelFromPoint(new OpenSeadragon.Point(bounds.x + bounds.width, normY), true);
      ctx.beginPath(); ctx.moveTo(p1.x, p1.y); ctx.lineTo(p2.x, p2.y); ctx.stroke();
    }

    // Draw vertical lines
    for (let c = 0; c <= cols; c++) {
      const normX = bounds.x + (c * cellWidth);
      const p1 = viewer.viewport.pixelFromPoint(new OpenSeadragon.Point(normX, bounds.y), true);
      const p2 = viewer.viewport.pixelFromPoint(new OpenSeadragon.Point(normX, bounds.y + bounds.height), true);
      ctx.beginPath(); ctx.moveTo(p1.x, p1.y); ctx.lineTo(p2.x, p2.y); ctx.stroke();
    }

    // Helper function to shade individual cells
    const drawCellHighlight = (r, c, fillStr, strokeStr, textAlpha) => {
      const normX = bounds.x + (c * cellWidth);
      const normY = bounds.y + (r * cellHeight);
      
      const p1 = viewer.viewport.pixelFromPoint(new OpenSeadragon.Point(normX, normY), true);
      const p2 = viewer.viewport.pixelFromPoint(new OpenSeadragon.Point(normX + cellWidth, normY + cellHeight), true);
      
      const w = p2.x - p1.x;
      const h = p2.y - p1.y;

      ctx.fillStyle = fillStr;
      ctx.fillRect(p1.x, p1.y, w, h);
      ctx.strokeStyle = strokeStr;
      ctx.lineWidth = 2;
      ctx.strokeRect(p1.x, p1.y, w, h);

      // Draw coordinates text in center
      ctx.fillStyle = `rgba(255, 255, 255, ${textAlpha})`;
      ctx.font = "bold 13px monospace";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.shadowColor = "rgba(0,0,0,0.6)";
      ctx.shadowBlur = 4;
      ctx.fillText(`${r},${c}`, p1.x + w/2, p1.y + h/2);
      ctx.shadowBlur = 0;
    };

    // Draw active/hover highlights
    if (hoveredTile && (!selectedPatch || hoveredTile.row !== selectedPatch.row || hoveredTile.col !== selectedPatch.col)) {
      drawCellHighlight(hoveredTile.row, hoveredTile.col, "rgba(59, 130, 246, 0.2)", "rgba(59, 130, 246, 0.5)", 0.8);
    }
    
    if (selectedPatch) {
      drawCellHighlight(selectedPatch.row, selectedPatch.col, "rgba(59, 130, 246, 0.4)", "rgba(59, 130, 246, 1)", 1);
    }

  }, [showGrid, tileGrid, viewMode, hoveredTile, selectedPatch]);

  // Stable references for OSD event listeners
  const stateRefs = useRef({ showGrid, tileGrid, drawGrid, handleGridClick: null });
  useEffect(() => {
    stateRefs.current.showGrid = showGrid;
    stateRefs.current.tileGrid = tileGrid;
    stateRefs.current.drawGrid = drawGrid;
  }, [showGrid, tileGrid, drawGrid]);

  const handleGridClick = useCallback((tile) => {
    if (!selectedSlide) return;
    setIsLoadingPatch(true);
    const url = `${API_BASE}/api/slides/${selectedSlide.name}/tiles/${tile.filename}`;
    setSelectedPatch({ row: tile.row, col: tile.col, url, filename: tile.filename });
    setIsLoadingPatch(false);
  }, [selectedSlide]);

  useEffect(() => { stateRefs.current.handleGridClick = handleGridClick; }, [handleGridClick]);


  // ── OSD Initialization & Event Hooks ──
  useEffect(() => {
    if (viewMode !== "dzi" || !selectedSlide?.has_dzi || isPatchFullscreen) return;

    if (osdViewerRef.current) { osdViewerRef.current.destroy(); osdViewerRef.current = null; }
    if (annoRef.current)      { annoRef.current.destroy();      annoRef.current = null; }

    const viewer = OpenSeadragon({
      id: "osd-viewer",
      prefixUrl: "//openseadragon.github.io/openseadragon/images/",
      tileSources: `${API_BASE}/api/slides/${selectedSlide.name}/slide.dzi`,
      showNavigationControl: false,
      crossOriginPolicy: "Anonymous",
      animationTime: 0.5,
      blendTime: 0.1,
      constrainDuringPan: true,
      maxZoomPixelRatio: 10,
    });

    osdViewerRef.current = viewer;

    // Attach redraw hook to view movement events
    const triggerDraw = () => stateRefs.current.drawGrid();
    viewer.addHandler("open", triggerDraw);
    viewer.addHandler("animation", triggerDraw);
    viewer.addHandler("update-viewport", triggerDraw);
    viewer.addHandler("resize", triggerDraw);
    viewer.addHandler("zoom", (e) => setZoom([Math.round(e.zoom * 100)]));

    // CLICK INTERCEPTOR
    viewer.addHandler("canvas-click", (e) => {
      const { showGrid, tileGrid, handleGridClick } = stateRefs.current;
      if (!showGrid || !tileGrid || !handleGridClick) return;

      const tiledImage = viewer.world.getItemAt(0);
      if (!tiledImage) return;

      const bounds = tiledImage.getBounds();
      const rows = tileGrid.rows || 4;
      const cols = tileGrid.cols || 4;
      const normalizedPoint = viewer.viewport.pointFromPixel(e.position);

      // Check if click was inside the actual image bounds
      if (normalizedPoint.x >= bounds.x && normalizedPoint.x <= bounds.x + bounds.width &&
          normalizedPoint.y >= bounds.y && normalizedPoint.y <= bounds.y + bounds.height) {
        
        e.preventDefaultAction = true; // Stop zoom

        const cellWidth = bounds.width / cols;
        const cellHeight = bounds.height / rows;

        const col = Math.floor((normalizedPoint.x - bounds.x) / cellWidth);
        const row = Math.floor((normalizedPoint.y - bounds.y) / cellHeight);

        if (row >= 0 && row < rows && col >= 0 && col < cols) {
          const tile = tileGrid.tiles.find(t => t.row === row && t.col === col);
          if (tile) handleGridClick(tile);
        }
      }
    });

    // HOVER TRACKER
    const hoverTracker = new OpenSeadragon.MouseTracker({
      element: viewer.element,
      moveHandler: (e) => {
        const { showGrid, tileGrid } = stateRefs.current;
        if (!showGrid || !tileGrid) { setHoveredTile(null); return; }

        const tiledImage = viewer.world.getItemAt(0);
        if (!tiledImage) return;

        const bounds = tiledImage.getBounds();
        const rows = tileGrid.rows || 4;
        const cols = tileGrid.cols || 4;
        const normalizedPoint = viewer.viewport.pointFromPixel(e.position);

        if (normalizedPoint.x >= bounds.x && normalizedPoint.x <= bounds.x + bounds.width &&
            normalizedPoint.y >= bounds.y && normalizedPoint.y <= bounds.y + bounds.height) {
          
          const cellWidth = bounds.width / cols;
          const cellHeight = bounds.height / rows;

          const col = Math.floor((normalizedPoint.x - bounds.x) / cellWidth);
          const row = Math.floor((normalizedPoint.y - bounds.y) / cellHeight);

          if (row >= 0 && row < rows && col >= 0 && col < cols) {
            setHoveredTile((prev) => (prev?.row === row && prev?.col === col) ? prev : { row, col });
          } else {
            setHoveredTile(null);
          }
        } else {
          setHoveredTile(null);
        }
      },
      exitHandler: () => setHoveredTile(null)
    });

    const anno = Annotorious(viewer, { disableEditor: true, widgets: [] });
    annoRef.current = anno;
    const currentMode = drawingModeRef.current;
    if (currentMode === "rect") { anno.setDrawingTool("rect"); anno.setDrawingEnabled(true); }
    else if (currentMode === "circle") { anno.setDrawingTool("circle"); anno.setDrawingEnabled(true); }
    else { anno.setDrawingEnabled(false); }

    anno.on("createAnnotation", (annotation) => {
      const shapeType = drawingModeRef.current === "circle" ? "circle" : "rect";
      setAnnotations((prev) => [...prev, { id: annotation.id, label: `Region ${prev.length + 1}`, shape: shapeType, raw: annotation }]);
    });
    anno.on("deleteAnnotation", (annotation) => {
      setAnnotations((prev) => prev.filter((a) => a.id !== annotation.id));
    });

    return () => {
      hoverTracker.destroy();
      if (annoRef.current)   { annoRef.current.destroy();   annoRef.current = null; }
      if (osdViewerRef.current) { osdViewerRef.current.destroy(); osdViewerRef.current = null; }
    };
  }, [viewMode, selectedSlide, isPatchFullscreen, resetKey]);

  useEffect(() => { drawGrid(); }, [showGrid, drawGrid, selectedPatch, hoveredTile]);

  // ── Patch sidebar scroll-zoom ─────────────────────────────────────────────
  useEffect(() => {
    const container = patchContainerRef.current;
    if (!container) return;
    const handler = (e) => {
      e.preventDefault();
      const dir = e.deltaY < 0 ? 1 : -1;
      setPatchZoom((p) => Math.min(Math.max(p + dir * 0.2, 1), 5));
    };
    container.addEventListener("wheel", handler, { passive: false });
    return () => container.removeEventListener("wheel", handler);
  }, [patchContainerRef, selectedPatch]);

  useEffect(() => {
    if (selectedPatch) { setPatchZoom(1); setFullPatchZoom([100]); }
  }, [selectedPatch]);

  // ── HANDLERS ─────────────────────────────────────────────────────────────
  const handleZoomIn = () => {
    if (isPatchFullscreen) { setFullPatchZoom([Math.min(fullPatchZoom[0] + 25, 500)]); return; }
    if (osdViewerRef.current) osdViewerRef.current.viewport.zoomTo(osdViewerRef.current.viewport.getZoom() * 1.2);
  };

  const handleZoomOut = () => {
    if (isPatchFullscreen) { setFullPatchZoom([Math.max(fullPatchZoom[0] - 25, 25)]); return; }
    if (osdViewerRef.current) osdViewerRef.current.viewport.zoomTo(osdViewerRef.current.viewport.getZoom() / 1.2);
  };

  const handleSliderZoom = (val) => {
    if (isPatchFullscreen) { setFullPatchZoom(val); return; }
    setZoom(val);
    if (osdViewerRef.current) osdViewerRef.current.viewport.zoomTo(val[0] / 100);
  };

  const handleRotateCw  = () => { const r = rotation + 90; setRotation(r); if (!isPatchFullscreen && osdViewerRef.current) osdViewerRef.current.viewport.setRotation(r); };
  const handleRotateCcw = () => { const r = rotation - 90; setRotation(r); if (!isPatchFullscreen && osdViewerRef.current) osdViewerRef.current.viewport.setRotation(r); };

  const handleReset = () => {
    setResetKey((k) => k + 1);
    setRotation(0);
    if (isPatchFullscreen) { setFullPatchZoom([100]); return; }
    setZoom([100]);
    setSelectedPatch(null);
    setHoveredTile(null);
    if (osdViewerRef.current) { osdViewerRef.current.viewport.goHome(); osdViewerRef.current.viewport.setRotation(0); }
    if (annoRef.current) annoRef.current.clearAnnotations();
    setAnnotations([]);
  };

  const handleModeChange = (mode) => {
    setDrawingMode(mode);
    drawingModeRef.current = mode;
    if (!annoRef.current) return;
    if (mode === "select") { annoRef.current.setDrawingEnabled(false); }
    else if (mode === "rect") { annoRef.current.setDrawingTool("rect"); annoRef.current.setDrawingEnabled(true); }
    else if (mode === "circle") { annoRef.current.setDrawingTool("circle"); annoRef.current.setDrawingEnabled(true); }
  };

  const handlePatchZoomIn  = (e) => { e.stopPropagation(); setPatchZoom((p) => Math.min(p + 0.5, 5)); };
  const handlePatchZoomOut = (e) => { e.stopPropagation(); setPatchZoom((p) => Math.max(p - 0.5, 1)); };
  const handlePatchReset   = (e) => { e.stopPropagation(); setPatchZoom(1); setSidebarKey((k) => k + 1); };
  const togglePatchFullscreen = () => { setIsPatchFullscreen(!isPatchFullscreen); setRotation(0); };

  const gridRows = tileGrid?.rows || 4;
  const gridCols = tileGrid?.cols || 4;

  // ── RENDER ────────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* HEADER */}
      <motion.header
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50 shrink-0"
      >
        <div className="container mx-auto px-4 py-3 flex items-center justify-between gap-4 flex-wrap">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm" onClick={() => navigate("/")} className="hover:bg-primary/90">
              <ArrowLeft className="w-4 h-4 mr-2" /> Back
            </Button>
            <div>
              <h1 className="text-xl font-bold">WSI Slide Viewer</h1>
              {selectedSlide && <p className="text-xs text-muted-foreground">{selectedSlide.name}</p>}
            </div>
          </div>

          <div className="flex items-center gap-3 flex-wrap">
            <SlideSelector
              slides={slides}
              selectedSlide={selectedSlide}
              onSelect={handleSlideSelect}
              loading={slidesLoading}
            />
          </div>

          <div className="flex items-center gap-2">
            {!isPatchFullscreen && selectedSlide?.has_tiles && (
              <Button variant={showGrid ? "default" : "outline"} size="sm" onClick={() => setShowGrid(!showGrid)}>
                <Grid3X3 className="w-4 h-4 mr-2" />
                {showGrid ? "Hide Grid" : "Show Grid"}
              </Button>
            )}
            <Button variant="outline" size="sm">
              <Download className="w-4 h-4 mr-2" /> Export
            </Button>
          </div>
        </div>
      </motion.header>

      {/* MAIN */}
      <div className="flex-1 container mx-auto px-4 py-6 overflow-hidden">
        {/* ERROR BANNER */}
        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="mb-4 flex items-center gap-3 bg-destructive/10 border border-destructive/20 text-destructive rounded-xl px-4 py-3 text-sm"
            >
              <AlertCircle className="w-4 h-4 shrink-0" />
              {error}
              <button className="ml-auto" onClick={() => setError(null)}><X className="w-4 h-4" /></button>
            </motion.div>
          )}
        </AnimatePresence>

        {!selectedSlide && !slidesLoading && (
          <div className="flex flex-col items-center justify-center h-[60vh] gap-4 text-muted-foreground">
            <Layers className="w-16 h-16 opacity-20" />
            <p className="text-lg font-medium">Select a slide to begin</p>
            <p className="text-sm">Use the dropdown in the header to choose a slide from your GCP bucket.</p>
          </div>
        )}

        {selectedSlide && (
          <div className="grid lg:grid-cols-[1fr_300px] gap-6 h-full">
            {/* VIEWER WINDOW */}
            <motion.div
              className="bg-muted/30 rounded-2xl border border-border shadow-card overflow-hidden relative group"
              style={{ height: "calc(100vh - 160px)" }}
            >
              {/* LEFT TOOLBAR */}
              <div className="absolute left-4 top-1/2 -translate-y-1/2 z-20 flex flex-col bg-white/90 backdrop-blur-sm rounded-full shadow-lg border border-border/50">
                <div className="p-2">
                  <Button variant="ghost" size="icon" className="rounded-full h-10 w-10" onClick={() => setIsToolbarExpanded(!isToolbarExpanded)}>
                    {isToolbarExpanded ? <X className="w-5 h-5" /> : <MoreHorizontal className="w-5 h-5" />}
                  </Button>
                </div>
                <motion.div
                  initial={false}
                  animate={{ height: isToolbarExpanded ? "auto" : 0, opacity: isToolbarExpanded ? 1 : 0 }}
                  transition={{ duration: 0.3, ease: "easeInOut" }}
                  className="flex flex-col items-center overflow-hidden"
                >
                  <div className="flex flex-col gap-2 pb-2 px-2">
                    <div className="h-px w-6 bg-border mx-auto my-1" />
                    <Button variant={drawingMode === "select" ? "default" : "ghost"} size="icon" className="rounded-full h-10 w-10" onClick={() => handleModeChange("select")} title="Select / Pan"><MousePointer2 className="w-5 h-5" /></Button>
                    <Button variant={drawingMode === "rect"   ? "default" : "ghost"} size="icon" className="rounded-full h-10 w-10" onClick={() => handleModeChange("rect")}   title="Draw Rectangle"><Square className="w-5 h-5" /></Button>
                    <Button variant={drawingMode === "circle"  ? "default" : "ghost"} size="icon" className="rounded-full h-10 w-10" onClick={() => handleModeChange("circle")}  title="Draw Circle"><CircleIcon className="w-5 h-5" /></Button>
                    <div className="h-px w-6 bg-border mx-auto my-1" />
                    <Button variant="ghost" size="icon" className="rounded-full h-10 w-10 hover:bg-primary/10" onClick={handleReset}><Home className="w-5 h-5 text-primary" /></Button>
                    <Button variant="ghost" size="icon" className="rounded-full h-10 w-10 hover:bg-primary/10" onClick={handleZoomIn}><ZoomIn className="w-5 h-5" /></Button>
                    <Button variant="ghost" size="icon" className="rounded-full h-10 w-10 hover:bg-primary/10" onClick={handleZoomOut}><ZoomOut className="w-5 h-5" /></Button>
                    <div className="h-px w-6 bg-border mx-auto my-1" />
                    <Button variant="ghost" size="icon" className="rounded-full h-10 w-10 hover:bg-primary/10" onClick={handleRotateCcw}><RotateCcw className="w-5 h-5" /></Button>
                    <Button variant="ghost" size="icon" className="rounded-full h-10 w-10 hover:bg-primary/10" onClick={handleRotateCw}><RotateCw  className="w-5 h-5" /></Button>
                    <div className="h-px w-6 bg-border mx-auto my-1" />
                    <Button variant="ghost" size="icon" className="rounded-full h-10 w-10 hover:bg-primary/10"><Camera className="w-5 h-5" /></Button>
                  </div>
                </motion.div>
              </div>

              {/* FULLSCREEN PATCH VIEW */}
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
                    Patch: Row {selectedPatch.row}, Col {selectedPatch.col}
                  </div>
                </div>
              ) : viewMode === "dzi" ? (
                /* DZI VIEW */
                <div className="relative w-full h-full">
                  <div id="osd-viewer" className="w-full h-full" />
                  
                  {/* CANVAS GRID OVERLAY */}
                  <canvas 
                    ref={canvasRef} 
                    className="absolute inset-0 w-full h-full pointer-events-none"
                    style={{ zIndex: 15 }} 
                  />

                  <div className="absolute top-4 left-4 bg-background/90 backdrop-blur-sm px-4 py-2 rounded-lg border border-border z-10 ml-16">
                    <div className="text-xs text-muted-foreground">Mode</div>
                    <div className="text-lg font-bold text-primary capitalize">{drawingMode}</div>
                  </div>
                  {showGrid && tileGrid && (
                    <div className="absolute top-4 right-4 bg-primary text-primary-foreground px-3 py-1.5 rounded-lg text-xs font-medium z-10 shadow">
                      Grid {gridRows} × {gridCols}
                    </div>
                  )}
                </div>
              ) : (
                /* TILE GRID VIEW */
                <div className="relative w-full h-full flex items-center justify-center overflow-hidden bg-black/5">
                  {tilesLoading ? (
                    <div className="flex flex-col items-center gap-3 text-muted-foreground">
                      <Loader2 className="w-8 h-8 animate-spin text-primary" />
                      <span className="text-sm">Loading tile grid…</span>
                    </div>
                  ) : tileGrid ? (
                    <>
                      <div
                        className="absolute inset-0 grid"
                        style={{
                          gridTemplateColumns: `repeat(${gridCols}, 1fr)`,
                          gridTemplateRows: `repeat(${gridRows}, 1fr)`,
                        }}
                      >
                        {tileGrid.tiles.map((tile) => {
                          const isSelected = selectedPatch?.row === tile.row && selectedPatch?.col === tile.col;
                          return (
                            <div
                              key={`tile-${tile.row}-${tile.col}`}
                              data-tile-row={tile.row}
                              data-tile-col={tile.col}
                              className={`
                                relative overflow-hidden border border-white/10 cursor-pointer transition-all hover:brightness-110 hover:z-10
                                ${isSelected ? "ring-2 ring-primary ring-inset" : ""}
                              `}
                              onClick={() => handleGridClick(tile)}
                            >
                              <img
                                src={`${API_BASE}/api/slides/${selectedSlide.name}/tiles/${tile.filename}`}
                                alt={`Tile R${tile.row}C${tile.col}`}
                                className="w-full h-full object-cover"
                                loading="lazy"
                                onError={(e) => { e.currentTarget.style.background = "#334155"; }}
                              />
                              <div className="absolute bottom-1 right-1 bg-black/50 text-white text-[10px] px-1 rounded">
                                {tile.row},{tile.col}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                      {showGrid && (
                        <div
                          className="absolute inset-0 grid pointer-events-none"
                          style={{
                            gridTemplateColumns: `repeat(${gridCols}, 1fr)`,
                            gridTemplateRows: `repeat(${gridRows}, 1fr)`,
                            zIndex: 10
                          }}
                        >
                          {Array.from({ length: gridRows * gridCols }).map((_, i) => (
                            <div key={i} className="border border-primary/30 flex items-center justify-center">
                              <span className="text-[10px] text-white/50 font-mono">
                                {Math.floor(i / gridCols)},{i % gridCols}
                              </span>
                            </div>
                          ))}
                        </div>
                      )}
                    </>
                  ) : (
                    <div className="text-muted-foreground text-sm">No tiles available for this slide.</div>
                  )}
                </div>
              )}
            </motion.div>

            {/* RIGHT SIDEBAR */}
            <motion.div className="space-y-4 overflow-y-auto h-[calc(100vh-160px)] pr-2">
              {/* PATCH PREVIEW */}
              <AnimatePresence>
                {selectedPatch && !isPatchFullscreen && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="bg-primary/5 border border-primary/20 rounded-2xl p-4 shadow-sm"
                  >
                    <div className="flex justify-between items-center mb-2">
                      <h3 className="font-semibold text-primary">Selected Patch</h3>
                      <div className="flex gap-1">
                        <Button variant="ghost" size="icon" className="h-6 w-6 text-primary hover:bg-primary/20" onClick={togglePatchFullscreen}>
                          <Expand className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => setSelectedPatch(null)}>
                          <X className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                    <div ref={patchContainerRef} className="aspect-square bg-black/10 rounded-lg overflow-hidden relative group">
                      {isLoadingPatch ? (
                        <div className="flex items-center justify-center w-full h-full">
                          <Loader2 className="w-6 h-6 animate-spin text-primary" />
                        </div>
                      ) : (
                        <>
                          <motion.img
                            key={sidebarKey}
                            src={selectedPatch.url}
                            alt="High Res Patch"
                            className={`w-full h-full object-cover ${patchZoom > 1 ? "cursor-grab active:cursor-grabbing" : "cursor-default"}`}
                            drag={patchZoom > 1}
                            dragConstraints={{ left: -150*(patchZoom-1), right: 150*(patchZoom-1), top: -150*(patchZoom-1), bottom: 150*(patchZoom-1) }}
                            dragElastic={0.2}
                            animate={{ scale: patchZoom }}
                            transition={{ type: "spring", stiffness: 300, damping: 20 }}
                            onError={(e) => { e.currentTarget.src = "https://placehold.co/400x400?text=No+Data"; }}
                          />
                          <div className="absolute bottom-2 right-2 flex gap-1 bg-black/50 backdrop-blur-md p-1 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity">
                            <Button variant="ghost" size="icon" className="h-6 w-6 text-white hover:bg-white/20" onClick={handlePatchZoomOut}><ZoomOut className="w-3 h-3" /></Button>
                            <Button variant="ghost" size="icon" className="h-6 w-6 text-white hover:bg-white/20" onClick={handlePatchZoomIn}><ZoomIn  className="w-3 h-3" /></Button>
                            <Button variant="ghost" size="icon" className="h-6 w-6 text-white hover:bg-white/20" onClick={handlePatchReset}><RefreshCcw className="w-3 h-3" /></Button>
                          </div>
                        </>
                      )}
                    </div>
                    <div className="mt-2 text-xs text-muted-foreground text-center">
                      Row {selectedPatch.row} · Col {selectedPatch.col}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* SLIDE INFO */}
              {selectedSlide && (
                <div className="bg-card border border-border rounded-2xl p-4 shadow-card">
                  <h3 className="font-semibold mb-3 text-sm">Slide Info</h3>
                  <div className="space-y-1.5 text-xs text-muted-foreground">
                    <div className="flex justify-between"><span>Name</span><span className="text-foreground font-medium truncate ml-2 max-w-[140px]">{selectedSlide.name}</span></div>
                    <div className="flex justify-between"><span>DZI</span><span className={selectedSlide.has_dzi ? "text-emerald-500" : "text-muted-foreground"}>{selectedSlide.has_dzi ? "✓ Available" : "—"}</span></div>
                    <div className="flex justify-between"><span>Tiles</span><span className={selectedSlide.has_tiles ? "text-blue-500" : "text-muted-foreground"}>{selectedSlide.has_tiles ? `✓ ${tileGrid ? `${tileGrid.rows}×${tileGrid.cols}` : "Available"}` : "—"}</span></div>
                    <div className="flex justify-between"><span>View Mode</span><span className="text-foreground font-medium capitalize">{viewMode}</span></div>
                  </div>
                </div>
              )}

              {/* CONTROLS */}
              <div className="bg-card border border-border rounded-2xl p-6 shadow-card">
                <h3 className="font-semibold mb-4">{isPatchFullscreen ? "Patch Controls" : "Slide Controls"}</h3>
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <Button variant="outline" size="icon" onClick={handleZoomOut}><ZoomOut className="w-4 h-4" /></Button>
                    <Slider
                      value={isPatchFullscreen ? fullPatchZoom : zoom}
                      onValueChange={handleSliderZoom}
                      min={25} max={isPatchFullscreen ? 500 : 400} step={25}
                      className="flex-1"
                    />
                    <Button variant="outline" size="icon" onClick={handleZoomIn}><ZoomIn className="w-4 h-4" /></Button>
                  </div>
                  <div className="text-center text-sm text-muted-foreground">
                    Zoom: {isPatchFullscreen ? fullPatchZoom[0] : zoom[0]}%
                  </div>
                </div>
              </div>

              <div className="bg-card border border-border rounded-2xl p-6 shadow-card">
                <h3 className="font-semibold mb-4">View Controls</h3>
                <div className="space-y-2">
                  <Button variant="outline" className="w-full justify-start" onClick={handleRotateCw}><RotateCw className="w-4 h-4 mr-2" /> Rotate 90°</Button>
                  <Button variant="outline" className="w-full justify-start" onClick={handleReset}><Home className="w-4 h-4 mr-2" /> Reset View</Button>
                </div>
              </div>

            </motion.div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Viewer;