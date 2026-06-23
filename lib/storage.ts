import { useSyncExternalStore } from "react";
import type { GameState } from "./types";
import { createDefaultGameState } from "./gameState";

function createStore<T>(key: string, initialValue: T) {
  let cache: T = initialValue;
  let listeners: Array<() => void> = [];
  let hydrated = false;

  function hydrate() {
    if (hydrated || typeof window === "undefined") return;
    hydrated = true;
    try {
      const raw = window.localStorage.getItem(key);
      if (raw) cache = JSON.parse(raw) as T;
    } catch {
      cache = initialValue;
    }
  }

  function getSnapshot(): T {
    hydrate();
    return cache;
  }

  function getServerSnapshot(): T {
    return initialValue;
  }

  function subscribe(listener: () => void) {
    listeners.push(listener);
    return () => {
      listeners = listeners.filter((l) => l !== listener);
    };
  }

  function set(value: T) {
    cache = value;
    hydrated = true;
    if (typeof window !== "undefined") {
      window.localStorage.setItem(key, JSON.stringify(value));
    }
    listeners.forEach((l) => l());
  }

  return { getSnapshot, getServerSnapshot, subscribe, set };
}

const gameStateStore = createStore<GameState>(
  "studyverse:gamestate",
  createDefaultGameState(),
);

export function useGameState() {
  const state = useSyncExternalStore(
    gameStateStore.subscribe,
    gameStateStore.getSnapshot,
    gameStateStore.getServerSnapshot,
  );
  return [state, gameStateStore.set] as const;
}

/** Reads the current cached state, applies an updater fn, persists the result. */
export function updateGameState(updater: (state: GameState) => GameState) {
  const current = gameStateStore.getSnapshot();
  gameStateStore.set(updater(current));
}

/** Overwrites the stored state wholesale, e.g. when restoring from an exported backup file. */
export function setGameState(state: GameState) {
  gameStateStore.set(state);
}
