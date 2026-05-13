// File: src/app/tools/photo-editor/page.tsx
"use client";

import React, { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft,
  Upload,
  Download,
  RotateCw,
  FlipHorizontal,
  FlipVertical,
  Image as ImageIcon,
  RotateCcw,
  Plus,
  Trash2,
  Zap,
} from "lucide-react";
import Link from "next/link";

// ==========================================
// TYPES
// ==========================================

type ActiveTab =
  | "presets"
  | "basic"
  | "effects"
  | "transform"
  | "frame"
  | "text"
  | "export";

type Filters = {
  brightness: number;
  contrast: number;
  saturation: number;
  grayscale: number;
  sepia: number;
  blur: number;
  hueRotate: number;
  opacity: number;
  temperature: number;
  exposure: number;
};

type Effects = {
  vignette: number;
  pixelate: number;
  grain: number;
  glitch: number;
  flareOpacity: number;
  sharpness: number;
  lightLeft: string;
  lightRight: string;
  lightOpacity: number;
};

type Transform = {
  rotate: number;
  flipX: number;
  flipY: number;
  scale: number;
  panX: number;
  panY: number;
};

type Frame = {
  padding: number;
  borderWidth: number;
  borderRadius: number;
  borderColor: string;
  shadowBlur: number;
  glowIntensity: number;
};

type CropBox = {
  x: number;
  y: number;
  width: number;
  height: number;
};

export type TextLayerData = {
  id: string;
  text: string;
  x: number;
  y: number;
  fontSize: number;
  color: string;
  fontFamily: string;
  fontWeight: string;
  opacity: number;
  rotation: number;
  strokeColor: string;
  strokeWidth: number;
  backgroundColor: string;
};

// ==========================================
// DEFAULTS
// ==========================================

const DEFAULT_FILTERS: Filters = {
  brightness: 100,
  contrast: 100,
  saturation: 100,
  grayscale: 0,
  sepia: 0,
  blur: 0,
  hueRotate: 0,
  opacity: 100,
  temperature: 0,
  exposure: 0,
};

const DEFAULT_EFFECTS: Effects = {
  vignette: 0,
  pixelate: 0,
  grain: 0,
  glitch: 0,
  flareOpacity: 0,
  sharpness: 0,
  lightLeft: "#ffffff",
  lightRight: "#ffffff",
  lightOpacity: 0,
};

const DEFAULT_TRANSFORM: Transform = {
  rotate: 0,
  flipX: 1,
  flipY: 1,
  scale: 1,
  panX: 0,
  panY: 0,
};

const DEFAULT_FRAME: Frame = {
  padding: 0,
  borderWidth: 0,
  borderRadius: 0,
  borderColor: "#ffffff",
  shadowBlur: 0,
  glowIntensity: 0,
};

const DEFAULT_CROP: CropBox = {
  x: 0,
  y: 0,
  width: 100,
  height: 100,
};

// ==========================================
// MAIN
// ==========================================

