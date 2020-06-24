define(function() {
    const STATES = {
        MENU: 0,
        LOBBY: 1,
        SELECT_QUESTION: 2, // non-questioners wait.
        DRAW_ANSWER: 3,
        ARRANGE_ANSWER: 4, // non-questioners wait.
        BET: 5,
        PAYOUT: 6, // questioner selects
        RESET_ROUND: 7,
        RESET_GAME: 8,
    };
    let state = 0;
    let stateChanged = false;

    function updateState(newStateIndex) {
        stateChanged = true;
        state = Number(newStateIndex);
    }

    function tick() {
        if (stateChanged) {
            stateChanged = false;
            return true;
        }
        return false;
    }

    function getStateName() {
        return Object.keys(STATES)[state];
    }

    function render(stateDom) {
        stateDom.html(getStateName());
    }

    return {
        menu() {updateState(STATES.MENU)},
        lobby() {updateState(STATES.LOBBY)},
        selectQuestion() {updateState(STATES.SELECT_QUESTION)},
        drawAnswer() {updateState(STATES.DRAW_ANSWER)},
        arrangeAnswer() {updateState(STATES.ARRANGE_ANSWER)},
        bet() {updateState(STATES.BET)},
        payout() {updateState(STATES.PAYOUT)},
        resetRound() {updateState(STATES.RESET_ROUND)},
        resetGame() {updateState(STATES.RESET_GAME)},
        tick: tick,
        render: render,
        getState() {return state},
        getStateName: getStateName,
        updateStateDebugOnly: updateState,
        updateState: updateState,
        ...STATES,
    }
});
