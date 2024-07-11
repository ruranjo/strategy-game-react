import { BuilderProperties, Character } from "../types/character.type";

export const Constructor: Character<BuilderProperties> = {
    id: 6,
    name: 'Constructor',
    role: 'builder',
    imgCode: '👨‍🔧',
    x: 0,
    y: 0,
    description: 'Construye y mejora edificios',
    properties: {
      constructionSpeed: 1,
      currentHealth:500,
      health: 500,
    },
    type:"ser",
    OnAttack: false,
    bando:"neutro"
  };