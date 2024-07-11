import { create } from 'zustand';
import { BaseProperties, Character } from '../types/character.type';

// Definimos el tipo para el estado del tablero
type BoardState<T extends BaseProperties> = {
  rows: number;
  cols: number;
  boardMatrix: (Character<T> | null)[][];
  isPushMode: boolean; // Estado para el modo push
  setBoardSize: (rows: number, cols: number) => void;
  setBoardMatrix: (boardMatrix: (Character<T> | null)[][]) => void;
  setCellValue: (row: number, col: number, value: Character<T> | null) => void;
  enablePushMode: () => void; // Habilitar el modo push
  disablePushMode: () => void; // Deshabilitar el modo push
};

// Función inicializadora para el estado del tablero
const createBoardState = <T extends BaseProperties>() => (
  set: (partial: BoardState<T> | Partial<BoardState<T>> | ((state: BoardState<T>) => BoardState<T> | Partial<BoardState<T>>), replace?: boolean) => void
): BoardState<T> => ({
  rows: 0, // Inicializamos con 0 filas
  cols: 0, // Inicializamos con 0 columnas
  boardMatrix: [], // Inicializamos boardMatrix vacío
  isPushMode: false, // Inicializamos el modo push como falso

  // Función para establecer el tamaño del tablero
  setBoardSize: (rows, cols) =>
    set((state) => ({
      ...state,
      rows,
      cols,
      // Creamos una nueva matriz con las nuevas dimensiones y valores iniciales
      boardMatrix: Array(rows)
        .fill(null)
        .map(() => Array(cols).fill(null)),
    })),

  // Función para actualizar directamente la matriz del tablero
  setBoardMatrix: (boardMatrix) =>
    set((state) => ({
      ...state,
      rows: boardMatrix.length,
      cols: boardMatrix[0]?.length || 0,
      boardMatrix,
    })),

  // Función para establecer el valor de una celda en la matriz
  setCellValue: (row, col, value) =>
    set((state) => {
      if (row < 0 || row >= state.rows || col < 0 || col >= state.cols) {
        return state; // Validación básica de rangos para evitar accesos fuera de límites
      }

      const newBoardMatrix = state.boardMatrix.map((r, rowIndex) =>
        rowIndex === row ? r.map((c, colIndex) => (colIndex === col ? value : c)) : r
      );

      return {
        ...state,
        boardMatrix: newBoardMatrix,
      };
    }),

  // Función para habilitar el modo push
  enablePushMode: () => set({ isPushMode: true }),

  // Función para deshabilitar el modo push
  disablePushMode: () => set({ isPushMode: false }),
});

// Creamos el store usando la función create de Zustand
const useBoardStore = create<BoardState<BaseProperties>>((set) => createBoardState<BaseProperties>()(set));

export default useBoardStore;
