/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef } from "react";
import { 
  Building, 
  ChevronRight, 
  Compass, 
  MapPin, 
  Navigation, 
  Layers, 
  PhoneCall, 
  ClipboardCheck, 
  FileBadge, 
  Crosshair, 
  Upload, 
  CheckCircle, 
  ExternalLink,
  ShieldAlert,
  ArrowRight,
  Info
} from "lucide-react";

// Import custom sub-components
import CoordinateSurveyorCanvas from "./components/CoordinateSurveyorCanvas";
import ServicesGrid from "./components/ServicesGrid";
import EquipmentSpecs from "./components/EquipmentSpecs";
import ProjectShowcase from "./components/ProjectShowcase";

// Import generated assets so Vite can bundle them safely
// @ts-ignore
import surveyorHero from "./assets/images/surveyor_hero_1781478062212.jpg";
// @ts-ignore
import totalStation from "./assets/images/total_station_1781478077019.jpg";
// @ts-ignore
import droneTopo from "./assets/images/drone_topo_1781478090820.jpg";

const SURVEYOR_HERO_PATH = surveyorHero;
const TOTAL_STATION_PATH = totalStation;
const DRONE_TOPO_PATH = droneTopo;

export default function App() {
  // Contact and File Upload form states
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    subjectAddress: "",
    surveyType: "boundary",
    terrainType: "wooded",
    estimatedArea: "",
    additionalDetails: ""
  });
  
  const [fileDetails, setFileDetails] = useState<{ name: string; size: string } | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [isSubmitSuccess, setIsSubmitSuccess] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // Drag and Drop implementation for files
  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      setFileDetails({
        name: file.name,
        size: (file.size / (1024 * 1024)).toFixed(2) + " MB"
      });
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setFileDetails({
        name: file.name,
        size: (file.size / (1024 * 1024)).toFixed(2) + " MB"
      });
    }
  };

  const triggerFileSearch = () => {
    if (fileInputRef.current) fileInputRef.current.click();
  };

  // Simulated lead intake processing with invoice breakdown output
  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setTimeout(() => {
      setSubmitting(false);
      setIsSubmitSuccess(true);
    }, 1500);
  };

  return (
    <div id="survey-branding-root" className="min-h-screen bg-brand-sand-light text-brand-green-mid font-sans antialiased selection:bg-brand-orange selection:text-white">
      
      {/* 1. BRAND GLOBAL HEADER */}
      <header className="sticky top-0 z-40 bg-[#0f1c14] text-white border-b border-[#2d523d]/30 backdrop-blur-md bg-opacity-95 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 md:px-6 h-16 flex items-center justify-between">
          
          {/* Logo with technical crosshair accent */}
          <a href="#" className="flex items-center gap-3 group">
            <div className="h-10 w-10 rounded bg-brand-orange text-white flex items-center justify-center border border-white/10 shrink-0 relative overflow-hidden">
              <Crosshair size={22} className="group-hover:rotate-90 transition-transform duration-500 text-white" />
              {/* Corner brackets */}
              <div className="absolute top-0.5 left-0.5 text-[6px] font-mono leading-none opacity-50 select-none">{"["}</div>
              <div className="absolute bottom-0.5 right-0.5 text-[6px] font-mono leading-none opacity-50 select-none">{"]"}</div>
            </div>
            <div className="flex flex-col text-left">
              <span className="font-display font-bold text-sm tracking-tight uppercase leading-tight sm:block hidden">
                Vance Geomatics
              </span>
              <span className="font-display font-medium text-xs text-brand-orange font-bold tracking-tight uppercase leading-tight sm:hidden block">
                Vance Surveys
              </span>
              <span className="font-mono text-[9px] text-[#efebdf]/60 tracking-wider font-light leading-none">
                LICENSED PROFESSIONAL LAND SURVEYORS
              </span>
            </div>
          </a>

          {/* Navigation Links */}
          <nav className="hidden md:flex items-center gap-6 font-mono text-[11px] font-bold tracking-wide text-[#efebdf]/85">
            <a href="#services-overview-section" className="hover:text-brand-orange transition-colors">CAPABILITIES</a>
            <a href="#about-authority-section" className="hover:text-brand-orange transition-colors">ACCURACY INDEX</a>
            <a href="#survey-plotter-section" className="hover:text-brand-orange transition-all flex items-center gap-1 bg-[#1c3326] px-2.5 py-1 rounded border border-[#2d523d]/50 text-white hover:border-brand-orange">
              <span className="h-1.5 w-1.5 bg-brand-orange rounded-full animate-pulse"></span>
              CAD PLOTTER SANDBOX
            </a>
            <a href="#equipment-section" className="hover:text-brand-orange transition-colors">FIELD INVENTORY</a>
            <a href="#project-showcase-section" className="hover:text-brand-orange transition-colors">COMPLETED PLATS</a>
          </nav>

          {/* Quick Quote CTA Action */}
          <div className="flex items-center gap-3">
            <a 
              href="tel:+18005557878" 
              className="px-3 py-1.5 bg-transparent border border-[#2d523d]/60 rounded text-xs font-mono font-bold text-[#efebdf] hover:border-[#efebdf] transition-colors md:flex hidden items-center gap-1.5"
            >
              <PhoneCall size={12} className="text-brand-orange" />
              800-555-[7878]
            </a>
            <a 
              href="#survey-plotter-section" 
              className="px-4 py-2 bg-brand-orange hover:bg-brand-orange-hover text-white rounded text-xs font-mono font-bold text-center uppercase tracking-wider transition-all shadow"
            >
              Open CAD Sandbox
            </a>
          </div>

        </div>
      </header>

      {/* 2. FIELD SURVEYS HERO BANNER */}
      <section className="bg-[#0f1c14] text-white relative py-20 lg:py-28 overflow-hidden border-b-2 border-brand-orange">
        
        {/* CAD Blueprint background pattern */}
        <div className="absolute inset-0 cad-grid-dark opacity-10 pointer-events-none" />
        <div className="absolute -left-16 bottom-0 top-0 w-80 bg-gradient-to-r from-black/50 to-transparent pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 md:px-6 relative z-10">
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* HERO LEFT: Structured precise copy details */}
            <div className="lg:col-span-7 flex flex-col items-start text-left">
              
              {/* Surveyor Badge indicator */}
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#1c3326] border border-[#2d523d] rounded-full mb-6 font-mono text-[10.5px]">
                <span className="h-2 w-2 rounded-full bg-brand-yellow"></span>
                <span className="text-[#efebdf]/90 font-bold uppercase tracking-wider">
                  Licensed Civil & Geodetic Surveyors // WGS84 Certified
                </span>
              </div>
              
              <h1 className="text-4xl md:text-6xl font-display font-medium text-white tracking-tight leading-none mb-6">
                Boundary Precision.<br />
                <span className="text-[#faf8f5]/55 font-light">Earthy Certainty.</span><br />
                <span className="text-brand-orange font-bold">No Spatial Compromises.</span>
              </h1>
              
              {/* Blueprint Divider Line */}
              <div className="w-full h-px bg-gradient-to-r from-brand-orange to-transparent mb-6 block" />

              <p className="text-[#efebdf]/80 text-base md:text-lg font-sans leading-relaxed max-w-xl mb-8">
                Since 1998, developers, municipal agencies, and residential property owners have trusted Vance Geomatics to locate the truth. We trace physical lines, establish legal boundaries, and map terrain structures with rigorous, county-compliant ALTA/NSPS survey certifications.
              </p>

              {/* Real World Metrics stats overlay */}
              <div className="grid grid-cols-3 gap-6 bg-[#0c140f] p-4 rounded-lg border border-[#2d523d] w-full max-w-lg mb-8 font-mono">
                <div>
                  <span className="text-[10px] text-stone-400 uppercase block">Error Limit Target</span>
                  <span className="text-lg font-bold text-brand-orange font-mono">&lt; 0.01ft</span>
                  <span className="text-[9px] text-[#efebdf]/50 block">Horizontal Deviation</span>
                </div>
                <div className="border-l border-[#2d523d]/60 pl-4">
                  <span className="text-[10px] text-stone-400 uppercase block">In-Field Records</span>
                  <span className="text-lg font-bold text-white font-mono">14,200+</span>
                  <span className="text-[9px] text-[#efebdf]/50 block">Completed Plats</span>
                </div>
                <div className="border-l border-[#2d523d]/60 pl-4">
                  <span className="text-[10px] text-stone-400 uppercase block">Registered PLS</span>
                  <span className="text-lg font-bold text-brand-yellow font-mono">A-State Certified</span>
                  <span className="text-[9px] text-[#efebdf]/50 block">Sealed Documents</span>
                </div>
              </div>

              {/* Action Buttons trigger */}
              <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
                <a 
                  href="#survey-plotter-section" 
                  className="px-6 py-3 bg-brand-orange hover:bg-brand-orange-hover text-white rounded font-mono font-bold text-center text-xs tracking-wider uppercase transition-all shadow-md flex items-center justify-center gap-2"
                >
                  Interactive CAD Plotter
                  <ArrowRight size={14} />
                </a>
                <a 
                  href="#equipment-section" 
                  className="px-6 py-3 bg-brand-green-mid hover:bg-brand-green-light text-[#efebdf] border border-brand-green-light hover:border-brand-orange/40 rounded font-mono text-center text-xs tracking-wider uppercase transition-all flex items-center justify-center gap-1.5"
                >
                  <span>Sensor Calibration Data</span>
                </a>
              </div>

            </div>

            {/* HERO RIGHT: The Real World Field Work photo layout */}
            <div className="lg:col-span-5 relative">
              <div className="relative border-4 border-[#2d523d] p-1 bg-[#0b130e] rounded-lg shadow-2xl overflow-hidden aspect-[4/3] w-full">
                {/* Image element with required attributes */}
                <img 
                  src={SURVEYOR_HERO_PATH} 
                  alt="Land Surveyor in open grasses terrain using high-visibility vest and GPS RTK receiver tripod antenna" 
                  className="w-full h-full object-cover rounded opacity-90 hover:scale-105 transition-transform duration-700"
                  referrerPolicy="no-referrer"
                />
                
                {/* Visual HUD coordinate system mockup */}
                <div className="absolute top-4 left-4 bg-black/70 backdrop-blur-sm border border-[#2d523d] p-3 rounded font-mono text-[10px] text-[#efebdf]/90 select-none flex flex-col gap-1">
                  <div className="text-brand-orange font-bold font-mono tracking-widest uppercase">GPS NETWORK LIVE</div>
                  <div>SATELLITES IN FOCUS: 24 (L1/L2)</div>
                  <div>COORD S_DEVIATION: 0.004 m</div>
                  <div className="text-stone-400 uppercase">E: 542,150 // N: 4,853,240</div>
                </div>

                <div className="absolute bottom-4 right-4 bg-brand-orange/90 text-white font-mono font-bold text-[9px] uppercase py-1 px-2.5 rounded tracking-widest">
                  ALTA LEVEL 1 VERIFIED
                </div>
              </div>
              
              {/* Subtle background tech coordinates element decoration */}
              <div className="absolute -bottom-8 -right-8 h-24 w-24 border-b border-r border-[#2d523d]/60 hidden sm:block" />
              <div className="absolute -top-6 -left-6 h-12 w-12 border-t border-l border-[#2d523d]/60 hidden sm:block" />
            </div>

          </div>

        </div>
      </section>

      {/* 3. CORE SERVICES SUB-COMPONENTS */}
      <ServicesGrid />

      {/* 4. WHY CHOOSE US / ACCURACY AUTHORITY SECTION */}
      <section id="about-authority-section" className="py-20 bg-brand-concrete-light text-[#222925] border-t border-b border-brand-clay/60 relative">
        <div className="absolute inset-0 cad-grid opacity-[0.02] pointer-events-none" />
        
        <div className="max-w-7xl mx-auto px-4 md:px-6 relative z-10">
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Left: Detail Info and trust columns */}
            <div className="lg:col-span-5 relative">
              <div className="relative border-4 border-brand-clay/80 p-1 bg-[#1c3326] rounded-lg shadow-xl overflow-hidden aspect-[4/3] w-full">
                <img 
                  src={TOTAL_STATION_PATH} 
                  alt="Industrial robotic total station tripod instrument set up on a raw construction site blueprint slab background" 
                  className="w-full h-full object-cover rounded opacity-90 transition-opacity hover:opacity-100"
                  referrerPolicy="no-referrer"
                />
                
                {/* Lens focus overlays */}
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-40">
                  <div className="h-28 w-28 border border-brand-orange rounded-full flex items-center justify-center">
                    <div className="h-6 w-6 border border-brand-orange flex items-center justify-center rounded-full">
                      <div className="h-1 w-1 bg-brand-orange rounded-full" />
                    </div>
                  </div>
                </div>

                <div className="absolute top-4 right-4 bg-[#0a110d] text-brand-yellow font-mono text-[9px] border border-[#2d523d] py-1 px-2 rounded">
                  LASER PLUMMET AXIS COMPLIANT
                </div>
              </div>
            </div>

            {/* Right: Sub-millimeter error budget description */}
            <div className="lg:col-span-7 flex flex-col items-start">
              <div className="flex items-center gap-2 mb-2">
                <span className="h-1 bg-brand-orange w-8"></span>
                <span className="text-brand-green-mid uppercase text-xs font-mono font-bold tracking-widest">Authority & Standard Standards</span>
              </div>
              <h2 className="text-3xl md:text-5xl font-display font-medium text-brand-green-dark tracking-tight leading-none mb-6">
                How We Guarantee Absolute Geodetic Accuracy
              </h2>
              <p className="text-stone-600 font-sans text-sm md:text-base leading-relaxed mb-6">
                Unlike architectural firms or real-estate agents that estimate boundaries based on GIS maps, our team works directly in the physical earth structure. We reconcile discrepancies between decades-old written descriptions and the real physical coordinates using physical calculations.
              </p>

              {/* 4 Trust Quadrants list */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 w-full">
                
                <div className="flex gap-3 items-start">
                  <div className="p-2 bg-[#1c3326] text-white rounded shrink-0">
                    <FileBadge size={16} className="text-brand-yellow" />
                  </div>
                  <div>
                    <span className="font-display font-bold text-sm text-brand-green-dark block">Licensed PLS Seal</span>
                    <span className="text-xs text-stone-600 font-sans">Every boundary plat we draw is sealed and certified under direct Land Surveyor licensing codes, making them legally binding document submissions.</span>
                  </div>
                </div>

                <div className="flex gap-3 items-start">
                  <div className="p-2 bg-[#1c3326] text-white rounded shrink-0">
                    <ClipboardCheck size={16} className="text-brand-orange" />
                  </div>
                  <div>
                    <span className="font-display font-bold text-sm text-brand-green-dark block">Rigorous Deed Reconstruction</span>
                    <span className="text-xs text-stone-600 font-sans">We dig through historical records, county vaults, and adjoining parcel registers to trace your tract original chain of title prior to stepping into the mud.</span>
                  </div>
                </div>

                <div className="flex gap-3 items-start">
                  <div className="p-2 bg-[#1c3326] text-white rounded shrink-0">
                    <Navigation size={16} className="text-white" />
                  </div>
                  <div>
                    <span className="font-display font-bold text-sm text-brand-green-dark block">Dual Rover RTK GPS</span>
                    <span className="text-xs text-stone-600 font-sans">Utilizing advanced GPS, GLONASS, and Galileo satellite links simultaneously to resolve geographical points with less than 1-centimeter error deviation.</span>
                  </div>
                </div>

                <div className="flex gap-3 items-start">
                  <div className="p-2 bg-[#1c3326] text-white rounded shrink-0">
                    <Layers size={16} className="text-brand-yellow" />
                  </div>
                  <div>
                    <span className="font-display font-bold text-sm text-brand-green-dark block">ALTA / NSPS Alignment</span>
                    <span className="text-xs text-stone-600 font-sans">Adhering strictly to national boundary guidelines. We map physical features, structural encroachments, overhead wires, and deep utilities.</span>
                  </div>
                </div>

              </div>
            </div>

          </div>

        </div>
      </section>

      {/* 5. INTERACTIVE SANDBOX COMPONENT SECTION */}
      <CoordinateSurveyorCanvas />

      {/* 6. STEP BY STEP PROCESS */}
      <section className="py-20 bg-[#faf8f5] text-[#222925] border-b border-brand-clay/60">
        <div className="max-w-7xl mx-auto px-4 md:px-6">
          
          {/* Section title */}
          <div className="mb-14 text-center max-w-2xl mx-auto">
            <div className="inline-flex items-center gap-2 mb-2">
              <span className="h-1 bg-brand-orange w-4"></span>
              <span className="text-brand-green-mid uppercase text-xs font-mono font-bold tracking-widest">Workflow Pipeline</span>
              <span className="h-1 bg-brand-orange w-4"></span>
            </div>
            <h2 className="text-3xl md:text-5xl font-display font-medium text-brand-green-dark tracking-tight leading-none">
              Rigid Chain of Verification
            </h2>
            <p className="mt-4 text-sm text-stone-600 leading-relaxed font-sans">
              Surveying raw land requires a sequential mathematical process. Here is how our field crews and cad technicians secure your boundary measurements.
            </p>
          </div>

          {/* 4 Process blocks representation */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 relative">
            
            {/* Step 1 */}
            <div className="bg-white border border-brand-clay rounded-lg p-5 relative shadow-sm hover:shadow transition-shadow">
              <div className="absolute -top-4 left-6 bg-brand-green-dark text-brand-orange text-xs font-mono font-bold px-3 py-1 rounded-full border border-[#2d523d]">
                PHASE 01
              </div>
              <div className="mt-3">
                <span className="text-[10px] font-mono uppercase text-stone-400 block font-bold mb-1">Office Audits</span>
                <span className="text-[15px] font-display font-bold text-brand-green-dark block mb-2">Historical Deed Research</span>
                <p className="text-xs text-stone-600 font-sans leading-relaxed">
                  We locate courthouse deeds, historic parcel maps, adjoining easements, and regional baseline control monuments to construct a perfect theoretical outline of your parcel lines.
                </p>
              </div>
            </div>

            {/* Step 2 */}
            <div className="bg-white border border-brand-clay rounded-lg p-5 relative shadow-sm hover:shadow transition-shadow">
              <div className="absolute -top-4 left-6 bg-brand-green-dark text-brand-yellow text-xs font-mono font-bold px-3 py-1 rounded-full border border-[#2d523d]">
                PHASE 02
              </div>
              <div className="mt-3">
                <span className="text-[10px] font-mono uppercase text-stone-400 block font-bold mb-1">Field Mobilization</span>
                <span className="text-[15px] font-display font-bold text-brand-green-dark block mb-2">Physical Traverse & Scans</span>
                <p className="text-xs text-stone-600 font-sans leading-relaxed">
                  Field crews arrive with total stations, robust tripods, and satellite antennas. We hunt down physical iron monuments buried in soil and map slopes, ditches, structure offsets, and contours.
                </p>
              </div>
            </div>

            {/* Step 3 */}
            <div className="bg-white border border-brand-clay rounded-lg p-5 relative shadow-sm hover:shadow transition-shadow">
              <div className="absolute -top-4 left-6 bg-brand-green-dark text-white text-xs font-mono font-bold px-3 py-1 rounded-full border border-[#2d523d]">
                PHASE 03
              </div>
              <div className="mt-3">
                <span className="text-[10px] font-mono uppercase text-stone-400 block font-bold mb-1">Geodetic Calculations</span>
                <span className="text-[15px] font-display font-bold text-brand-green-dark block mb-2">Traverse Least Squares Adjustment</span>
                <p className="text-xs text-stone-600 font-sans leading-relaxed">
                  Back in the engineering office, we feed physical field records into geodetic coordinate grids. We balance spatial traverse margins to resolve micro-errors and confirm absolute closing accuracy.
                </p>
              </div>
            </div>

            {/* Step 4 */}
            <div className="bg-white border border-brand-orange/40 rounded-lg p-5 relative shadow-sm hover:shadow transition-shadow border-r-4 border-r-brand-orange">
              <div className="absolute -top-4 left-6 bg-brand-orange text-white text-xs font-mono font-bold px-3 py-1 rounded-full">
                DELIVERY
              </div>
              <div className="mt-3">
                <span className="text-[10px] font-mono uppercase text-brand-orange block font-bold mb-1">Sealed Plats</span>
                <span className="text-[15px] font-display font-bold text-brand-green-dark block mb-2">Certified Record filing</span>
                <p className="text-xs text-stone-600 font-sans leading-relaxed">
                  You receive legally signed, stamped plat prints for property deeds filings, combined with raw AutoCAD DWG / LandXML files for direct civil engineering blueprint matching.
                </p>
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* 7. HIGH RES HARDWARE INVENTORY IN USE */}
      <EquipmentSpecs />

      {/* 8. RIGOROUS COMPLETED PROJECTS PORTFOLIO */}
      <ProjectShowcase />

      {/* 9. DRONE AERIAL TOPOGRAPHY COMPLEMENTARY */}
      <section className="py-24 bg-[#121c17] text-white relative overflow-hidden">
        {/* Topo lines backdrop */}
        <div className="absolute inset-0 topo-lines opacity-10 pointer-events-none" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent pointer-events-none" />
        
        <div className="max-w-7xl mx-auto px-4 md:px-6 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Descriptive block */}
            <div className="lg:col-span-6 flex flex-col items-start text-left">
              <span className="text-xs font-mono text-brand-orange font-bold uppercase tracking-widest bg-[#1c3326] px-2.5 py-1 rounded border border-[#2d523d] mb-4">
                Aerial Reconnaissance Data
              </span>
              <h2 className="text-3xl md:text-5xl font-display font-bold text-white tracking-tight leading-none mb-6">
                Rapid High-Density Drone LiDAR Operations
              </h2>
              <p className="text-sm md:text-base text-[#efebdf]/80 font-sans leading-relaxed mb-6">
                For massive commercial ranch boundaries, steep canyon structures, and splayed solar corridor alignments, physical ground traverses are highly hazardous and time-consuming. 
              </p>
              <p className="text-sm md:text-base text-[#efebdf]/70 font-sans leading-relaxed mb-8">
                Our autonomous aerial UAS setups fly targeted patterns, shooting millions of georeferenced solid-state laser returns per square meter. This pierces through heavy brush branches to extract flawless topographic ground models with zero guessing.
              </p>
              
              <div className="bg-[#0b130f] border border-[#2d523d] rounded p-4 font-mono text-xs text-brand-yellow flex items-center gap-3">
                <Info size={18} className="text-brand-orange shrink-0 animate-pulse" />
                <span>FAA Part 107 Commercial Flight Authorization completely insured. Full RTK integration bypasses traditional survey timeline bottleneck.</span>
              </div>
            </div>

            {/* Beautiful visual image box */}
            <div className="lg:col-span-6">
              <div className="relative border-4 border-[#2d523d] p-1 bg-[#0b130e] rounded-lg shadow-2xl overflow-hidden aspect-[16/9] w-full">
                <img 
                  src={DRONE_TOPO_PATH} 
                  alt="Overhead topographic drone drone contours sweep scanning high production value" 
                  className="w-full h-full object-cover rounded opacity-80"
                  referrerPolicy="no-referrer"
                />
                
                {/* HUD controls simulation */}
                <div className="absolute bottom-3 left-4 bg-black/60 backdrop-blur-xs p-2 text-[10px] font-mono text-stone-300 rounded border border-[#2d523d]/40 select-none">
                  LIDAR POINT CLOUD DENSITY: 1.2M PTS/M²
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>



      {/* 11. DETAILED BRAND FOOTER */}
      <footer className="bg-[#0f1c14] text-[#efebdf]/85 border-t-4 border-brand-orange py-14">
        <div className="max-w-7xl mx-auto px-4 md:px-6">
          
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 mb-12 border-b border-[#2d523d]/20 pb-12">
            
            {/* Column 1: Info */}
            <div className="md:col-span-5 flex flex-col items-start">
              <div className="flex items-center gap-3 mb-4">
                <div className="h-9 w-9 rounded bg-brand-orange text-white flex items-center justify-center">
                  <Crosshair size={18} />
                </div>
                <div className="flex flex-col text-left">
                  <span className="font-display font-bold text-sm tracking-tight text-white uppercase leading-none">
                    Vance Geomatics
                  </span>
                  <span className="text-[8.5px] font-mono text-[#efebdf]/50 leading-none mt-1">
                    ESTABLISHED IN 1998
                  </span>
                </div>
              </div>
              <p className="text-xs text-[#efebdf]/70 leading-relaxed font-sans text-justify mb-6">
                Vance Geomatics & Geodetic Measurement, LLC is a state-regulated land surveying enterprise providing high-fidelity residential plats, heavy civil utility stakes, and 3D drone laser scanning. 
              </p>
              <div className="font-mono text-[9.5px] text-[#efebdf]/50 flex flex-col gap-1 text-left">
                <span>NIST CONTROL REFERENCE PILLAR STANDARD</span>
                <span className="text-brand-orange font-bold">STATE CERTIFICATION CODE: PLS-78402 / SEATTLE AREA</span>
              </div>
            </div>

            {/* Column 2: Links */}
            <div className="md:col-span-3 flex flex-col text-left font-mono text-xs">
              <span className="text-brand-orange font-bold uppercase text-[10.5px] tracking-wider mb-4">Geodetic Services</span>
              <ul className="space-y-2 text-[#efebdf]/75">
                <li><a href="#services-overview-section" className="hover:text-brand-orange transition-colors">Residential Boundary Surveys</a></li>
                <li><a href="#services-overview-section" className="hover:text-brand-orange transition-colors">Topographic Elevation Mapping</a></li>
                <li><a href="#services-overview-section" className="hover:text-brand-orange transition-colors">Civil Construction Staking</a></li>
                <li><a href="#services-overview-section" className="hover:text-brand-orange transition-colors">As-Built Terrestrial scan</a></li>
                <li><a href="#services-overview-section" className="hover:text-brand-orange transition-colors">Drone Aerial LiDAR Point Clouds</a></li>
              </ul>
            </div>

            {/* Column 3: Contact details */}
            <div className="md:col-span-4 flex flex-col text-left font-mono text-xs">
              <span className="text-brand-orange font-bold uppercase text-[10.5px] tracking-wider mb-4 font-mono">Office Baselines</span>
              <ul className="space-y-3 text-[#efebdf]/75">
                <li className="flex items-start gap-2">
                  <MapPin size={14} className="text-brand-orange shrink-0 mt-0.5" />
                  <span>Main dispatch: 4120 Stone Way N, Suite 210, Seattle, WA 98103</span>
                </li>
                <li className="flex items-center gap-2">
                  <PhoneCall size={14} className="text-brand-orange shrink-0" />
                  <span>Geodetic Dispatch: +1 (800) 555-7878</span>
                </li>
                <li className="flex items-center gap-2 text-brand-yellow font-bold">
                  <Building size={14} className="shrink-0" />
                  <span>Working Hours: Mon - Fri // 0700 to 1630 PST</span>
                </li>
              </ul>
            </div>

          </div>

          {/* Footer Copyright */}
          <div className="flex flex-col sm:flex-row items-center justify-between text-[10px] font-mono text-[#efebdf]/40 gap-4">
            <div>
              &copy; {new Date().getFullYear()} Vance Geomatics & Geodetic Measurement, LLC. All georeferenced coordinate data, map drawings, and certified seals protected under state and national professional land surveyor acts.
            </div>
            <div className="flex gap-4">
              <span className="hover:text-white transition-colors">COORD_SYSTEM: NAD83_ZONE10</span>
              <span>•</span>
              <span className="hover:text-white transition-colors">LICENSED SEALS: VALID</span>
            </div>
          </div>

        </div>
      </footer>

    </div>
  );
}
