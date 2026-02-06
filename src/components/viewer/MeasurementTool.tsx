import { useState, useCallback } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Ruler, Trash2, Plus } from "lucide-react";

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

interface MeasurementToolProps {
  isActive: boolean;
  onToggle: () => void;
  measurements: Measurement[];
  onAddMeasurement: (measurement: Measurement) => void;
  onClearMeasurements: () => void;
  micronsPerPixel?: number; // Default: 0.25 µm/pixel for 40x
}

const MeasurementTool = ({
  isActive,
  onToggle,
  measurements,
  onAddMeasurement,
  onClearMeasurements,
  micronsPerPixel = 0.25,
}: MeasurementToolProps) => {
  const formatDistance = (pixels: number): string => {
    const microns = pixels * micronsPerPixel;
    if (microns >= 1000) {
      return `${(microns / 1000).toFixed(2)} mm`;
    }
    return `${microns.toFixed(1)} µm`;
  };

  return (
    <div className="bg-card border border-border rounded-2xl p-4 shadow-card">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Ruler className="w-4 h-4 text-primary" />
          <h3 className="font-semibold text-sm">Measurement</h3>
        </div>
        <Button
          variant={isActive ? "default" : "outline"}
          size="sm"
          onClick={onToggle}
          className={isActive ? "bg-primary" : ""}
        >
          <Plus className="w-3 h-3 mr-1" />
          {isActive ? "Active" : "Measure"}
        </Button>
      </div>

      {isActive && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          className="mb-3 p-2 bg-primary/10 border border-primary/20 rounded-lg"
        >
          <p className="text-xs text-primary">
            Click two points on the slide to measure distance
          </p>
        </motion.div>
      )}

      <div className="space-y-2 max-h-40 overflow-y-auto">
        {measurements.length === 0 ? (
          <p className="text-xs text-muted-foreground text-center py-2">
            No measurements yet
          </p>
        ) : (
          measurements.map((m, index) => (
            <motion.div
              key={m.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center justify-between bg-muted/50 rounded-lg px-3 py-2"
            >
              <div className="flex items-center gap-2">
                <div 
                  className="w-3 h-3 rounded-full"
                  style={{ 
                    backgroundColor: `hsl(${(index * 60) % 360}, 70%, 50%)` 
                  }}
                />
                <span className="text-sm font-medium">
                  {formatDistance(m.distance)}
                </span>
              </div>
              <span className="text-xs text-muted-foreground">
                #{index + 1}
              </span>
            </motion.div>
          ))
        )}
      </div>

      {measurements.length > 0 && (
        <Button
          variant="ghost"
          size="sm"
          onClick={onClearMeasurements}
          className="w-full mt-3 text-destructive hover:text-destructive hover:bg-destructive/10"
        >
          <Trash2 className="w-3 h-3 mr-1" />
          Clear All
        </Button>
      )}

      <div className="mt-3 pt-3 border-t border-border">
        <div className="text-xs text-muted-foreground">
          <div className="flex justify-between">
            <span>Scale:</span>
            <span className="font-medium">{micronsPerPixel} µm/px</span>
          </div>
          <div className="flex justify-between mt-1">
            <span>Magnification:</span>
            <span className="font-medium">40x</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MeasurementTool;
