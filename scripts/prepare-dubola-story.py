"""Prepare supplied media for the Dubola case. Originals are never modified."""
import concurrent.futures
import json
from pathlib import Path
import subprocess
import sys
from PIL import Image, ImageOps

PROJECT = Path(__file__).resolve().parents[1]
SOURCE = Path(sys.argv[1]) if len(sys.argv) > 1 else Path('/Users/bruno/Documents/Dubola Alimentos')
DEST = PROJECT / 'public/assets/cases/dubola/story'
DEST.mkdir(parents=True, exist_ok=True)

# Only resize and encode. Composition and close-ups belong to the page's viewports.
IMAGES = {
    'signature': ('mockups/como deve ser-02.png', 1100),
    'label': ('mockups/rotulo_ketchup_goiaba_230g.png', 1000),
    'ketchups': ('mockups/Trio ketchups BOPP.png', 1500),
    'maioneses': ('mockups/4 maioneses correto.png', 1600),
    'tomates': ('mockups/trio molho de tomate-certo.png', 1600),
    'avental': ('Churrasqueadas/Avental/Dubola Avental Churrasqueadas 2026.png', 1800),
    'camiseta': ('Churrasqueadas/Camiseta/Camiseta Churrasqueadas 2026.png', 1300),
    'bandana': ('Churrasqueadas/Bandana/bandana Dubola churrasqueadas 2026 lateral esquerda.png', 1200),
    'pano': ('Churrasqueadas/Pano de Prato/mockup1 pano de prato tomate pintado a mão.png', 1600),
    'sacola': ('Sacola Papel/sacola papel1.png', 1500),
    'windbanner': ('Churrasqueadas/windbanner/wind banner  Dubola mockup Frente Verso.png', 1300),
    'display': ('Churrasqueadas/Display/display Dubola mockup1.png', 1200),
    'evento': ('Dubola Eventos e outros/IMG_4059.jpg', 1200),
}

def run(args):
    subprocess.run(['ffmpeg', '-hide_banner', '-loglevel', 'error', '-y', *args], check=True, timeout=150)

def image_job(item):
    name, (source, width) = item
    origin = SOURCE / source
    target = DEST / (name + '.webp')
    with Image.open(origin) as raw:
        prepared = ImageOps.exif_transpose(raw)
        prepared.thumbnail((width, width * 3), Image.Resampling.LANCZOS)
        prepared.save(target, 'WEBP', quality=85, method=6)
    provenance = {'prompt': f'Origem: {origin}. Material fornecido pelo usuário. Apenas redimensionamento e conversão WebP; sem geração e sem alteração de rótulos.'}
    target.with_suffix('.webp.json').write_text(json.dumps(provenance, ensure_ascii=False, indent=2))
    return name

if __name__ == '__main__':
    with concurrent.futures.ThreadPoolExecutor(max_workers=3) as pool:
        for name in pool.map(image_job, IMAGES.items()):
            print('Imagem preparada:', name, flush=True)

    landing = Path('/tmp/dubola-landing-real.png')
    if landing.exists():
        with Image.open(landing) as shot:
            shot.save(DEST / 'landing.webp', 'WEBP', quality=90, method=6)
        (DEST / 'landing.webp.json').write_text(json.dumps({'prompt': 'Captura real de https://dubola.com.br/ em 30/10/2026, sem interface do navegador. Conversão WebP. Sem reconstrução ou geração.'}, ensure_ascii=False, indent=2))

    # Supplied event footage. Keep the full portrait composition and mute incidental audio.
    run(['-i', str(SOURCE / 'Dubola Eventos e outros/IMG_3851.mov'), '-an', '-vf', 'scale=-2:960', '-c:v', 'libx264', '-crf', '23', '-preset', 'fast', '-pix_fmt', 'yuv420p', '-movflags', '+faststart', str(DEST / 'encontro.mp4')])
    run(['-ss', '0.6', '-i', str(DEST / 'encontro.mp4'), '-frames:v', '1', str(DEST / 'encontro-poster.png')])
    with Image.open(DEST / 'encontro-poster.png') as frame:
        frame.save(DEST / 'encontro-poster.webp', 'WEBP', quality=85)
    (DEST / 'encontro-poster.png').unlink()
    (DEST / 'encontro-poster.webp.json').write_text(json.dumps({'prompt': 'Origem: IMG_3851.mov, Dubola Eventos e outros. Quadro em 0,6 segundo. Registro fornecido pelo usuário, sem identificação presumida de edição ou cidade.'}, ensure_ascii=False, indent=2))

    # A 30-second case film made exclusively from supplied footage and supplied designs.
    # The paper/black matte preserves every original frame. No synthetic footage or audio.
    scratch = Path('/tmp/dubola-case-film')
    scratch.mkdir(exist_ok=True)
    scenes = [
        (SOURCE / 'Landing Page Dubola/public/videos/hero-dubola.mp4', 4, False),
        (DEST / 'label.webp', 2, True),
        (DEST / 'maioneses.webp', 3, True),
        (SOURCE / 'Landing Page Dubola/public/videos/barbecue-hero.mp4', 4, False),
        (PROJECT / 'public/assets/cases/dubola/catalogo-jeito-dubola.webp', 2.5, True),
        (DEST / 'landing.webp', 2.5, True),
        (DEST / 'avental.webp', 3, True),
        (DEST / 'windbanner.webp', 2, True),
        (DEST / 'pano.webp', 2, True),
        (SOURCE / 'Dubola Eventos e outros/IMG_3379.mov', 5, False),
    ]
    segments = []
    for index, (source, duration, still) in enumerate(scenes):
        target = scratch / f'{index:02d}.mp4'
        inputs = ['-loop', '1', '-i', str(source)] if still else ['-i', str(source)]
        run([*inputs, '-t', str(duration), '-an', '-vf', 'scale=1280:720:force_original_aspect_ratio=decrease,pad=1280:720:(ow-iw)/2:(oh-ih)/2:color=0x11110f,setsar=1,fps=24', '-c:v', 'libx264', '-crf', '22', '-preset', 'fast', '-pix_fmt', 'yuv420p', str(target)])
        segments.append(target)
        print('Cena preparada:', index + 1, flush=True)
    playlist = scratch / 'scenes.txt'
    playlist.write_text(''.join(f"file '{p}'\n" for p in segments))
    run(['-f', 'concat', '-safe', '0', '-i', str(playlist), '-c', 'copy', '-movflags', '+faststart', str(DEST / 'filme-dubola.mp4')])
    with Image.open(PROJECT / 'public/assets/cases/dubola/hero-mesa.webp') as cover:
        cover.save(DEST / 'filme-poster.webp', 'WEBP', quality=88)
    (DEST / 'filme-poster.webp.json').write_text(json.dumps({'prompt': 'Origem: hero-mesa.webp, composição fornecida no acervo Dubola, já otimizada no projeto. Usada sem alteração de conteúdo como capa do filme do case.'}, ensure_ascii=False, indent=2))
    print('Filme de 30 segundos pronto.', flush=True)
