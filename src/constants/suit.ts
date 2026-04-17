import type { ColorRepresentation, MeshPhysicalMaterialParameters } from 'three';

export interface SuitPartDefinition {
  id: string;
  label: string;
  color: ColorRepresentation;
  position: [number, number, number];
  scale?: [number, number, number];
}

export const hologramMaterial: MeshPhysicalMaterialParameters = {
  color: '#62f5ff',
  emissive: '#2fe7ff',
  emissiveIntensity: 1.25,
  transparent: true,
  opacity: 0.24,
  roughness: 0.15,
  metalness: 0.9,
  transmission: 0.08,
  clearcoat: 1,
  clearcoatRoughness: 0.12,
};

export const suitParts: SuitPartDefinition[] = [
  { id: 'helmet', label: 'Helmet', color: '#7bf7ff', position: [0, 1.8, 0] },
  { id: 'torso', label: 'Torso', color: '#53d8ff', position: [0, 0.9, 0] },
  { id: 'arc', label: 'Chest Core', color: '#d8fbff', position: [0, 1.05, 0.42] },
  { id: 'left-eye', label: 'Left Eye', color: '#f4feff', position: [-0.16, 1.83, 0.48] },
  { id: 'right-eye', label: 'Right Eye', color: '#f4feff', position: [0.16, 1.83, 0.48] },
  { id: 'left-gauntlet', label: 'Left Gauntlet', color: '#79e6ff', position: [-0.95, 1.02, 0] },
  { id: 'right-gauntlet', label: 'Right Gauntlet', color: '#79e6ff', position: [0.95, 1.02, 0] },
  { id: 'left-leg', label: 'Left Leg', color: '#45bbff', position: [-0.28, -0.85, 0] },
  { id: 'right-leg', label: 'Right Leg', color: '#45bbff', position: [0.28, -0.85, 0] },
];
