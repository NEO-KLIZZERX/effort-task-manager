import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Pencil, Eraser, Square, Circle, Undo, Redo, Download } from "lucide-react";

const Index = () => {
  const [activeColor, setActiveColor] = useState("#000000");
  const [activeTool, setActiveTool] = useState<"pencil" | "eraser" | "square" | "circle">("pencil");
  const [canvasSize, setCanvasSize] = useState({ width: 32, height: 32 });
  const [pixelSize, setPixelSize] = useState(20);

  const tools = [
    { name: "pencil", icon: Pencil },
    { name: "eraser", icon: Eraser },
    { name: "square", icon: Square },
    { name: "circle", icon: Circle },
  ];

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <div className="max-w-6xl mx-auto space-y-4">
        <header className="text-center">
          <h1 className="text-4xl font-bold text-gray-800">Pixel Art Studio</h1>
          <p className="text-gray-600">Create beautiful pixel art</p>
        </header>

        <div className="bg-white rounded-lg shadow-lg p-4">
          {/* Toolbar */}
          <div className="flex gap-4 mb-4">
            <div className="flex gap-2">
              {tools.map((tool) => (
                <Button
                  key={tool.name}
                  variant={activeTool === tool.name ? "default" : "outline"}
                  size="icon"
                  onClick={() => setActiveTool(tool.name as typeof activeTool)}
                >
                  <tool.icon className="h-4 w-4" />
                </Button>
              ))}
            </div>

            <Input
              type="color"
              value={activeColor}
              onChange={(e) => setActiveColor(e.target.value)}
              className="w-12 h-10 p-1"
            />

            <div className="flex gap-2">
              <Button variant="outline" size="icon">
                <Undo className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="icon">
                <Redo className="h-4 w-4" />
              </Button>
            </div>

            <Button variant="outline" size="icon">
              <Download className="h-4 w-4" />
            </Button>
          </div>

          {/* Canvas Container */}
          <div className="relative border border-gray-200 rounded-lg overflow-hidden">
            <div
              className="grid bg-white"
              style={{
                width: canvasSize.width * pixelSize,
                height: canvasSize.height * pixelSize,
                gridTemplateColumns: `repeat(${canvasSize.width}, ${pixelSize}px)`,
              }}
            >
              {Array.from({ length: canvasSize.width * canvasSize.height }).map((_, i) => (
                <div
                  key={i}
                  className="border border-gray-100 cursor-pointer hover:bg-gray-50"
                  style={{ width: pixelSize, height: pixelSize }}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;