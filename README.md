# Audio Player with WaveSurfer.js and React

This project demonstrates how to integrate WaveSurfer.js with a React application using TypeScript. The example includes features such as playback controls, zoom functionality, and optional spectrogram visualization.

## Features

- **Playback Controls**: Play, pause, and skip through the audio.
- **Zoom Control**: Adjust the zoom level of the waveform.
- **Spectrogram Visualization**: Toggle the spectrogram view on and off.
- **Real-time Updates**: Display the current timestamp of the audio.

## Technologies Used

- **React**: A JavaScript library for building user interfaces.
- **TypeScript**: A typed superset of JavaScript that compiles to plain JavaScript.
- **WaveSurfer.js**: A customizable audio waveform visualization, built on Web Audio API.
- **Material-UI**: A popular React UI framework.

## Getting Started

### Prerequisites

- Node.js and npm installed on your machine.

### Installation

1. Clone the repository:
    ```sh
    git clone <repository-url>
    cd <repository-directory>
    ```

2. Install the dependencies:
    ```sh
    npm install
    ```

3. Start the development server:
    ```sh
    npm run dev
    ```

### Usage

1. Open your browser and navigate to `http://localhost:3000/react-wavesurferjs-player`.
2. Use the playback controls to play, pause, and skip through the audio.
3. Adjust the zoom level using the zoom control.
4. Toggle the spectrogram view using the spectrogram control.

## Project Structure

- `src/feature/AudioPlayer.tsx`: Main component that integrates WaveSurfer.js with React.
- `src/controls`: Contains the playback, zoom, and spectrogram control components.
- `src/plugins`: Contains the plugin instances for WaveSurfer.js.

## Customization

You can customize the audio player by modifying the components and styles in the `src` directory. The `audioPlayerOptions` object in `AudioPlayer.tsx` can be adjusted to change the WaveSurfer.js configuration.

## Lessons Learned

For some reason registering the Spectrogram plugin didn't render it correctly. But by setting the zoom `wavesurfer.zoom(zoom)` to the current zoom, somehow, it worked. I'm not sure why this is the case, but it works.
Maybe it's because the action caused by the zoom change triggers the rendering of the spectrogram.

It also worked with `seekTo(0)`, but it wouldn't be practical. Specially if the player cue point is located somewhere else other than the initial 0 position.

## License

This project is licensed under the MIT License.