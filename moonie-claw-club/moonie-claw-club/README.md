# Moonie Claw Club

A cute claw-machine game for the web. Move the claw, press **GRAB**, tap your blind box twice, and meet one of eight Moonies.

Made with plain **HTML + CSS + JavaScript**. No installs, no servers, no paid services.

---

## YOUR CHECKLIST (do these in order)

1. **Unzip** `moonie-claw-club.zip`. You get a folder called `moonie-claw-club`.
2. **Open that folder in VS Code**: File → Open Folder → pick `moonie-claw-club`.
3. **Install "Live Server"** in VS Code (see Part 1). Then right-click `index.html` → **Open with Live Server**.
4. **Play it.** Check that it works. All downloads work here.
5. **Make your GitHub repository and publish** (Part 3).
6. **Turn on GitHub Pages** (Part 3, step 5).
7. Later, when you change something, follow **Part 4** to update.

Keep `moonie-originals-backup.zip` on your computer only; do NOT upload it to GitHub.

Read `ASSET-GUIDE.md` once. It explains your pictures, what I changed, and the one picture I could not find (`blind-box.png`).

---

## What is in the folder

| File | What it does | Do I edit it? |
|---|---|---|
| `index.html` | The page structure (machine, buttons, reveal screen) | Rarely |
| `style.css` | All the looks and animations | Sometimes (top section) |
| `game.js` | The game rules and button behaviour | Often (Moonie names, odds) |
| `assets/` | All your pictures | Replace pictures here |
| `ASSET-GUIDE.md` | What each picture is for | Read only |

---

## Part 1 — Play it on your computer

**Do NOT just double-click `index.html`.** The game will mostly work, but your browser blocks the **JPEG download** when a page is opened from a file. Use Live Server instead. It is free and takes a minute.

1. Open VS Code.
2. Click the **Extensions** icon (four squares) on the left.
3. Search for **Live Server** (by Ritwick Dey) and click **Install**.
4. In the file list on the left, **right-click `index.html`** and choose **Open with Live Server**.
5. Your browser opens the game. When you save a file in VS Code, the page refreshes by itself.

### How to play
- Hold **LEFT** or **RIGHT** to slide the claw. (Keyboard: ← → arrows.)
- Press **GRAB** (or Space). The claw goes down, grabs a box, and carries it to the prize hole.
- **Tap the box** → it opens. **Tap again** → your Moonie appears.
- Then you can **Download PNG**, **Download JPEG**, **Add to collection**, or go **Back to machine**.

---

## Part 2 — Things you will probably want to change

### Change the Moonie names, descriptions, rarity or odds
1. Open **`game.js`**.
2. Find the box that says **`1. CONFIG — YOUR MOONIES`** (near the top).
3. Edit the text between the quote marks, for example `name: 'Noodle Night Moonie'`.
4. Odds: change the `weight` numbers. Keep the total at 100 if you want them to read as percentages.
5. Save. The page refreshes.

To test the odds, open the game, press **F12**, click **Console**, type `testOdds(10000)` and press Enter.

### Change the size or position of things
Open **`style.css`** and look at the box **`1. CONFIG`** at the very top.
- `--win-left`, `--win-top`, `--win-width`, `--win-height`: where the glass window is on the machine picture.
- `--claw-w`: how big the claw is.
- `--box-w-front`, `--box-w-back`: how big the pile boxes are.

Claw speed, where the claw drops the box, and animation timings are in **`game.js`**, section **`2. CONFIG`**.

### Replace a picture
Save your new picture in the same folder with **exactly the same file name** (capital letters matter!). Keep see-through backgrounds see-through. See `ASSET-GUIDE.md`.

---

## Part 3 — Publish it on GitHub Pages (first time)

You need a free account at **github.com**.

1. **Make the repository.** On github.com click the **+** (top right) → **New repository**.
   - Name: `moonie-claw-club` (lowercase, no spaces)
   - Choose **Public**
   - Do **not** tick "Add a README"
   - Click **Create repository**
