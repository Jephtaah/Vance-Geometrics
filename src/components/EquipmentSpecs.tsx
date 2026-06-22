/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from "react";
import { EquipmentDetail } from "../types";
import { ShieldCheck, Cpu, Database, Disc, Settings, Sliders } from "lucide-react";

const REAL_EQUIPMENT: EquipmentDetail[] = [
  {
    id: "total-station",
    name: "Leica MS60 MultiStation",
    category: "optical",
    tagline: "High-precision robotic angle measurement & 3D laser scanner hybrid",
    description: "The world's first MultiStation, combining digital high-end total station optics with a fast 3D laser scanner. Capable of pinpointing a single millimeter over distances up to several kilometers under construction environments.",
    specifications: {
      "Angular Accuracy": "0.5 arc-seconds (Hz & V)",
      "Reflectorless Range": "2,000 meters pin-point laser",
      "Dynamic Lock Range": "800 meters robotic prism tracking",
      "Scan Rate": "up to 30,000 points/second 3D wave scanner",
      "Tilt Compensation": "Quadruple axis liquid compensator",
      "Dust/Water Resistance": "IP65 certified dust-tight & water jets resistance",
    },
    precisionMetric: "±0.5mm Angle + 1.0mm EDM Distance Accuracy Target",
    iconName: "Sliders",
    fieldReadyMsg: "Staged on carbon tribrach. Calibrated monthly using baseline NIST geodetic pillars to guarantee absolute alignment."
  },
  {
    id: "gps-rtk",
    name: "Trimble R12i GNSS Smart Antenna",
    category: "spatial",
    tagline: "Absolute geodetic positioning with magnetic tilt compensation",
    description: "Multi-constellation GPS and coordinate tracking antenna containing built-in inertial measurement units (IMUs). Allows our field crews to measure points at extreme tilt angles behind trees, walls, or sloped ditches with total coordinate validity.",
    specifications: {
      "GNSS Tracking": "672 Channels (GPS, GLONASS, Galileo, BeiDou, QZSS)",
      "RTK Precision": "8mm Horizontal / 15mm Vertical error margin",
      "Tilt Compensation": "Calibration-free IMU sensor up to 45 degree slope deflection",
      "Network Protocol": "NTRIP cellular streaming / UHF Base & Rover radio link",
      "Cold-Start Alignment": "< 10 seconds signal initialization",
      "Battery Life": "Up to 11.5 hours field execution",
    },
    precisionMetric: "RTK Horizontal: 8mm + 1 ppm RMS, Vertical: 15mm + 1 ppm RMS",
    iconName: "Cpu",
    fieldReadyMsg: "Mounted on standard 2.0m carbon fiber poles. Receives RTN corrections from local CORS reference hubs."
  },
  {
    id: "lidar-scanner",
    name: "FARO Focus Premium 3D Scanner",
    category: "optical",
    tagline: "High-speed terrestrial LiDAR scanner mapping millions of details",
    description: "Captures rapid 360-degree point clouds of plant environments, historical structure facades, interior concrete slabs, and roadway tunnels. Essential for creating perfect 'As-Built' Revit and CAD models with total dimensional assurance.",
    specifications: {
      "Scan Speed": "1,000,000 coordinate points / second",
      "Distance Accuracy": "±1.0 millimeter at 10 meters distance",
      "Laser Safety Class": "Eye-Safe Class 1 Laser (970nm wavelength)",
      "Point Spacing": "Sub-millimeter grid resolution at medium zoom",
      "Integrated Sensor": "Onboard GPS tracker, altimeter, and liquid-level balance",
      "Data Export": "Structured PTS / XYZ formats for direct CAD matching",
    },
    precisionMetric: "0.03 millimeter range noise resolution",
    iconName: "Database",
    fieldReadyMsg: "Staged on carbon fiber tripods. Incorporates automated target sphere alignment to combine multiple setups cleanly."
  },
  {
    id: "survey-drone",
    name: "DJI Matrice 350 RTK + DJI Zenmuse L2",
    category: "aerial",
    tagline: "Aerial mapping drone streaming georeferenced photogrammetry & LiDAR",
    description: "An industrial-grade autonomous mapping UAV outfitted with dual RTK coordinates antennas. Deploys advanced solid-state LiDAR sensors to penetrate woodland tree canopies and generate perfect topographic maps of rough undeveloped areas.",
    specifications: {
      "Aerial Positioning": "Double RTK Antennas (Real-time centimeter coordinate stream)",
      "Sensor Payload": "3-channel visual camera + 5-return solid-state LiDAR sensor",
      "Wind Coverage": "Resilient up to 12 meters/second gale forces",
      "Flight Duration": "45 Minutes per quad-rotor battery swap",
      "Positional Accuracy": "Horizontal: 1.5cm / Vertical: 2.0cm target (without ground markers)",
      "Coverage Density": "Up to 500 acres mapped per single flight loop",
    },
    precisionMetric: "Ground Sample Distance (GSD) of up to 0.4 inches per pixel",
    iconName: "Disc",
    fieldReadyMsg: "Monitored closely by FAAC Part 107 certified flight pilots, guided with physical Ground Control Points."
  }
];

