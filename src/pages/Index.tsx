import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Pencil, Eraser, Square, Circle, Undo, Redo, Download } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

type PixelGrid = string[][];
type HistoryEntry = { grid: PixelGrid; };

const Index = () => {
  const { toast } = useToast();
  const [activeColor, setActiveColor] = useState("#000000");
  const [activeTool, setActiveTool] = useState<"pencil" | "eraser" | "square" | "circle">("pencil");
  const [canvasSize, setCanvasSize] = useState({ width: 32, height: 32 });
  const [pixelSize, setPixelSize] = useState(20);
  const [isDrawing, setIsDrawing] = useState(false);
  const [startPixel, setStartPixel] = useState<{ x: number; y: number } | null>(null);
  
  // История действий для undo/redo
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [currentStep, setCurrentStep] = useState(-1);
  
  // Инициализация пустой сетки
  const [pixelGrid, setPixelGrid] = useState<PixelGrid>(() => 
    Array(canvasSize.height).fill(null).map(() => 
      Array(canvasSize.width).fill("")
    )
  );

  const tools = [
    { name: "pencil", icon: Pencil },
    { name: "eraser", icon: Eraser },
    { name: "square", icon: Square },
    { name: "circle", icon: Circle },
  ];

  // Сохранение текущего состояния в историю
  const saveToHistory = useCallback((newGrid: PixelGrid) => {
    const newHistory = history.slice(0, currentStep + 1);
    newHistory.push({ grid: JSON.parse(JSON.stringify(newGrid)) });
    setHistory(newHistory);
    setCurrentStep(newHistory.length - 1);
  }, [history, currentStep]);

  // Функции для рисования
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

  // Обработчики событий мыши
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

  // Функции undo/redo
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

  // Функция сохранения
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
      link.download = 'pixel-art.png';
      link.href = canvas.toDataURL();
      link.click();
      
      toast({
        title: "Успешно сохранено",
        description: "Ваш рисунок был сохранен как PNG файл",
      });
    }
  };

  // Инициализация истории при первой загрузке
  useEffect(() => {
    saveToHistory(pixelGrid);
  }, []);

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
              <Button variant="outline" size="icon" onClick={undo}>
                <Undo className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="icon" onClick={redo}>
                <Redo className="h-4 w-4" />
              </Button>
            </div>

            <Button variant="outline" size="icon" onClick={saveImage}>
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
              {pixelGrid.map((row, y) =>
                row.map((color, x) => (
                  <div
                    key={`${x}-${y}`}
                    className="border border-gray-100 cursor-pointer"
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