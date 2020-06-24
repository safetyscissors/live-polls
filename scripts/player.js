define(function(){
    let isHost;
    let uid;
    let players = {};

    function setUid() {
        // use get param
        if (uid) {}
        // use localstorage
        else if(localStorage.hasOwnProperty('uid')) {
            uid = localStorage.getItem('uid');
        }
        // make new uid.
        else {
            uid = (new Date().getTime() * 16 + Math.floor(Math.random() * 16)).toString(16);
            localStorage.setItem('uid', uid);
        }
        // add to player map incase you're the host
        players[uid] = undefined;
        return uid;
    }

    function init() {
        const queryString = window.location.search;
        const urlParams = new URLSearchParams(queryString);

        isHost = urlParams.get('o') === 'andrew';
        if (urlParams.get('u'))
        uid = urlParams.get('u');

        setUid();
    }

    function addPlayerFn(playerId) {
        players[playerId] = undefined;
    }

    return {
        init: init,
        getUid: function(){ return uid; },
        isHost: function(){ return isHost; },
        addPlayerFn: addPlayerFn,

    }
});