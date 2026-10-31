export const SPEAKER_IMAGE = '/assets/brand/intro/speakers.webp';

// As 21 variações e a aceleração vêm da MatchCutIntro.jsx enviada por Bruno.
export const INTRO_MATERIALS = [
  { id: 'rupestre', file: '01_rupestre', duration: 0.42 },
  { id: 'papiro', file: '02_papiro', duration: 0.36 },
  { id: 'mosaico', file: '03_mosaico_bizantino', duration: 0.31 },
  { id: 'gutenberg', file: '04_gutenberg', duration: 0.27 },
  { id: 'barroco', file: '05_barroco', duration: 0.235 },
  { id: 'sumie', file: '06_sumie', duration: 0.205 },
  { id: 'taisho', file: '07_taisho', duration: 0.175 },
  { id: 'radio', file: '08_radio', duration: 0.15 },
  { id: 'rubber_hose', file: '09_rubber_hose', duration: 0.13 },
  { id: 'favo_cafe', file: '10_favo_cafe', duration: 0.11 },
  { id: 'comic_pop', file: '11_comic_pop', duration: 0.1 },
  { id: 'warhol', file: '12_warhol', duration: 0.095 },
  { id: 'claymation', file: '13_claymation', duration: 0.09 },
  { id: 'brutalismo', file: '14_brutalismo', duration: 0.085 },
  { id: 'patch_jeans', file: '15_patch_jeans', duration: 0.085 },
  { id: 'cassete_som', file: '16_cassete_som', duration: 0.085 },
  { id: 'satelite', file: '17_satelite', duration: 0.085 },
  { id: 'circuito', file: '18_circuito', duration: 0.085 },
  { id: 'fluid_acrylic', file: '19_fluid_acrylic', duration: 0.085 },
  { id: 'cyberpunk', file: '20_cyberpunk', duration: 0.085 },
  { id: 'ouro_obsidiana', file: '21_ouro_obsidiana', duration: 0.52 },
].map((material) => ({
  ...material,
  src: `/assets/brand/intro/${material.file}.webp`,
  mobileSrc: `/assets/brand/intro/mobile/${material.file}.webp`,
}));

export function shouldShowIntro({ directLanding, reducedMotion }) {
  return !directLanding && !reducedMotion;
}
