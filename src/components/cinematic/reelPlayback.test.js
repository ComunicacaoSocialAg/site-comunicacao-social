import test from 'node:test';
import assert from 'node:assert/strict';
import { createReelPlayback } from './reelPlayback.js';

class FakeVideo extends EventTarget {
  paused = true;
  currentTime = 0;
  rejectPlay = false;
  _muted = true;
  get muted() { return this._muted; }
  set muted(value) { this._muted = value; this.dispatchEvent(new Event('volumechange')); }
  play() {
    if (this.rejectPlay) return Promise.reject(new Error('Autoplay bloqueado'));
    this.paused = false;
    this.dispatchEvent(new Event('playing'));
    return Promise.resolve();
  }
  pause() {
    if (this.paused) return;
    this.paused = true;
    this.dispatchEvent(new Event('pause'));
  }
}

function setup(options = {}) {
  const video = new FakeVideo();
  const updates = [];
  const controller = createReelPlayback(video, { ...options, onState: (state) => updates.push(state) });
  return { video, controller, updates };
}

test('a prévia começa visível, muda, e retorna ao início após dez segundos', () => {
  const { video, controller } = setup();
  assert.equal(video.paused, true);
  controller.setVisible(true);
  assert.equal(video.paused, false);
  assert.equal(video.muted, true);
  video.currentTime = 10.1;
  video.dispatchEvent(new Event('timeupdate'));
  assert.equal(video.currentTime, 0);
  controller.destroy();
});

test('o clique reinicia com som, permite o filme inteiro e silencia no mesmo vídeo', () => {
  const { video, controller, updates } = setup();
  controller.setVisible(true);
  video.currentTime = 7;
  controller.toggleSound();
  assert.equal(video.currentTime, 0);
  assert.equal(video.muted, false);
  video.currentTime = 23;
  video.dispatchEvent(new Event('timeupdate'));
  assert.equal(video.currentTime, 23);
  assert.equal(updates.at(-1).sound, true);
  controller.toggleSound();
  assert.equal(video.currentTime, 0);
  assert.equal(video.muted, true);
  assert.equal(video.paused, false);
  controller.destroy();
});

test('sair da tela ou ocultar a aba interrompe o som e a reprodução', () => {
  const { video, controller } = setup();
  controller.setVisible(true);
  controller.toggleSound();
  controller.setVisible(false);
  assert.equal(video.paused, true);
  assert.equal(video.muted, true);
  controller.setVisible(true);
  assert.equal(video.paused, false);
  controller.toggleSound();
  controller.setHidden(true);
  assert.equal(video.paused, true);
  assert.equal(video.muted, true);
  controller.destroy();
});

test('a pausa escolhida pelo visitante é preservada ao sair e voltar', () => {
  const { video, controller } = setup();
  controller.setVisible(true);
  controller.togglePause();
  controller.setVisible(false);
  controller.setVisible(true);
  assert.equal(video.paused, true);
  controller.togglePause();
  assert.equal(video.paused, false);
  controller.destroy();
});

test('movimento reduzido exige ação explícita e reage a mudanças da preferência', () => {
  const { video, controller } = setup({ reducedMotion: true });
  controller.setVisible(true);
  assert.equal(video.paused, true);
  controller.toggleSound();
  assert.equal(video.paused, false);
  assert.equal(video.muted, false);
  controller.setReducedMotion(true);
  assert.equal(video.paused, true);
  assert.equal(video.muted, true);
  controller.destroy();
});

test('bloqueio de autoplay permite uma nova tentativa explícita', async () => {
  const { video, controller, updates } = setup();
  video.rejectPlay = true;
  controller.setVisible(true);
  await Promise.resolve();
  assert.equal(updates.at(-1).blocked, true);
  video.rejectPlay = false;
  controller.toggleSound();
  await Promise.resolve();
  assert.equal(updates.at(-1).blocked, false);
  assert.equal(video.paused, false);
  controller.destroy();
});

test('falhas são informadas e desmontar interrompe reproduções pendentes', async () => {
  const { video, controller, updates } = setup();
  video.dispatchEvent(new Event('error'));
  assert.equal(updates.at(-1).failed, true);
  controller.toggleSound();
  assert.equal(video.paused, true);
  controller.destroy();

  const pending = setup();
  let resolvePlay;
  pending.video.play = () => new Promise((resolve) => { resolvePlay = resolve; });
  pending.controller.setVisible(true);
  pending.controller.destroy();
  const count = pending.updates.length;
  pending.video.paused = false;
  resolvePlay();
  await Promise.resolve();
  assert.equal(pending.video.paused, true);
  assert.equal(pending.updates.length, count);
});
