/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface GpsCoordinate {
  id: string;
  x: number; // canvas pixel x
  y: number; // canvas pixel y
  easting: number; // calculated UTM Easting (m)
  northing: number; // calculated UTM Northing (m)
  elevation: number; // simulated elevation (m)
}

export interface ServiceDetail {
  id: string;
  title: string;
  description: string;
  iconName: string;
  basePrice: number;
  pricePerSqFt: number;
  typicalTimeframe: string;
  deliverables: string[];
}

export interface EquipmentDetail {
  id: string;
  name: string;
  category: "optical" | "spatial" | "aerial" | "computing";
  tagline: string;
  description: string;
  specifications: Record<string, string>;
  precisionMetric: string;
  iconName: string;
  fieldReadyMsg: string;
}

export interface LandProject {
  id: string;
  title: string;
  location: string;
  date: string;
  serviceType: string;
  areaAcres: number;
  description: string;
  utmCoordinates: string;
  boundaryPointsCount: number;
  status: "Completed" | "Active Field Phase" | "Office Calculations";
  contourInterval: string;
}
