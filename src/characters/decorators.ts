import { Character, MountainProperties, TreeProperties } from "../types/character.type";

export const Tree:Character<TreeProperties> = {
    id:1,
    name:'arbol',
    role:'decoracion',
    imgCode:'🌳',
    x:0,
    y:0,
    description:'',
    properties:{
        age:1,
        height:1,
    },
    type: 'decoracion',
    bando: 'neutro',
    OnAttack: false,
}

export const Mountain: Character<MountainProperties> = {
    id: 2,
    name: 'montain',
    role: 'decoracion',
    imgCode: '⛰️',
    x: 0,
    y: 0,
    description: '',
    properties: {
        elevation: 1000,
        prominence: 500,
    },
    type: 'decoracion',
    bando: 'neutro',
    OnAttack: false,
}