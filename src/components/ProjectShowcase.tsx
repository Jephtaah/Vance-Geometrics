/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from "react";
import { LandProject } from "../types";
import { Search, MapPin, Compass, FileCheck2, CalendarRange, Scale } from "lucide-react";

const COMPLETED_PROJECTS: LandProject[] = [
  {
    id: "proj-1",
    title: "Blackstone Residential Subdivision",
    location: "Snohomish County Plat Sector 12",
    date: "May 2026",
    serviceType: "Boundary & Plat Partitioning",
    areaAcres: 54.2,
    description: "Multi-lot residential CAD mapping of 120 residential subdivisions. Mapped steep forested slopes containing historical creeks, established physical iron-rod monument stakes at all lot corners, and successfully registered the official plat division with county recorders.",
    utmCoordinates: "E: 542,109.43 // N: 4,853,241.12",
    boundaryPointsCount: 42,
    status: "Completed",
    contourInterval: "1-foot Contours (US Survey Feet)"
  },
  {
    id: "proj-2",
    title: "Interstate Highway 80 Bypass Corridor",
    location: "Sutter Basin Utility Right-of-Way",
    date: "April 2026",
    serviceType: "Civil Construction Layout Staking",
    areaAcres: 112.5,
    description: "Absolute horizontal and vertical alignment tracing on concrete slope forms, drainage pipes, and bridge abutments for 4.2 miles of high-speed bypass. Configured double RTK base vectors to guarantee millimetric elevation control across grading machinery.",
    utmCoordinates: "E: 521,490.81 // N: 4,831,048.25",
    boundaryPointsCount: 184,
    status: "Completed",
    contourInterval: "0.5-foot Grading Contours"
  },
  {
    id: "proj-3",
    title: "BioPharm Industrial Plant Expansion",
    location: "South San Francisco Biotech Park",
    date: "March 2026",
    serviceType: "As-Built Terrestrial 3D Mapping",
    areaAcres: 8.4,
    description: "Terrestrial laser micro-scanning producing raw coordinate point clouds of elaborate structural column structures, overhead HVAC pipe racks, and precise concrete slab level evaluations. Generated perfect Autodesk Revit 3D models with sub-millimeter tolerances.",
    utmCoordinates: "E: 561,042.15 // N: 4,892,105.74",
    boundaryPointsCount: 12,
    status: "Completed",
    contourInterval: "Grid Cloud Mesh (1,200,000 pts/sqm)"
  },
  {
    id: "proj-4",
    title: "Windridge Valley Clean Energy Ranch",
    location: "Tejon Pass Ridge Boundary Sector",
    date: "June 2026",
    serviceType: "LiDAR Aerial Survey & Topography",
    areaAcres: 340.0,
    description: "Acquired high-density, multi-return LiDAR sensor data across rugged steep ridge lines for turbine location layouts. Deployed custom survey drones to bypass dangerous cliff faces, generating orthophotos and clean 2-foot topographic grids.",
    utmCoordinates: "E: 531,029.17 // N: 4,818,495.34",
    boundaryPointsCount: 78,
    status: "Active Field Phase",
    contourInterval: "2-foot Contour Interval model"
  }
];

