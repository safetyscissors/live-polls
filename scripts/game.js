define(function(){
    let data;
    let dataUpdated = false;

    function init() {
        data = {
            queue: [],
            currentQ: {},
            history: [],
            p: [],
        };
        dataUpdated = true;
    }

    function minify(raw) {
        return raw;
        // return JSON.stringify(raw);
    }

    function unminify(raw) {
        console.log(raw);
        data = raw;
        // data = JSON.parse(raw);
        dataUpdated = true;
        return data;
    }

    function updateGameStateFn(data) {
        return unminify(data);
    }

    function getGameData() {
        return minify(data);
    }

    function addQuestion(questionDom, answersDom) {
        let question = questionDom.value;
        let answers = [];

        if (!question) return;

        for(let i of Object.keys(answersDom)) {
            let answerDom = answersDom[i];
            if (answerDom.value != '') answers.push({
                text: answerDom.value,
                i: i,
            });
        }
        if (data.currentQ.a) data.history.unshift(data.currentQ);
        data.currentQ = {
            q: question,
            a: answers,
        };
        dataUpdated = true;

        return getGameData();
    }

    function addScore(namesDom, pointsDom) {
        let players = [];

        for(let i of Object.keys(namesDom)) {
            let nameDom = namesDom[i];
            let pointDom = pointsDom[i];
            if (nameDom.value != '') players.push({
                name: nameDom.value,
                p: pointDom.value,
            });
        }
        data.p = players.sort((a,b) => {
            if (Number(a.p) > Number(b.p)) return -1;
            if (Number(a.p) < Number(b.p)) return 1;
            return 0;
        });
        dataUpdated = true;
        return getGameData();
    }

    function tick() {

    }

    function hasVoted(myId) {
        if (!data.currentQ || !data.currentQ.a) return;
        for(let answer of data.currentQ.a) {
            if (answer.v && answer.v.indexOf(myId) >= 0) return true;
        }
        return false;
    }

    function renderGraphs(myId) {

        if (myId && hasVoted(myId)) {
            renderQuestionGraph(data.currentQ, "#0F9D58")
        }
        for (let question of data.history) {
            renderQuestionGraph(question, "grey");
        }

    }
    function renderQuestionGraph(question, color) {
        let total = question.a.reduce((sum, a) => {
            return sum + (a.v ? a.v.length : 0);
        }, 0);
        let graphDom = $(`#history-${question.i}`).get(0);
        let ctx = graphDom.getContext("2d");
        ctx.clearRect(0,0,graphDom.width, graphDom.height);
        graphDom.style.height = question.a.length*34 + 'px';
        ctx.canvas.height = question.a.length*34;
        ctx.canvas.width = graphDom.width;



        for (let j of Object.keys(question.a)) {
            let answer = question.a[j];
            let count = answer.v ? answer.v.length : 0;
            ctx.fillStyle = color;
            ctx.fillRect(0, j*34, Math.max(count/total * ctx.canvas.width, 1), 28);
            ctx.font = "18px Arial";
            ctx.fillStyle = "black";
            let ratio = (count > 0)? `${count}/${total}`: '';
            ctx.fillText(`${answer.text} ${ratio}`, 10, 21 + j * 34);
        }
    }
    function renderPoints() {
        if (!data.p || data.p.length == 0) return;
        let output = '<br><br><b>Points</b><br>';
        for (let key in data.p) {
            output += `${data.p[key].p}-${data.p[key].name}<br>`;
        }
        $('#players').html(output);
    }
    function renderQuestion (question, myId) {
        if (!question.a) return 'no questions';
        let activeColor = myId? "#0F9D58" : "grey";
        let title =`
            <div class="mdl-card__title" style="background-color:${activeColor}">
              <h2 class="mdl-card__title-text">${question.q}</h2>
            </div>`;
        let answers = '';

        if (myId && !hasVoted(myId)) {
            for (let answer of question.a) {
                answers += `<button id="a-${answer.i}" class="answer mdl-button mdl-js-button">${answer.text}</button><br>`
            }
        } else {
            answers += `<canvas id="history-${question.i}"></canvas>`
        }
        return `<div class="demo-card-wide mdl-card mdl-shadow--3dp phone-width">
            ${title}
            <div class="mdl-card__supporting-text">
              ${answers}
            </div>
          </div>`;
    }
    function render(cardsDom, myId) {
        if (!dataUpdated) return;
        console.log('got update');
        dataUpdated = false;

        cardsDom.html(renderQuestion(data.currentQ, myId));
        let history = '';
        for (let i of Object.keys(data.history)) {
            data.history[i].i = i;
            history += renderQuestion(data.history[i]);
        }
        cardsDom.append(history);
        renderPoints();
        renderGraphs(myId);
    }

    function minifyVote(vote) {
        return vote;
    }

    function unminifyVote(vote) {
        return vote;
    }

    function vote(target, myId) {
        if (!target.id || target.id.indexOf('-') < 0) return;
        let id = Number(target.id.split('-')[1]);
        return minifyVote({u: myId, a: id});
    }

    function addVote(raw) {
        let vote = unminifyVote(raw);
        if (!vote.hasOwnProperty('a') || isNaN(vote.a)) return false;
        let aid = Number(vote.a);
        if (!data.currentQ.a[aid]) return false;
        if (!data.currentQ.a[aid].v) data.currentQ.a[aid].v = [];
        if (data.currentQ.a[aid].v.indexOf(vote.u) >= 0) return false;
        data.currentQ.a[aid].v.push(vote.u);
        dataUpdated = true;
        return true;
    }

    function reset() {
        init();
        return getGameData();
    }

    return {
        init: init,
        getGameData: getGameData,
        updateGameStateFn: updateGameStateFn,
        tick: tick,
        addQuestion: addQuestion,
        addScore: addScore,
        render: render,
        vote: vote,
        addVote: addVote,
        reset: reset,
    }
});