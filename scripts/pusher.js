

define(function() {
    let pusher;
    let channel;
    let subscribed = false;

    function connect(uid) {
        // Pusher.logToConsole = true;
        pusher = new Pusher('89bfbfdd4bf659e11345', { cluster: 'us3', authEndpoint: '/wagers/server/auth/' });
        channel = pusher.subscribe(`private-liveform`);
        channel.bind('pusher:subscription_error', function(e) {
            alert(`Connection failed. Please refresh: ${JSON.stringify(e.error)}`)
        });
        channel.bind('pusher:subscription_succeeded', function() {
            subscribed = true;
            channel.trigger('client-joined', uid);
        });
    }

    function setupHost(addPlayerFn) {
        // listen for client-joined
        channel.bind('client-joined', addPlayerFn);
    }

    function bind(event, callback) {
        channel.bind(`client-${event}`, callback);
    }

    function trigger(event, data) {
        channel.trigger(`client-${event}`, data);
    }

    return {
        connect: connect,
        setupHost: setupHost,
        bind: bind,
        trigger: trigger,
    }
});