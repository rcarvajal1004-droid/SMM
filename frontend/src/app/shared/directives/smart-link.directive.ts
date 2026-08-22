import { Directive, EventEmitter, HostListener, Input, Output } from '@angular/core';

export interface DetectedPlatform {
  name: string;
  color: string;
  icon: string;
}

@Directive({
  selector: 'input[smartLink]',
  standalone: true
})
export class SmartLinkDirective {
  @Input('smartLink') serviceSelector = '';
  @Output() smartLinkChange = new EventEmitter<DetectedPlatform | null>();

  private patterns: { [key: string]: DetectedPlatform } = {
    instagram: {
      name: 'Instagram',
      color: 'bg-pink-500 text-white',
      icon: '📷'
    },
    tiktok: {
      name: 'TikTok',
      color: 'bg-black text-white',
      icon: '🎵'
    },
    youtube: {
      name: 'YouTube',
      color: 'bg-red-600 text-white',
      icon: '▶️'
    },
    spotify: {
      name: 'Spotify',
      color: 'bg-green-500 text-white',
      icon: '🎧'
    },
    telegram: {
      name: 'Telegram',
      color: 'bg-blue-500 text-white',
      icon: '✈️'
    }
  };

  private regexPatterns: { [key: string]: RegExp } = {
    instagram: /instagram\.com\/(p|reel|tv|stories)/i,
    tiktok: /tiktok\.com\/@?[\w.-]+\/video\/\d+|vm\.tiktok\.com/i,
    youtube: /youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/shorts/i,
    spotify: /open\.spotify\.com\/(track|album|playlist|artist)/i,
    telegram: /t\.me\/[\w]+|telegram\.me\/[\w]+/i
  };

  @HostListener('input', ['$event.target'])
  onInput(input: EventTarget | null) {
    const value = (input as HTMLInputElement)?.value?.trim() || '';
    const detected = this.detectPlatform(value);
    this.smartLinkChange.emit(detected);
  }

  detectPlatform(url: string): DetectedPlatform | null {
    for (const [platform, regex] of Object.entries(this.regexPatterns)) {
      if (regex.test(url)) {
        return this.patterns[platform];
      }
    }
    return null;
  }
}