export default function SeloiceUltimateEditor() {
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [fileName, setFileName] = useState("edited-image");

  const [activeTab, setActiveTab] =
    useState<ActiveTab>("basic");

  const [filters, setFilters] =
    useState<Filters>(DEFAULT_FILTERS);

  const [effects, setEffects] =
    useState<Effects>(DEFAULT_EFFECTS);

  const [transform, setTransform] =
    useState<Transform>(DEFAULT_TRANSFORM);

  const [frame, setFrame] =
    useState<Frame>(DEFAULT_FRAME);

  const [cropBox, setCropBox] =
    useState<CropBox>(DEFAULT_CROP);

  const [textLayers, setTextLayers] = useState<TextLayerData[]>([]);
  const [selectedLayerId, setSelectedLayerId] =
    useState<string | null>(null);

  const [exportFormat, setExportFormat] = useState<
    "image/png" | "image/jpeg"
  >("image/jpeg");

  const [exportScale, setExportScale] = useState(2);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // ==========================================
  // CLEANUP
  // ==========================================

  useEffect(() => {
    return () => {
      if (imageSrc) {
        URL.revokeObjectURL(imageSrc);
      }
    };
  }, [imageSrc]);

  // ==========================================
  // HELPERS
  // ==========================================

  const updateObjectState = <T,>(
    setter: React.Dispatch<React.SetStateAction<T>>,
    key: keyof T,
    value: T[keyof T]
  ) => {
    setter((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  // ==========================================
  // FILE UPLOAD
  // ==========================================

  const handleFileUpload = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];

    if (!file) return;

    if (!file.type.startsWith("image/")) {
      alert("Please upload image file");
      return;
    }

    const objectUrl = URL.createObjectURL(file);

    setFileName(file.name.replace(/\.[^/.]+$/, ""));
    setImageSrc(objectUrl);

    handleReset();
  };

  // ==========================================
  // RESET
  // ==========================================

  const handleReset = () => {
    setFilters(DEFAULT_FILTERS);
    setEffects(DEFAULT_EFFECTS);
    setTransform(DEFAULT_TRANSFORM);
    setFrame(DEFAULT_FRAME);
    setCropBox(DEFAULT_CROP);
    setTextLayers([]);
    setSelectedLayerId(null);
  };

  // ==========================================
  // FILTER CSS
  // ==========================================

  const getFilterCSS = () => {
    return `
      brightness(${filters.brightness + filters.exposure}%)
      contrast(${filters.contrast}%)
      saturate(${filters.saturation}%)
      grayscale(${filters.grayscale}%)
      sepia(${filters.sepia}%)
      blur(${filters.blur}px)
      hue-rotate(${filters.hueRotate}deg)
      opacity(${filters.opacity}%)
    `;
  };

  // ==========================================
  // TRANSFORM CSS
  // ==========================================

  const getTransformCSS = () => {
    return `
      translate(${transform.panX}px, ${transform.panY}px)
      rotate(${transform.rotate}deg)
      scale(${transform.scale})
      scaleX(${transform.flipX})
      scaleY(${transform.flipY})
    `;
  };

  // ==========================================
  // PRESETS
  // ==========================================

  const applyPreset = (preset: string) => {
    handleReset();

    if (preset === "cyberpunk") {
      setFilters((p) => ({
        ...p,
        contrast: 130,
        saturation: 160,
        hueRotate: 15,
      }));
    }

    if (preset === "vintage") {
      setFilters((p) => ({
        ...p,
        sepia: 60,
        contrast: 90,
        brightness: 110,
      }));
    }

    if (preset === "bw") {
      setFilters((p) => ({
        ...p,
        grayscale: 100,
      }));
    }
  };

  // ==========================================
  // TEXT LAYER
  // ==========================================

  const addTextLayer = () => {
    const layer: TextLayerData = {
      id: Date.now().toString(),
      text: "New Text",
      x: 50,
      y: 50,
      fontSize: 40,
      color: "#ffffff",
      fontFamily: "Arial",
      fontWeight: "700",
      opacity: 100,
      rotation: 0,
      strokeColor: "#000000",
      strokeWidth: 0,
      backgroundColor: "transparent",
    };

    setTextLayers((prev) => [...prev, layer]);
    setSelectedLayerId(layer.id);
  };

  const updateSelectedLayer = (
    updates: Partial<TextLayerData>
  ) => {
    if (!selectedLayerId) return;

    setTextLayers((prev) =>
      prev.map((layer) =>
        layer.id === selectedLayerId
          ? { ...layer, ...updates }
          : layer
      )
    );
  };

  // ==========================================
  // DOWNLOAD
  // ==========================================

  const handleDownload = () => {
    if (
      !imageSrc ||
      !imageRef.current ||
      !canvasRef.current
    ) {
      return;
    }

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    if (!ctx) return;

    const img = new Image();

    img.crossOrigin = "anonymous";
    img.src = imageSrc;

    img.onload = () => {
      canvas.width = img.naturalWidth * exportScale;
      canvas.height = img.naturalHeight * exportScale;

      ctx.filter = getFilterCSS();

      ctx.drawImage(
        img,
        0,
        0,
        canvas.width,
        canvas.height
      );

      ctx.filter = "none";

      textLayers.forEach((layer) => {
        ctx.save();

        const x = (canvas.width * layer.x) / 100;
        const y = (canvas.height * layer.y) / 100;

        ctx.translate(x, y);

        ctx.rotate((layer.rotation * Math.PI) / 180);

        ctx.globalAlpha = layer.opacity / 100;

        ctx.font = `${layer.fontWeight} ${
          layer.fontSize * exportScale
        }px ${layer.fontFamily}`;

        ctx.textAlign = "center";
        ctx.textBaseline = "middle";

        if (layer.strokeWidth > 0) {
          ctx.strokeStyle = layer.strokeColor;
          ctx.lineWidth =
            layer.strokeWidth * exportScale;
          ctx.strokeText(layer.text, 0, 0);
        }

        ctx.fillStyle = layer.color;
        ctx.fillText(layer.text, 0, 0);

        ctx.restore();
      });

      const dataUrl = canvas.toDataURL(
        exportFormat,
        exportFormat === "image/jpeg" ? 0.92 : 1
      );

      const link = document.createElement("a");

      link.href = dataUrl;

      link.download = `${fileName}.${
        exportFormat === "image/jpeg"
          ? "jpg"
          : "png"
      }`;

      link.click();
    };
  };

  // ==========================================
  // WRAPPER STYLE
  // ==========================================

  const wrapperStyle: React.CSSProperties = {
    padding: `${frame.padding}px`,
    background: frame.borderColor,
    borderRadius: `${frame.borderRadius}px`,
    border:
      frame.borderWidth > 0
        ? `${frame.borderWidth}px solid ${frame.borderColor}`
        : "none",
    boxShadow:
      frame.glowIntensity > 0
        ? `0 0 ${frame.glowIntensity}px ${frame.borderColor}`
        : "none",
  };

  // ==========================================
  // JSX
  // ==========================================

  return (
    <div className="min-h-screen bg-black text-white p-5">
      <div className="max-w-[1500px] mx-auto">

        {/* HEADER */}

        <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
          <Link
            href="/"
            className="flex items-center gap-2 text-emerald-400"
          >
            <ArrowLeft size={18} />
            Back
          </Link>

          <h1 className="text-3xl font-black">
            PHOTO EDITOR PRO
          </h1>

          <div className="flex items-center gap-3">
            <button
              onClick={handleReset}
              className="bg-white/10 px-4 py-2 rounded-xl"
            >
              <RotateCcw size={18} />
            </button>

            <button
              onClick={handleDownload}
              disabled={!imageSrc}
              className="bg-emerald-600 hover:bg-emerald-500 disabled:opacity-40 px-6 py-3 rounded-xl font-bold flex items-center gap-2"
            >
              <Download size={18} />
              Export
            </button>
          </div>
        </div>

        {/* MAIN */}

        <div className="grid lg:grid-cols-[1fr_420px] gap-6">

          {/* PREVIEW */}

          <div className="bg-[#0c0c0c] rounded-3xl border border-white/10 min-h-[700px] flex items-center justify-center p-6 relative overflow-hidden">

            {!imageSrc ? (
              <div
                onClick={() =>
                  fileInputRef.current?.click()
                }
                className="w-full h-full border-2 border-dashed border-white/10 rounded-3xl flex flex-col items-center justify-center cursor-pointer"
              >
                <Upload size={50} />

                <p className="text-2xl font-bold mt-5">
                  Upload Image
                </p>

                <input
                  type="file"
                  accept="image/*"
                  ref={fileInputRef}
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </div>
            ) : (
              <div className="relative">

                <div style={wrapperStyle}>
                  <img
                    ref={imageRef}
                    src={imageSrc}
                    alt="preview"
                    draggable={false}
                    className="max-h-[75vh] object-contain select-none"
                    style={{
                      filter: getFilterCSS(),
                      transform: getTransformCSS(),
                    }}
                  />
                </div>

                {textLayers.map((layer) => (
                  <div
                    key={layer.id}
                    onClick={() =>
                      setSelectedLayerId(layer.id)
                    }
                    className={`absolute cursor-pointer ${
                      selectedLayerId === layer.id
                        ? "ring-2 ring-emerald-500"
                        : ""
                    }`}
                    style={{
                      left: `${layer.x}%`,
                      top: `${layer.y}%`,
                      transform: `translate(-50%, -50%) rotate(${layer.rotation}deg)`,
                      color: layer.color,
                      fontSize: layer.fontSize,
                      fontWeight: layer.fontWeight as any,
                      opacity: layer.opacity / 100,
                    }}
                  >
                    {layer.text}
                  </div>
                ))}

                <button
                  onClick={() =>
                    fileInputRef.current?.click()
                  }
                  className="absolute top-4 left-4 bg-black/70 px-4 py-2 rounded-xl flex items-center gap-2"
                >
                  <ImageIcon size={15} />
                  Change
                </button>
              </div>
            )}
          </div>

          {/* SIDEBAR */}

          <div className="bg-[#0c0c0c] rounded-3xl border border-white/10 p-5">

            {/* TABS */}

            <div className="flex flex-wrap gap-2 mb-6">
              <TabBtn
                active={activeTab === "basic"}
                label="Basic"
                onClick={() =>
                  setActiveTab("basic")
                }
              />

              <TabBtn
                active={activeTab === "effects"}
                label="Effects"
                onClick={() =>
                  setActiveTab("effects")
                }
              />

              <TabBtn
                active={activeTab === "transform"}
                label="Transform"
                onClick={() =>
                  setActiveTab("transform")
                }
              />

              <TabBtn
                active={activeTab === "frame"}
                label="Frame"
                onClick={() =>
                  setActiveTab("frame")
                }
              />

              <TabBtn
                active={activeTab === "text"}
                label="Text"
                onClick={() =>
                  setActiveTab("text")
                }
              />

              <TabBtn
                active={activeTab === "export"}
                label="Export"
                onClick={() =>
                  setActiveTab("export")
                }
              />
            </div>

            <AnimatePresence mode="wait">

              {/* BASIC */}

              {activeTab === "basic" && (
                <motion.div
                  key="basic"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="space-y-6"
                >
                  <FilterSlider
                    label="Brightness"
                    value={filters.brightness}
                    min={0}
                    max={200}
                    onChange={(v) =>
                      updateObjectState(
                        setFilters,
                        "brightness",
                        v
                      )
                    }
                  />

                  <FilterSlider
                    label="Contrast"
                    value={filters.contrast}
                    min={0}
                    max={200}
                    onChange={(v) =>
                      updateObjectState(
                        setFilters,
                        "contrast",
                        v
                      )
                    }
                  />

                  <FilterSlider
                    label="Saturation"
                    value={filters.saturation}
                    min={0}
                    max={200}
                    onChange={(v) =>
                      updateObjectState(
                        setFilters,
                        "saturation",
                        v
                      )
                    }
                  />
                </motion.div>
              )}

              {/* EFFECTS */}

              {activeTab === "effects" && (
                <motion.div
                  key="effects"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="space-y-6"
                >
                  <FilterSlider
                    label="Blur"
                    value={filters.blur}
                    min={0}
                    max={20}
                    step={0.5}
                    onChange={(v) =>
                      updateObjectState(
                        setFilters,
                        "blur",
                        v
                      )
                    }
                  />

                  <FilterSlider
                    label="Grayscale"
                    value={filters.grayscale}
                    min={0}
                    max={100}
                    onChange={(v) =>
                      updateObjectState(
                        setFilters,
                        "grayscale",
                        v
                      )
                    }
                  />

                  <FilterSlider
                    label="Sepia"
                    value={filters.sepia}
                    min={0}
                    max={100}
                    onChange={(v) =>
                      updateObjectState(
                        setFilters,
                        "sepia",
                        v
                      )
                    }
                  />
                </motion.div>
              )}

              {/* TRANSFORM */}

              {activeTab === "transform" && (
                <motion.div
                  key="transform"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="space-y-5"
                >
                  <div className="grid grid-cols-3 gap-3">

                    <button
                      onClick={() =>
                        updateObjectState(
                          setTransform,
                          "rotate",
                          transform.rotate + 90
                        )
                      }
                      className="bg-white/10 rounded-xl py-4 flex flex-col items-center gap-2"
                    >
                      <RotateCw size={18} />
                      Rotate
                    </button>

                    <button
                      onClick={() =>
                        updateObjectState(
                          setTransform,
                          "flipX",
                          transform.flipX * -1
                        )
                      }
                      className="bg-white/10 rounded-xl py-4 flex flex-col items-center gap-2"
                    >
                      <FlipHorizontal size={18} />
                      Flip X
                    </button>

                    <button
                      onClick={() =>
                        updateObjectState(
                          setTransform,
                          "flipY",
                          transform.flipY * -1
                        )
                      }
                      className="bg-white/10 rounded-xl py-4 flex flex-col items-center gap-2"
                    >
                      <FlipVertical size={18} />
                      Flip Y
                    </button>

                  </div>

                  <FilterSlider
                    label="Zoom"
                    value={transform.scale}
                    min={0.5}
                    max={3}
                    step={0.1}
                    onChange={(v) =>
                      updateObjectState(
                        setTransform,
                        "scale",
                        v
                      )
                    }
                  />
                </motion.div>
              )}

              {/* FRAME */}

              {activeTab === "frame" && (
                <motion.div
                  key="frame"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="space-y-6"
                >
                  <FilterSlider
                    label="Border Width"
                    value={frame.borderWidth}
                    min={0}
                    max={30}
                    onChange={(v) =>
                      updateObjectState(
                        setFrame,
                        "borderWidth",
                        v
                      )
                    }
                  />

                  <FilterSlider
                    label="Border Radius"
                    value={frame.borderRadius}
                    min={0}
                    max={100}
                    onChange={(v) =>
                      updateObjectState(
                        setFrame,
                        "borderRadius",
                        v
                      )
                    }
                  />

                  <input
                    type="color"
                    value={frame.borderColor}
                    onChange={(e) =>
                      updateObjectState(
                        setFrame,
                        "borderColor",
                        e.target.value
                      )
                    }
                    className="w-full h-12"
                  />
                </motion.div>
              )}

              {/* TEXT */}

              {activeTab === "text" && (
                <motion.div
                  key="text"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="space-y-6"
                >

                  <button
                    onClick={addTextLayer}
                    className="w-full bg-emerald-600 py-3 rounded-xl font-bold flex items-center justify-center gap-2"
                  >
                    <Plus size={18} />
                    Add Text
                  </button>

                  {textLayers.map((layer) => (
                    <div
                      key={layer.id}
                      className={`p-3 rounded-xl border flex items-center justify-between ${
                        selectedLayerId === layer.id
                          ? "border-emerald-500"
                          : "border-white/10"
                      }`}
                    >
                      <span>{layer.text}</span>

                      <button
                        onClick={() =>
                          setTextLayers((prev) =>
                            prev.filter(
                              (l) =>
                                l.id !== layer.id
                            )
                          )
                        }
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  ))}

                  {selectedLayerId && (
                    <div className="space-y-4">

                      <input
                        type="text"
                        value={
                          textLayers.find(
                            (l) =>
                              l.id ===
                              selectedLayerId
                          )?.text ?? ""
                        }
                        onChange={(e) =>
                          updateSelectedLayer({
                            text: e.target.value,
                          })
                        }
                        className="w-full bg-black border border-white/10 rounded-xl p-3"
                      />

                      <input
                        type="color"
                        value={
                          textLayers.find(
                            (l) =>
                              l.id ===
                              selectedLayerId
                          )?.color ?? "#ffffff"
                        }
                        onChange={(e) =>
                          updateSelectedLayer({
                            color: e.target.value,
                          })
                        }
                        className="w-full h-12"
                      />

                    </div>
                  )}
                </motion.div>
              )}

              {/* EXPORT */}

              {activeTab === "export" && (
                <motion.div
                  key="export"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="space-y-6"
                >
                  <div className="grid grid-cols-3 gap-3">

                    <button
                      onClick={() =>
                        setExportScale(1)
                      }
                      className={`py-3 rounded-xl ${
                        exportScale === 1
                          ? "bg-emerald-600"
                          : "bg-white/10"
                      }`}
                    >
                      1x
                    </button>

                    <button
                      onClick={() =>
                        setExportScale(2)
                      }
                      className={`py-3 rounded-xl ${
                        exportScale === 2
                          ? "bg-emerald-600"
                          : "bg-white/10"
                      }`}
                    >
                      2x
                    </button>

                    <button
                      onClick={() =>
                        setExportScale(4)
                      }
                      className={`py-3 rounded-xl ${
                        exportScale === 4
                          ? "bg-emerald-600"
                          : "bg-white/10"
                      }`}
                    >
                      4x
                    </button>

                  </div>

                  <div className="grid grid-cols-2 gap-3">

                    <button
                      onClick={() =>
                        setExportFormat(
                          "image/jpeg"
                        )
                      }
                      className="bg-white/10 rounded-xl py-3"
                    >
                      JPG
                    </button>

                    <button
                      onClick={() =>
                        setExportFormat(
                          "image/png"
                        )
                      }
                      className="bg-white/10 rounded-xl py-3"
                    >
                      PNG
                    </button>

                  </div>
                </motion.div>
              )}

            </AnimatePresence>
          </div>
        </div>

        <canvas
          ref={canvasRef}
          className="hidden"
        />
      </div>
    </div>
  );
}

// ==========================================
// TAB BUTTON
// ==========================================

function TabBtn({
  active,
  label,
  onClick,
}: {
  active: boolean;
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`px-4 py-2 rounded-xl text-sm font-bold transition ${
        active
          ? "bg-emerald-600"
          : "bg-white/10"
      }`}
    >
      {label}
    </button>
  );
}

// ==========================================
// FILTER SLIDER
// ==========================================

function FilterSlider({
  label,
  value,
  min,
  max,
  step = 1,
  onChange,
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  step?: number;
  onChange: (v: number) => void;
}) {
  return (
    <div>
      <div className="flex justify-between mb-2 text-sm">
        <span>{label}</span>
        <span>{value}</span>
      </div>

      <input
        type="range"
        value={value}
        min={min}
        max={max}
        step={step}
        onChange={(e) =>
          onChange(Number(e.target.value))
        }
        className="w-full"
      />
    </div>
  );
}