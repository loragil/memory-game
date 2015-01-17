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



    ///
    function isGameRunning() {
        return deck.length > 0;
    }

    var players = ['playerA', 'playerB'];
    var playersNames = ['A san', 'B san'];
    document.querySelector('#playerA h3').innerHTML = playersNames[0];
    document.querySelector('#playerB h3').innerHTML = playersNames[1];

    var currentPlayer = players[0];
    document.getElementById('currentPlayer').innerHTML = currentPlayer;

    var visibleCards = [];
    var pairsCount = cardTypes.length;
    document.getElementById('pairsLeft').innerHTML = pairsCount;

    function switchPlayer() {
        currentPlayer = currentPlayer === players[0] ? players[1] : players[0];
        document.getElementById('currentPlayer').innerHTML = currentPlayer;
    }

    function isMatch(cards) {
        return cards[0].getAttribute('card_id') === cards[1].getAttribute('card_id');
    }

    function removePair() {
        /*visibleCards[0].remove();
                    visibleCards[1].remove();*/


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
        document.querySelector('#' + currentPlayer + ' ul').appendChild(li);
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
                        if (pairsCount === 0) {
                            alert('game over, ' + currentPlayer + ' wins!');
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


}());