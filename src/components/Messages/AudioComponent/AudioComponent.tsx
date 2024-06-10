import { FC, useEffect, useRef, useState } from 'react';
import { useWavesurfer } from '@wavesurfer/react';
import { useTranslation } from 'react-i18next';
import { useDebounce } from 'use-debounce';

import ButtonAudio from '@components/Buttons/ButtonAudio/ButtonAudio';
import convertAudioMsgTime from '@utils/messages/convertAudioMsgTime';
import { IAudioComponentProps } from '@interfaces/IAudioComponentProps';

const AudioComponent: FC<IAudioComponentProps> = ({ audioUrl }) => {
  const [volume, setVolume] = useState<number>(100);
  const containerRef = useRef(null);
  const [debouncedVolume] = useDebounce(volume, 50);
  const { t } = useTranslation('translation');

  const { wavesurfer, isPlaying, currentTime } = useWavesurfer({
    container: containerRef,
    url: audioUrl,
    waveColor: 'orange',
    height: 50,
  });

  useEffect(() => {
    if (wavesurfer) {
      wavesurfer.setVolume(debouncedVolume / 100);
    }
  }, [debouncedVolume, wavesurfer]);

  const onPlayPause = () => {
    wavesurfer?.playPause();
  };

  const onVolumeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseInt(event.target.value);
    setVolume(newVolume);
  };

  return (
    <div className="flex flex-row items-start gap-2 w-[300px] sm:w-[200px] md:min-w-[220px] md:max-w-md lg:min-w-[360px]">
      <ButtonAudio isPlaying={isPlaying} onPlayPause={onPlayPause} />

      <div className="flex flex-1 flex-col items-start w-full">
        <div
          className="flex-1 w-full sm:w-[95%] md:w-full"
          ref={containerRef}
        />

        <div className="flex justify-between w-full sm:flex-col lg:flex-row">
          <div className="flex gap-1">
            <p className="text-dark dark:text-white">{t('Time')}</p>
            {isPlaying && (
              <p className="text-black dark:text-white">
                {convertAudioMsgTime(currentTime)}
              </p>
            )}
            {!isPlaying && wavesurfer && (
              <p className="text-black dark:text-white">
                {convertAudioMsgTime(wavesurfer.getDuration())}
              </p>
            )}
          </div>

          <div className="flex gap-1 flex-wrap">
            <p className="text-dark dark:text-white">{t('Volume')}</p>
            <input
              className="w-24 sm:w-16 lg:w-24 
            appearance-none bg-transparent 
            [&::-webkit-slider-runnable-track]:rounded-full 
            [&::-webkit-slider-runnable-track]:bg-zinc-500
            dark:[&::-webkit-slider-runnable-track]:bg-zinc-100

            [&::-webkit-slider-thumb]:appearance-none 
            [&::-webkit-slider-thumb]:h-[10px] 
            [&::-webkit-slider-thumb]:w-[10px] 
            [&::-webkit-slider-thumb]:rounded-full 
            [&::-webkit-slider-thumb]:bg-zinc-950
            dark:[&::-webkit-slider-thumb]:bg-zinc-500"
              type="range"
              min="0"
              max="100"
              value={volume}
              onChange={onVolumeChange}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AudioComponent;
