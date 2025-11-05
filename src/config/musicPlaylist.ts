/**
 * Music Playlist Configuration
 *
 * Add your music files to the public/music directory and list them here.
 * The player will cycle through all songs in order and loop the playlist.
 */

export interface Song {
  /** Filename of the song in the public/music directory */
  filename: string;
  /** Display name for the song (optional) */
  title?: string;
}

/**
 * Playlist of songs to play during pomodoro sessions
 *
 * To add a new song:
 * 1. Place the audio file (MP3, OGG, etc.) in public/music/
 * 2. Add an entry to this array with the filename
 */
export const MUSIC_PLAYLIST: Song[] = [
  {
    filename: 'lofi-jazz-cafe-327791.mp3',
    title: 'Lofi Jazz Cafe'
  },
  {
    filename: 'sloth-tier-lofi-jazz-223593.mp3',
    title: 'Sloth Tier Lofi Jazz'
  },
  {
    filename: 'warm-breeze-lofi-music-chill-lofi-344259.mp3',
    title: 'Warm Breeze Lofi'
  }
];

/**
 * Get the full URL for a song
 */
export const getSongUrl = (filename: string): string => {
  const basePath = '/music/';
  return process.env.PUBLIC_URL
    ? `${process.env.PUBLIC_URL}${basePath}${filename}`
    : `${basePath}${filename}`;
};
