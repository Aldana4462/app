# Simple Canvas App
This project provides a minimal responsive web app with a fixed 700x700 canvas.

Images you upload or text you add behave like layers so you can still see the ones underneath. The two built-in images act as a background layer and only one is visible at a time; use the arrow buttons or the left/right keys to switch between them. The zoom controls affect only the selected image and never resize the canvas. The toolbar lets you upload custom images and add multiple text layers over the canvas. A panel on the right lists only the layers you add, starting empty when the page loads. You can click any layer to select it and drag layers up or down in the list to change their order on the canvas. When a layer is selected a properties panel on the left lets you tweak its scale, position, rotation, opacity and crop.
Text layers have additional settings in this panel so you can choose a color, pick a Google font and toggle bold, uppercase, underline or strikethrough.

The layout adapts to any screen size. On screens wider than about 900&nbsp;px the layer panel sits beside the canvas, while on smaller displays it moves below and the controls shrink so the app remains fully usable on phones and tablets. The entire interface is centered on the page so it looks balanced on both desktop and mobile. The canvas itself is kept in the exact center of the page even when the layer panel is visible.

Uploaded images appear at 40% of the canvas and remain centered so they keep their natural aspect ratio. The layer panel grows with your layers and scrolls if needed so entries never spill outside the container.

## Files
- `index.html` – main HTML page
- `styles.css` – styles for responsive design
- `script.js` – handles images, text layers, zoom and layer management

## Usage
Open `index.html` in a web browser. The layout adjusts for mobile and desktop screens. Use the arrow buttons or the left/right arrow keys to choose a different image layer. Press the plus and minus buttons to zoom the currently selected image. The layer panel lists each layer and highlights the one that is selected. When you first open the page the panel is empty, and it will display items only after you upload an image or add text.
You can reorder visible layers by dragging them in the list. Each layer entry
also includes buttons to rename the layer, remove it or toggle its visibility.
