import { Injectable } from '@angular/core';

export type FontSize = 'small' | 'normal' | 'large' | 'xlarge';
export type ColorblindMode = 'none' | 'protanopia' | 'deuteranopia' | 'tritanopia';

export interface A11ySettings {
  fontSize: FontSize;
  dyslexiaFont: boolean;
  highContrast: boolean;
  darkMode: boolean;
  colorblindMode: ColorblindMode;
  reduceMotion: boolean;
  lineSpacing: boolean;
  letterSpacing: boolean;
  focusHighlight: boolean;
  largeCursor: boolean;
  audioEnabled: boolean;
}

const DEFAULTS: A11ySettings = {
  fontSize: 'normal',
  dyslexiaFont: false,
  highContrast: false,
  darkMode: false,
  colorblindMode: 'none',
  reduceMotion: false,
  lineSpacing: false,
  letterSpacing: false,
  focusHighlight: false,
  largeCursor: false,
  audioEnabled: false,
};

const STORAGE_KEY = 'dobrobit_a11y_v2';

const FONT_SIZE_MAP: Record<FontSize, string> = {
  small:  '14px',
  normal: '16px',
  large:  '19px',
  xlarge: '22px',
};

@Injectable({ providedIn: 'root' })
export class AccessibilityService {
  private _s: A11ySettings = { ...DEFAULTS };

  get settings(): A11ySettings { return { ...this._s }; }

  constructor() { this.load(); }

  // ── Font size ────────────────────────────────────────────
  setFontSize(size: FontSize) {
    this._s.fontSize = size;
    document.documentElement.style.setProperty('font-size', FONT_SIZE_MAP[size], 'important');
    this.save();
  }

  // ── Dyslexia font ────────────────────────────────────────
  toggleDyslexia() {
    this._s.dyslexiaFont = !this._s.dyslexiaFont;
    if (this._s.dyslexiaFont) {
      this._loadOpenDyslexic();
      document.body.classList.add('a11y-dyslexia');
    } else {
      document.body.classList.remove('a11y-dyslexia');
    }
    this.save();
  }

  // ── Line spacing ─────────────────────────────────────────
  toggleLineSpacing() {
    this._s.lineSpacing = !this._s.lineSpacing;
    document.body.classList.toggle('a11y-line-spacing', this._s.lineSpacing);
    this.save();
  }

  // ── Letter spacing ───────────────────────────────────────
  toggleLetterSpacing() {
    this._s.letterSpacing = !this._s.letterSpacing;
    document.body.classList.toggle('a11y-letter-spacing', this._s.letterSpacing);
    this.save();
  }

  // ── High contrast ────────────────────────────────────────
  toggleHighContrast() {
    this._s.highContrast = !this._s.highContrast;
    document.body.classList.toggle('a11y-high-contrast', this._s.highContrast);
    this.save();
  }

  // ── Dark mode ────────────────────────────────────────────
  toggleDarkMode() {
    this._s.darkMode = !this._s.darkMode;
    document.body.classList.toggle('a11y-dark-mode', this._s.darkMode);
    this.save();
  }

  // ── Focus highlight ──────────────────────────────────────
  toggleFocusHighlight() {
    this._s.focusHighlight = !this._s.focusHighlight;
    document.body.classList.toggle('a11y-focus-highlight', this._s.focusHighlight);
    this.save();
  }

  // ── Large cursor ─────────────────────────────────────────
  toggleLargeCursor() {
    this._s.largeCursor = !this._s.largeCursor;
    document.body.classList.toggle('a11y-large-cursor', this._s.largeCursor);
    this.save();
  }

  // ── Colorblind mode ──────────────────────────────────────
  setColorblindMode(mode: ColorblindMode) {
    document.body.classList.remove('a11y-cb-protanopia','a11y-cb-deuteranopia','a11y-cb-tritanopia');
    this._s.colorblindMode = mode;
    if (mode !== 'none') document.body.classList.add(`a11y-cb-${mode}`);
    this.save();
  }

  // ── Reduce motion ────────────────────────────────────────
  toggleReduceMotion() {
    this._s.reduceMotion = !this._s.reduceMotion;
    document.body.classList.toggle('a11y-reduce-motion', this._s.reduceMotion);
    this.save();
  }

  // ── Audio (placeholder) ──────────────────────────────────
  toggleAudio() {
    this._s.audioEnabled = !this._s.audioEnabled;
    // Implementacija audio čitača slijedi u fazi 2
    this.save();
  }

  // ── Reset all ────────────────────────────────────────────
  resetAll() {
    document.body.classList.remove(
      'a11y-dyslexia','a11y-line-spacing','a11y-letter-spacing',
      'a11y-high-contrast','a11y-dark-mode','a11y-reduce-motion',
      'a11y-focus-highlight','a11y-large-cursor',
      'a11y-cb-protanopia','a11y-cb-deuteranopia','a11y-cb-tritanopia'
    );
    document.documentElement.style.removeProperty('font-size');
    this._s = { ...DEFAULTS };
    localStorage.removeItem(STORAGE_KEY);
  }

  // ── Persist ──────────────────────────────────────────────
  private save() {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(this._s)); } catch {}
  }

  private load() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return;
      const saved: A11ySettings = JSON.parse(raw);
      if (saved.fontSize)      this.setFontSize(saved.fontSize);
      if (saved.dyslexiaFont)  { this._s.dyslexiaFont = false; this.toggleDyslexia(); }
      if (saved.lineSpacing)   { this._s.lineSpacing = false; this.toggleLineSpacing(); }
      if (saved.letterSpacing) { this._s.letterSpacing = false; this.toggleLetterSpacing(); }
      if (saved.highContrast)    { this._s.highContrast = false; this.toggleHighContrast(); }
      if (saved.darkMode)        { this._s.darkMode = false; this.toggleDarkMode(); }
      if (saved.colorblindMode && saved.colorblindMode !== 'none') this.setColorblindMode(saved.colorblindMode);
      if (saved.reduceMotion)    { this._s.reduceMotion = false; this.toggleReduceMotion(); }
      if (saved.focusHighlight)  { this._s.focusHighlight = false; this.toggleFocusHighlight(); }
      if (saved.largeCursor)     { this._s.largeCursor = false; this.toggleLargeCursor(); }
      if (saved.audioEnabled)    { this._s.audioEnabled = saved.audioEnabled; }
    } catch {}
  }

  private _loadOpenDyslexic() {
    if (document.getElementById('opendyslexic-font')) return;
    const link = document.createElement('link');
    link.id = 'opendyslexic-font';
    link.rel = 'stylesheet';
    link.href = 'https://cdn.jsdelivr.net/npm/open-dyslexic@1.0.3/open-dyslexic-regular.css';
    document.head.appendChild(link);
  }
}
