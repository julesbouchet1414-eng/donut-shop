/**
 * Icônes pixel-art 16x16 dessinées à la main, dans l'esprit des textures
 * Minecraft (aucune texture du jeu n'est copiée ici).
 *
 * Chaque sprite est une grille de 16 lignes de 16 caractères ; chaque
 * caractère est une clé de la palette du sprite, `.` = transparent.
 * Les pixels contigus de même couleur sont fusionnés en un seul <rect>.
 */

type Sprite = { palette: Record<string, string>; rows: string[] };

const P = {
  // pâte / donut
  dough: '#c98a3f',
  doughDark: '#8a5a2b',
  glaze: '#ff5fa2',
  glazeLight: '#ff9ac4',
  // métaux
  nether: '#4a3f47',
  netherLight: '#6d5d66',
  netherDark: '#2b2429',
  iron: '#d8d8d8',
  ironDark: '#8f8f9a',
  wood: '#8a5a32',
  woodDark: '#5c3a1f',
  // couleurs
  white: '#ffffff',
  gold: '#ffb52e',
  goldDark: '#c8860f',
  cyan: '#4ee2ec',
  cyanDark: '#1f9aa8',
  green: '#3ddc84',
  greenDark: '#1f8f52',
  red: '#e8485f',
  redDark: '#9e2436',
  blue: '#5b8cff',
  blueDark: '#2f4fa8',
  purple: '#b46cff',
  purpleDark: '#5c2f8f',
  skin: '#c9906a',
  hair: '#3b2a1a',
  shadow: '#1a1520',
};

