import { AlmacenDeOroProperties, AyuntamientoProperties, BarracaProperties, Character, MinaDeOroProperties, MurallaProperties } from "../types/character.type";

export const Ayuntamiento: Character<AyuntamientoProperties> = {
  id: 5,
  name: 'Ayuntamiento',
  role: 'building',
  imgCode: '🏛️',
  description: 'Centro neurálgico de tu aldea',
  x: 0,
  y: 0,
  properties: {
      cost: 150,
      administrativeLevel: 1,
      publicServices: ["hola"],
      maxResistance: 1000,
      currentResistance: 1000,
  },
  type: 'edificio',
  bando: 'neutro',
  OnAttack: false,
};

export const Barraca: Character<BarracaProperties> = {
  id: 2,
  name: 'Barraca',
  role: 'building',
  imgCode: '⚔️',
  x: 0,
  y: 0,
  description: 'Entrenas tropas para ataques',
  properties: {
      trainingCapacity: 1,
      troopType: "",
      cost: 150,
      maxResistance: 800,
      currentResistance: 800,
  },
  type: 'edificio',
  bando: 'neutro',
  OnAttack: false,
};

export const Muralla: Character<MurallaProperties> = {
  id: 3,
  name: 'Muralla',
  role: 'building',
  imgCode: '🧱',
  x: 0,
  y: 0,
  description: 'Protege tu aldea de ataques enemigos',
  properties: {
      defenseStrength: 1,
      height: 1,
      cost: 80,
      maxResistance: 1200,
      currentResistance: 1200,
  },
  type: 'edificio',
  bando: 'neutro',
  OnAttack: false,
};

export const MinaDeOro: Character<MinaDeOroProperties> = {
  id: 4,
  name: 'Mina de oro',
  role: 'building',
  imgCode: '⛏️',
  x: 0,
  y: 0,
  description: 'Genera oro, moneda principal',
  properties: {
      cost: 150,
      productionRate: 100,
      capacity: 5000,
      timeToFullCapacity: 1,
      buildDate: new Date(),
      isFull: false,
      currentGold: 0,
      maxResistance: 700,
      currentResistance: 700,
  },
  type: 'edificio',
  bando: 'neutro',
  OnAttack: false,
};

export const AlmacenDeOro: Character<AlmacenDeOroProperties> = {
  id: 1,
  name: 'Almacén de Oro',
  role: 'Almacen',
  imgCode: '💰',
  x: 0,
  y: 0,
  description: 'Un almacén para guardar oro.',
  properties: {
      cost: 500,
      capacity: 1000,
      maxResistance: 900,
      currentResistance: 900,
  },
  type: 'edificio',
  bando: 'neutro',
  OnAttack: false,
};