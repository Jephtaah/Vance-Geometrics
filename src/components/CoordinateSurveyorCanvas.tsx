/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef, useEffect } from "react";
import { GpsCoordinate } from "../types";
import { Clipboard, Eye, RefreshCw, Layers, MapPin, Grid, Compass, FileText, Download, ShieldCheck } from "lucide-react";

interface CanvasPreset {
  name: string;
  description: string;
  points: { x: number; y: number }[];
}

const PARCEL_PRESETS: Record<string, CanvasPreset> = {
  residential: {
    name: "0.25-Acre Subdivision Plot",
    description: "Standard standard rectangular lot with back easement boundary",
    points: [
      { x: 100, y: 100 },
      { x: 340, y: 100 },
      { x: 340, y: 280 },
      { x: 100, y: 260 },
    ],
  },
  acreage: {
    name: "4.8-Acre Forest Ridge boundary",
    description: "Irregular woodland division containing geographic creek edge",
    points: [
      { x: 80, y: 70 },
      { x: 280, y: 50 },
      { x: 420, y: 180 },
      { x: 300, y: 310 },
      { x: 120, y: 280 },
      { x: 50, y: 190 },
    ],
  },
  easement: {
    name: "Commercial Highway Easement",
    description: "Splayed infrastructure corridor marking utility access lines",
    points: [
      { x: 50, y: 220 },
      { x: 180, y: 190 },
      { x: 350, y: 160 },
      { x: 450, y: 250 },
      { x: 300, y: 280 },
      { x: 140, y: 310 },
    ],
  },
};

// Calibration definitions
const SCALE_FACTOR_METERS_PER_PX = 0.65;
const FEET_PER_METER = 3.28084;
const BASE_EASTING = 542150.0; // Central UTM Easting (Zone 10N)
const BASE_NORTHING = 4853240.0; // Central UTM Northing

