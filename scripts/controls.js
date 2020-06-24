define(function() {
    let keyDown = {};
    let controlQueue = [];
    let mouse = {x: 0, y: 0, changed: false, clicked: false, dragged: true};
    let portraitMouse = {x: 0, y: 0, changed: false, clicked: false, dragged: false};
    function setupListeners(portraitDom) {
        document.onkeydown = latchKeyDown;
        document.onkeyup = latchKeyUp;
        // document.onmousemove = logMousemove;
        portraitDom.onclick = logPortraitClick;
        portraitDom.onmousedown = logPortraitDrag;
        portraitDom.onmouseup = logPortraitDragUp;
        portraitDom.onmousemove = logPortraitMouse;
    }

    function logMousemove(e) {
        if (mouse.clicked) return;
        mouse.x = e.clientX || e.pageX;
        mouse.y = e.clientY || e.pageY;
        mouse.changed = true;
    }
    function logClick(e) {
        mouse.x = e.clientX || e.pageX;
        mouse.y = e.clientY || e.pageY;
        mouse.clicked = true;
        mouse.changed = true;
    }

    function logPortraitMouse(e) {
        portraitMouse.x = (e.clientX || e.pageX) - this.offsetLeft;
        portraitMouse.y = (e.clientY || e.pageY) - this.offsetTop;
        portraitMouse.changed = true;
    }

    function logPortraitClick(e) {
        portraitMouse.clicked = true;
        portraitMouse.changed = true;
    }

    function logPortraitDrag(e) {
        portraitMouse.dragged = true;
        portraitMouse.changed = true;
    }

    function logPortraitDragUp(e) {
        portraitMouse.dragged = false;
        portraitMouse.changed = true;
    }

    function tick() {
        if (portraitMouse.changed) {
            document.getElementById('debug1').innerHTML = `${portraitMouse.x}, ${portraitMouse.y}, ${portraitMouse.dragged}`;
        }
    }

    function latchKeyDown(e) {
        keyDown[e.code] = true;
    }

    function latchKeyUp(e) {
        keyDown[e.code] = false;
    }

    function getQueue() {
        return controlQueue;
    }

    function resetQueue() {
        controlQueue = [];
        portraitMouse.changed = false;
        portraitMouse.clicked = false;
    }

    return {
        init: setupListeners,
        tick: tick,
        getPortraitMouse: function() {return portraitMouse},
        getPortraitMouseMoved: function() {return portraitMouse.changed},
        getMouseMoved: function() {return mouse.changed},
        getQueue: function() {return getQueue()},
        resetQueue: resetQueue,
    }
});