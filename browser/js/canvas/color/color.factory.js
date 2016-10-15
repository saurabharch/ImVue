/* eslint-disable  id-length */
app.factory('ColorFactory', function() {

    var colorElements;
    var color;
    var colorPallete = false;

    function initializeColorElements(doc) {

        colorElements = [].slice.call(doc.querySelectorAll('.marker'));

        colorElements.forEach(function(el) {

            // Set the background color of this element
            // to its id (purple, red, blue, etc).
            el.style.backgroundColor = el.id;

            // Attach a click handler that will set our color variable to
            // the elements id, remove the selected class from all colors,
            // and then add the selected class to the clicked color.

            function pickColor() {
                color = this.id;
                doc.querySelector('.selected').classList.remove('selected');
                this.classList.add('selected');
            }

            el.onclick = pickColor

            el.addEventListener('click', pickColor);
            el.addEventListener('tap', pickColor);

        });
    }

    function getCurrentColor() {
        return color;
    }

    function toggleColorPalette() {
        colorPallete = !colorPallete;
    }

    function showColorPalette() {
        return colorPallete;
    }

    return {
        initializeColorElements: initializeColorElements,
        getCurrentColor: getCurrentColor,
        toggleColorPalette: toggleColorPalette,
        showColorPalette: showColorPalette
    }

})
