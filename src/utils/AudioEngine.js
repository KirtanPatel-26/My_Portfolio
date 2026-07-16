class AudioEngine {
  constructor() {
    this.ctx = null;
    this.isMuted = true;
    this.isPlaying = false;
    this.themeNode = null;
    this.tempo = 110;
    this.timerId = null;
  }

  init() {
    if (this.ctx) return;
    this.ctx = new (window.AudioContext || window.webkitAudioContext)();
  }

  toggleMute() {
    this.init();
    this.isMuted = !this.isMuted;
    
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }

    if (this.isMuted) {
      this.stopAmbientTheme();
    } else {
      this.startAmbientTheme();
    }
    return this.isMuted;
  }

  // Play a brief high-tech beep when hovering buttons
  playHoverBeep() {
    if (this.isMuted || !this.ctx) return;
    this.init();
    
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(880, this.ctx.currentTime); // A5
    osc.frequency.exponentialRampToValueAtTime(1760, this.ctx.currentTime + 0.1);
    
    gain.gain.setValueAtTime(0.04, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + 0.1);
    
    osc.connect(gain);
    gain.connect(this.ctx.destination);
    
    osc.start();
    osc.stop(this.ctx.currentTime + 0.1);
  }

  // Play a click spark sound
  playClickSpark() {
    if (this.isMuted || !this.ctx) return;
    this.init();
    
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    
    osc.type = 'sine';
    osc.frequency.setValueAtTime(2200, this.ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(500, this.ctx.currentTime + 0.05);
    
    gain.gain.setValueAtTime(0.05, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + 0.05);
    
    osc.connect(gain);
    gain.connect(this.ctx.destination);
    
    osc.start();
    osc.stop(this.ctx.currentTime + 0.05);
  }

  // Synthesize a dog bark
  playDogBark() {
    if (this.isMuted || !this.ctx) return;
    this.init();
    
    const now = this.ctx.currentTime;
    
    // First bark pulse
    this.generateBarkPulse(now);
    // Double bark after 0.12 seconds
    this.generateBarkPulse(now + 0.15);
  }

  generateBarkPulse(time) {
    const osc = this.ctx.createOscillator();
    const bandpass = this.ctx.createBiquadFilter();
    const gain = this.ctx.createGain();
    
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(110, time);
    osc.frequency.exponentialRampToValueAtTime(330, time + 0.04);
    osc.frequency.exponentialRampToValueAtTime(80, time + 0.12);
    
    bandpass.type = 'bandpass';
    bandpass.frequency.setValueAtTime(400, time);
    bandpass.Q.setValueAtTime(3.0, time);
    bandpass.frequency.exponentialRampToValueAtTime(200, time + 0.12);
    
    gain.gain.setValueAtTime(0.12, time);
    gain.gain.exponentialRampToValueAtTime(0.001, time + 0.12);
    
    osc.connect(bandpass);
    bandpass.connect(gain);
    gain.connect(this.ctx.destination);
    
    osc.start(time);
    osc.stop(time + 0.12);
  }

  // Synthesize paper plane launch (whoosh)
  playPaperPlane() {
    if (this.isMuted || !this.ctx) return;
    this.init();
    
    const bufferSize = this.ctx.sampleRate * 0.8;
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);
    
    // Generate white noise
    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1;
    }
    
    const noise = this.ctx.createBufferSource();
    noise.buffer = buffer;
    
    const filter = this.ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(200, this.ctx.currentTime);
    filter.frequency.exponentialRampToValueAtTime(4500, this.ctx.currentTime + 0.4);
    filter.frequency.exponentialRampToValueAtTime(800, this.ctx.currentTime + 0.8);
    
    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(0.0001, this.ctx.currentTime);
    gain.gain.linearRampToValueAtTime(0.12, this.ctx.currentTime + 0.2);
    gain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + 0.8);
    
    noise.connect(filter);
    filter.connect(gain);
    gain.connect(this.ctx.destination);
    
    noise.start();
  }

  // Synthesize explosion noise (for clicks or easter egg fireworks)
  playExplosion() {
    if (this.isMuted || !this.ctx) return;
    this.init();
    
    const bufferSize = this.ctx.sampleRate * 0.6;
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);
    
    // White noise
    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1;
    }
    
    const noise = this.ctx.createBufferSource();
    noise.buffer = buffer;
    
    const filter = this.ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(800, this.ctx.currentTime);
    filter.frequency.exponentialRampToValueAtTime(20, this.ctx.currentTime + 0.6);
    
    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(0.2, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + 0.6);
    
    noise.connect(filter);
    filter.connect(gain);
    gain.connect(this.ctx.destination);
    
    noise.start();
  }

  // Start the background procedural synth arpeggio theme
  startAmbientTheme() {
    this.init();
    if (this.isPlaying) return;
    this.isPlaying = true;
    this.isMuted = false;
    
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }

    let step = 0;
    const pentatonic = [130.81, 146.83, 164.81, 196.00, 220.00, 261.63, 293.66, 329.63, 392.00, 440.00]; // C minor/major pentatonic blend
    
    const playStep = () => {
      if (!this.isPlaying) return;
      
      const now = this.ctx.currentTime;
      const noteFreq = pentatonic[Math.floor(Math.random() * pentatonic.length)];
      
      // Arpeggiate
      if (step % 2 === 0) {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        
        osc.type = 'sine';
        osc.frequency.setValueAtTime(noteFreq * 2, now); // Higher pitch arpeggio
        
        gain.gain.setValueAtTime(0.008, now);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.4);
        
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        
        osc.start(now);
        osc.stop(now + 0.4);
      }
      
      // Bass line on beat 1 and 3
      if (step % 8 === 0) {
        const bassOsc = this.ctx.createOscillator();
        const bassGain = this.ctx.createGain();
        const bassFilter = this.ctx.createBiquadFilter();
        
        bassOsc.type = 'sawtooth';
        // Base notes: C (65Hz), Eb (77Hz), G (98Hz), Bb (116Hz)
        const bassNotes = [65.41, 77.78, 98.00, 116.54];
        const bassFreq = bassNotes[Math.floor(step / 8) % bassNotes.length];
        bassOsc.frequency.setValueAtTime(bassFreq, now);
        
        bassFilter.type = 'lowpass';
        bassFilter.frequency.setValueAtTime(200, now);
        bassFilter.frequency.exponentialRampToValueAtTime(80, now + 1.2);
        
        bassGain.gain.setValueAtTime(0.025, now);
        bassGain.gain.exponentialRampToValueAtTime(0.0001, now + 1.2);
        
        bassOsc.connect(bassFilter);
        bassFilter.connect(bassGain);
        bassGain.connect(this.ctx.destination);
        
        bassOsc.start(now);
        bassOsc.stop(now + 1.2);
      }

      step++;
      const nextTimeMs = (60 / this.tempo) * 250; // 16th notes
      this.timerId = setTimeout(playStep, nextTimeMs);
    };

    playStep();
  }

  stopAmbientTheme() {
    this.isPlaying = false;
    if (this.timerId) {
      clearTimeout(this.timerId);
      this.timerId = null;
    }
  }
}

export const audioEngine = new AudioEngine();
