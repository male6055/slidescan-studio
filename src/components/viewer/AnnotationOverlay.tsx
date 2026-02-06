import { motion } from "framer-motion";
import { X } from "lucide-react";
import type { Annotation, AnnotationType } from "./AnnotationTools";

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

interface AnnotationOverlayProps {
  annotations: Annotation[];
  measurements: Measurement[];
  showAnnotations: boolean;
  zoom: number;
  onDeleteAnnotation?: (id: string) => void;
  micronsPerPixel?: number;
  measurementColors?: string[];
}

const AnnotationOverlay = ({
  annotations,
  measurements,
  showAnnotations,
  zoom,
  onDeleteAnnotation,
  micronsPerPixel = 0.25,
  measurementColors = [],
}: AnnotationOverlayProps) => {
  if (!showAnnotations) return null;

  const formatDistance = (pixels: number): string => {
    const microns = pixels * micronsPerPixel;
    if (microns >= 1000) {
      return `${(microns / 1000).toFixed(2)} mm`;
    }
    return `${microns.toFixed(1)} µm`;
  };

  const getMeasurementColor = (index: number): string => {
    return `hsl(${(index * 60) % 360}, 70%, 50%)`;
  };

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      {/* Render annotations */}
      {annotations.map((annotation) => (
        <motion.div
          key={annotation.id}
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="absolute pointer-events-auto"
          style={{
            left: annotation.x,
            top: annotation.y,
            transform: "translate(-50%, -50%)",
          }}
        >
          {annotation.type === "point" && (
            <div
              className="relative group cursor-pointer"
              style={{ color: annotation.color }}
            >
              <div
                className="w-4 h-4 rounded-full border-2 border-current bg-current/30"
                style={{ boxShadow: `0 0 8px ${annotation.color}` }}
              />
              <div className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-background/80 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <X
                  className="w-2 h-2 text-foreground cursor-pointer"
                  onClick={() => onDeleteAnnotation?.(annotation.id)}
                />
              </div>
            </div>
          )}

          {annotation.type === "circle" && annotation.radius && (
            <div
              className="relative group cursor-pointer"
              style={{
                width: annotation.radius * 2,
                height: annotation.radius * 2,
                border: `2px solid ${annotation.color}`,
                borderRadius: "50%",
                backgroundColor: `${annotation.color}20`,
              }}
            >
              <div className="absolute -top-2 -right-2 w-4 h-4 rounded-full bg-background/80 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <X
                  className="w-3 h-3 text-foreground cursor-pointer"
                  onClick={() => onDeleteAnnotation?.(annotation.id)}
                />
              </div>
            </div>
          )}

          {annotation.type === "rectangle" && annotation.width && annotation.height && (
            <div
              className="relative group cursor-pointer"
              style={{
                width: annotation.width,
                height: annotation.height,
                border: `2px solid ${annotation.color}`,
                backgroundColor: `${annotation.color}20`,
                transform: "translate(0, 0)", // Override parent transform
              }}
            >
              <div className="absolute -top-2 -right-2 w-4 h-4 rounded-full bg-background/80 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <X
                  className="w-3 h-3 text-foreground cursor-pointer"
                  onClick={() => onDeleteAnnotation?.(annotation.id)}
                />
              </div>
            </div>
          )}

          {annotation.type === "text" && (
            <div
              className="relative group cursor-pointer bg-background/90 backdrop-blur-sm px-2 py-1 rounded border text-sm"
              style={{ borderColor: annotation.color, color: annotation.color }}
            >
              {annotation.text || "Text"}
              <div className="absolute -top-2 -right-2 w-4 h-4 rounded-full bg-background/80 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <X
                  className="w-3 h-3 text-foreground cursor-pointer"
                  onClick={() => onDeleteAnnotation?.(annotation.id)}
                />
              </div>
            </div>
          )}
        </motion.div>
      ))}

      {/* Render measurements as lines */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none">
        {measurements.map((measurement, index) => {
          const color = getMeasurementColor(index);
          const midX = (measurement.start.x + measurement.end.x) / 2;
          const midY = (measurement.start.y + measurement.end.y) / 2;

          return (
            <g key={measurement.id}>
              {/* Line */}
              <line
                x1={measurement.start.x}
                y1={measurement.start.y}
                x2={measurement.end.x}
                y2={measurement.end.y}
                stroke={color}
                strokeWidth="2"
                strokeDasharray="4 2"
              />
              
              {/* Start point */}
              <circle
                cx={measurement.start.x}
                cy={measurement.start.y}
                r="5"
                fill={color}
                stroke="white"
                strokeWidth="1"
              />
              
              {/* End point */}
              <circle
                cx={measurement.end.x}
                cy={measurement.end.y}
                r="5"
                fill={color}
                stroke="white"
                strokeWidth="1"
              />
              
              {/* Distance label */}
              <g transform={`translate(${midX}, ${midY})`}>
                <rect
                  x="-30"
                  y="-10"
                  width="60"
                  height="20"
                  rx="4"
                  fill="hsl(var(--background))"
                  fillOpacity="0.9"
                  stroke={color}
                  strokeWidth="1"
                />
                <text
                  x="0"
                  y="5"
                  textAnchor="middle"
                  fill={color}
                  fontSize="11"
                  fontWeight="500"
                >
                  {formatDistance(measurement.distance)}
                </text>
              </g>
            </g>
          );
        })}
      </svg>
    </div>
  );
};

export default AnnotationOverlay;
