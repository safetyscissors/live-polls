(function () {
    init();
})();

function init() {
    require([
        'scripts/configs.js',
        'scripts/pusher.js',
        'scripts/player.js',
        'scripts/game.js',
    ], function (configs, pusher, player, game) {
        // init components.
        player.init();
        pusher.connect(player.getUid());

        if (player.isHost()) {
            pusher.bind('joined', function(uid) {
                player.addPlayerFn(uid);
                pusher.trigger('game', game.getGameData());
            });
            pusher.bind('vote', function(vote) {
                if (game.addVote(vote)) pusher.trigger('game', game.getGameData());
            });

            $('#hostPanel').css('display', 'flex');
        }
        pusher.bind('game', game.updateGameStateFn);
        game.init();

        // listeners
        $('#reset').on('click tap', function() {
            if (!player.isHost()) return alert('not the host');
            pusher.trigger('game', game.reset());
        });
        $('#queueQuestion').on('click tap', function() {
            if (!player.isHost()) return alert('not the host');
            pusher.trigger('game', game.addQuestion($('#question').get(0), $('.answerInput').get()));
        });
        $('#queuePoints').on('click tap', function() {
            if (!player.isHost()) return alert('not the host');
            pusher.trigger('game', game.addScore($('.nameInput').get(), $('.pointInput').get()));
        });
        $('#cards').on('click tap', '.answer',function() {
            let vote = game.vote(this, player.getUid(), player.isHost());
            if (!player.isHost()) return pusher.trigger('vote', vote);
            if (game.addVote(vote)) pusher.trigger('game', game.getGameData());
        });
        setInterval(function () {
            tick();
            draw(game, player);
        }, 1000 / configs.fps);
    });
}

function tick() {
}

function draw(game, player) {
    game.render($('#cards'), player.getUid());
}