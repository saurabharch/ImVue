app.factory('TextFactory', function() {

    let ctx;
    let texts = [];

    let textSizes = fetchTextSizes();
    let fontFamilies = fetchFontFamilies();
    let textLocations = fetchTextLocations();
    let textSelect = false;

    function initializeTextFactory(canvasCtx) {
        ctx = canvasCtx;
    }

    function saveTexts() {
        let holdTexts = texts;
        texts = [];
        return holdTexts;
    }

    function drawText(size, font, color, locX, locY, content) {
        ctx.font = size + 'px ' + font;
        ctx.fillStyle = color;
        ctx.fillText(content, locX, locY);
        texts.push({ size: size, font: font, color: color, x: locX, y: locY, content: content }) // eslint-disable-line id-length
    }

    function drawTextsOnCanvas(textsToDraw) {
        textsToDraw.forEach(text => {
            drawText(text.size, text.font, text.color, text.x, text.y, text.content)
        })
    }

    function toggleTextSelect() {
        textSelect = !textSelect;
    }

    function showTextSelect() {
        return textSelect;
    }

    return {
        initializeTextFactory: initializeTextFactory,
        drawText: drawText,
        drawTextsOnCanvas: drawTextsOnCanvas,
        saveTexts: saveTexts,
        getTextSizes: textSizes,
        getFontFamilies: fontFamilies,
        getTextLocations: textLocations,
        toggleTextSelect: toggleTextSelect,
        showTextSelect: showTextSelect
    }

});

/* ------------- TEXT SIZES ------------- */

function fetchTextSizes() {

    let minTextSize = 50;
    let maxTextSize = 150;
    let textIncrementSize = 10;
    let textSizes = [];

    for (let i = minTextSize; i <= maxTextSize; i += textIncrementSize) {
        textSizes.push(i);
    }

    return textSizes;
}

/* ------------- FONT FAMILIES ------------- */

function fetchFontFamilies() {
    return [
        'Arial',
        'Verdana',
        'Times New Roman',
        'Courier New',
        'serif',
        'sans-serif'
    ]
}

function fetchTextLocations() {

    let top = screen.availWidth * 0.1;
    let centerVert = screen.availWidth * 0.5;
    let bottom = screen.availWidth * 0.9;

    let left = screen.availHeight * 0.1;
    let centerHor = screen.availHeight * 0.5;
    let right = screen.availHeight * 0.9;

    return [ /*eslint-disable id-length*/
        { locString: 'top-left', locCoords: { x: left, y: top } },
        { locString: 'top-center', locCoords: { x: centerHor, y: top } },
        { locString: 'top-right', locCoords: { x: right, y: top } },
        { locString: 'center-left', locCoords: { x: left, y: centerVert } },
        { locString: 'center-center', locCoords: { x: centerHor, y: centerVert } },
        { locString: 'center-right', locCoords: { x: right, y: centerVert } },
        { locString: 'bottom-left', locCoords: { x: left, y: bottom } },
        { locString: 'bottom-center', locCoords: { x: centerHor, y: bottom } },
        { locString: 'bottom-right', locCoords: { x: right, y: bottom } },
    ] /*eslint-enable id-length*/
}
