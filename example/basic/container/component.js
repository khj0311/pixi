;(function() {
    'use strict';

    window.pixi = window.pixi || {};
    window.pixi.component = window.pixi.component || {};

    pixi.component.container = (function() {
        var obj = {};

        var init = function() {
            obj.section = document.querySelector('.pixi-container');

            if (!!obj.section) {
                setElements();
                setSprite();
                setContainer();
                bindEvents();
            }
        };

        var setElements = function() {
            obj.app = new PIXI.Application({
                view: document.getElementById('container'),
                width: 800,
                height: 800,
                backgroundColor: 0xa0f584,
                resolution: window.devicePixelRatio || 1
            });

            obj.container = new PIXI.Container();
            obj.app.stage.addChild(obj.container);
            obj.texture = PIXI.Texture.from('/content/images/bunny.png');

            // Sprite
            obj.addSprite = obj.section.querySelector('#addSprite');
            obj.removeSprite = obj.section.querySelector('#removeSprite');
            obj.removeSomeSprite = obj.section.querySelector('#removeSomeSprite');

            // Ticker
            obj.addTicker = obj.section.querySelector('#addTicker');
            obj.removeTicker = obj.section.querySelector('#removeTicker');
            obj.startTicker = obj.section.querySelector('#startTicker');
            obj.stopTicker = obj.section.querySelector('#stopTicker');
        };

        var setSprite = function() {
            for (var i = 0; i < 25; i++) {
                var bunny = new PIXI.Sprite(obj.texture);
                bunny.anchor.set(0.5);
                bunny.scale.set(2);
                bunny.x = (i % 5) * 100;
                bunny.y = Math.floor(i / 5) * 100;
                obj.container.addChild(bunny);
            }
        };

        var setContainer = function() {
            obj.container.x = obj.app.screen.width / 2;
            obj.container.y = obj.app.screen.height / 2;

            obj.container.pivot.x = obj.container.width / 2;
            obj.container.pivot.y = obj.container.height / 2;
        };

        var bindEvents = function() {
            obj.container.on('childAdded', function(child, cont, index) {
                console.log(child);
                console.log(cont);
                console.log(index);
            });

            if (obj.addSprite) obj.addSprite.addEventListener('click', onClickAddSprite);
            if (obj.removeSprite) obj.removeSprite.addEventListener('click', onClickRemoveSprite);
            if (obj.removeSomeSprite) obj.removeSomeSprite.addEventListener('click', onClickRemoveSomeSprite);

            if (obj.addTicker) obj.addTicker.addEventListener('click', onClickAddTicker);
            if (obj.removeTicker) obj.removeTicker.addEventListener('click', onClickRemoveTicker);
            if (obj.startTicker) obj.startTicker.addEventListener('click', onClickStartTicker);
            if (obj.stopTicker) obj.stopTicker.addEventListener('click', onClickStopTicker);
        };

        var onClickAddSprite = function() {
            var leng = obj.container.children.length;
            var bunny = new PIXI.Sprite(obj.texture);
            bunny.anchor.set(0.5);
            bunny.scale.set(2);
            bunny.x = (leng % 5) * 100;
            bunny.y = Math.floor(leng / 5) * 100;
            obj.container.addChild(bunny);
        };

        var onClickRemoveSprite = function() {
            var child = obj.container.children;
            var leng = obj.container.children.length - 1;
            obj.container.removeChild(child[leng]);
        };

        var onClickRemoveSomeSprite = function() {
            var startIndex = document.querySelector('#startIndex').value;
            var endIndex = document.querySelector('#endIndex').value;
            startIndex = !!startIndex ? startIndex : 0;
            endIndex = !!endIndex ? endIndex : obj.container.children.length;

            obj.container.removeChildren(startIndex, endIndex);
        };

        var tickerAnimation = function(delta) {
            obj.container.rotation -= 0.01 * delta;
        };

        var onClickAddTicker = function() {
            obj.app.ticker.add(tickerAnimation);
        };

        var onClickRemoveTicker = function() {
            obj.app.ticker.remove(tickerAnimation);
        };

        var onClickStartTicker = function() {
            obj.app.ticker.start();
        };

        var onClickStopTicker = function() {
            obj.app.ticker.stop();
        };

        return {
            init: init
        }
    })();

    pixi.component.container.init();
})();