2. **Publish from VS Code.** (With the `moonie-claw-club` folder open.)
   1. Click the **Source Control** icon on the left (a branch symbol).
   2. Click **Initialize Repository**.
   3. Type a message such as `First version` in the box, then click **Commit**. If VS Code asks "stage all changes?", click **Yes**.
   4. Click **Publish Branch**. Sign in to GitHub when asked. Choose the **public** `moonie-claw-club` repository (or let VS Code create it for you, choosing *Public*).
3. **Check on github.com** that you can see `index.html`, `style.css`, `game.js` and the `assets` folder.
4. Click the **Settings** tab of your repository.
5. In the left menu, click **Pages**.
6. Under **Build and deployment → Source**, choose **Deploy from a branch**.
7. Under **Branch**, choose **main** and folder **/ (root)**. Click **Save**.
8. Wait 1 to 3 minutes. Refresh the Pages screen. A green box shows your address:

   `https://YOUR-USERNAME.github.io/moonie-claw-club/`

   Open it on your computer **and your phone**.

> **No VS Code publishing?** You can also upload through the website: open your repository → **Add file → Upload files**, drag in **the contents** of the folder (`index.html`, `style.css`, `game.js`, and the whole `assets` folder), then click **Commit changes**.

---

## Part 4 — Update your game later

1. Change your files in VS Code. Test with Live Server.
2. Click **Source Control** (left).
3. Type a short message (for example `Changed names`).
4. Click **Commit**, then **Sync Changes**.
5. Wait 1 to 2 minutes. On your published page, press **Ctrl + Shift + R** (Windows) or **Cmd + Shift + R** (Mac). On a phone, close the tab and open it again.

---

## Troubleshooting (the most common problems)

**The page is blank or pictures are missing on GitHub Pages, but fine on my computer.**
File names are case-sensitive online. `Moonie01.png` is *not* `moonie01.png`. Make sure the names in `game.js` match the real file names exactly, and the folders are all uploaded.

**Pictures are missing everywhere.**
The `assets` folder must sit **next to** `index.html`. Don't move `index.html` out of the folder.

**I changed something but the published site looks the same.**
You forgot to **Commit** and **Sync Changes**, or the browser is showing its old copy. Wait 2 minutes, then hard refresh (Ctrl + Shift + R).

**Download PNG works but Download JPEG says it is blocked.**
You opened `index.html` by double-clicking. Use **Live Server** (Part 1) or your GitHub Pages address.

**Downloads do nothing on my phone.**
Some phone browsers handle downloads differently. Try again in Chrome or Safari (not inside another app's built-in browser), or press and hold the Moonie picture and choose Save.

**The claw is cut off, or the boxes don't line up with the window.**
Only if you changed `machine.png`. Update the four `--win-` numbers at the top of `style.css`.

**The claw is too big or too small.**
Change `--claw-w` in `style.css`. If you change it, also change `--box-w-front` so the pile boxes match the box drawn in the closed claw.

**The LEFT and RIGHT buttons don't stop.**
Reload the page. If it keeps happening, tell me which device and browser.

**The collection is empty after I reopen the page.**
The collection is saved inside the browser. It resets if you clear browser data, use a private window, or use a different device or browser.

**GitHub Pages says 404.**
Check Settings → Pages is set to **main / (root)**, and that `index.html` is at the top of the repository, not inside another folder.

**Do my downloads have a signature?**
Yes. "Moonie Brownie" is stamped on every PNG and JPEG. Change it in `game.js` → `SETTINGS.watermark`.

---

## How the claw layers work (the short version)

Back to front: white backing → open claw → pile of boxes → closed claw (after grabbing) → `machine.png` on top. The glass window is a box with `overflow: hidden`, so nothing can ever show outside it. Every number that controls the window is in one place: `style.css`, section 1.
