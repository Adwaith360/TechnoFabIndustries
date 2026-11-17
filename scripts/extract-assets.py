from pathlib import Path
from pypdf import PdfReader
from PIL import Image, ImageOps, ImageDraw
import shutil

root = Path(__file__).resolve().parents[1]
assets = root / 'public' / 'assets'
reader = PdfReader(r'C:\Users\adwai\Downloads\Techno_Fab_Industries_Brochure.pdf')
names = {0: ['laser-cutting', 'logo'], 1: ['laser-cutting', 'coating', 'cnc-bending', 'fabrication'], 3: ['structural'], 4: ['electrical'], 5: ['automation'], 6: ['mechanical'], 7: ['architectural'], 8: ['process']}
for page, labels in names.items():
    for item, name in zip(reader.pages[page].images, labels):
        im = item.image.convert('RGB')
        im.thumbnail((1600, 1600))
        im.save(assets / f'{name}.webp', 'WEBP', quality=88)
shutil.copyfile(r'C:\Users\adwai\Downloads\Techno_Fab_Industries_Brochure.pdf', assets / 'Techno-Fab-Industries-Brochure.pdf')
files = list(assets.glob('*.webp'))
sheet = Image.new('RGB', (900, ((len(files)+2)//3)*240), '#eeeeee')
draw = ImageDraw.Draw(sheet)
for i, p in enumerate(files):
    sheet.paste(ImageOps.contain(Image.open(p), (290, 210)), ((i%3)*300, (i//3)*240))
    draw.text(((i%3)*300+5, (i//3)*240+215), p.stem, fill='black')
sheet.save(root / 'tmp' / 'pdfs' / 'assets.jpg')
print('Extracted', len(files), 'images and copied brochure.')
