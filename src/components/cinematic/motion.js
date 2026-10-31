const POSES = [
  { at: 0, x: 0, y: 0, z: 0, yaw: 0, tilt: 0, roll: 0, scale: 1 },
  { at: 0.13, x: -1.62, y: 0.05, z: 0.1, yaw: 0.6, tilt: 0.12, roll: 0.08, scale: 1.3 },
  { at: 0.23, x: 0, y: 0.1, z: 0.6, yaw: 2.7, tilt: -0.14, roll: -0.12, scale: 1.8 },
  { at: 0.33, x: 0.3, y: -0.05, z: -0.2, yaw: 5.85, tilt: 0.02, roll: 0.02, scale: 1.15 },
  { at: 0.43, x: 0, y: 0.1, z: -5, yaw: 6.28, tilt: 0.1, roll: 0, scale: 0.45 },
  { at: 0.75, x: 0, y: 0, z: -6, yaw: 6.6, tilt: 0, roll: 0, scale: 0.3 },
  { at: 0.86, x: 1.7, y: 0.15, z: 0, yaw: 5.8, tilt: -0.1, roll: 0.1, scale: 1.18 },
  { at: 1, x: 1.15, y: 0.15, z: 0.3, yaw: 6.1, tilt: 0.08, roll: -0.06, scale: 1.48 },
];

export function samplePose(progress, compact = false) {
  const value = Math.max(0, Math.min(1, progress));
  const right = POSES.find((pose) => pose.at >= value) || POSES.at(-1);
  const left = [...POSES].reverse().find((pose) => pose.at <= value) || POSES[0];
  const raw = right.at === left.at ? 0 : (value - left.at) / (right.at - left.at);
  const weight = raw * raw * (3 - 2 * raw);
  const result = Object.fromEntries(['x', 'y', 'z', 'yaw', 'tilt', 'roll', 'scale'].map((key) => [key, left[key] + (right[key] - left[key]) * weight]));
  if (compact) {
    result.x *= value < 0.08 ? 0 : 0.16;
    result.y += value > 0.08 && (value < 0.19 || value > 0.82) ? 0.2 : 0;
  }
  result.opacity = value > 0.43 && value < 0.75 ? 0 : 1;
  return result;
}