export default function EquipmentSpecs() {
  const [activeItem, setActiveItem] = useState<string>("total-station");

  const currentEquipment = REAL_EQUIPMENT.find((eq) => eq.id === activeItem) || REAL_EQUIPMENT[0];

  return (
    <section id="equipment-section" className="py-20 bg-[#15231b] text-[#efebdf] relative overflow-hidden">
      {/* CAD technical subgrid layout */}
      <div className="absolute inset-0 cad-grid opacity-[0.03] pointer-events-none" />
      <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-brand-green-dark opacity-15 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 md:px-6 relative z-15">
        
        {/* Intro section */}
        <div className="mb-14 max-w-3xl flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-[#2d523d]/40 pb-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="h-1.5 w-1.5 rounded-full bg-brand-yellow"></span>
              <span className="text-brand-yellow uppercase text-xs font-mono font-bold tracking-widest text-[#ffd000]">Precision Machinery</span>
            </div>
            <h2 className="text-3xl md:text-5xl font-display font-medium text-white tracking-tight leading-none">
              Rigid Geodetic Field Hardware
            </h2>
            <p className="mt-4 text-sm text-[#efebdf]/70 leading-relaxed font-sans max-w-xl">
              We do not lease consumer tools. Our equipment list is carefully chosen to meet sub-millimeter tolerances for highway construction, utility grids, and property subdivisions.
            </p>
          </div>
          <div className="flex items-center gap-4 bg-brand-green-dark border border-brand-green-light/40 p-3 rounded font-mono text-xs">
            <div className="text-left">
              <span className="text-[9px] uppercase text-[#efebdf]/40 block">NIST Calibration Standard</span>
              <span className="text-brand-orange font-bold">ALTA/NSPS LEVEL 1 COMPLIANT</span>
            </div>
          </div>
        </div>

        {/* Dynamic selector Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          
          {/* Left panel selector buttons: 4 columns */}
          <div className="lg:col-span-4 flex flex-col gap-3">
            {REAL_EQUIPMENT.map((eq) => (
              <button
                key={eq.id}
                onClick={() => setActiveItem(eq.id)}
                className={`w-full text-left p-4 rounded-lg border transition-all duration-200 cursor-pointer flex flex-col ${activeItem === eq.id ? "bg-brand-green-mid text-white border-brand-orange shadow-md relative" : "bg-brand-concrete-dark text-slate-300 border-brand-green-light/35 hover:border-brand-green-light hover:bg-brand-green-dark"}`}
              >
                {/* Accent Orange Edge Tag */}
                {activeItem === eq.id && (
                  <div className="absolute top-0 bottom-0 left-0 w-1 bg-brand-orange rounded-l-lg" />
                )}
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[9px] font-mono uppercase tracking-wider text-brand-orange font-bold">
                    {eq.category.toUpperCase()} INSTRUMENT
                  </span>
                  <span className="text-[10px] font-mono opacity-50">
                    {activeItem === eq.id ? "ACTIVE VIEW" : "INSPECT SPEC"}
                  </span>
                </div>
                <span className="text-base font-display font-bold">
                  {eq.name}
                </span>
                <span className="text-xs opacity-70 font-sans truncate block mt-1.5 font-light">
                  {eq.tagline}
                </span>
              </button>
            ))}
          </div>

          {/* Right panel spec sheets: 8 columns */}
          <div className="lg:col-span-8 bg-brand-concrete-dark border border-brand-green-light rounded-lg p-6 md:p-8 flex flex-col justify-between shadow-xl relative">
            <div className="absolute bottom-4 right-4 text-[9px] font-mono opacity-15 pointer-events-none">
              GEODETIC EQUIPMENT MANUAL ID: {currentEquipment.id.toUpperCase()}-2026
            </div>
            
            {/* Spec Content Header */}
            <div>
              <div className="flex flex-col md:flex-row md:items-center justify-between border-b border-brand-green-light/35 pb-4 mb-6 gap-2">
                <div>
                  <span className="text-xs font-mono text-brand-orange font-bold font-mono">{currentEquipment.category.toUpperCase()} SENSOR DATA</span>
                  <h3 className="text-2xl font-display font-bold text-white mt-1">
                    {currentEquipment.name}
                  </h3>
                </div>
                {/* Calibration Standard Target Badge */}
                <div className="inline-flex flex-col bg-brand-green-dark/40 border border-brand-green-light/70 px-3 py-1.5 rounded text-left">
                  <span className="text-[8px] font-mono text-brand-yellow uppercase block font-bold leading-none mb-1">Tolerance Guarantee</span>
                  <span className="text-[11px] font-mono font-bold text-white whitespace-nowrap">{currentEquipment.precisionMetric}</span>
                </div>
              </div>

              {/* Tagline & main Description */}
              <p className="text-sm text-[#efebdf]/80 font-mono italic mb-4 leading-relaxed font-light">
                "{currentEquipment.tagline}"
              </p>
              <p className="text-sm text-[#efebdf]/70 font-sans leading-relaxed mb-6">
                {currentEquipment.description}
              </p>

              {/* Grid-based Parameter Datasheet */}
              <div className="bg-brand-green-dark/70 rounded-lg p-4 border border-brand-green-light/30">
                <span className="text-[10px] font-mono text-brand-orange uppercase block font-bold mb-3 tracking-widest">
                  Engineering Datasheet & Calibration Limits
                </span>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-2 text-xs font-mono">
                  {Object.entries(currentEquipment.specifications).map(([key, value]) => (
                    <div key={key} className="flex justify-between py-1.5 border-b border-brand-green-light/15 items-center">
                      <span className="text-[#efebdf]/45 uppercase text-[10px]">{key}</span>
                      <span className="text-white text-right font-medium">{value}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Field readiness disclaimer block */}
            <div className="mt-6 pt-5 border-t border-brand-green-light/30 flex flex-col sm:flex-row items-center sm:items-start gap-4 text-xs">
              <div className="p-2.5 bg-brand-orange/10 border border-brand-orange/30 text-brand-orange rounded-full">
                <ShieldCheck size={18} />
              </div>
              <div className="text-[#efebdf]/65 text-justify leading-relaxed">
                <span className="font-mono text-white text-[11px] font-bold block mb-1">Standard Calibration Protocol:</span>
                <p className="text-[11px]">{currentEquipment.fieldReadyMsg}</p>
              </div>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
}
