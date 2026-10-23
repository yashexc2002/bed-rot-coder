import record from 'node-record-lpcm16';
import fs from 'fs';

console.log("🎙️ Mic is ON! Kuch bolo... (Jab bolna khatam ho jaye toh terminal me Ctrl+C dabana)");

const file = fs.createWriteStream('command.wav', { encoding: 'binary' });

record.record({
  sampleRate: 16000,
  channels: 1,
  audioType: 'wav'
}).stream().pipe(file);