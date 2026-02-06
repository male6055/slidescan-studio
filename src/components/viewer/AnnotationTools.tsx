import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { 
  Pencil, 
  Circle, 
  Square, 
  Type, 
  Trash2, 
  Eye, 
  EyeOff,
  MapPin 
} from "lucide-react";

export type AnnotationType = "point" | "circle" | "rectangle" | "text";

export interface Annotation {
  id: string;
  type: AnnotationType;
  x: number;
  y: number;
  width?: number;
  height?: number;
  radius?: number;
  text?: string;
  color: string;
}

interface AnnotationToolsProps {
  activeToolType: AnnotationType | null;
  onSelectTool: (tool: AnnotationType | null) => void;
  annotations: Annotation[];
  onClearAnnotations: () => void;
  showAnnotations: boolean;
  onToggleVisibility: () => void;
}

const ANNOTATION_COLORS = [
  "#ef4444", // red
  "#22c55e", // green
  "#3b82f6", // blue
  "#f59e0b", // amber
  "#8b5cf6", // violet
  "#ec4899", // pink
];

const AnnotationTools = ({
  activeToolType,
  onSelectTool,
  annotations,
  onClearAnnotations,
  showAnnotations,
  onToggleVisibility,
}: AnnotationToolsProps) => {
  const [selectedColor, setSelectedColor] = useState(ANNOTATION_COLORS[0]);

  const tools: { type: AnnotationType; icon: typeof Pencil; label: string }[] = [
    { type: "point", icon: MapPin, label: "Point" },
    { type: "circle", icon: Circle, label: "Circle" },
    { type: "rectangle", icon: Square, label: "Rectangle" },
    { type: "text", icon: Type, label: "Text" },
  ];

  return (
    <div className="bg-card border border-border rounded-2xl p-4 shadow-card">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Pencil className="w-4 h-4 text-primary" />
          <h3 className="font-semibold text-sm">Annotations</h3>
        </div>
        <Button
          variant="ghost"
          size="icon"
          className="h-7 w-7"
          onClick={onToggleVisibility}
          title={showAnnotations ? "Hide annotations" : "Show annotations"}
        >
          {showAnnotations ? (
            <Eye className="w-4 h-4" />
          ) : (
            <EyeOff className="w-4 h-4" />
          )}
        </Button>
      </div>

      {/* Tool buttons */}
      <div className="grid grid-cols-4 gap-2 mb-3">
        {tools.map((tool) => (
          <Button
            key={tool.type}
            variant={activeToolType === tool.type ? "default" : "outline"}
            size="sm"
            className={`flex flex-col items-center gap-1 h-auto py-2 ${
              activeToolType === tool.type ? "bg-primary" : ""
            }`}
            onClick={() => onSelectTool(activeToolType === tool.type ? null : tool.type)}
          >
            <tool.icon className="w-4 h-4" />
            <span className="text-[10px]">{tool.label}</span>
          </Button>
        ))}
      </div>

      {/* Color picker */}
      <div className="mb-3">
        <p className="text-xs text-muted-foreground mb-2">Color</p>
        <div className="flex gap-2">
          {ANNOTATION_COLORS.map((color) => (
            <button
              key={color}
              onClick={() => setSelectedColor(color)}
              className={`w-6 h-6 rounded-full transition-all ${
                selectedColor === color 
                  ? "ring-2 ring-offset-2 ring-primary scale-110" 
                  : "hover:scale-105"
              }`}
              style={{ backgroundColor: color }}
            />
          ))}
        </div>
      </div>

      {/* Active tool indicator */}
      {activeToolType && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          className="mb-3 p-2 bg-primary/10 border border-primary/20 rounded-lg"
        >
          <p className="text-xs text-primary">
            {activeToolType === "point" && "Click on the slide to add a marker"}
            {activeToolType === "circle" && "Click and drag to draw a circle"}
            {activeToolType === "rectangle" && "Click and drag to draw a rectangle"}
            {activeToolType === "text" && "Click to add a text annotation"}
          </p>
        </motion.div>
      )}

      {/* Annotation count */}
      <div className="flex items-center justify-between text-sm">
        <span className="text-muted-foreground">
          {annotations.length} annotation{annotations.length !== 1 ? "s" : ""}
        </span>
        {annotations.length > 0 && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onClearAnnotations}
            className="text-destructive hover:text-destructive hover:bg-destructive/10 h-7 px-2"
          >
            <Trash2 className="w-3 h-3 mr-1" />
            Clear
          </Button>
        )}
      </div>
    </div>
  );
};

export { ANNOTATION_COLORS };
export default AnnotationTools;
