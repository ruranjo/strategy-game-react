import { Character, HeroProperties } from "../types/character.type";

export const Spider: Character<HeroProperties> = {
    id: 20,
    name: 'Araña',
    role: 'Enemigo',
    imgCode: '🕷️', // Código de imagen para representar a la araña
    x: 0,
    y: 0,
    description: 'Una araña rápida y letal.',
    properties: {
      health: 100,
      currentHealth: 100,
      attackDamage: 10,
      specialAbility: 'Veneno',
    },
    type: 'ser',
    bando: 'enemigo',
    OnAttack: false,
  };