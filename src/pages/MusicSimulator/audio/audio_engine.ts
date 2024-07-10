
export interface AudioSource {
  name: string;
  src: string;
  audio?: HTMLAudioElement;
}

export class AudioEngine {
  sources: AudioSource[];

  constructor(sources: AudioSource[]) {
    this.sources = sources;
    this.sources.map((s) => this.load_source(s));
  }

  private load_source(source: AudioSource) {
    const audio = document.createElement("audio");
    audio.src = source.src;
    source.audio = audio;
  }
}
