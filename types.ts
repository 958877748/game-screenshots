export enum ScreenType {
  MAIN_MENU = 'Main Menu',
  GAMEPLAY = 'Gameplay Action',
  INVENTORY = 'Inventory/Equipment',
  LEVEL_SELECT = 'Level Selection',
  GAME_OVER = 'Game Over/Victory',
  DIALOGUE = 'Dialogue/Story',
}

export interface GameConcept {
  title: string;
  genre: string;
  artStyle: string;
  visualDescription: string;
  colorPalette: string;
  gameplayMechanic: string;
}

export interface GeneratedImage {
  id: string;
  screenType: ScreenType;
  imageUrl: string;
  timestamp: number;
}

export interface LoadingState {
  isGeneratingConcept: boolean;
  isGeneratingImage: boolean;
  currentAction?: string;
}