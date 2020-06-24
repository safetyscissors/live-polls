define(function() {
    let dom;
    let ctx;
    let linePoints = [];
    let dotPoints = [];
    let lineLength = 0;;
    let isDrawing = false;
    let colors = '#9B59B6,#8E44AD,#2980B9,#3498DB,#1ABC9C,#16A085,#F1C40F,#F39C12,#E67E22,#D35400,#C0392B,#FFFFFF,#BDC3C7,#95A5A6,#17202A'.split(',');

    let color = '#17202A';
    let size = 10;
    function tick(portraitMouse) {
        if (portraitMouse.clicked && lineLength <= 1) {
            // check for controls click
            if (portraitMouse.y < 20) {
                let i = Math.floor(portraitMouse.x / 10);
                color = colors[i];
            } else {
                dotPoints.push({x: portraitMouse.x, y: portraitMouse.y});
            }
        }

        if (!isDrawing && portraitMouse.dragged) {
            ctx.beginPath();
            ctx.moveTo(portraitMouse.x, portraitMouse.y);
            isDrawing = true;
            lineLength++;
        }
        else if (isDrawing && portraitMouse.dragged) {
            lineLength++;
            linePoints.push({x: portraitMouse.x, y: portraitMouse.y});
        }
        else if (isDrawing && !portraitMouse.dragged) {
            lineLength = 0;
            isDrawing = false;
        }
    }

    function draw() {
        drawColorPicker();
        // draw dots
        for (let point of dotPoints) {
            ctx.beginPath();
            ctx.fillStyle = color;
            ctx.arc(point.x, point.y, size / 2, 0, 2 * Math.PI);
            ctx.fill()
        }
        dotPoints = [];

        // draw lines
        if (linePoints.length === 0) return;
        ctx.lineJoin = 'round';
        ctx.lineCap = 'round';
        ctx.strokeStyle = color;
        ctx.lineWidth = size;
        for (let point of linePoints) {
            ctx.lineTo(point.x, point.y);
            ctx.stroke();
        }
        linePoints = [];
    }

    function drawColorPicker() {
        for (let i = 0; i< colors.length; i++) {
            ctx.fillStyle = colors[i];
            ctx.fillRect(i*10, 0, 10, 20);
        }

    }

    function init(newDom, resetDom, finishDom) {
        dom = newDom;
        ctx = newDom.getContext("2d");
        resetDom.addEventListener('click', function() {
            ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height)
        });
        finishDom.addEventListener('click', function() {
            uploadImage();
        })
    }

    function uploadImage() {
        let dataURL = dom.toDataURL();
        $.ajax({
            type: "POST",
            url: "server/upload.php",
            data: {
                imgBase64: dataURL
            }
        }).done(function(o) {
            console.log('saved');
        });
    }
    return {
        init: init,
        tick: tick,
        draw: draw,
    }
});