const SPRITES: Record<string, Sprite> = {
  donut: donutSprite(P.glaze, P.glazeLight),
  donutChoco: donutSprite('#7b4a2a', '#a4703f'),
  donutMint: donutSprite('#3ddc84', '#8ff5bd'),
  donutGold: donutSprite('#ffb52e', '#ffd98a'),
  donutPurple: donutSprite('#b46cff', '#d9b6ff'),

  elytra: {
    palette: { a: P.ironDark, b: '#b9b6c4', c: '#6b6875', d: P.netherDark },
    rows: [
      '................',
      '..cc........cc..',
      '.cbbc......cbbc.',
      '.cbbbc....cbbbc.',
      'cbbbbc....cbbbbc',
      'cbbbbbc..cbbbbbc',
      'cabbbbc..cbbbbac',
      'cabbbbcddcbbbbac',
      'cabbbbcddcbbbbac',
      'cabbbbcddcbbbbac',
      '.cabbbcddcbbbac.',
      '.caabbcddcbbaac.',
      '..caabcddcbaac..',
      '...cacddddcac...',
      '....cddddddc....',
      '.....cdddc......',
    ],
  },

  helmet: {
    palette: { n: P.nether, l: P.netherLight, d: P.netherDark, s: P.shadow },
    rows: [
      '................',
      '................',
      '...dddddddddd...',
      '..dllllllllllld.',
      '.dlnnnnnnnnnnld.',
      '.dlnnnnnnnnnnld.',
      '.dlnnnnnnnnnnld.',
      '.dlnnnnnnnnnnld.',
      '.dlnssssssssnld.',
      '.dlnssssssssnld.',
      '.dlnnssssssnnld.',
      '.dllnnnnnnnnlld.',
      '.dlnnd....dnnld.',
      '.dlnnd....dnnld.',
      '..ddd......ddd..',
      '................',
    ],
  },

  chestplate: {
    palette: { n: P.nether, l: P.netherLight, d: P.netherDark },
    rows: [
      '................',
      '.dd..........dd.',
      'dlld........dlld',
      'dlnld......dlnld',
      'dlnnd......dlnnd',
      'dlnndddddddlnnnd',
      'dlnnllllllllnnnd',
      'dlnnnnnnnnnnnnnd',
      'dlnnnnnnnnnnnnnd',
      'dlnnnnnnnnnnnnnd',
      '.dlnnnnnnnnnnnd.',
      '.dlnnnnnnnnnnnd.',
      '.dlnnnnnnnnnnnd.',
      '.dlnnnnnnnnnnnd.',
      '.ddnnnnnnnnnndd.',
      '..dddddddddddd..',
    ],
  },

  sword: {
    palette: { n: P.nether, l: P.netherLight, d: P.netherDark, w: P.woodDark, g: P.gold },
    rows: [
      '............ddd.',
      '...........dlnd.',
      '..........dlnnd.',
      '.........dlnndd.',
      '........dlnndd..',
      '.......dlnndd...',
      '......dlnndd....',
      '.....dlnndd.....',
      '..g.dlnndd......',
      '.ggggdlndd......',
      '.ggggdndd.......',
      'wggggdd.........',
      '.wwgg...........',
      'w.www...........',
      'ww.w............',
      'w...............',
    ],
  },

  axe: {
    palette: { n: P.nether, l: P.netherLight, d: P.netherDark, w: P.wood, W: P.woodDark },
    rows: [
      '.....dddddd.....',
      '....dlnnnnld....',
      '...dlnnnnnnld...',
      '..dlnnnnnnnnld..',
      '..dlnnnndnnnld..',
      '..dlnnnd.dnnld..',
      '..dlnnd...dnld..',
      '...dld.wW.dld...',
      '....d..wW..d....',
      '.......wW.......',
      '.......wW.......',
      '.......wW.......',
      '.......wW.......',
      '.......wW.......',
      '.......wW.......',
      '.......WW.......',
    ],
  },

  bow: {
    palette: { w: P.wood, W: P.woodDark, s: '#d8d0c0', a: P.ironDark, f: P.white },
    rows: [
      '..........WWw...',
      '.........Ww..w..',
      '........Ww....w.',
      '.......s.......w',
      '......s.......Ww',
      '.....s........Ww',
      '....s.........Ww',
      'faaas..........w',
      'faaas..........w',
      '....s.........Ww',
      '.....s........Ww',
      '......s.......Ww',
      '.......s.......w',
      '........Ww....w.',
      '.........Ww..w..',
      '..........WWw...',
    ],
  },

  trident: {
    palette: { c: P.cyan, d: P.cyanDark, s: '#2a6b74', l: P.white },
    rows: [
      '.d.....d.....d..',
      '.dc....dc....dc.',
      '.dc....dc....dc.',
      '.dc....dc....dc.',
      '.dc....dc....dc.',
      '.dcd...dc...ddc.',
      '..dcd..dc..dcd..',
      '...dcddcddcdd...',
      '....dcccccdd....',
      '......dcd.......',
      '......dcd.......',
      '......dcd.......',
      '......dcd.......',
      '......dcd.......',
      '......dsd.......',
      '.......s........',
    ],
  },

  bookGreen: bookSprite(P.green, P.greenDark),
  bookBlue: bookSprite(P.blue, P.blueDark),
  bookRed: bookSprite(P.red, P.redDark),
  bookGold: bookSprite(P.gold, P.goldDark),

  apple: {
    palette: { g: P.gold, G: P.goldDark, l: '#ffe9a8', s: P.greenDark, w: P.wood },
    rows: [
      '................',
      '.......w........',
      '......w.ss......',
      '.....w.ssss.....',
      '...GGwGGGG......',
      '..GglGGGGGGG....',
      '.GgllgGGGGGGG...',
      '.GgllggGGGGGGG..',
      '.GglgggGGGGGGG..',
      '.GgggggGGGGGGG..',
      '.GgggggGGGGGGG..',
      '..GggggGGGGGGG..',
      '..GGgggGGGGGGG..',
      '...GGGGGGGGGG...',
      '....GGGGGGGG....',
      '................',
    ],
  },

  potion: {
    palette: { g: '#cfd8dc', d: '#8a949a', r: P.red, R: P.redDark, c: P.woodDark, l: P.white },
    rows: [
      '.......cc.......',
      '.......cc.......',
      '......dccd......',
      '......dggd......',
      '......dggd......',
      '.....dggggd.....',
      '....dglgggdd....',
      '...dglrrrrgdd...',
      '..dglrrrrrrRdd..',
      '..dgrrrrrrrRdd..',
      '..dgrrrrrrrRdd..',
      '..dgrrrrrrrRdd..',
      '..dgRrrrrrRRdd..',
      '...dgRRRRRRdd...',
      '....ddddddd.....',
      '................',
    ],
  },

  star: {
    palette: { w: P.white, l: '#e6e0ff', d: '#a89ec9', s: P.purple },
    rows: [
      '.......ss.......',
      '.......ww.......',
      '......wllw......',
      '......wllw......',
      '.s....wllw....s.',
      '..s..wllllw..s..',
      '...swllllllws...',
      '.sswllllllllwss.',
      '.sswllllllllwss.',
      '...swllllllws...',
      '..s..wllllw..s..',
      '.s....wllw....s.',
      '......wllw......',
      '......wllw......',
      '.......ww.......',
      '.......ss.......',
    ],
  },

  netheriteBlock: {
    palette: { n: P.nether, l: P.netherLight, d: P.netherDark, s: P.shadow, g: '#7a6a72' },
    rows: [
      'dddddddddddddddd',
      'dlllllllllllllld',
      'dlnnnsnnnnnnnngd',
      'dlnnnsnnngnnnnnd',
      'dlnngsnnngnnnsnd',
      'dlnngnnnnnnnnsnd',
      'dlnnnnnngnnnnsnd',
      'dlsnnnngnnnnnnnd',
      'dlsnnnngnnnnsnnd',
      'dlnnnnnnnnnnsnnd',
      'dlnngnnnnnnnnnnd',
      'dlnngnnnsnnnngnd',
      'dlnnnnnnsnnnngnd',
      'dlnnnnnnnnnnnnnd',
      'dnnnnnnnnnnnnnnd',
      'dddddddddddddddd',
    ],
  },

  beacon: {
    palette: { g: '#9fd8e8', d: '#3b6f80', c: P.cyan, w: P.white, o: '#1b2a33' },
    rows: [
      'dddddddddddddddd',
      'dggggggggggggggd',
      'dgoooooooooooogd',
      'dgo.wwwwwwww.ogd',
      'dgo.wccccccw.ogd',
      'dgo.wccccccw.ogd',
      'dgo.wccccccw.ogd',
      'dgo.wccccccw.ogd',
      'dgo.wccccccw.ogd',
      'dgo.wccccccw.ogd',
      'dgo.wccccccw.ogd',
      'dgo.wwwwwwww.ogd',
      'dgoooooooooooogd',
      'dggggggggggggggd',
      'dddddddddddddddd',
      'dddddddddddddddd',
    ],
  },

  shulker: {
    palette: { p: P.purple, d: P.purpleDark, l: '#d9b6ff', s: '#3b1f5c' },
    rows: [
      '................',
      '...dddddddddd...',
      '..dllllllllllld.',
      '..dlppppppppppd.',
      '..dlpppsspppppd.',
      '..dlppssssppppd.',
      '..dddddddddddd..',
      '.dlllllllllllld.',
      '.dlpppppppppppd.',
      '.dlpppppppppppd.',
      '.dlppppsspppppd.',
      '.dlpppssssppppd.',
      '.dlpppppppppppd.',
      '.dlpppppppppppd.',
      '.dddddddddddddd.',
      '................',
    ],
  },

  head: {
    palette: { s: P.skin, h: P.hair, e: '#3b5dc9', d: '#8a5f42', w: P.white },
    rows: [
      '................',
      '..hhhhhhhhhhhh..',
      '.hhhhhhhhhhhhhh.',
      '.hhhhhhhhhhhhhh.',
      '.hssssssssssssh.',
      '.hssssssssssssh.',
      '.hswwessswweshh.',
      '.hswwessswwessh.',
      '.hsssssssssssss.',
      '.hssssssssssssh.',
      '.hsssdddddddssh.',
      '.hssssssssssssh.',
      '.hssssssssssssh.',
      '.hssssssssssssh.',
      '..hssssssssssh..',
      '................',
    ],
  },

  dragonEgg: {
    palette: { d: '#120a1c', p: '#2d1543', l: P.purple, w: '#e6d4ff', s: '#43206b' },
    rows: [
      '.......dd.......',
      '......dppd......',
      '.....dppppd.....',
      '.....dplppd.....',
      '....dppppppd....',
      '....dpplpppd....',
      '...dppppppppd...',
      '...dpplppppsd...',
      '..dppppppppppd..',
      '..dpplppppppwd..',
      '..dppppppplppd..',
      '.dppppppppppppd.',
      '.dpplppppppppsd.',
      '.dpppppppppppd..',
      '..dddddddddddd..',
      '................',
    ],
  },
};

