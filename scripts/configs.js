define(function(){
    let canvasSize = {
        w: window.innerWidth,
        h: window.innerHeight
    };
    return {
        fps: 10,
        txFps: 5,
        canvasSize: canvasSize,
        updateSize() {
            canvasSize.w = window.innerWidth;
            canvasSize.h = window.innerHeight;
        }
    }
});