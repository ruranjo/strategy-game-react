import React, { useEffect, useState } from "react";
import useGameStore from "../../../store/GameStore";
import {
  AyuntamientoProperties,
  BuilderProperties,
  BuildingProperties,
  Character,
  HeroProperties,
  MinaDeOroProperties,
  MurallaProperties,
} from "../../../types/character.type";
import { AlmacenDeOro, MinaDeOro, Muralla } from "../../../characters/build";
import useBoardStore from "../../../store/BoardStore";

interface GameMenuProps {}

interface MonitorItem {
  label: string;
  emoji: string;
  value: number;
}

interface DynamicMenuItem {
  label: string;
  emoji: string;
  content: React.ReactNode;
}

const GameMenu: React.FC<GameMenuProps> = () => {
  const {
    gold,
    goldTotalCapacity,
    builders,
    heroes,
    selectedCharacter,
    setSelectedBuild,
    isSelected,
    resetSelection,
    goldMines,
    updateResources,
    setSelectedCharacter,
  } = useGameStore((state) => ({
    gold: state.gold,
    goldTotalCapacity: state.goldTotalCapacity,
    builders: state.builders,
    heroes: state.heroes,
    selectedCharacter: state.selectedCharacter,
    setSelectedBuild: state.setSelectedBuild,
    selectedBuild: state.selectedBuild,
    isSelected: state.isSelected,
    resetSelection: state.resetSelection,
    selectedCell: state.selectedCell,
    setSelectedCharacter: state.setSelectedCharacter,
    goldMines: state.goldMines,
    updateResources: state.updateResources,
  }));

  const { enablePushMode, disablePushMode } = useBoardStore((state) => ({
    enablePushMode: state.enablePushMode,
    disablePushMode: state.disablePushMode,
  }));

  const { boardMatrix, setBoardMatrix } = useBoardStore((state) => ({
    boardMatrix: state.boardMatrix,
    rows: state.rows,
    cols: state.cols,
    isPushMode: state.isPushMode,
    setBoardMatrix: state.setBoardMatrix,
  }));

  const handlerBack = () => {
    setActiveDynamicMenuItem(null);
    resetSelection();
    disablePushMode();
    setSelectedBuild(null);
  };

  useEffect(() => {
    const interval = setInterval(() => {
      let totalGoldProduced = 0;
      console.log(goldMines);

      goldMines.forEach((mine) => {
        if (mine.name === "Mina de oro") {
          // Verificar si es una mina de oro
          const properties = mine.properties as MinaDeOroProperties;
          const { productionRate, capacity, currentGold } = properties;

          // Calcular el nuevo oro generado
          let newGoldGenerated = currentGold + productionRate; // Asumiendo productionRate es por hora y intervalos de 10 segundos

          // Asegurar que el oro generado no exceda la capacidad máxima de la mina
          // if (newGoldGenerated >= capacity) {
          //   newGoldGenerated = capacity;
          //   properties.isFull = true;
          // } else {
          //   properties.isFull = false;
          // }

          totalGoldProduced += newGoldGenerated - currentGold; // Solo sumar la diferencia generada en este intervalo
          properties.currentGold = newGoldGenerated; // Actualizar la propiedad currentGold en la mina
        }
      });

      // Calcular el nuevo valor de oro sin exceder la capacidad total
      console.log(gold + totalGoldProduced, goldTotalCapacity);
      const newGold = Math.min(gold + totalGoldProduced, goldTotalCapacity);

      updateResources(Math.ceil(newGold), builders, heroes);
    }, 1000); // gold by second

    return () => clearInterval(interval); // Limpiar el intervalo al desmontar el componente
  }, [goldMines, gold, goldTotalCapacity, builders, heroes, updateResources]);

  const monitorItems: MonitorItem[] = [
    { label: "ORO", emoji: "💰", value: gold },
    { label: "CONSTRUCTORES", emoji: "👨‍🔧", value: builders },
    { label: "HEROES", emoji: "🏌️‍♂️", value: heroes },
  ];

  const buildingMenu: DynamicMenuItem = {
    label: "CREAR EDIFICIOS",
    emoji: "🏠",
    content: (
      <div className=" bg-yellow-950 rounded-md text-white font-bold ">
        <div className="grid grid-cols-2 gap-1">
          <button
            className={`bg-orange-300 hover:bg-orange-400 focus:bg-orange-400 text-green-950 p-2 rounded shadow-md flex items-center justify-center ${
              gold < AlmacenDeOro.properties.cost &&
              selectedCharacter?.bando === "jugador"
                ? "opacity-50 cursor-not-allowed"
                : ""
            }`}
            onClick={() => handleBuildingClick(AlmacenDeOro)}
            disabled={
              gold < AlmacenDeOro.properties.cost &&
              selectedCharacter?.bando !== "enemigo"
            }
          >
            {AlmacenDeOro.imgCode} {AlmacenDeOro.name} costo:{" "}
            {AlmacenDeOro.properties.cost}
          </button>

          <button
            className={`bg-orange-300 hover:bg-orange-400 focus:bg-orange-400 text-green-950 p-2 rounded shadow-md flex items-center justify-center ${
              gold < AlmacenDeOro.properties.cost &&
              selectedCharacter?.bando === "jugador"
                ? "opacity-50 cursor-not-allowed"
                : ""
            }`}
            onClick={() => handleBuildingClick(Muralla)}
            disabled={
              gold < Muralla.properties.cost &&
              selectedCharacter?.bando !== "enemigo"
            }
          >
            {Muralla.imgCode} {Muralla.name} costo: {Muralla.properties.cost}
          </button>
          <button
            className={`bg-orange-300 hover:bg-orange-400 focus:bg-orange-400 text-green-950 p-2 rounded shadow-md flex items-center justify-center ${
              gold < MinaDeOro.properties.cost &&
              selectedCharacter?.bando === "jugador"
                ? "opacity-50 cursor-not-allowed"
                : ""
            }`}
            onClick={() => handleBuildingClick(MinaDeOro)}
            disabled={
              gold < MinaDeOro.properties.cost &&
              selectedCharacter?.bando !== "enemigo"
            }
          >
            {MinaDeOro.imgCode} {MinaDeOro.name} costo:{" "}
            {MinaDeOro.properties.cost}
          </button>
        </div>

        <button
          className="mt-2 bg-orange-300 hover:bg-orange-400 focus:bg-orange-400 text-green-950 p-1 rounded shadow-md"
          onClick={() => handlerBack()}
        >
          Volver
        </button>
      </div>
    ),
  };

  const [activeDynamicMenuItem, setActiveDynamicMenuItem] =
    useState<DynamicMenuItem | null>(null);

  const handleBuildingClick = (building: Character<BuildingProperties>) => {
    console.log(
      "gold >= building.properties.cost : ",
      gold >= building.properties.cost,
      " selectedCharacter?.bando === 'enemigo'",
      selectedCharacter?.bando === "enemigo"
    );
    if (
      gold >= building.properties.cost ||
      selectedCharacter?.bando === "enemigo"
    ) {
      console.log("setSelectedBuild(building);");
      console.log(building);
      setSelectedBuild(building);
      setActiveDynamicMenuItem(null);
      enablePushMode(); // Enable push mode after selection
    } else {
      alert("No tienes suficiente oro para seleccionar este edificio.");
    }
  };

  const renderMonitors = () => {
    return (
      <div className="flex flex-col w-1/4  bg-yellow-950 rounded-md text-white font-medium p-2">
        {monitorItems.map((item, index) => (
          <div key={index} className="bg-brown-600 p-2 rounded">
            <span role="img" aria-label={item.label}>
              {item.emoji}
            </span>{" "}
            {item.label}: {item.value}
            {item.label === "ORO" ? <>/{goldTotalCapacity}</> : ""}
          </div>
        ))}
      </div>
    );
  };

  const renderCentralMenuContent = () => {
    if (isSelected && selectedCharacter) {
      if (selectedCharacter.name === "Mina de oro") {
        const {
          currentGold,
          productionRate,
          capacity,
          timeToFullCapacity,
          buildDate,
        } = selectedCharacter.properties as MinaDeOroProperties;

        // Calcular el tiempo transcurrido en segundos desde la fecha de construcción hasta la fecha actual
        const currentTime = new Date();
        const buildTime = new Date(buildDate);
        const timeElapsedInSeconds =
          (currentTime.getTime() - buildTime.getTime()) / 1000;

        // Convertir timeToFullCapacity a segundos
        const timeToFullCapacityInSeconds = timeToFullCapacity * 60;

        // Calcular el oro generado
        let goldGenerated;
        console.log(
          "timeElapsedInSeconds: ",
          timeElapsedInSeconds,
          "timeToFullCapacityInSeconds: ",
          timeToFullCapacityInSeconds,
          timeElapsedInSeconds >= timeToFullCapacityInSeconds
        );
        if (timeElapsedInSeconds >= timeToFullCapacityInSeconds) {
          goldGenerated = capacity; // Si el tiempo transcurrido supera el tiempo para capacidad máxima, está lleno
        } else {
          goldGenerated =
            capacity * (timeElapsedInSeconds / timeToFullCapacityInSeconds);
        }

        return (
          <div className="flex flex-col  bg-yellow-950 rounded-md text-white font-bold gap-2 p-2 shadow-lg">
            <div className="w-full ">
              <p className="text-center text-sm">Detalles de la Mina de Oro:</p>
              <div className="bg-yellow-800 text-sm rounded-md shadow-inner p-4 flex flex-wrap justify-between">
                <div className="flex flex-col items-center mb-2 w-1/2 md:w-1/4">
                  <span>💰 Oro actual:</span>
                  <span>{Math.ceil(currentGold)}</span>
                </div>
                <div className="flex flex-col items-center mb-2 w-1/2 md:w-1/4">
                  <span>🏭 Tasa de producción:</span>
                  <span>{productionRate} oro/segundo</span>
                </div>
                <div className="flex flex-col items-center mb-2 w-1/2 md:w-1/4">
                  <span>🏦 Capacidad de almacenamiento:</span>
                  <span>{capacity}</span>
                </div>
              </div>
            </div>

            <div className="w-full flex flex-col items-center">
              <button
                onClick={() => handlerBack()}
                className="bg-orange-300 hover:bg-orange-400 focus:bg-orange-400 text-green-950 p-2 rounded shadow-md "
              >
                Volver al Menú Principal
              </button>
            </div>
          </div>
        );
      } else if (selectedCharacter.role === "builder") {
        // Menú para el constructor
        const propBuilder = selectedCharacter.properties as BuilderProperties;
        return (
          <div className="flex flex-col  bg-yellow-950 rounded-md text-white font-bold gap-1">
            <div className="bg-yellow-800 p-2 rounded shadow-inner">
              <table className="w-full text-left">
                <tbody>
                  <tr>
                    <th className="pr-2">Salud:</th>
                    <td>{propBuilder.health}</td>
                  </tr>
                </tbody>
              </table>
            </div>
            {buildingMenu.content}
          </div>
        );
      } else if (
        selectedCharacter.role === "hero" &&
        selectedCharacter.bando !== "enemigo"
      ) {
        const { currentHealth, health, attackDamage } =
          selectedCharacter.properties as HeroProperties;

        const handleBuyPotion = () => {
          if (gold >= 50) {
            const newGold = gold - 50;
            const updatedHero = {
              ...selectedCharacter,
              properties: {
                ...selectedCharacter.properties,
                currentHealth: health,
              },
            };
            updateResources(newGold, builders, heroes);
            setSelectedCharacter(updatedHero);
            boardMatrix[updatedHero.x][updatedHero.y] = updatedHero;
            setBoardMatrix(boardMatrix);
          } else {
            alert("No tienes suficiente oro para comprar una poción de vida.");
          }
        };

        // Menú para el héroe
        return (
          <div className="flex flex-col  bg-yellow-950 rounded-md text-white font-bold gap-1 p-2">
            <div className="bg-yellow-800 p-2 rounded shadow-inner">
              <table className="w-full text-left">
                <tbody>
                  <tr>
                    <th className="pr-2">Salud:</th>
                    <td>{currentHealth}</td>
                    <th className="pr-2">Ataque:</th>
                    <td>{attackDamage}</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <button
              onClick={handleBuyPotion}
              className={`mt-2 bg-orange-300 hover:bg-orange-400 focus:bg-orange-400 text-white p-2 rounded shadow-md ${
                gold < 50 || currentHealth === health
                  ? "opacity-50 cursor-not-allowed"
                  : ""
              }`}
              disabled={gold < 50 || currentHealth === health}
            >
              🧪 Comprar Poción de Vida (50 oro)
            </button>
            <button
              onClick={() => handlerBack()}
              className="mt-2 bg-orange-300 hover:bg-orange-400 focus:bg-orange-400 text-green-950 p-2 rounded shadow-md"
            >
              Volver al Menú Principal
            </button>
          </div>
        );
      } else if (selectedCharacter.name === "Ayuntamiento") {
        const { name, imgCode, bando } = selectedCharacter;
        const { maxResistance, currentResistance } =
          selectedCharacter.properties as AyuntamientoProperties;

        const countPlayerHeroes = () => {
          return boardMatrix.reduce((count, row) => {
            return (
              count +
              row.filter(
                (cell) =>
                  cell && cell.role === "hero" && cell.bando === "jugador"
              ).length
            );
          }, 0);
        };

        // Menú para el ayuntamiento
        return (
          <div className="flex flex-col bg-yellow-950 rounded-md text-white font-bold gap-1">
            <div className=" p-2 rounded shadow-inner flex flex-col gap-5">
              <p className="text-center text-sm">
                <span>{imgCode} </span> {name}
              </p>

              <div className="bg-yellow-800 p-2 rounded shadow-inner">
                <table className="w-full text-left">
                  <tbody>
                    <tr>
                      <th className="">Resistencia Actual:</th>
                      <td>
                        {currentResistance}/{maxResistance}
                      </td>
                      <th className="">heroes:</th>
                      <td>
                        {countPlayerHeroes()}/{heroes}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <button
                onClick={() => handlerBack()}
                className="mt-2 bg-orange-300 hover:bg-orange-400 focus:bg-orange-400 text-yellow-950 p-2 rounded shadow-md"
              >
                Volver al Menú Principal
              </button>
            </div>
          </div>
        );
      } else if (selectedCharacter.name === "Almacén de Oro") {
        // Menú para el Almacén de Oro

        const { name, imgCode } = selectedCharacter;
        const { capacity, maxResistance, currentResistance } =
          selectedCharacter.properties as MinaDeOroProperties;

        return (
          <div className="flex flex-col bg-yellow-950 rounded-md text-white font-bold gap-1">
            <div className=" p-2 rounded shadow-inner flex flex-col gap-5">
              <p className="text-center text-sm">
                <span>{imgCode} </span> {name}
              </p>

              <div className="bg-yellow-800 p-2 rounded shadow-inner">
                <table className="w-full text-left">
                  <tbody>
                    <tr>
                      <th className="pr-2">Capacidad:</th>
                      <td>{capacity}</td>
                      <th className="pr-2">Resistencia Actual:</th>
                      <td>
                        {currentResistance}/{maxResistance}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <button
                onClick={() => handlerBack()}
                className="mt-2 bg-orange-300 hover:bg-orange-400 focus:bg-orange-400 text-yellow-950 p-2 rounded shadow-md"
              >
                Volver al Menú Principal
              </button>
            </div>
          </div>
        );
      } else if (selectedCharacter.name === "Muralla") {
        // Menú para el Almacén de Oro

        const { name, imgCode, bando } = selectedCharacter;
        const { maxResistance, currentResistance } =
          selectedCharacter.properties as MurallaProperties;
        return (
          <div className="flex flex-col bg-yellow-950 rounded-md text-white font-bold gap-1">
            <div className=" p-2 rounded shadow-inner flex flex-col gap-5">
              <p className="text-center text-sm">
                <span>{imgCode} </span> {name}
              </p>

              <div className="bg-yellow-800 p-2 rounded shadow-inner">
                <table className="w-full text-left">
                  <tbody>
                    <tr>
                      <th className="pr-2">Resistencia Actual:</th>
                      <td>
                        {currentResistance}/{maxResistance}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <button
                onClick={() => handlerBack()}
                className="mt-2 bg-orange-300 hover:bg-orange-400 focus:bg-orange-400 text-yellow-950 p-2 rounded shadow-md"
              >
                Volver al Menú Principal
              </button>
            </div>
          </div>
        );
      } else {
        // Otra lógica para personajes seleccionados que no son constructores o héroes
        return (
          <div>
            <p>Has seleccionado: {selectedCharacter.name}</p>
            <button onClick={() => handlerBack()}>
              Volver al menú principal
            </button>
          </div>
        );
      }
    } else {
      // Mensaje cuando no se ha seleccionado ningún personaje
      return (
        <div>
          <p>No has seleccionado nada</p>
          <button onClick={() => handlerBack()}>
            Volver al menú principal
          </button>
        </div>
      );
    }
  };

  return (
    <div className="flex justify-center items-center border bg-yellow-950 gap-2 text-black p-2 fixed bottom-0 left-0 right-0">
      {/* Sección izquierda: Monitores */}
      <div className="flex gap-4 w-4/6 justify-center bg-yellow-700 p-2 rounded-md">
        {renderMonitors()}

        {/* Sección central: Menú dinámico */}
        <div className="w-1/2 flex flex-col text-center  bg-yellow-950 rounded-md text-white font-bold p-2">
          {isSelected ? (
            <div className="flex flex-col  bg-yellow-950 rounded-md text-white font-bold gap-1">
              {renderCentralMenuContent()}
            </div>
          ) : (
            <div className="flex flex-col  bg-yellow-950 rounded-md text-white font-bold gap-1">
              {activeDynamicMenuItem ? (
                <div className="flex flex-col  bg-yellow-950 rounded-md text-white font-bold gap-1">
                  {activeDynamicMenuItem.content}
                </div>
              ) : (
                <div className="flex flex-col h-full">
                  <div className="flex flex-col  bg-yellow-950 rounded-md text-white font-bold gap-1 h-full">
                    <div className="flex-grow font-bold text-2xl bg-yellow-800 w-full  flex items-center justify-center">
                      MENU PRINCIPAL
                    </div>
                    <div className="flex-grow bg-yellow-800 w-full h-[100px] flex items-center justify-center">
                      SELECCIONA UN ELEMENTO
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default GameMenu;
