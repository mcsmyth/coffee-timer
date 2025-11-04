# Music Files

Place your lofi jazz music files here (MP3, OGG, etc.).

The music player supports multiple songs and will automatically loop through your playlist!

## Adding Songs to Your Playlist

1. **Download a royalty-free music track** (see sources below)
2. **Place the file** in this folder (e.g., `lofi-chill-beats.mp3`)
3. **Update the playlist** in `src/config/musicPlaylist.ts`:
   ```typescript
   export const MUSIC_PLAYLIST: Song[] = [
     {
       filename: 'lofi-jazz-cafe-327791.mp3',
       title: 'Lofi Jazz Cafe'
     },
     {
       filename: 'lofi-chill-beats.mp3',  // Add your new song here
       title: 'Lofi Chill Beats'
     }
   ];
   ```

## Playlist Features

- **Automatic progression**: Songs play sequentially
- **Infinite looping**: Playlist repeats when it reaches the end
- **Skip button**: Appears when you have 2+ songs (only visible when music is on)
- **Song info**: Shows current song name and position in playlist

## Free Music Sources

- **Pixabay**: https://pixabay.com/music/search/lofi%20jazz/
- **Free Music Archive**: https://freemusicarchive.org/
- **Incompetech**: https://incompetech.com/music/royalty-free/
- **Bensound**: https://www.bensound.com/
- **YouTube Audio Library**: https://www.youtube.com/audiolibrary (requires download)

**Important**: Make sure to check the license requirements for any music you use!

