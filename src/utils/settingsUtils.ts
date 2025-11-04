import { DEFAULT_COFFEE_SHOP_IMAGE_ID } from '../config/coffeeShopImages';

const COFFEE_SHOP_IMAGE_STORAGE_KEY = 'pomodoro_coffee_shop_image';

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
