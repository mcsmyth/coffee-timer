import {
  getSelectedCoffeeShopImageId,
  getSelectedSongIndex,
  setSelectedCoffeeShopImageId,
  setSelectedSongIndex,
} from './settingsUtils';
import { DEFAULT_COFFEE_SHOP_IMAGE_ID } from '../config/coffeeShopImages';

describe('settingsUtils', () => {
  beforeEach(() => {
    localStorage.clear();
    jest.restoreAllMocks();
  });

  describe('getSelectedCoffeeShopImageId', () => {
    it('returns the default image id when nothing stored', () => {
      expect(getSelectedCoffeeShopImageId()).toBe(DEFAULT_COFFEE_SHOP_IMAGE_ID);
    });

    it('returns the stored image id when present', () => {
      setSelectedCoffeeShopImageId('custom-image');
      expect(getSelectedCoffeeShopImageId()).toBe('custom-image');
    });
  });

  describe('getSelectedSongIndex', () => {
    it('returns stored index when valid', () => {
      localStorage.setItem('pomodoro_selected_song_index', '2');
      expect(getSelectedSongIndex(5)).toBe(2);
    });

    it('falls back to zero when stored index is invalid', () => {
      localStorage.setItem('pomodoro_selected_song_index', '10');
      expect(getSelectedSongIndex(3)).toBe(0);
    });

    it('falls back to zero when stored value is not a number', () => {
      localStorage.setItem('pomodoro_selected_song_index', 'not-a-number');
      expect(getSelectedSongIndex(3)).toBe(0);
    });
  });

  describe('setSelectedSongIndex', () => {
    it('stores the index and dispatches an event', () => {
      const dispatchSpy = jest.spyOn(window, 'dispatchEvent');
      setSelectedSongIndex(1);

      expect(localStorage.getItem('pomodoro_selected_song_index')).toBe('1');
      expect(dispatchSpy).toHaveBeenCalledTimes(1);
      const event = dispatchSpy.mock.calls[0][0] as CustomEvent<{ songIndex: number }>;
      expect(event.type).toBe('selectedSongChanged');
      expect(event.detail?.songIndex).toBe(1);
    });
  });
});
