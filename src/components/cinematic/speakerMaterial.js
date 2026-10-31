import { Color, LinearFilter, LinearMipmapLinearFilter } from 'three';

// Correção de acabamento durante a renderização. O atlas original, as UVs e
// os detalhes dos cones continuam intactos no arquivo do modelo.
const PAINT_CORRECTION = `
#include <map_fragment>
float csagPaintWeight = 0.0;
#ifdef USE_MAP
  vec3 csagOriginal = diffuseColor.rgb;
  csagPaintWeight = smoothstep(0.035, 0.14, csagOriginal.g - csagOriginal.b)
    * smoothstep(0.10, 0.30, min(csagOriginal.r, csagOriginal.g));
  vec3 csagMacro = textureLod(map, vMapUv, 4.0).rgb;
  vec3 csagLumaWeights = vec3(0.2126, 0.7152, 0.0722);
  float csagLuma = dot(csagOriginal, csagLumaWeights);
  float csagMacroLuma = dot(csagMacro, csagLumaWeights);
  float csagConfidence = smoothstep(0.08, 0.22, min(csagMacro.r, csagMacro.g))
    * smoothstep(0.015, 0.08, csagMacro.g - csagMacro.b);
  float csagDetail = clamp(csagLuma / max(csagMacroLuma, 0.04), 0.75, 1.25);
  float csagBalancedLuma = mix(csagLuma, 0.47 * csagDetail, 0.16 * csagConfidence);
  vec3 csagBalancedPaint = csagPaintColor * csagBalancedLuma
    / dot(csagPaintColor, csagLumaWeights);
  diffuseColor.rgb = mix(csagOriginal, csagBalancedPaint, 0.38 * csagPaintWeight);
#endif
`;

export function refineSpeakerMaterial(original, maxAnisotropy = 1) {
  const material = original.clone();
  material.roughness = 0.70;
  material.metalness = 0.035;
  material.envMapIntensity = 0.85;
  material.dithering = true;
  // A superfície permanece opaca: evita manchas de ordenação entre faces.
  material.transparent = false;
  material.opacity = 1;

  if (original.map) {
    material.map = original.map.clone();
    material.map.anisotropy = Math.max(1, Math.min(8, maxAnisotropy));
    material.map.minFilter = LinearMipmapLinearFilter;
    material.map.magFilter = LinearFilter;
    material.map.generateMipmaps = true;
    material.map.needsUpdate = true;
  }

  material.onBeforeCompile = (shader) => {
    shader.uniforms.csagPaintColor = { value: new Color('#e9bb46') };
    shader.fragmentShader = shader.fragmentShader
      .replace('#include <common>', '#include <common>\nuniform vec3 csagPaintColor;')
      .replace('#include <map_fragment>', PAINT_CORRECTION)
      .replace('#include <roughnessmap_fragment>', '#include <roughnessmap_fragment>\nroughnessFactor = mix(roughnessFactor, 0.54, csagPaintWeight);')
      .replace('#include <metalnessmap_fragment>', '#include <metalnessmap_fragment>\nmetalnessFactor = mix(metalnessFactor, 0.075, csagPaintWeight);');
  };
  material.customProgramCacheKey = () => 'csag-original-speaker-satin-v1';
  return material;
}
