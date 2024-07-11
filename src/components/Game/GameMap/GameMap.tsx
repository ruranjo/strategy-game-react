import React, { useState } from "react";
import useBoardStore from "../../../store/BoardStore";
import useGameStore from "../../../store/GameStore";
import {
  Character,
  MinaDeOroProperties,
  AlmacenDeOroProperties,
  HeroProperties,
  BuildingProperties,
} from "../../../types/character.type";

type GameMapProps = {
  rows?: number;
  cols?: number;
};

const GameMap: React.FC<GameMapProps> = () => {
  const { boardMatrix, isPushMode, setBoardMatrix, disablePushMode } =
    useBoardStore((state) => ({
      boardMatrix: state.boardMatrix,
      rows: state.rows,
      cols: state.cols,
      isPushMode: state.isPushMode,
      setBoardMatrix: state.setBoardMatrix,
      disablePushMode: state.disablePushMode,
    }));

  const {
    heroes,
    builders,
    gold,
    updateResources,
    selectedCharacter,
    addGoldMine,
    setSelectedBuild,
    setSelectedCharacter,
    selectedCell,
    setSelectedCell,
    selectedBuild,
    deductGold,
  } = useGameStore((state) => ({
    selectedCharacter: state.selectedCharacter,
    setSelectedCharacter: state.setSelectedCharacter,
    setSelectedBuild: state.setSelectedBuild,
    selectedBuild: state.selectedBuild,
    selectedCell: state.selectedCell,
    setSelectedCell: state.setSelectedCell,
    builders: state.builders,
    heroes: state.heroes,
    gold: state.gold,
    addGoldMine: state.addGoldMine,
    deductGold: state.deductGold,
    updateResources: state.updateResources,
  }));

  const [hoveredCell, setHoveredCell] = useState<{
    row: number;
    col: number;
  } | null>(null);

  // Función para obtener el color según el porcentaje de salud
  const getColorByHealthPercentageEnemy = (percentage: number): string => {
    if (percentage > 80) return "bg-red-500";
    if (percentage > 60) return "bg-red-600";
    if (percentage > 40) return "bg-red-700";
    if (percentage > 20) return "bg-red-800";
    return "bg-red-900";
  };

  const getColorByHealthPercentagePlayer = (percentage: number): string => {
    if (percentage > 80) return "bg-blue-500";
    if (percentage > 60) return "bg-blue-600";
    if (percentage > 40) return "bg-blue-700";
    if (percentage > 20) return "bg-blue-800";
    return "bg-blue-900";
  };

  const getCellColor = (row: number, col: number): string => {
    const cell = boardMatrix[row][col];

    if (cell?.bando === "jugador") {
      const proper = cell?.properties as HeroProperties;
      const percentage =
        proper.currentHealth !== undefined && proper.health !== undefined
          ? (proper.currentHealth / proper.health) * 100
          : 100;
      return getColorByHealthPercentagePlayer(percentage);
    }

    if (cell?.bando === "enemigo" && cell?.type === "ser") {
      const proper = cell.properties as HeroProperties;
      const percentage =
        proper.currentHealth !== undefined && proper.health !== undefined
          ? (proper.currentHealth / proper.health) * 100
          : 100;
      return getColorByHealthPercentageEnemy(percentage);
    }

    if (cell?.bando === "enemigo" && cell?.type === "edificio") {
      const proper = cell.properties as BuildingProperties;
      const percentage =
        proper.currentResistance !== undefined &&
        proper.maxResistance !== undefined
          ? (proper.currentResistance / proper.maxResistance) * 100
          : 100;
      return getColorByHealthPercentageEnemy(percentage);
    }

    if (cell?.name === "montain") {
      return (row + col) % 2 === 0 ? "bg-gray-300" : "bg-gray-400";
    }

    let baseClass = "";

    if (hoveredCell && hoveredCell.row === row && hoveredCell.col === col) {
      baseClass = "bg-red-500";
    } else if (hoveredCell) {
      const { row: hoveredRow, col: hoveredCol } = hoveredCell;
      if (
        (row === hoveredRow - 1 && col === hoveredCol) ||
        (row === hoveredRow + 1 && col === hoveredCol) ||
        (row === hoveredRow && col === hoveredCol - 1) ||
        (row === hoveredRow && col === hoveredCol + 1)
      ) {
        baseClass = "bg-gray-400";
      }
    }

    if (!baseClass) {
      baseClass = (row + col) % 2 === 0 ? "bg-green-300" : "bg-green-400";
    }

    if (
      isPushMode &&
      hoveredCell &&
      ((row === hoveredCell.row - 1 && col === hoveredCell.col) ||
        (row === hoveredCell.row + 1 && col === hoveredCell.col) ||
        (row === hoveredCell.row && col === hoveredCell.col - 1) ||
        (row === hoveredCell.row && col === hoveredCell.col + 1))
    ) {
      baseClass = "bg-orange-500 rounded-full";
    }

    return baseClass;
  };

  const handleCellHover = (row: number, col: number) => {
    setHoveredCell({ row, col });
  };

  type Direction = {
    dRow: number;
    dCol: number;
  };
  const directions: Direction[] = [
    { dRow: -1, dCol: 0 },
    { dRow: 1, dCol: 0 },
    { dRow: 0, dCol: -1 },
    { dRow: 0, dCol: 1 },
    { dRow: -1, dCol: -1 },
    { dRow: -1, dCol: 1 },
    { dRow: 1, dCol: -1 },
    { dRow: 1, dCol: 1 },
  ];

  const findAdjacentAvailableCell = (
    row: number,
    col: number
  ): { newRow: number; newCol: number } | null => {
    for (let i = 0; i < directions.length; i++) {
      const newRow = row + directions[i].dRow;
      const newCol = col + directions[i].dCol;
      if (
        newRow >= 0 &&
        newRow < boardMatrix.length &&
        newCol >= 0 &&
        newCol < boardMatrix[0].length
      ) {
        if (boardMatrix[newRow][newCol] === null) {
          return { newRow, newCol };
        }
      }
    }
    return null;
  };

  const isAdjacentCellAvailable = (row: number, col: number): boolean => {
    for (let i = 0; i < directions.length; i++) {
      const newRow = row + directions[i].dRow;
      const newCol = col + directions[i].dCol;
      if (
        newRow >= 0 &&
        newRow < boardMatrix.length &&
        newCol >= 0 &&
        newCol < boardMatrix[0].length
      ) {
        if (boardMatrix[newRow][newCol] === null) {
          return true;
        }
      }
    }
    return false;
  };
  const startAttack = (
    attackerCell: { row: number; col: number },
    targetCell: { row: number; col: number },
    damage: number
  ) => {
    const attacker = boardMatrix[attackerCell.row]?.[attackerCell.col];
    const target = boardMatrix[targetCell.row]?.[targetCell.col];

    if (!attacker || !target) {
      console.error("Invalid cells for attacker or target");
      return;
    }

    const attackerProps = { ...attacker.properties } as HeroProperties;
    const targetProps = { ...target.properties } as HeroProperties;

    // Create a deep copy of boardMatrix
    const newBoardMatrix = boardMatrix.map((row) => [...row]);

    // Set OnAttack to true for attacker and target in the newBoardMatrix
    //newBoardMatrix[attackerCell.row][attackerCell.col].OnAttack = true;
    //newBoardMatrix[targetCell.row][targetCell.col].OnAttack = true;

    setBoardMatrix(newBoardMatrix); // Update board to reflect OnAttack status

    const intervalId = setInterval(() => {
      // Check if attacker or target is null and clear interval if true
      if (
        !newBoardMatrix[attackerCell.row]?.[attackerCell.col] ||
        !newBoardMatrix[targetCell.row]?.[targetCell.col]
      ) {
        clearInterval(intervalId);
        console.log("Attacker or target is null, stopping interval.");
        return;
      }

      if (targetProps.currentHealth > 0) {
        targetProps.currentHealth -= damage;
      }

      if (attackerProps.currentHealth > 0) {
        attackerProps.currentHealth -= targetProps.attackDamage; // Assume target also has attackDamage
      }

      // Create another copy of newBoardMatrix to avoid direct mutations
      const updatedBoardMatrix = newBoardMatrix.map((row) => [...row]);

      if (targetProps.currentHealth <= 0) {
        updatedBoardMatrix[targetCell.row][targetCell.col] = null;
      } else {
        updatedBoardMatrix[targetCell.row][targetCell.col] = {
          ...target,
          properties: { ...targetProps },
        };
      }

      if (attackerProps.currentHealth <= 0) {
        updatedBoardMatrix[attackerCell.row][attackerCell.col] = null;
      } else {
        updatedBoardMatrix[attackerCell.row][attackerCell.col] = {
          ...attacker,
          properties: { ...attackerProps },
        };
      }

      setBoardMatrix(updatedBoardMatrix);

      // Check if either target or attacker is dead to stop the interval
      if (targetProps.currentHealth <= 0 || attackerProps.currentHealth <= 0) {
        clearInterval(intervalId);

        // Create a final copy to update OnAttack to false
        const finalBoardMatrix = updatedBoardMatrix.map((row) => [...row]);
        //finalBoardMatrix[attackerCell.row][attackerCell.col].OnAttack = false;
        //finalBoardMatrix[targetCell.row][targetCell.col].OnAttack = false;

        setBoardMatrix(finalBoardMatrix); // Update board to reflect OnAttack status
      }
    }, 500); // 0.5 second interval
  };

  const startAttackOnBuilding = (
    attackerCell: { row: number; col: number },
    targetCell: { row: number; col: number },
    damage: number
  ) => {
    const attacker = boardMatrix[attackerCell.row]?.[attackerCell.col];
    const target = boardMatrix[targetCell.row]?.[targetCell.col];

    console.log("attacker: ", attacker);
    console.log("target: ", target);

    if (!attacker || !target) {
      console.error("Invalid cells for attacker or target");
      return;
    }

    const attackerProps = { ...attacker.properties } as HeroProperties;
    const targetProps = { ...target.properties } as BuildingProperties;

    // Create a deep copy of boardMatrix
    const newBoardMatrix = boardMatrix.map((row) => [...row]);

    // Set OnAttack to true for attacker and target in the newBoardMatrix
    //newBoardMatrix[attackerCell.row][attackerCell.col].OnAttack = true;
    //newBoardMatrix[targetCell.row][targetCell.col].OnAttack = true;

    setBoardMatrix(newBoardMatrix); // Update board to reflect OnAttack status

    const intervalId = setInterval(() => {
      // Check if attacker or target is null and clear interval if true
      if (
        !newBoardMatrix[attackerCell.row]?.[attackerCell.col] ||
        !newBoardMatrix[targetCell.row]?.[targetCell.col]
      ) {
        clearInterval(intervalId);
        console.log("Attacker or target is null, stopping interval.");
        return;
      }

      if (targetProps.currentResistance > 0) {
        targetProps.currentResistance -= damage;
      }

      // Create another copy of newBoardMatrix to avoid direct mutations
      const updatedBoardMatrix = newBoardMatrix.map((row) => [...row]);

      if (targetProps.currentResistance <= 0) {
        updatedBoardMatrix[targetCell.row][targetCell.col] = null;
        if (target.role === "Almacen") {
          updateResources(gold + 1000, builders, heroes);
        }
        if (target.name === "Mina de oro") {
          updateResources(gold + 500, builders, heroes);
        }
      } else {
        updatedBoardMatrix[targetCell.row][targetCell.col] = {
          ...target,
          properties: { ...targetProps },
        };
      }

      if (attackerProps.currentHealth <= 0) {
        updatedBoardMatrix[attackerCell.row][attackerCell.col] = null;
      } else {
        updatedBoardMatrix[attackerCell.row][attackerCell.col] = {
          ...attacker,
          properties: { ...attackerProps },
        };
      }

      setBoardMatrix(updatedBoardMatrix);

      // Check if either target or attacker is dead to stop the interval
      if (
        targetProps.currentResistance <= 0 ||
        attackerProps.currentHealth <= 0
      ) {
        clearInterval(intervalId);

        // Create a final copy to update OnAttack to false
        const finalBoardMatrix = updatedBoardMatrix.map((row) => [...row]);
        //finalBoardMatrix[attackerCell.row][attackerCell.col].OnAttack = false;
        //finalBoardMatrix[targetCell.row][targetCell.col].OnAttack = false;

        setBoardMatrix(finalBoardMatrix); // Update board to reflect OnAttack status
      }
    }, 1000);
  };

  const handleCellClick = (row: number, col: number) => {
    const cell = boardMatrix[row][col];

    if (
      selectedCharacter &&
      selectedCharacter.bando === "jugador" &&
      selectedCharacter.role === "hero" &&
      cell?.bando === "enemigo" &&
      cell?.type === "ser"
    ) {
      console.log("cell && cell.OnAttack: ", cell, cell?.OnAttack);
      if (cell && cell.OnAttack) {
        console.log(
          "No se puede seleccionar un personaje mientras está en combate."
        );
        return;
      }

      const adjacentCell = findAdjacentAvailableCell(row, col);
      const auxCharacter = selectedCharacter;
      if (adjacentCell) {
        const newBoardMatrix = [...boardMatrix];
        newBoardMatrix[selectedCharacter.x][selectedCharacter.y] = null;
        newBoardMatrix[adjacentCell.newRow][adjacentCell.newCol] = {
          ...selectedCharacter,
          x: adjacentCell.newRow,
          y: adjacentCell.newCol,
        };

        setBoardMatrix(newBoardMatrix);
        setSelectedCharacter(null);
        setSelectedCell(null);

        // Iniciar
        const proper = auxCharacter.properties as HeroProperties;
        startAttack(
          { row: adjacentCell.newRow, col: adjacentCell.newCol },
          { row, col },
          proper.attackDamage
        );
      }
    } else if (
      selectedCharacter &&
      selectedCharacter.bando === "jugador" &&
      selectedCharacter.role === "hero" &&
      cell?.type === "edificio" &&
      cell?.bando === "enemigo"
    ) {
      const adjacentCell = findAdjacentAvailableCell(row, col);
      const auxCharacter = selectedCharacter;
      if (adjacentCell) {
        const newBoardMatrix = [...boardMatrix];
        newBoardMatrix[selectedCharacter.x][selectedCharacter.y] = null;
        newBoardMatrix[adjacentCell.newRow][adjacentCell.newCol] = {
          ...selectedCharacter,
          x: adjacentCell.newRow,
          y: adjacentCell.newCol,
        };

        setBoardMatrix(newBoardMatrix);
        setSelectedCharacter(null);
        setSelectedCell(null);

        // Iniciar
        console.log("esta seccion es para qu el heroe pueda atacar edificios ");
        const proper = auxCharacter.properties as HeroProperties;
        startAttackOnBuilding(
          { row: adjacentCell.newRow, col: adjacentCell.newCol },
          { row, col },
          proper.attackDamage
        );
      }
    } else if (isAdjacentCellAvailable(row, col)) {
      if (isPushMode && selectedCharacter && selectedBuild) {
        if (boardMatrix[row][col] === null) {
          const newBoardMatrix = [...boardMatrix];
          newBoardMatrix[row][col] = {
            ...selectedBuild,
            x: row,
            y: col,
            bando: selectedCharacter.bando,
          };

          const adjacentCell = findAdjacentAvailableCell(row, col);
          if (adjacentCell) {
            const { newRow, newCol } = adjacentCell;

            if (selectedCell) {
              newBoardMatrix[selectedCell.row][selectedCell.col] = null;
            }

            newBoardMatrix[newRow][newCol] = {
              ...selectedCharacter,
              x: newRow,
              y: newCol,
            };
          } else {
            console.error(
              "No se encontró una celda adyacente disponible para el constructor"
            );
          }

          setBoardMatrix(newBoardMatrix);

          disablePushMode();
          setSelectedCharacter(null);
          setSelectedBuild(null);

          setSelectedCell(null);

          setHoveredCell(null);

          if (
            selectedBuild &&
            selectedBuild.properties &&
            selectedBuild.bando !== "enemigo" &&
            (selectedBuild.bando !== "neutro" ||
              selectedCharacter.bando === "jugador")
          ) {
            deductGold(selectedBuild.properties.cost);
            //ddfa366e
            if (selectedBuild.name === "Mina de oro") {
              console.log(selectedBuild);
              const minaDeOro: Character<MinaDeOroProperties> = {
                ...selectedBuild,
                x: row,
                y: col,
                properties: selectedBuild.properties as MinaDeOroProperties,
                bando: selectedCharacter.bando,
              };
              addGoldMine(minaDeOro);
            } else if (selectedBuild.name === "Almacén de Oro") {
              const almacenDeOro: Character<AlmacenDeOroProperties> = {
                ...selectedBuild,
                x: row,
                y: col,
                properties: selectedBuild.properties as AlmacenDeOroProperties,
                bando: selectedCharacter.bando,
              };
              addGoldMine(almacenDeOro);
            }
          }
        } else {
          console.log("No es posible colocar en esta posición");
        }
      } else {
        const selected = boardMatrix[row][col];

        setSelectedCharacter(selected);
        setSelectedCell({ row, col });
      }
    } else {
      console.log("No es posible colocar en esta posición");
    }
  };

  const handleCellClickTypeSer = (row: number, col: number) => {
    const cell = boardMatrix[row][col];
    if (selectedCharacter && selectedCharacter.type === "ser") {
      console.log("cell && cell.OnAttack: ", cell, cell?.OnAttack);
      if (cell && cell.OnAttack) {
        console.log(
          "No se puede seleccionar un personaje mientras está en combate."
        );
        return;
      }

      if (boardMatrix[row][col] === null) {
        const updatedCharacter = { ...selectedCharacter, x: row, y: col };
        const newBoardMatrix = [...boardMatrix];
        newBoardMatrix[selectedCharacter.x][selectedCharacter.y] = null;
        newBoardMatrix[row][col] = updatedCharacter;
        setBoardMatrix(newBoardMatrix);
        setSelectedCharacter(updatedCharacter);
        setSelectedCell(null);
        setHoveredCell(null);
        setSelectedBuild(null);
        setSelectedCharacter(null);
        disablePushMode();
      } else {
        console.log(
          "No es posible moverse a esta posición porque está ocupada"
        );
      }
    } else {
      console.log(
        "No se puede mover el personaje seleccionado porque no es de tipo 'ser'"
      );
    }
  };

  const handleCellClickWrapper = (rowIndex: number, colIndex: number) => {
    const cell = boardMatrix[rowIndex][colIndex];
    console.log(
      "cell:",
      cell,
      "cell?.type === 'edificio': ",
      cell?.type === "edificio",
      "cell?.type === 'ser': ",
      cell?.type === "ser"
    );
    if (cell && (cell.type === "edificio" || cell.type === "ser")) {
      handleCellClick(rowIndex, colIndex);
    } else if (selectedCharacter?.type === "ser" && !selectedBuild) {
      handleCellClickTypeSer(rowIndex, colIndex);
      if (selectedCharacter.role !== "builder") {
        setSelectedBuild(null);
      }
    } else {
      handleCellClick(rowIndex, colIndex);
    }
  };

  return (
    <div className="flex flex-col items-center bg-green-400 rounded-md p-4">
      {boardMatrix.map((row, rowIndex) => (
        <div key={rowIndex} className="flex">
          {row.map((cell, colIndex) => (
            <div
              key={`${rowIndex}-${colIndex}`}
              className={`w-7 h-7 ${getCellColor(
                rowIndex,
                colIndex
              )} text-center items-center flex justify-center cursor-pointer`}
              onMouseEnter={() => handleCellHover(rowIndex, colIndex)}
              onMouseLeave={() => setHoveredCell(null)}
              onClick={() => handleCellClickWrapper(rowIndex, colIndex)}
            >
              {cell?.imgCode}
            </div>
          ))}
        </div>
      ))}

      {/* hoveredCell && (
        <div className="mb-2 text-black">
          Coordenadas: {hoveredCell.row}, {hoveredCell.col}
        </div>
      )* */}
    </div>
  );
};

export default GameMap;
