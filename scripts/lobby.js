define(function(){
    function init(createDom, joinDom, roomNameDom, errorDom, pusherConnectFn, pusherRoomCheckFn, playerSetOwnerFn, doneFn) {
        createDom.on('click tap', function() {
            if (roomNameDom.val() == '' || roomNameDom.val().length <= 3) {
                errorDom.html('Please use a room name longer than 3 letters.');
                return;
            } else {
                errorDom.html('');
            }
            pusherRoomCheckFn(roomNameDom.val(), function(res) {
                if (res === "OPEN") {
                    playerSetOwnerFn(true);
                    pusherConnectFn(roomNameDom.val(), doneFn, true); // create game
                } else {
                    errorDom.html('Room name is currently in use.');
                }
            });
        });
        joinDom.on('click tap', function() {
            if (roomNameDom.val() == '' || roomNameDom.val().length <= 3) {
                errorDom.html('Please give a room name longer than 3 letters.');
                return;
            } else {
                errorDom.html('');
            }
            pusherRoomCheckFn(roomNameDom.val(), function(res) {
                if (res === "INUSE") {
                    pusherConnectFn(roomNameDom.val(), doneFn); // create game
                } else {
                    errorDom.html('Room name is not currently in use.');
                }
            });
        });
    }
    function takeSlot(e, nameDom, errorDom, callback) {
        let name = nameDom.val();
        let i = e.target.id.split('-')[1];
        if (name == '' || name.length <= 3 || isNaN(i)) {
            errorDom.html('Please give a name longer than 3 letters.');
            return;
        } else {
            errorDom.html('');
        }
        callback(`${Number(i)}|${name}`, Number(i), name);
    }

    return {
        init: init,
        takeSlot: takeSlot,
    }
});