export default function ProjectShowcase() {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState<"All" | "Boundary" | "Construction" | "3D Scanning">("All");

  const filteredProjects = COMPLETED_PROJECTS.filter((proj) => {
    // Search matcher
    const matchesSearch = 
      proj.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      proj.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
      proj.serviceType.toLowerCase().includes(searchTerm.toLowerCase());

    if (activeTab === "All") return matchesSearch;
    if (activeTab === "Boundary") return matchesSearch && proj.serviceType.includes("Boundary");
    if (activeTab === "Construction") return matchesSearch && proj.serviceType.includes("Construction");
    if (activeTab === "3D Scanning") return matchesSearch && proj.serviceType.includes("As-Built");

    return matchesSearch;
  });

  return (
    <section id="project-showcase-section" className="py-20 bg-[#faf8f5] text-[#222925] border-t border-brand-clay/70">
      <div className="max-w-7xl mx-auto px-4 md:px-6">

        {/* Section Heading */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="h-1 bg-brand-orange w-8"></span>
              <span className="text-brand-green-mid uppercase text-xs font-mono font-bold tracking-widest">Selected Portfolios</span>
            </div>
            <h2 className="text-3xl md:text-5xl font-display font-medium text-brand-green-dark tracking-tight leading-none">
              Rigorous Field Records
            </h2>
            <p className="mt-3 text-sm text-stone-600 leading-relaxed font-sans max-w-xl">
              Take a physical look at completed legal surveys and civil engineering staking operations. Rigorously referenced to geodetic tie-points.
            </p>
          </div>

          {/* Tab Selector Filters */}
          <div className="flex flex-wrap gap-2 text-xs font-mono">
            {["All", "Boundary", "Construction", "3D Scanning"].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab as any)}
                className={`px-3 py-1.5 rounded transition-all cursor-pointer ${activeTab === tab ? "bg-[#1c3326] text-white font-bold" : "bg-[#eff1f0] text-[#222925]/70 hover:bg-brand-clay/50"}`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        {/* Dynamic Project Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {filteredProjects.map((proj) => (
            <div 
              key={proj.id}
              className="bg-white border border-brand-clay/80 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
            >
              
              {/* Card Header & Georeference metadata */}
              <div className="bg-brand-concrete-light p-4 border-b border-brand-clay/40 font-mono text-[10.5px] text-stone-500 flex justify-between items-center">
                <div className="flex items-center gap-1.5">
                  <Compass size={12} className="text-brand-orange animate-spin-slow" />
                  <span className="font-bold text-brand-green-mid uppercase">COORD_REF // WGS84</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className={`h-2 w-2 rounded-full ${proj.status === "Completed" ? "bg-emerald-600" : "bg-amber-600"}`}></span>
                  <span className="font-semibold text-brand-green-dark">{proj.status.toUpperCase()}</span>
                </div>
              </div>

              {/* Main Content Area */}
              <div className="p-6 md:p-8 flex-1">
                <div className="flex items-center gap-1 text-xs text-brand-orange font-mono font-bold mb-2">
                  <CalendarRange size={12} />
                  <span>PUBLISHED IN CAD: {proj.date.toUpperCase()}</span>
                </div>
                
                <h3 className="text-xl md:text-2xl font-display font-bold text-brand-green-dark leading-tight mb-2">
                  {proj.title}
                </h3>

                <div className="flex items-center gap-1 text-xs text-stone-500 font-sans mb-4">
                  <MapPin size={13} className="text-brand-concrete-mid" />
                  <span>{proj.location}</span>
                </div>

                <p className="text-sm text-stone-600 leading-relaxed font-sans mb-6">
                  {proj.description}
                </p>

                {/* Grid metrics details */}
                <div className="grid grid-cols-2 gap-4 bg-[#fbfaf7] p-4 rounded border border-brand-clay/40 text-xs font-mono">
                  <div className="border-r border-brand-clay/60 pr-2">
                    <span className="text-[9px] uppercase text-stone-400 block font-bold">Survey Scope Category</span>
                    <span className="text-[#222925] font-semibold block truncate">{proj.serviceType}</span>
                  </div>
                  <div className="pl-2">
                    <span className="text-[9px] uppercase text-stone-400 block font-bold">Map Contour Limits</span>
                    <span className="text-[#222925] font-semibold block truncate">{proj.contourInterval}</span>
                  </div>
                  <div className="border-r border-brand-clay/60 pr-2 pt-2 border-t">
                    <span className="text-[9px] uppercase text-stone-400 block font-bold">Total Acreage Scale</span>
                    <span className="text-[#222925] font-semibold block">{proj.areaAcres.toFixed(1)} Acres</span>
                  </div>
                  <div className="pl-2 pt-2 border-t">
                    <span className="text-[9px] uppercase text-stone-400 block font-bold">Boundary Node Markers</span>
                    <span className="text-[#222925] font-semibold block">{proj.boundaryPointsCount} Survey Points</span>
                  </div>
                </div>

              </div>

              {/* Card Footer coordinates stream bar */}
              <div className="bg-[#121c17] text-[#efebdf]/50 p-3 px-6 border-t border-brand-clay font-mono text-[10px] sm:text-[11px] flex justify-between items-center">
                <div className="truncate pr-4 text-brand-yellow font-bold">
                  {proj.utmCoordinates}
                </div>
                <div className="text-right text-white/40 whitespace-nowrap">
                  EPSG: 32610
                </div>
              </div>

            </div>
          ))}
        </div>

        {/* Search tool for other plats / records */}
        <div className="mt-14 bg-white border border-brand-clay p-6 rounded-lg shadow-sm flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="max-w-sm">
            <h4 className="text-sm font-mono uppercase text-brand-orange font-bold tracking-wider">County Deeds Search Helper</h4>
            <p className="text-xs text-stone-500 font-sans mt-1">
              Have an existing historical plat or parcel ID? Input keyword details to search our digital baseline records.
            </p>
          </div>
          <div className="w-full md:w-auto flex-1 max-w-md relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" size={16} />
            <input
              type="text"
              placeholder="Enter City, Plat Lot, Subdivision Name, or Deed Reference..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-[#fbfaf7] border border-brand-clay rounded pl-10 pr-4 py-2 text-xs font-mono text-[#222925] focus:outline-none focus:border-brand-green-mid focus:bg-white"
            />
          </div>
          {searchTerm && (
            <button
              onClick={() => setSearchTerm("")}
              className="px-2.5 py-1.5 bg-brand-concrete-light border border-brand-clay rounded text-xs font-mono text-stone-600 hover:bg-stone-200 transition-colors"
            >
              Reset Search Filter
            </button>
          )}
        </div>

      </div>
    </section>
  );
}
