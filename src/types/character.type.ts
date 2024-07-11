// Base properties interface
export interface BaseProperties {
  // Common properties for all character types can go here if needed
}

// Properties specific to heroes
export interface HeroProperties extends BaseProperties {
  health: number;
  currentHealth: number;
  attackDamage: number;
  specialAbility: string;
}

// Extend BuildingProperties to include resistance properties
export interface BuildingProperties extends BaseProperties {
  cost: number;
  maxResistance: number;
  currentResistance: number;
}

// Specific properties for different buildings
export interface BarracaProperties extends BuildingProperties {
  trainingCapacity: number;
  troopType: string;
}

export interface MurallaProperties extends BuildingProperties {
  defenseStrength: number;
  height: number;
}

export interface MinaDeOroProperties extends BuildingProperties {
  productionRate: number;
  capacity: number;
  timeToFullCapacity: number;
  buildDate: Date;
  isFull: boolean;
  currentGold: number;
}

export interface AyuntamientoProperties extends BuildingProperties {
  administrativeLevel: number;
  publicServices: string[];
}

export interface AlmacenDeOroProperties extends BuildingProperties {
  capacity: number;
}

// Specific properties for non-building characters
export interface TreeProperties extends BaseProperties {
  height: number;
  age: number;
}

export interface BuilderProperties extends BaseProperties {
  constructionSpeed: number;
  health: number,
  currentHealth: number,
}

// Specific properties for mountain characters
export interface MountainProperties extends BaseProperties {
  elevation: number;
  prominence: number;
}

// Character interface
export interface Character<T extends BaseProperties> {
  id: number;
  name: string;
  role: string;
  imgCode: string;
  x: number;
  y: number;
  description: string;
  properties: T;
  OnAttack: boolean;
  type: "ser" | "decoracion" | "edificio"; // Campo de tipo para el personaje
  bando: "enemigo" | "jugador" | "neutro"; // Campo de tipo para el personaje
}
