;
(function() {
    'use strict';

    var cardTypes = [{
        id: '8-ball',
        source: 'http://igorminar.github.io/Memory-Game/app/img/8-ball.png'
    }, {
        id: 'baked-potato',
        source: 'http://igorminar.github.io/Memory-Game/app/img/baked-potato.png'
    }, {
        id: 'dinosaur',
        source: 'http://igorminar.github.io/Memory-Game/app/img/dinosaur.png'
    }, {
        id: 'kronos',
        source: 'http://igorminar.github.io/Memory-Game/app/img/kronos.png'
    }, {
        id: 'rocket',
        source: 'http://igorminar.github.io/Memory-Game/app/img/rocket.png'
    }, {
        id: 'skinny-unicorn',
        source: 'http://igorminar.github.io/Memory-Game/app/img/skinny-unicorn.png'
    }, {
        id: 'that-guy',
        source: 'http://igorminar.github.io/Memory-Game/app/img/that-guy.png'
    }, {
        id: 'zeppelin',
        source: 'http://igorminar.github.io/Memory-Game/app/img/zeppelin.png'
    }];

    function shuffle(deck) {
        for (var j, x, i = deck.length; i; j = parseInt(Math.random() * i), x = deck[--i], deck[i] = deck[j], deck[j] = x);
        return deck;
    };

    function createCards(cardTypes) {
        var deck = [],
            card;

        for (var i = 0; i < cardTypes.length; i++) {
            card = '<game-card card_id="' + cardTypes[i].id + '" card_source="' + cardTypes[i].source + '"></game-card>';
            deck.push(card);
            card = '<game-card card_id="' + cardTypes[i].id + '" card_source="' + cardTypes[i].source + '"></game-card>';
            deck.push(card);
        }

        return shuffle(deck);
    }

    function createBoard(deck) {
        var board = document.querySelector('.board');
        board.innerHTML = deck.join('');
    }

    var deck = createCards(cardTypes);
    createBoard(deck);

    function isGameRunning() {
        return deck.length > 0;
    }

    function setPlayersNames(playerA, playerB) {
        document.querySelector('#playerA h3').innerHTML = playerA;
        document.querySelector('#playerB h3').innerHTML = playerB;

        currentPlayerPlaceHolder.innerHTML = playerA;
    }

    var players = [{
        id: 'playerA',
        name: '',
        score: 0
    }, {
        id: 'playerB',
        name: '',
        score: 0
    }];

    var currentPlayerPlaceHolder = document.querySelector('.currentPlayer');

    var currentPlayer = 0;


    var visibleCards = [];
    var pairsCount = cardTypes.length;
    document.getElementById('pairsLeft').innerHTML = pairsCount;

    function switchPlayer() {
        currentPlayer = currentPlayer === 0 ? 1 : 0;
        currentPlayerPlaceHolder.innerHTML = players[currentPlayer].name;
    }

    function isMatch(cards) {
        return cards[0].getAttribute('card_id') === cards[1].getAttribute('card_id');
    }

    function removePair() {
        visibleCards[0].style.opacity = 0;
        visibleCards[0].style.pointerEvents = 'none';
        visibleCards[1].style.opacity = 0;
        visibleCards[1].style.pointerEvents = 'none';

        pairsCount--;
        document.getElementById('pairsLeft').innerHTML = pairsCount;
    }

    function flipBack() {
        visibleCards[0].setAttribute('hide', true);
        visibleCards[1].setAttribute('hide', true);
    }

    function assignToPlayer() {
        var li = document.createElement('li');
        var img = document.createElement('img');
        img.src = visibleCards[0].getAttribute('card_source');
        li.appendChild(img.cloneNode(true));
        li.appendChild(img);
        document.querySelector('#' + players[currentPlayer].id + ' ul').appendChild(li);
    };

    var gameCards = document.querySelectorAll('game-card');

    [].forEach.call(gameCards, function(DOMcard) {
        DOMcard.addEventListener('click', function() {
            if (this == visibleCards[0]) {
                return;
            }

            visibleCards.push(this);
            this.setAttribute('block', '');

            if (visibleCards.length == 2) {

                [].forEach.call(gameCards, function(c) {
                    c.setAttribute('block', '');
                });

                setTimeout(function() {
                    if (isMatch(visibleCards)) {
                        assignToPlayer();
                        removePair();
                        players[currentPlayer].score += 1;
                        if (pairsCount === 0) {
                            var winnerId = players[0].score === players[1].score ? "draw" : players[0].score > players[1].score ? 0 : 1;

                            alert('game over, ' + players[winnerId].name + ' wins!');
                        }
                    }
                    else {
                        flipBack();
                        switchPlayer();
                    }

                    // reset visibleCards;
                    visibleCards.length = 0;

                    [].forEach.call(gameCards, function(c) {
                        c.removeAttribute('block');
                        c.removeAttribute('hide');
                    });
                }, 1500);

            }

            // display message


        });
    });


    /************************** game UI logic ********************************/
    document.getElementById('startNew').addEventListener('click', function() {
        start();
    });

    function start() {
        var container = document.getElementById('container'),
            nameA = document.querySelector('[name=playerAName]'),
            nameB = document.querySelector('[name=playerBName]');
        players[0].name = nameA.value || players[0].id;
        players[1].name = nameB.value || players[1].id;

        setPlayersNames(players[0].name, players[1].name)
        container.classList.add('inGame');
    }


    var deckSelect = document.getElementById('selectDeck');
    deckSelect.addEventListener('change', function() {
        updateSelectedDeck();
    });

    function updateSelectedDeck() {
            var gameCards = document.querySelectorAll('game-card');
            var backImage = deckSelect.value;
            document.querySelector('.preview').className = 'preview';
            document.querySelector('.preview').classList.add(backImage);
            for (var i = 0; i < gameCards.length; i++) {
                var back = gameCards[i].shadowRoot.querySelector('.back');
                back.className = 'back';
                back.classList.add(backImage);
            }
        }
        //set initial selection
    updateSelectedDeck();

    /*document.getElementById('container').addEventListener('mousemove', function(e) {
        var amountMovedX = (e.pageX * -1 / 6);
        var amountMovedY = (e.pageY * -1 / 6);
        
        e.currentTarget.style.backgroundPosition = amountMovedX + 'px ' + amountMovedY + 'px';
    });*/

    
}());
