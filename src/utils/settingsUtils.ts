import { DEFAULT_COFFEE_SHOP_IMAGE_ID } from '../config/coffeeShopImages';

const COFFEE_SHOP_IMAGE_STORAGE_KEY = 'pomodoro_coffee_shop_image';
const SELECTED_SONG_INDEX_STORAGE_KEY = 'pomodoro_selected_song_index';

/**
 * Get the selected coffee shop image ID from localStorage
 * @returns Selected image ID or default if not set
 */
export const getSelectedCoffeeShopImageId = (): string => {
  try {
    const saved = localStorage.getItem(COFFEE_SHOP_IMAGE_STORAGE_KEY);
    if (saved) {
      return saved;
    }
  } catch (error) {
    console.error('Error reading coffee shop image setting:', error);
  }
  return DEFAULT_COFFEE_SHOP_IMAGE_ID;
};

/**
 * Save the selected coffee shop image ID to localStorage
 * @param imageId - The image ID to save
 */
export const setSelectedCoffeeShopImageId = (imageId: string): void => {
  try {
    localStorage.setItem(COFFEE_SHOP_IMAGE_STORAGE_KEY, imageId);
  } catch (error) {
    console.error('Error saving coffee shop image setting:', error);
  }
};

/**
 * Get the selected song index from localStorage
 * @param playlistLength - Length of the playlist to validate the index
 * @returns Selected song index or 0 if not set or invalid
 */
export const getSelectedSongIndex = (playlistLength: number): number => {
  try {
    const saved = localStorage.getItem(SELECTED_SONG_INDEX_STORAGE_KEY);
    if (saved !== null) {
      const index = parseInt(saved, 10);
      if (!isNaN(index) && index >= 0 && index < playlistLength) {
        return index;
      }
    }
  } catch (error) {
    console.error('Error reading selected song index:', error);
  }
  return 0;
};

/**
 * Save the selected song index to localStorage
 * @param songIndex - The song index to save
 */
export const setSelectedSongIndex = (songIndex: number): void => {
  try {
    localStorage.setItem(SELECTED_SONG_INDEX_STORAGE_KEY, songIndex.toString());
    // Dispatch event so MusicPlayer component can update
    window.dispatchEvent(new CustomEvent('selectedSongChanged', { detail: { songIndex } }));
  } catch (error) {
    console.error('Error saving selected song index:', error);
  }
};
