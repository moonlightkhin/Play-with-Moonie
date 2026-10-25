# ASSET GUIDE — Moonie Claw Club

This page lists every picture in the game, what it is for, and where it lives.

## What I found in your ZIP (`Claw_Machine_Game.zip`)

13 files. I opened and measured every one.

| Your original file | Size (pixels) | What it is | Had see-through parts? |
|---|---|---|---|
| `machine.png` | 1200 × 1800 | The machine frame | **No.** Yellow outside, **solid white window**, and a small claw drawn inside the window (top-left) |
| `claw-open.png` | 1200 × 1800 | Open claw, no box | **No.** White background. The claw is small, near the top-left of a big empty page |
| `claw-closed-box.png` | 1200 × 1800 | Closed claw already holding its box | **No.** White background |
| `blind-box-closeup.png` | 800 × 800 | Close-up box (stage 1) | **No.** White background |
| `blind-box-open.png` | 800 × 800 | Open box (stage 2) | **No.** White background |
| `Moonie01.png` … `Moonie08.png` | 800 × 800 each | The eight dolls | **No.** White background |

None of your PNGs contained real transparency. They are all solid-colour pictures (RGB), so I could not use them as layers exactly as they were.

## What I changed (and what I did NOT change)

**Your original files are untouched.** They are saved, byte for byte, in the separate file `moonie-originals-backup.zip`. Keep that on your own computer. **Do NOT put it in the GitHub repository**, because everything in the repository is public.

The game uses *copies* that I processed. I did not redraw, recolour, resize or restyle any artwork. I only did these things:

1. **`machine.png`** — made the big glass window **transparent**, so the claw can be seen behind the frame. The frame, clouds, scallops, moon, stars, title and lower panel are unchanged.
   - Your machine picture had a small claw **drawn into** the window. It would have stayed on screen forever, so I removed it. Where it covered part of the orange scallop and the left frame line, I **redrew a few pixels** to match the neighbouring scallop and line. Zoom in on the top-left corner of the window if you want to check it.
2. **`claw-open.png` and `claw-closed-box.png`** — removed the white background and cropped away the huge empty space. **Both use exactly the same crop (260 × 293 px)**, so the hook sits in the same place in both and nothing jumps when they swap.
3. **Moonie01–08, `blind-box-closeup.png`, `blind-box-open.png`** — removed the white background so they are see-through PNGs. Size is unchanged (800 × 800).

## Essential asset that was MISSING

**`blind-box.png`** (the small boxes piled up inside the machine) was not in your ZIP.

I did **not** invent a new drawing. As a stand-in I made `assets/boxes/blind-box.png` by cropping your own `blind-box-closeup.png`. It works, but the pile boxes are tilted 3/4 views, while the box in `claw-closed-box.png` is drawn front-on.

**To use your own drawing later:** draw a blind box, export it as a see-through PNG, name it `blind-box.png`, and replace the file in `assets/boxes/`. Nothing else needs to change. For the best match, make it roughly 120 wide × 130 tall in proportion, like the box in your closed claw.

## Final folder map

```
moonie-claw-club/
├── index.html
├── style.css
├── game.js
├── README.md
├── ASSET-GUIDE.md
└── assets/
    ├── machine/
    │   └── machine.png               ← frame with see-through window
    ├── claw/
    │   ├── claw-open.png             ← open claw (moving, descending)
    │   └── claw-closed-box.png       ← closed claw + its box (lifting)
    ├── boxes/
    │   ├── blind-box.png             ← small boxes in the machine (STAND-IN)
    │   ├── blind-box-closeup.png     ← reveal stage 1
    │   └── blind-box-open.png        ← reveal stage 2
    ├── moonie/
    │   ├── Moonie01.png … Moonie08.png   ← the dolls (see-through)
```

## Which picture does what

| File in the game | Used for | Where it appears |
|---|---|---|
| `assets/machine/machine.png` | The machine frame, always on top | Whole machine |
| `assets/claw/claw-open.png` | Claw while moving, and while going down | Inside the window |
| `assets/claw/claw-closed-box.png` | Claw after it closes, going up and across | Inside the window |
| `assets/boxes/blind-box.png` | The pile of prize boxes | Bottom of the window |
| `assets/boxes/blind-box-closeup.png` | First reveal screen ("Tap your box") | Reveal screen |
| `assets/boxes/blind-box-open.png` | Second reveal screen ("Tap again") | Reveal screen |
| `assets/moonie/Moonie01.png` … `08.png` | The prize + downloads + collection | Reveal screen, collection |

## Layer order (back to front) inside the machine

1. White backing behind the window
2. Open claw (it slides **behind** the pile as it goes down)
3. The pile of blind boxes
4. Closed claw + box (comes **in front** after the grab)
5. `machine.png` frame — on top of everything, so the claw never looks like it leaves the machine

## Moonie list (edit names, odds and text in `game.js`, section 1)

| File | Placeholder name | Rarity | Weight (chance) |
|---|---|---|---|
| `Moonie01.png` | Noodle Night Moonie | Common | 25 |
| `Moonie02.png` | Mailbox Moonie | Common | 20 |
| `Moonie03.png` | Hello Moonie | Uncommon | 16 |
| `Moonie04.png` | Starlight Moonie | Uncommon | 13 |
| `Moonie05.png` | Camera Moonie | Rare | 10 |
| `Moonie06.png` | Daydream Moonie | Rare | 8 |
| `Moonie07.png` | Shiba Moonie | Super Rare | 6 |
| `Moonie08.png` | Secret Wink Moonie | **Secret** | 2 |

The names and descriptions are **placeholders I made up from what the dolls look like**. Please replace them with your real names.

## If you redraw the machine later

Keep `machine.png` at **1200 × 1800**, with the glass window **see-through** (transparent in your drawing app: select the white window area and delete it, on a layer with no background). The window's position is stored in `style.css`, section 1A. If you move the window in your drawing, update those four numbers.

**Important:** CSS cannot turn white pixels in a picture into see-through ones. The transparency has to be inside the PNG file itself, which is why I made the processed copy.

## Protecting your artwork

- Every **Download PNG** and **Download JPEG** is stamped with **"Moonie Brownie"** (a signature at the bottom plus faint repeated marks). The game never gives out the raw file. You can change or switch off the stamp in `game.js` → `SETTINGS.watermark`.
- Right-click and drag-saving are blocked on pictures.
- **Honest limit:** anything a website shows can still be saved by a determined person (browser developer tools, screenshots). The see-through PNGs in `assets/` are public once published. The stamp and the blocks stop casual saving, not a determined one.
