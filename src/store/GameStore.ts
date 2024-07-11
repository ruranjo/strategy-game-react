import { create } from 'zustand';
import { AlmacenDeOroProperties, BaseProperties, BuildingProperties, Character, MinaDeOroProperties } from '../types/character.type';

type GameState<T extends BaseProperties> = {
  gold: number;
  goldTotalCapacity: number; // Añadir propiedad para capacidad total de oro
  intialGoldCapacity: number;
  builders: number;
  heroes: number;
  selectedCharacter: Character<T> | null;
  selectedBuild: Character<BuildingProperties> | null;
  isSelected: boolean;
  selectedCell: { row: number; col: number } | null;
  goldMines: Character<MinaDeOroProperties | AlmacenDeOroProperties>[]; // Array para guardar las minas de oro
  attackMode: boolean; // Añadir modo de ataque
  updateResources: (gold: number, builders: number, heroes: number) => void;
  setSelectedCharacter: (character: Character<T> | null) => void;
  setSelectedBuild: (character: Character<BuildingProperties> | null) => void;
  setSelectedCell: (cell: { row: number; col: number } | null) => void;
  addGoldMine: (goldMine: Character<MinaDeOroProperties | AlmacenDeOroProperties>) => void;
  removeGoldMine: (id: number) => void;
  resetSelection: () => void;
  toggleAttackMode: () => void; // Añadir función para alternar el modo de ataque
  deductGold: (amount: number) => void; // Función para deducir oro
  updateGoldTotalCapacity: () => void; // Función para actualizar la capacidad total de oro
};

const createGameState = <T extends BaseProperties>() => (
  set: (partial: GameState<T> | Partial<GameState<T>> | ((state: GameState<T>) => GameState<T> | Partial<GameState<T>>), replace?: boolean) => void
): GameState<T> => ({
  gold: 1000,
  goldTotalCapacity: 1000, // Inicializar la capacidad total de oro
  intialGoldCapacity: 1000,
  builders: 1,
  heroes: 2,
  selectedCharacter: null,
  selectedBuild: null,
  isSelected: false,
  selectedCell: null,
  goldMines: [], // Inicializar el array de minas de oro
  attackMode: false, // Inicializar el modo de ataque

  updateResources: (gold, builders, heroes) =>
    set((state) => ({
      ...state,
      gold,
      builders,
      heroes,
    })),

  setSelectedCharacter: (character) =>
    set((state) => ({
      ...state,
      selectedCharacter: character,
      isSelected: character !== null,
    })),

  setSelectedBuild: (build) =>
    set((state) => ({
      ...state,
      selectedBuild: build,
      isSelected: build !== null,
    })),

  setSelectedCell: (cell) =>
    set((state) => ({
      ...state,
      selectedCell: cell,
    })),

  addGoldMine: (goldMine) =>
    set((state) => {
      const newGoldMines = [...state.goldMines, goldMine];
      const goldTotalCapacity = state.intialGoldCapacity + newGoldMines.reduce((total, mine) => total + mine.properties.capacity, 0);
      return {
        ...state,
        goldMines: newGoldMines,
        goldTotalCapacity, // Actualizar la capacidad total de oro
      };
    }),

  removeGoldMine: (id: number) =>
    set((state) => {
      const newGoldMines = state.goldMines.filter((mine) => mine.id !== id);
      const goldTotalCapacity = newGoldMines.reduce((total, mine) => total + mine.properties.capacity, 0);
      return {
        ...state,
        goldMines: newGoldMines,
        goldTotalCapacity, // Actualizar la capacidad total de oro
      };
    }),

  resetSelection: () =>
    set((state) => ({
      ...state,
      selectedCharacter: null,
      isSelected: false,
    })),

  toggleAttackMode: () =>
    set((state) => ({
      ...state,
      attackMode: !state.attackMode,
    })),

  deductGold: (amount) =>
    set((state) => ({
      ...state,
      gold: state.gold - amount,
    })),

  updateGoldTotalCapacity: () =>
    set((state) => {
      const goldTotalCapacity = state.goldMines.reduce((total, mine) => total + mine.properties.capacity, 0);
      return {
        ...state,
        goldTotalCapacity, // Actualizar la capacidad total de oro
      };
    }),
});

const useGameStore = create<GameState<BaseProperties>>((set) => createGameState<BaseProperties>()(set));

export default useGameStore;
