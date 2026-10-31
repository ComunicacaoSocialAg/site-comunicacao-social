export function createWorkTiming(count) {
  const scenes = [];
  let time = 0;
  const TRANSITION_DURATION = 1.0;

  for (let index = 0; index < count; index++) {
    // O primeiro case segura mais tempo para absorver o scroll de entrada.
    // Os cases seguintes mantêm pausa confortável para observação antes da transição.
    const hold = index === 0 ? 3.6 : 1.9;
    scenes.push({
      start: time,
      rest: time + hold * 0.5,
      transition: time + hold,
    });
    time += hold + (index < count - 1 ? TRANSITION_DURATION : 0);
  }
  return { scenes, duration: time, transitionDuration: TRANSITION_DURATION };
}