function donutSprite(glaze: string, glazeLight: string): Sprite {
  return {
    palette: {
      D: P.doughDark,
      d: P.dough,
      g: glaze,
      G: glazeLight,
      '1': P.white,
      '2': P.gold,
      '3': P.cyan,
      '4': P.green,
    },
    rows: [
      '.....DDDDDD.....',
      '...DDggggggDD...',
      '..DggggggggggD..',
      '.Dgggg2gggggggD.',
      '.DggggggggggggD.',
      'Dgggg3gggggggggD',
      'Dggggg....ggggGD',
      'Dgggg......ggggD',
      'Dgggg......ggggD',
      'Dggggg....gggggD',
      'Dgg1ggggggggggGD',
      '.DggggggggggggD.',
      '.Dgggg4gggggggD.',
      '..DggggggggggD..',
      '...DDggggggDD...',
      '.....DDDDDD.....',
    ],
  };
}

function bookSprite(cover: string, coverDark: string): Sprite {
  return {
    palette: { c: cover, d: coverDark, p: '#f3e6c8', s: '#cbb894', g: P.gold, l: '#fffbe8' },
    rows: [
      '................',
      '..dddddddddd....',
      '.dccccccccccd...',
      '.dcccccccccccd..',
      '.dccppppppppcd..',
      '.dccpsspsspscd..',
      '.dccplllllpscd..',
      '.dccpsspsspscd..',
      '.dccplllllpscd..',
      '.dccpsspsspscd..',
      '.dccplllllpscd..',
      '.dccppppppppcd..',
      '.dcccccccccccd..',
      '.dccccccccccd.g.',
      '..ddddddddddd.g.',
      '.............ggg',
    ],
  };
}

