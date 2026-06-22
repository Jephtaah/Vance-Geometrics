/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Activity, ShieldAlert, Compass, Globe, Layers, MapPin, Navigation, Settings } from "lucide-react";
import { ServiceDetail } from "../types";

const REAL_SERVICES: ServiceDetail[] = [
  {
    id: "boundary",
    title: "Boundary & Land Title Surveys",
    description: "Establish official, legal boundaries of properties by investigating historic deeds, locating physical monuments, and staking precise property offsets for fence, structure planning, or transactions.",
    iconName: "Compass",
    basePrice: 850,
    pricePerSqFt: 0.005,
    typicalTimeframe: "3 - 5 Business Days",
    deliverables: [
      "Certified Staked Boundary Corners",
      "County-Recorded Plat/Map of Survey",
      "Digital DWG / LandXML CAD Vector Files",
      "Official Metes & Bounds Description Report"
    ]
  },
  {
    id: "topo",
    title: "Topographic & Contour Mapping",
    description: "Measure elevations, slopes, tree locations, structures, and utility features to produce detailed counter-maps. Vital for Civil Engineers, architects, and site developers preparing drainage or grading designs.",
    iconName: "Layers",
    basePrice: 1200,
    pricePerSqFt: 0.008,
    typicalTimeframe: "5 - 7 Business Days",
    deliverables: [
      "1-foot or 2-foot Contour Interval maps",
      "3D Digital Terrain Model (DTM) Mesh",
      "Tree Canopy, Utility & Structure Locations",
      "Grading and Drainage Vector Profiles"
    ]
  },
  {
    id: "construction",
    title: "Construction Layout & Civil Staking",
    description: "Ensure buildings, highway corridors, sewer lines, and structural foundations are built exactly where the design plans specify. We transfer coordinate offsets from paper blueprints onto the physical ground.",
    iconName: "MapPin",
    basePrice: 1500,
    pricePerSqFt: 0.004,
    typicalTimeframe: "Varies by Project Milestone",
    deliverables: [
      "Foundation Offset & Pile Stakeout",
      "Utility Alignment & Gradient Marks",
      "As-Built Survey Audits & Tolerances Report",
      "Grade Stakes & Elevation Offset Points"
    ]
  },
  {
    id: "drone",
    title: "GIS Mapping & Drone Remote Sensing",
    description: "Rapidly inspect and map hundreds of undeveloped acres utilizing high-resolution multispectral cameras and LiDAR sensors mounted on aerial survey drones. Creates precise GIS models and high-res orthophotos.",
    iconName: "Globe",
    basePrice: 950,
    pricePerSqFt: 0.002,
    typicalTimeframe: "2 - 4 Business Days",
    deliverables: [
      "1-inch Pixel Orthomosaic Geotiff Image",
      "Dense LiDAR Point Cloud (.LAS file format)",
      "Digital Surface Model (DSM) Slope Profiles",
      "GIS Boundary Integration & Attributes CSV"
    ]
  }
];

export default function ServicesGrid() {
  return (
    <section id="services-overview-section" className="py-20 bg-[#faf8f5] text-[#222925] relative">
      {/* Decorative technical margin grid tick marks */}
      <div className="absolute inset-0 cad-grid opacity-[0.03] pointer-events-none" />
      
      <div className="max-w-7xl mx-auto px-4 md:px-6 relative z-10">
        
        {/* Section Heading */}
        <div className="mb-14 max-w-2xl">
          <div className="flex items-center gap-2 mb-2">
            <span className="h-1 bg-brand-orange w-8"></span>
            <span className="text-brand-green-mid uppercase text-xs font-mono font-bold tracking-widest">Our Capabilities</span>
          </div>
          <h2 className="text-3xl md:text-5xl font-display font-medium text-brand-green-dark tracking-tight leading-none">
            High-Precision Surveying Services
          </h2>
          <p className="mt-4 text-base text-stone-600 leading-relaxed font-sans">
            Committed to millimetric accuracy. We deliver licensed surveying solutions backed by legal deeds research, rigorous geodetic controls, and state-of-the-art layout machinery.
          </p>
        </div>

        {/* Services Multi-Card Grid layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {REAL_SERVICES.map((service) => {
            // Render specific icon based on string name
            let IconComponent = Compass;
            if (service.id === "topo") IconComponent = Layers;
            if (service.id === "construction") IconComponent = MapPin;
            if (service.id === "drone") IconComponent = Globe;

            return (
              <div 
                key={service.id} 
                className="bg-white border-b-4 border-b-brand-green-dark border border-brand-clay/75 hover:border-brand-green-light rounded-lg p-6 md:p-8 flex flex-col justify-between shadow-sm hover:shadow-md transition-all group"
              >
                <div>
                  {/* Card Header */}
                  <div className="flex items-center justify-between mb-4">
                    <div className="p-3 bg-brand-concrete-light text-brand-green-dark group-hover:bg-brand-green-mid group-hover:text-white rounded-lg transition-all duration-300">
                      <IconComponent size={24} />
                    </div>
                    <span className="text-xs font-mono text-stone-400 bg-stone-100 px-2.5 py-1 rounded">
                      EST. TIMEFLOW: {service.typicalTimeframe}
                    </span>
                  </div>

                  {/* Title & Desc */}
                  <h3 className="text-xl font-display font-bold text-brand-green-dark mb-3">
                    {service.title}
                  </h3>
                  <p className="text-sm text-stone-600 leading-relaxed font-sans mb-6">
                    {service.description}
                  </p>

                  {/* Deliverables List */}
                  <div className="border-t border-brand-clay/50 pt-5">
                    <span className="text-[10px] font-mono uppercase text-brand-orange font-bold block mb-3 tracking-widest">Certified Technical Deliverables</span>
                    <ul className="space-y-2 text-stone-700 text-xs">
                      {service.deliverables.map((item, idx) => (
                        <li key={idx} className="flex items-start gap-2">
                          <span className="text-brand-orange font-mono select-none">{"["}+{"}"}</span>
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Pricing info action footer */}
                <div className="mt-8 pt-4 border-t border-brand-clay/35 flex items-center justify-between">
                  <div className="font-mono text-xs">
                    <span className="text-stone-400 block text-[9px] uppercase font-bold">Standard Base Rate</span>
                    <span className="text-brand-green-dark font-bold text-base">${service.basePrice.toLocaleString()} base</span>
                  </div>
                  <a 
                    href="#survey-plotter-section" 
                    className="text-xs font-mono text-brand-orange hover:text-brand-orange-hover font-bold flex items-center gap-1 transition-all"
                  >
                    Plot estimate in Sandbox →
                  </a>
                </div>

              </div>
            );
          })}
        </div>
        
        {/* Bottom Banner - Accreditation Authority */}
        <div className="mt-14 p-5 bg-[#eff1f0] rounded border border-brand-clay flex flex-col sm:flex-row items-center justify-between gap-4 font-mono text-xs text-stone-600">
          <div className="flex items-center gap-3">
            <span className="p-2 bg-white rounded-full text-brand-green-mid border border-brand-clay">
              <Activity size={16} />
            </span>
            <span>All surveys are sealed by a Licensed Professional Land Surveyor (PLS) and meet strict ALTA/NSPS national boundary standards.</span>
          </div>
          <div className="flex gap-4 font-bold text-brand-green-dark">
            <span className="whitespace-nowrap">REG: STATE-COMPLIANT</span>
            <span>•</span>
            <span className="whitespace-nowrap">ERROR BUDGET: &lt; 0.01ft</span>
          </div>
        </div>

      </div>
    </section>
  );
}
