import { calculateFillPercentage, formatTime, minutesToSeconds, secondsToMinutes } from './timerUtils';

describe('timerUtils', () => {
  describe('formatTime', () => {
    it('formats zero seconds as 00:00', () => {
      expect(formatTime(0)).toBe('00:00');
    });

    it('formats minutes and seconds with leading zeros', () => {
      expect(formatTime(65)).toBe('01:05');
    });
  });

  describe('minutesToSeconds', () => {
    it('converts minutes to seconds', () => {
      expect(minutesToSeconds(5)).toBe(300);
    });
  });

  describe('secondsToMinutes', () => {
    it('floors the number of minutes', () => {
      expect(secondsToMinutes(119)).toBe(1);
      expect(secondsToMinutes(120)).toBe(2);
    });
  });

  describe('calculateFillPercentage', () => {
    it('returns percentage of remaining time', () => {
      expect(calculateFillPercentage(150, 300)).toBe(50);
    });

    it('never exceeds 100%', () => {
      expect(calculateFillPercentage(400, 300)).toBe(100);
    });

    it('never drops below 0%', () => {
      expect(calculateFillPercentage(-10, 300)).toBe(0);
    });

    it('handles zero initial time gracefully', () => {
      expect(calculateFillPercentage(10, 0)).toBe(0);
    });
  });
});
