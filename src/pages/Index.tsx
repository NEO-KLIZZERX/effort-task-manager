import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Pencil, Eraser, Square, Circle, Undo, Redo, Download, Palette } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

type PixelGrid = string[][];
type HistoryEntry = { grid: PixelGrid; };

const Index = () => {
  const { toast } = useToast();
  const [activeColor, setActiveColor] = useState("#9b87f5");
  const [activeTool, setActiveTool] = useState<"pencil" | "eraser" | "square" | "circle">("pencil");
  const [canvasSize, setCanvasSize] = useState({ width: 32, height: 32 });
  const [pixelSize, setPixelSize] = useState(20);
  const [isDrawing, setIsDrawing] = useState(false);
  const [startPixel, setStartPixel] = useState<{ x: number; y: number } | null>(null);
  
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [currentStep, setCurrentStep] = useState(-1);
  
  const [pixelGrid, setPixelGrid] = useState<PixelGrid>(() => 
    Array(canvasSize.height).fill(null).map(() => 
      Array(canvasSize.width).fill("")
    )
  );

  const tools = [
    { name: "pencil", icon: Pencil, tooltip: "Карандаш" },
    { name: "eraser", icon: Eraser, tooltip: "Ластик" },
    { name: "square", icon: Square, tooltip: "Квадрат" },
    { name: "circle", icon: Circle, tooltip: "Круг" },
  ];

  const drawPixel = (x: number, y: number, color: string) => {
    const newGrid = [...pixelGrid];
    if (x >= 0 && x < canvasSize.width && y >= 0 && y < canvasSize.height) {
      newGrid[y][x] = color;
      setPixelGrid(newGrid);
    }
  };

  const drawLine = (x0: number, y0: number, x1: number, y1: number, color: string) => {
    const dx = Math.abs(x1 - x0);
    const dy = Math.abs(y1 - y0);
    const sx = x0 < x1 ? 1 : -1;
    const sy = y0 < y1 ? 1 : -1;
    let err = dx - dy;

    while (true) {
      drawPixel(x0, y0, color);
      if (x0 === x1 && y0 === y1) break;
      const e2 = 2 * err;
      if (e2 > -dy) {
        err -= dy;
        x0 += sx;
      }
      if (e2 < dx) {
        err += dx;
        y0 += sy;
      }
    }
  };

  const drawSquare = (startX: number, startY: number, endX: number, endY: number, color: string) => {
    const newGrid = [...pixelGrid];
    const minX = Math.min(startX, endX);
    const maxX = Math.max(startX, endX);
    const minY = Math.min(startY, endY);
    const maxY = Math.max(startY, endY);

    for (let y = minY; y <= maxY; y++) {
      for (let x = minX; x <= maxX; x++) {
        if (x >= 0 && x < canvasSize.width && y >= 0 && y < canvasSize.height) {
          newGrid[y][x] = color;
        }
      }
    }
    setPixelGrid(newGrid);
  };

  const drawCircle = (startX: number, startY: number, endX: number, endY: number, color: string) => {
    const newGrid = [...pixelGrid];
    const centerX = startX;
    const centerY = startY;
    const radius = Math.sqrt(Math.pow(endX - startX, 2) + Math.pow(endY - startY, 2));

    for (let y = 0; y < canvasSize.height; y++) {
      for (let x = 0; x < canvasSize.width; x++) {
        const distance = Math.sqrt(Math.pow(x - centerX, 2) + Math.pow(y - centerY, 2));
        if (distance <= radius) {
          newGrid[y][x] = color;
        }
      }
    }
    setPixelGrid(newGrid);
  };

  const handleMouseDown = (x: number, y: number) => {
    setIsDrawing(true);
    setStartPixel({ x, y });
    
    if (activeTool === "pencil" || activeTool === "eraser") {
      const color = activeTool === "eraser" ? "" : activeColor;
      drawPixel(x, y, color);
    }
  };

  const handleMouseMove = (x: number, y: number) => {
    if (!isDrawing || !startPixel) return;

    if (activeTool === "pencil" || activeTool === "eraser") {
      const color = activeTool === "eraser" ? "" : activeColor;
      drawLine(startPixel.x, startPixel.y, x, y, color);
      setStartPixel({ x, y });
    }
  };

  const handleMouseUp = (x: number, y: number) => {
    if (!startPixel) return;

    if (activeTool === "square") {
      drawSquare(startPixel.x, startPixel.y, x, y, activeColor);
    } else if (activeTool === "circle") {
      drawCircle(startPixel.x, startPixel.y, x, y, activeColor);
    }

    setIsDrawing(false);
    setStartPixel(null);
    saveToHistory(pixelGrid);
  };

  const saveToHistory = useCallback((newGrid: PixelGrid) => {
    const newHistory = history.slice(0, currentStep + 1);
    newHistory.push({ grid: JSON.parse(JSON.stringify(newGrid)) });
    setHistory(newHistory);
    setCurrentStep(newHistory.length - 1);
  }, [history, currentStep]);

  const undo = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
      setPixelGrid(JSON.parse(JSON.stringify(history[currentStep - 1].grid)));
    }
  };

  const redo = () => {
    if (currentStep < history.length - 1) {
      setCurrentStep(currentStep + 1);
      setPixelGrid(JSON.parse(JSON.stringify(history[currentStep + 1].grid)));
    }
  };

  const saveImage = () => {
    const canvas = document.createElement('canvas');
    canvas.width = canvasSize.width;
    canvas.height = canvasSize.height;
    const ctx = canvas.getContext('2d');
    
    if (ctx) {
      pixelGrid.forEach((row, y) => {
        row.forEach((color, x) => {
          if (color) {
            ctx.fillStyle = color;
            ctx.fillRect(x, y, 1, 1);
          }
        });
      });

      const link = document.createElement('a');
      link.download = 'ef-pixelart.png';
      link.href = canvas.toDataURL();
      link.click();
      
      toast({
        title: "Успешно сохранено",
        description: "Ваш рисунок был сохранен как PNG файл",
      });
    }
  };

  useEffect(() => {
    saveToHistory(pixelGrid);
  }, []);

  return (
    <div className="min-h-screen bg-[#221F26] p-4">
      <div className="max-w-6xl mx-auto space-y-6">
        <header className="text-center space-y-2">
          <h1 className="text-5xl font-bold bg-gradient-to-r from-[#9b87f5] to-[#D946EF] text-transparent bg-clip-text">
            EF PixelArts
          </h1>
          <p className="text-[#C8C8C9]">Create amazing pixel art masterpieces</p>
        </header>

        <div className="bg-[#2A2630] rounded-xl shadow-xl p-6 space-y-6">
          <div className="flex flex-wrap gap-4 items-center justify-between bg-[#332F3B] p-4 rounded-lg">
            <div className="flex gap-2">
              {tools.map((tool) => (
                <Button
                  key={tool.name}
                  variant={activeTool === tool.name ? "default" : "outline"}
                  size="icon"
                  onClick={() => setActiveTool(tool.name as typeof activeTool)}
                  className={`hover:bg-[#9b87f5]/20 ${
                    activeTool === tool.name ? "bg-[#9b87f5] text-white" : "bg-transparent text-[#C8C8C9]"
                  }`}
                  title={tool.tooltip}
                >
                  <tool.icon className="h-4 w-4" />
                </Button>
              ))}
            </div>

            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <Palette className="h-4 w-4 text-[#C8C8C9]" />
                <Input
                  type="color"
                  value={activeColor}
                  onChange={(e) => setActiveColor(e.target.value)}
                  className="w-12 h-10 p-1 bg-transparent border-[#9b87f5] cursor-pointer"
                />
              </div>

              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={undo}
                  className="hover:bg-[#9b87f5]/20 bg-transparent text-[#C8C8C9]"
                  title="Отменить"
                >
                  <Undo className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={redo}
                  className="hover:bg-[#9b87f5]/20 bg-transparent text-[#C8C8C9]"
                  title="Повторить"
                >
                  <Redo className="h-4 w-4" />
                </Button>
              </div>

              <Button
                variant="outline"
                size="icon"
                onClick={saveImage}
                className="hover:bg-[#9b87f5]/20 bg-transparent text-[#C8C8C9]"
                title="Сохранить"
              >
                <Download className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <div className="relative border border-[#332F3B] rounded-lg overflow-hidden bg-[#1A171E] p-4">
            <div
              className="grid mx-auto"
              style={{
                width: canvasSize.width * pixelSize,
                height: canvasSize.height * pixelSize,
                gridTemplateColumns: `repeat(${canvasSize.width}, ${pixelSize}px)`,
              }}
            >
              {pixelGrid.map((row, y) =>
                row.map((color, x) => (
                  <div
                    key={`${x}-${y}`}
                    className="border border-[#332F3B]/30 cursor-crosshair transition-colors duration-150"
                    style={{
                      width: pixelSize,
                      height: pixelSize,
                      backgroundColor: color || 'transparent'
                    }}
                    onMouseDown={() => handleMouseDown(x, y)}
                    onMouseMove={() => handleMouseMove(x, y)}
                    onMouseUp={() => handleMouseUp(x, y)}
                  />
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