export default function CoordinateSurveyorCanvas() {
  const [points, setPoints] = useState<GpsCoordinate[]>([]);
  const [gridEnabled, setGridEnabled] = useState(true);
  const [contourEnabled, setContourEnabled] = useState(true);
  const [labelsEnabled, setLabelsEnabled] = useState(true);
  const [selectedService, setSelectedService] = useState<"boundary" | "topo" | "construction" | "drone">("boundary");
  const [propertyType, setPropertyType] = useState<"flat" | "wooded" | "mountain" | "urban">("wooded");
  const [hoveredPos, setHoveredPos] = useState({ x: 0, y: 0 });
  const [isHoveringCanvas, setIsHoveringCanvas] = useState(false);
  
  // Closing precision report state
  const [showReport, setShowReport] = useState(false);
  const [licensee, setLicensee] = useState("Jonathan Vance");
  const [licenseNumber, setLicenseNumber] = useState("PLS-78402");
  const [stampNotice, setStampNotice] = useState("");
  const [actionFeedback, setActionFeedback] = useState("");
  
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLDivElement>(null);

  // Generate simulated coordinate from canvas space
  const calculateCoordinate = (x: number, y: number, id: string): GpsCoordinate => {
    // UTM projection scale grid
    const easting = BASE_EASTING + x * SCALE_FACTOR_METERS_PER_PX;
    const northing = BASE_NORTHING + (380 - y) * SCALE_FACTOR_METERS_PER_PX;
    
    // Elevation simulation using periodic waves for topographic ridge profile
    const elevation = 124.8 + 
      Math.sin(x / 60) * 14.5 + 
      Math.cos(y / 40) * 8.2 + 
      Math.sin((x + y) / 100) * 5.0;

    return { id, x, y, easting, northing, elevation };
  };

  // Convert points from presets
  const loadPreset = (key: keyof typeof PARCEL_PRESETS) => {
    const preset = PARCEL_PRESETS[key];
    const newPoints = preset.points.map((p, index) => 
      calculateCoordinate(p.x, p.y, `vertex-${index + 1}`)
    );
    setPoints(newPoints);
  };

  // Load standard preset on mount
  useEffect(() => {
    loadPreset("acreage");
  }, []);

  const handleCanvasClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!canvasRef.current) return;
    const rect = canvasRef.current.getBoundingClientRect();
    const x = Math.round(e.clientX - rect.left);
    const y = Math.round(e.clientY - rect.top);

    // Limit to 10 points for boundary plotting readability
    if (points.length >= 12) {
      setActionFeedback("Maximum CAD demonstration points (12) reached. Click 'Clear Plot' or remove individual coordinates to plot custom boundaries.");
      setTimeout(() => setActionFeedback(""), 5000);
      return;
    }

    const nextId = `vertex-${Date.now()}`;
    const newCoord = calculateCoordinate(x, y, nextId);
    setPoints([...points, newCoord]);
  };

  const removePoint = (id: string) => {
    setPoints(points.filter(p => p.id !== id));
  };

  const clearCanvas = () => {
    setPoints([]);
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!canvasRef.current) return;
    const rect = canvasRef.current.getBoundingClientRect();
    const x = Math.round(e.clientX - rect.left);
    const y = Math.round(e.clientY - rect.top);
    setHoveredPos({ x, y });
  };

  // Calculate area based on Shoelace coordinate geometry
  const calculatePolygonArea = () => {
    if (points.length < 3) return 0;
    let sum1 = 0;
    let sum2 = 0;
    const n = points.length;
    
    for (let i = 0; i < n; i++) {
      const current = points[i];
      const next = points[(i + 1) % n];
      
      // Calculate based on simulated UTM meters for exact actual area (sq meters)
      sum1 += current.easting * next.northing;
      sum2 += next.easting * current.northing;
    }
    
    const areaSqMeters = Math.abs(sum1 - sum2) / 2;
    const areaSqFt = areaSqMeters * FEET_PER_METER * FEET_PER_METER;
    return areaSqFt;
  };

  // Calculate boundary perimeter
  const calculatePerimeter = () => {
    if (points.length < 2) return 0;
    let totalMeters = 0;
    const n = points.length;
    const isClosed = n >= 3;
    const limit = isClosed ? n : n - 1;

    for (let i = 0; i < limit; i++) {
      const current = points[i];
      const next = points[(i + 1) % n];
      
      const dx = next.easting - current.easting;
      const dy = next.northing - current.northing;
      const dist = Math.sqrt(dx * dx + dy * dy);
      totalMeters += dist;
    }

    return totalMeters * FEET_PER_METER;
  };

  const areaSqFt = calculatePolygonArea();
  const areaAcres = areaSqFt / 43560;
  const perimeterFt = calculatePerimeter();

  // Pricing formula logic following land surveying structure
  const getCalculatedSurveyFee = () => {
    if (points.length === 0) return 0;
    
    let baseRate = 850; // Base mobilization fee
    let areaMultiplier = 0.005; // per sq ft rate
    let complexityFactor = 1.0;

    switch (selectedService) {
      case "topo":
        baseRate = 1200;
        areaMultiplier = 0.008;
        break;
      case "construction":
        baseRate = 1500;
        areaMultiplier = 0.004;
        break;
      case "drone":
        baseRate = 950;
        areaMultiplier = 0.002;
        break;
    }

    switch (propertyType) {
      case "flat":
        complexityFactor = 0.85;
        break;
      case "wooded":
        complexityFactor = 1.15;
        break;
      case "mountain":
        complexityFactor = 1.45;
        break;
      case "urban":
        complexityFactor = 1.25;
        break;
    }

    // Complexity of surveying vertex layout
    const boundaryPointsAdjustment = Math.max(0, (points.length - 4) * 80);

    const calculatedPrice = (baseRate + (areaSqFt * areaMultiplier)) * complexityFactor + boundaryPointsAdjustment;
    
    // Return rounded reasonable fee
    return Math.round(calculatedPrice / 50) * 50;
  };

  const estimatedFee = getCalculatedSurveyFee();

  // Draw SVG lines for coordinates tracker
  const getSvgPolyPath = () => {
    if (points.length === 0) return "";
    return points.map(p => `${p.x},${p.y}`).join(" ");
  };

  const hoveredUtmEasting = BASE_EASTING + hoveredPos.x * SCALE_FACTOR_METERS_PER_PX;
  const hoveredUtmNorthing = BASE_NORTHING + (380 - hoveredPos.y) * SCALE_FACTOR_METERS_PER_PX;

  return (
    <div id="survey-plotter-section" className="bg-[#121c17] text-[#efebdf] border-t border-b border-[#2d523d]/40 cad-grid-dark-green relative overflow-hidden py-14">
      {/* Scope accent background element */}
      <div className="absolute right-4 top-4 text-[10px] font-mono text-brand-orange/30 pointer-events-none select-none text-right">
        RTK SEED ZONE UTM-10N // EPSG:32610<br />
        HORIZ ACCURACY: 0.008m // VERT: 0.012m<br />
        CALIBRATION LOCAL_TIME: 2026-06-14
      </div>
      
      {/* Heading Group */}
      <div className="max-w-7xl mx-auto px-4 md:px-6 relative z-10">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 pb-4 border-b border-[#2d523d]/30">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="h-1.5 w-1.5 rounded-full bg-brand-orange animate-pulse"></span>
              <span className="text-brand-orange uppercase text-xs font-mono font-semibold tracking-widest">Interactive Engineering Sandbox</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-display font-medium text-white tracking-tight">
              Interactive CAD & Boundary Plotter
            </h2>
            <p className="mt-2 text-sm text-[#efebdf]/70 font-sans max-w-xl">
              Simulate actual geodetic coordinates by plotting boundary vertices directly on our topo-scanned grid. Inspect survey geometry calculations in real-time.
            </p>
          </div>
          <div className="mt-4 md:mt-0 flex gap-2 overflow-x-auto pb-2 md:pb-0">
            {(Object.keys(PARCEL_PRESETS) as Array<keyof typeof PARCEL_PRESETS>).map((key) => (
              <button
                key={key}
                onClick={() => loadPreset(key)}
                className="px-3 py-1.5 bg-brand-green-mid hover:bg-brand-green-light border border-brand-green-light/60 rounded text-xs font-mono transition-all whitespace-nowrap text-white flex items-center gap-1.5"
              >
                <Layers size={12} className="text-brand-orange" />
                {PARCEL_PRESETS[key].name}
              </button>
            ))}
          </div>
        </div>

        {/* Major Sandbox Layout Container */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* LEFT: The Canvas Interactivity Area (cols: 7) */}
          <div className="lg:col-span-7 bg-brand-concrete-dark border border-brand-green-light/80 rounded-lg p-3 md:p-4 shadow-xl relative">
            <div className="flex flex-wrap items-center justify-between mb-3 pb-3 border-b border-brand-green-light/40 gap-3">
              {/* Layer Controls */}
              <div className="flex items-center gap-2 flex-wrap">
                <button
                  onClick={() => setGridEnabled(!gridEnabled)}
                  className={`px-2.5 py-1 rounded text-xs font-mono flex items-center gap-1 transition-colors ${gridEnabled ? "bg-brand-orange text-white" : "bg-brand-green-dark/60 text-white/50 border border-brand-green-light/40"}`}
                >
                  <Grid size={11} />
                  CAD Grid
                </button>
                <button
                  onClick={() => setContourEnabled(!contourEnabled)}
                  className={`px-2.5 py-1 rounded text-xs font-mono flex items-center gap-1 transition-colors ${contourEnabled ? "bg-brand-green-light text-white border border-brand-green-light" : "bg-brand-green-dark/60 text-white/50 border border-brand-green-light/40"}`}
                >
                  <Compass size={11} />
                  Contours
                </button>
                <button
                  onClick={() => setLabelsEnabled(!labelsEnabled)}
                  className={`px-2.5 py-1 rounded text-xs font-mono flex items-center gap-1 transition-colors ${labelsEnabled ? "bg-brand-green-light text-white border border-brand-green-light" : "bg-brand-green-dark/60 text-white/50 border border-brand-green-light/40"}`}
                >
                  <MapPin size={11} />
                  Labels
                </button>
              </div>

              {/* Utility Clear Controls */}
              <div className="flex items-center gap-2">
                <button
                  onClick={clearCanvas}
                  className="px-2.5 py-1 bg-transparent hover:bg-red-950/40 border border-red-900/40 rounded text-xs text-red-400 font-mono flex items-center gap-1 transition-colors"
                >
                  Clear Plot
                </button>
              </div>
            </div>

            {/* Simulated Interactive Stage Container */}
            <div 
              id="engineering-canvas-stage"
              ref={canvasRef}
              onClick={handleCanvasClick}
              onMouseMove={handleMouseMove}
              onMouseEnter={() => setIsHoveringCanvas(true)}
              onMouseLeave={() => setIsHoveringCanvas(false)}
              className="relative w-full aspect-[4/3] bg-[#0c1511] rounded cursor-crosshair overflow-hidden border border-[#2d523d]/30"
              style={{ maxHeight: "420px" }}
            >
              {/* Background Topographic Contour Lines simulation - conditionally rendered */}
              {contourEnabled && (
                <div className="absolute inset-0 topo-lines opacity-15 pointer-events-none transition-opacity" />
              )}
              
              {/* CAD Subgrids and Grid Lines conditionally rendered */}
              {gridEnabled && (
                <div className="absolute inset-0 cad-grid opacity-15 pointer-events-none transition-opacity" />
              )}
              {gridEnabled && (
                <div className="absolute inset-0 cad-subgrid opacity-25 pointer-events-none transition-opacity" />
              )}

              {/* Technical scope lines focusing the hovering pointer */}
              {isHoveringCanvas && (
                <div className="absolute inset-0 pointer-events-none">
                  {/* Vertical scope marker line */}
                  <div 
                    className="absolute top-0 bottom-0 border-l border-[#f2521c]/20" 
                    style={{ left: `${hoveredPos.x}px` }}
                  />
                  {/* Horizontal scope marker line */}
                  <div 
                    className="absolute left-0 right-0 border-t border-[#f2521c]/20" 
                    style={{ top: `${hoveredPos.y}px` }}
                  />
                  
                  {/* Hovering Geodetic UTM Coordinate Display near cursor */}
                  <div 
                    className="absolute bg-[#121c17] text-[10px] font-mono text-brand-orange px-2 py-1 rounded border border-[#2d523d]/90 shadow-md flex flex-col pointer-events-none gap-0.5"
                    style={{ 
                      left: `${hoveredPos.x + 12}px`, 
                      top: `${hoveredPos.y + 12}px`,
                      maxWidth: "200px",
                      zIndex: 30
                    }}
                  >
                    <span>E: {hoveredUtmEasting.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + " m"}</span>
                    <span>N: {hoveredUtmNorthing.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + " m"}</span>
                  </div>
                </div>
              )}

              {/* Svg Polygons for boundaries and lines representation */}
              {points.length > 0 && (
                <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ zIndex: 10 }}>
                  {/* Closed Polygon area fill */}
                  {points.length >= 3 && (
                    <polygon 
                      points={getSvgPolyPath()} 
                      className="fill-brand-orange/5 stroke-brand-orange/40 stroke-2"
                      strokeDasharray="4 4"
                    />
                  )}
                  
                  {/* Segment lines representation (unclosed polyline for < 3 points) */}
                  {points.length > 1 && points.length < 3 && (
                    <polyline 
                      points={getSvgPolyPath()} 
                      className="fill-none stroke-brand-orange/50 stroke-1.5"
                    />
                  )}

                  {/* Draw compass bearings labels between points if enabled */}
                  {points.length > 1 && points.map((p, idx) => {
                    const next = points[(idx + 1) % points.length];
                    if (idx === points.length - 1 && points.length < 3) return null; // do not close polyline if only 2 points
                    
                    // Center point calculation
                    const cx = (p.x + next.x) / 2;
                    const cy = (p.y + next.y) / 2;
                    
                    // Geodesic bearing simulation
                    const dx = next.easting - p.easting;
                    const dy = next.northing - p.northing;
                    let angleRad = Math.atan2(dx, dy); // Radians in UTM coord space (clockwise from North, but standard atan2 is counter-clockwise from East x-axis)
                    let bearingDeg = angleRad * (180 / Math.PI);
                    if (bearingDeg < 0) bearingDeg += 360;
                    
                    // Format degree, minute, second bearing label (e.g. N 32°14'22" E)
                    const formatBearing = (deg: number) => {
                      let d = Math.floor(deg);
                      let m = Math.floor((deg - d) * 60);
                      let s = Math.round(((deg - d) * 60 - m) * 60);
                      if (s === 60) { s = 0; m += 1; }
                      if (m === 60) { m = 0; d += 1; }
                      return `${d}°${m.toString().padStart(2, "0")}'${s.toString().padStart(2, "0")}"`;
                    };

                    const distanceMeters = Math.sqrt(dx*dx + dy*dy);
                    const distanceFeet = distanceMeters * FEET_PER_METER;

                    return (
                      <g key={`bearing-${idx}`} className="opacity-75">
                        <rect 
                          x={cx - 45} 
                          y={cy - 9} 
                          width="90" 
                          height="18" 
                          rx="3" 
                          className="fill-[#0c1511]/90 stroke-[#2d523d]/60 stroke-1"
                        />
                        <text 
                          x={cx} 
                          y={cy + 3} 
                          textAnchor="middle" 
                          className="fill-[#efebdf]/90 font-mono"
                          style={{ fontSize: "8px" }}
                        >
                          {formatBearing(bearingDeg)} | {distanceFeet.toFixed(1)}ft
                        </text>
                      </g>
                    );
                  })}
                </svg>
              )}

              {/* Vertices pointers */}
              {points.map((p, index) => {
                const labelLetter = String.fromCharCode(65 + index); // Spot A, B, C...
                return (
                  <div
                    key={p.id}
                    className="absolute group"
                    style={{ 
                      left: `${p.x}px`, 
                      top: `${p.y}px`, 
                      transform: "translate(-50%, -50%)", 
                      zIndex: 20 
                    }}
                  >
                    {/* Ring Pulse outer boundary */}
                    <div className="h-5 w-5 bg-brand-orange/25 rounded-full absolute -top-1 -left-1 scale-100 group-hover:scale-150 group-hover:bg-brand-orange/40 transition-all duration-300" />
                    
                    {/* Solid core pin */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        removePoint(p.id);
                      }}
                      title="Click vertex to delete"
                      className="h-3 w-3 bg-brand-orange border border-white rounded-full flex items-center justify-center relative shadow-lg cursor-pointer"
                    >
                      <span className="sr-only">Delete vertex</span>
                    </button>

                    {/* Numeric coordinate identifier overlay */}
                    {labelsEnabled && (
                      <div className="absolute bottom-5 left-1/2 -translate-x-1/2 whitespace-nowrap bg-[#121c17] text-[10px] font-mono text-white px-2 py-0.5 rounded border border-[#2d523d] shadow-sm flex items-center gap-1 pointer-events-none">
                        <span className="text-brand-yellow font-bold">{labelLetter}</span>
                        <span>({Math.round(p.easting)}, {Math.round(p.northing)})</span>
                      </div>
                    )}
                  </div>
                );
              })}

              {/* Instructions banner when empty */}
              {points.length === 0 && (
                <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-6 bg-black/45 backdrop-blur-[1px] pointer-events-none">
                  <div className="p-3 bg-[#112117] border border-[#2d523d]/80 rounded-full mb-3 text-brand-orange">
                    <MapPin size={24} className="animate-bounce" />
                  </div>
                  <h4 className="text-lg font-display text-white font-medium">Coordinate Board Ready</h4>
                  <p className="mt-1 text-xs text-[#efebdf]/75 max-w-sm">
                    Click anywhere inside this viewport grid to plot boundary vertices. Connect three or more points to create a land parcel and estimate parameters instantly.
                  </p>
                  <p className="mt-3 text-[10.5px] font-mono text-[#f2521c]/90 bg-[#121c17] px-3 py-1 border border-[#2d523d]/40 rounded">
                    Tip: Try clicking a preset parcel button on the top-right!
                  </p>
                </div>
              )}
            </div>

            {/* Scale Calibration and UTM Status footer */}
            <div className="mt-3 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 text-[11px] font-mono text-[#efebdf]/50 bg-[#0d1611] p-2.5 rounded border border-[#2d523d]/30">
              <div className="flex items-center gap-4 flex-wrap">
                <span className="flex items-center gap-1.5">
                  <span className="h-1.5 w-1.5 rounded-full bg-brand-yellow"></span>
                  Projection: NAD83 / State Plane / UTM Zone 10N
                </span>
                <span>•</span>
                <span>Grid Spacing: 40m x 40m</span>
              </div>
              <div>
                <span>Scale Ratio: 1 pixel = {SCALE_FACTOR_METERS_PER_PX}m / {(SCALE_FACTOR_METERS_PER_PX * FEET_PER_METER).toFixed(2)}ft</span>
              </div>
            </div>
          </div>

          {/* RIGHT: Real-time Coordinate Specs & Fee Estimator (cols: 5) */}
          <div className="lg:col-span-5 flex flex-col gap-6">
            
            {/* Real-time calculated Area and Geometrical Parameters */}
            <div className="bg-[#122119]/90 border border-[#2d523d] rounded-lg p-5 shadow-lg relative overflow-hidden">
              <div className="absolute top-0 right-0 py-1 px-2.5 bg-brand-yellow/10 border-l border-b border-[#2d523d]/60 text-[9px] font-mono text-brand-yellow">
                SECTOR CALCULATION_SHEET
              </div>
              <h3 className="text-xs font-mono font-bold tracking-widest text-[#efebdf]/45 uppercase mb-3">
                1. Calculated Geometry Parameters
              </h3>

              <div className="grid grid-cols-2 gap-4">
                <div className="bg-[#0b130f] p-3 rounded border border-[#2d523d]/40">
                  <span className="text-[10px] font-mono uppercase text-[#efebdf]/50 block">Boundary Vertices</span>
                  <div className="flex items-baseline gap-1 mt-1">
                    <span className="text-2xl font-mono font-bold text-white">{points.length}</span>
                    <span className="text-xs text-[#efebdf]/60 font-mono">Mapped</span>
                  </div>
                </div>

                <div className="bg-[#0b130f] p-3 rounded border border-[#2d523d]/40">
                  <span className="text-[10px] font-mono uppercase text-[#efebdf]/50 block">Perimeter Distance</span>
                  <div className="flex items-baseline gap-1 mt-1">
                    <span className="text-2xl font-mono font-bold text-white">
                      {perimeterFt > 0 ? perimeterFt.toLocaleString("en-US", { maximumFractionDigits: 1 }) : "---"}
                    </span>
                    <span className="text-xs text-[#efebdf]/60 font-mono">ft</span>
                  </div>
                </div>

                <div className="bg-[#0b130f] p-3 rounded border border-[#2d523d]/40 col-span-2">
                  <span className="text-[10px] font-mono uppercase text-[#efebdf]/50 block">Calculated Surface Area</span>
                  <div className="flex items-baseline gap-4 mt-1.5 flex-wrap">
                    <div className="flex items-baseline gap-1">
                      <span className="text-3xl font-mono font-bold text-brand-orange">
                        {areaAcres > 0 ? areaAcres.toFixed(3) : "0.000"}
                      </span>
                      <span className="text-sm text-brand-orange/80 font-mono font-semibold">Acres</span>
                    </div>
                    <div className="text-[#efebdf]/40 font-mono text-base font-light">/</div>
                    <div className="flex items-baseline gap-1">
                      <span className="text-xl font-mono font-bold text-white">
                        {areaSqFt > 0 ? Math.round(areaSqFt).toLocaleString() : "0"}
                      </span>
                      <span className="text-xs text-[#efebdf]/50 font-mono">sq ft</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Vertices GPS Details drawer list inside sandbox */}
              <div className="mt-4">
                <span className="text-[10px] font-mono uppercase text-[#efebdf]/40 block mb-2">Vertex GIS Log (UTM Easting/Northing)</span>
                {points.length === 0 ? (
                  <div className="p-3 bg-black/25 text-center text-[11px] font-mono text-[#efebdf]/40 italic rounded border border-[#2d523d]/20">
                    No boundary coordinates plotted. Please click the surveyor canvas.
                  </div>
                ) : (
                  <div className="max-h-[140px] overflow-y-auto border border-[#2d523d]/30 rounded bg-[#0b130f]">
                    <table className="w-full text-left font-mono text-[10px] border-collapse">
                      <thead>
                        <tr className="bg-[#121c17] text-[#efebdf]/50 border-b border-[#2d523d]/40">
                          <th className="p-1.5 text-center">Node</th>
                          <th className="p-1.5">UTM Easting (E)</th>
                          <th className="p-1.5">UTM Northing (N)</th>
                          <th className="p-1.5">Elevation (Z)</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-[#2d523d]/20">
                        {points.map((p, index) => {
                          const labelLetter = String.fromCharCode(65 + index);
                          return (
                            <tr key={p.id} className="hover:bg-[#1a2d21]/40 text-stone-200">
                              <td className="p-1.5 text-center font-bold text-brand-yellow border-r border-[#2d523d]/20">{labelLetter}</td>
                              <td className="p-1.5">{p.easting.toFixed(2)} m</td>
                              <td className="p-1.5">{p.northing.toFixed(2)} m</td>
                              <td className="p-1.5 text-brand-orange">{p.elevation.toFixed(1)} m</td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>

            {/* Custom Interactive Parameter Configuration Form & Dynamic Quote Estimator */}
            <div className="bg-[#122119]/90 border border-[#2d523d] rounded-lg p-5 shadow-lg relative flex-1">
              <h3 className="text-xs font-mono font-bold tracking-widest text-[#efebdf]/45 uppercase mb-3 text-white">
                2. Real-World Surveyor Mobilization Quote Calculator
              </h3>

              <div className="space-y-4">
                {/* Service type select */}
                <div>
                  <label className="text-[10px] font-mono text-[#efebdf]/60 uppercase block mb-1">Survey Category & Standard Scope</label>
                  <select
                    value={selectedService}
                    onChange={(e) => setSelectedService(e.target.value as any)}
                    className="w-full bg-[#0b130f] border border-[#2d523d]/80 rounded p-1.5 text-xs text-white font-mono focus:outline-none focus:border-brand-orange"
                  >
                    <option value="boundary">Boundary Survey & Property Lines Marking</option>
                    <option value="topo">Topographic Contour Survey & 3D Scanning</option>
                    <option value="construction">Construction Layout / Architectural Staking</option>
                    <option value="drone">GIS Aerial Drone Mapping & Visual Orthomosaic</option>
                  </select>
                </div>

                {/* Ground/Vegetation Cover select */}
                <div>
                  <label className="text-[10px] font-mono text-[#efebdf]/60 uppercase block mb-1">Terrain & Vegetation Density</label>
                  <select
                    value={propertyType}
                    onChange={(e) => setPropertyType(e.target.value as any)}
                    className="w-full bg-[#0b130f] border border-[#2d523d]/80 rounded p-1.5 text-xs text-white font-mono focus:outline-none focus:border-brand-orange"
                  >
                    <option value="flat">Clear & Flat (Low complexity, grass pasture)</option>
                    <option value="wooded">Moderately Forested / Sloped (Medium complexity)</option>
                    <option value="urban">Dense Urban Boundary / Developed Area (High structures)</option>
                    <option value="mountain">Steep & Mountainous Scrub Canopy (Extreme access layout)</option>
                  </select>
                </div>

                {/* Instant Calculated Fee Breakdown */}
                <div className="bg-black/40 border border-[#2d523d]/50 p-4 rounded mt-2">
                  <div className="flex justify-between items-center text-xs font-mono text-[#efebdf]/60 border-b border-[#2d523d]/20 pb-2 mb-2">
                    <span>Base Field Mobilization:</span>
                    <span className="text-white">${selectedService === "topo" ? "1,200" : selectedService === "construction" ? "1,500" : selectedService === "drone" ? "950" : "850"}</span>
                  </div>
                  
                  <div className="flex justify-between items-center text-xs font-mono text-[#efebdf]/60 border-b border-[#2d523d]/20 pb-2 mb-2">
                    <span>Acreage Complexity Cost:</span>
                    <span className="text-white">${points.length > 0 ? (estimatedFee - (selectedService === "topo" ? 1200 : selectedService === "construction" ? 1500 : selectedService === "drone" ? 950 : 850)).toLocaleString() : "0"}</span>
                  </div>

                  <div className="flex justify-between items-end pt-1">
                    <div>
                      <span className="text-[10px] font-mono text-brand-orange uppercase block tracking-wider font-semibold">Estimated Surveyor Fee</span>
                      <span className="text-stone-400 text-[10px] font-sans">Includes field crew and certified engineering sealing.</span>
                    </div>
                    <div className="text-right">
                      {points.length === 0 ? (
                        <span className="text-xs text-amber-500 font-mono italic">Plat boundary required</span>
                      ) : (
                        <div className="flex flex-col">
                          <span className="text-2xl font-mono font-bold text-white">${estimatedFee.toLocaleString()}</span>
                          <span className="text-[9px] font-mono text-[#efebdf]/40">Estimated ±5% error margin</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Action CTA Buttons */}
                <div className="grid grid-cols-2 gap-3 mt-4">
                  <button
                    disabled={points.length < 3}
                    onClick={() => setShowReport(true)}
                    className="px-4 py-2 bg-brand-green-mid hover:bg-brand-green-light border border-brand-green-light rounded text-white text-xs font-mono font-bold transition-all flex items-center justify-center gap-1.5 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <FileText size={14} className="text-brand-orange" />
                    Review Plat Report
                  </button>
                  <a
                    href="#contact-form-section"
                    className="px-4 py-2 bg-brand-orange hover:bg-brand-orange-hover rounded text-white text-xs font-mono font-bold text-center transition-all flex items-center justify-center gap-1.5"
                  >
                    Lock Mobilization Rate
                  </a>
                </div>
              </div>

            </div>

          </div>

        </div>
      </div>

      {/* MODAL: SIMULATED CLOSURE REPORT (SURVEY RECORD) */}
      {showReport && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-2xl bg-brand-sand-light text-brand-green-dark rounded-lg border-2 border-brand-green-dark p-6 shadow-2xl relative max-h-[90vh] overflow-y-auto">
            
            {/* Stamp Logo Overlay */}
            <div className="absolute right-8 top-16 border-2 border-dashed border-brand-green-mid/40 p-4 rounded-full text-center rotate-12 select-none pointer-events-none opacity-20 flex flex-col justify-center items-center h-28 w-28 text-brand-green-mid">
              <span className="text-[7.5px] font-mono leading-tight uppercase">Jonathan Vance<br />LICENSED LAND SURVEYOR<br />STATE REG: {licenseNumber}</span>
            </div>

            {/* Close Button Top */}
            <button 
              onClick={() => setShowReport(false)}
              className="absolute top-4 right-4 text-[#222925]/60 hover:text-red-600 text-sm font-mono font-bold border border-[#222925]/20 hover:border-red-600/30 px-2 py-1 rounded"
            >
              CLOSE PLAT REPORT
            </button>

            {/* Document Header */}
            <div className="border-b-2 border-brand-green-dark pb-4 mb-4">
              <div className="flex items-center gap-2 text-brand-green-mid uppercase font-mono text-[10px] tracking-widest font-semibold mb-1">
                <Compass size={14} className="text-brand-orange" />
                DRAFT PLAT CERTIFICATION & CLOSURE STATEMENT
              </div>
              <h3 className="text-xl font-display font-medium text-[#1c3326]">
                Simulated Geodetic Metes & Bounds Record
              </h3>
              <p className="text-[11px] font-mono text-[#222925]/60 mt-1">
                Project Timestamp: 2026-06-14 // UTM Grid Projection Standard (WGS84 Datum)
              </p>
            </div>

            {/* Metes & Bounds Details */}
            <div className="space-y-4 font-mono text-xs">
              <div className="grid grid-cols-2 gap-4 text-[11px] bg-brand-concrete-light p-3 rounded border border-brand-clay/50">
                <div>
                  <span className="text-[10px] text-stone-500 uppercase block">Licentiate Surveyor:</span>
                  <span className="font-semibold text-brand-green-dark">{licensee}, PLS (Licensed Signatory)</span>
                </div>
                <div>
                  <span className="text-[10px] text-stone-500 uppercase block">Registry Number:</span>
                  <span className="font-semibold text-brand-green-dark">{licenseNumber}</span>
                </div>
                <div>
                  <span className="text-[10px] text-stone-500 uppercase block">Mathematical Closure Ratio:</span>
                  <span className="font-semibold text-brand-green-light">1 : 284,500m (Exceeds ALTA/NSPS Target)</span>
                </div>
                <div>
                  <span className="text-[10px] text-stone-500 uppercase block">Relative Precision Error:</span>
                  <span className="font-semibold text-brand-green-light">0.0035 ft Error of Closure</span>
                </div>
              </div>

              {/* Bearing details table */}
              <div>
                <span className="font-bold text-xs text-brand-green-dark block mb-2">Calculated Traverse Line Course Bearings:</span>
                <div className="border border-brand-clay overflow-hidden rounded bg-white">
                  <table className="w-full text-[10.5px] text-left">
                    <thead>
                      <tr className="bg-brand-concrete-light font-bold text-brand-green-dark border-b border-brand-clay">
                        <th className="p-2">Segment Course</th>
                        <th className="p-2">Grid Distance</th>
                        <th className="p-2">Cartographic Bearing</th>
                        <th className="p-2">Change in elevation</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-brand-clay">
                      {points.map((p, idx) => {
                        const next = points[(idx + 1) % points.length];
                        const fromChar = String.fromCharCode(65 + idx);
                        const toChar = String.fromCharCode(65 + ((idx + 1) % points.length));
                        
                        const dx = next.easting - p.easting;
                        const dy = next.northing - p.northing;
                        let angleRad = Math.atan2(dx, dy);
                        let bearingDeg = angleRad * (180 / Math.PI);
                        if (bearingDeg < 0) bearingDeg += 360;
                        
                        const formatBearing = (deg: number) => {
                          let d = Math.floor(deg);
                          let m = Math.floor((deg - d) * 60);
                          let s = Math.round(((deg - d) * 60 - m) * 60);
                          return `${d}°${m.toString().padStart(2, "0")}'${s.toString().padStart(2, "0")}"`;
                        };

                        const distFt = Math.sqrt(dx*dx + dy*dy) * FEET_PER_METER;
                        const dz = next.elevation - p.elevation;

                        return (
                          <tr key={`report-row-${idx}`} className="text-[#222925]">
                            <td className="p-2 font-bold">{fromChar} ➔ {toChar}</td>
                            <td className="p-2">{distFt.toFixed(2)} ft</td>
                            <td className="p-2 text-brand-orange font-bold tracking-wide">{formatBearing(bearingDeg)}</td>
                            <td className="p-2">{dz >= 0 ? "+" : ""}{dz.toFixed(1)} m</td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Field certification statement */}
              <div className="bg-stone-50 border border-brand-clay p-3 rounded text-[11px] text-stone-600 text-justify leading-relaxed">
                <strong>SURVEYOR NOTES & BOUNDARY STATEMENTS:</strong> This coordinate statement represents a simulated geodetic traverse adjusted via Least Squares processing. Mapped boundary coordinates reflect simulated GIS coordinates inside UTM Zone 10N based on NAD83 horizontal control and NAVD83 vertical control. Real-world property line boundaries require an on-site field survey including physical monument searching, easement inspections, and standard boundary stakes certification. This document acts as an interactive visualization and does not constitute a legal property survey report filed with local county registries.
              </div>

              {/* Stamp customization controls */}
              <div className="bg-[#eff1f0] border border-[#cbd5e1] p-3 rounded font-sans text-xs">
                <span className="font-mono text-[9px] uppercase font-bold text-stone-500 block mb-2">Simulated Stamp Certification Parameters:</span>
                <div className="grid grid-cols-2 gap-3 text-stone-700">
                  <div>
                    <label className="block text-[10px] text-stone-500 uppercase mb-0.5">Licensed Surveyor Type-in Name</label>
                    <input 
                      type="text" 
                      value={licensee} 
                      onChange={(e) => setLicensee(e.target.value)} 
                      className="w-full bg-white border border-[#2d523d]/40 rounded p-1 text-[11px] font-mono focus:outline-none" 
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] text-stone-500 uppercase mb-0.5">License Registration #</label>
                    <input 
                      type="text" 
                      value={licenseNumber} 
                      onChange={(e) => setLicenseNumber(e.target.value)} 
                      className="w-full bg-white border border-[#2d523d]/40 rounded p-1 text-[11px] font-mono focus:outline-none" 
                    />
                  </div>
                </div>
              </div>

              {/* Action Buttons to print/export */}
              <div className="flex justify-between items-center pt-3 border-t border-brand-clay">
                <div className="flex items-center gap-2 text-[11px] text-brand-green-mid/80 font-bold">
                  <ShieldCheck size={16} className="text-brand-green-mid" />
                  Calculated Closure Error: Minimal
                </div>
                <button
                  onClick={() => {
                    setActionFeedback(`TRAVERSE CSV EXPORT SUCCESS! Points drafted under registry file 'PLS-${licenseNumber}_Project_Record.csv'. Simulated geodetic data recorded successfully.`);
                    setTimeout(() => setActionFeedback(""), 7000);
                  }}
                  className="px-4 py-2 bg-brand-green-mid hover:bg-brand-concrete-dark text-white rounded font-mono font-bold transition-all flex items-center gap-2 text-xs cursor-pointer"
                >
                  <Download size={13} />
                  Export CAD Point CSV
                </button>
              </div>

            </div>

          </div>
        </div>
      )}

      {/* FLOATING ACTION FEEDBACK TOAST */}
      {actionFeedback && (
        <div className="fixed bottom-6 right-6 z-50 max-w-sm bg-brand-green-dark border-2 border-brand-orange text-white p-4 rounded shadow-2xl flex items-start gap-3 animate-fade-in font-sans">
          <div className="h-2.5 w-2.5 rounded-full bg-brand-orange mt-1 shrink-0 animate-pulse" />
          <div className="flex-1 text-xs">
            <p className="font-mono font-bold text-[9px] text-brand-orange tracking-widest uppercase mb-1">// SYSTEM DATA BROADCAST</p>
            <p className="text-white/90 leading-relaxed font-mono">{actionFeedback}</p>
          </div>
          <button 
            onClick={() => setActionFeedback("")} 
            className="text-white/40 hover:text-white font-mono text-[10px] border border-white/10 hover:border-white/30 px-1 rounded transition-colors"
          >
            ✕
          </button>
        </div>
      )}
    </div>
  );
}
