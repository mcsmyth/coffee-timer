/**
 * Coffee Shop Image configuration
 */

export interface CoffeeShopImage {
  id: string;
  filename: string;
  name: string; // Display name
}

/**
 * Available coffee shop images
 * 
 * To add a new image:
 * 1. Place the image file in public/images/
 * 2. Add an entry to this array
 */
export const COFFEE_SHOP_IMAGES: CoffeeShopImage[] = [
  {
    id: 'coffee-shop-1',
    filename: 'coffee-shop-1.png',
    name: 'Lo-Fi Coffee Shop (Original)'
  },
  {
    id: 'coffee-shop-2',
    filename: 'coffee-shop-2.jpg',
    name: 'Coffee Shop Scene 2'
  },
  {
    id: 'matcha-shop-1',
    filename: 'matcha-shop-1.jpg',
    name: 'Matcha Shop Scene'
  }
];

/**
 * Default coffee shop image ID
 */
export const DEFAULT_COFFEE_SHOP_IMAGE_ID = 'coffee-shop-1';

/**
 * Get the full URL for a coffee shop image
 */
export const getCoffeeShopImageUrl = (filename: string): string => {
  const basePath = '/images/';
  return process.env.PUBLIC_URL
    ? `${process.env.PUBLIC_URL}${basePath}${filename}`
    : `${basePath}${filename}`;
};

/**
 * Get image by ID
 */
export const getImageById = (id: string): CoffeeShopImage | undefined => {
  return COFFEE_SHOP_IMAGES.find(img => img.id === id);
};

/**
 * Get default image
 */
export const getDefaultImage = (): CoffeeShopImage => {
  const defaultImg = getImageById(DEFAULT_COFFEE_SHOP_IMAGE_ID);
  return defaultImg || COFFEE_SHOP_IMAGES[0];
};