export const SPRITE_KEYS = Object.keys(SPRITES);

type Run = { x: number; y: number; w: number; fill: string };

function toRuns(sprite: Sprite): Run[] {
  const runs: Run[] = [];
  sprite.rows.forEach((row, y) => {
    let x = 0;
    while (x < row.length) {
      const key = row[x];
      if (key === '.' || !sprite.palette[key]) {
        x += 1;
        continue;
      }
      let w = 1;
      while (x + w < row.length && row[x + w] === key) w += 1;
      runs.push({ x, y, w, fill: sprite.palette[key] });
      x += w;
    }
  });
  return runs;
}

const RUN_CACHE = new Map<string, Run[]>();

function runsFor(name: string): Run[] {
  const cached = RUN_CACHE.get(name);
  if (cached) return cached;
  const sprite = SPRITES[name] ?? SPRITES.donut;
  const runs = toRuns(sprite);
  RUN_CACHE.set(name, runs);
  return runs;
}

export default function PixelIcon({
  name,
  size = 32,
  className = '',
  title,
}: {
  name: string;
  size?: number;
  className?: string;
  title?: string;
}) {
  const runs = runsFor(name);

  return (
    <svg
      viewBox="0 0 16 16"
      width={size}
      height={size}
      className={className}
      shapeRendering="crispEdges"
      role={title ? 'img' : undefined}
      aria-label={title}
      aria-hidden={title ? undefined : true}
    >
      {runs.map((r, i) => (
        <rect key={i} x={r.x} y={r.y} width={r.w} height={1} fill={r.fill} />
      ))}
    </svg>
  );
}
