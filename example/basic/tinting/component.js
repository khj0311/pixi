;(function() {
    'use strict';

    window.pixi = window.pixi || {};
    window.pixi.component = window.pixi.component || {};

    pixi.component.tinting = (function() {
        var obj = {};

        var init = function() {
            obj.section = document.querySelector('.pixi-tinting');

            if (!!obj.section) {
                setElements();
                setSprite();
                setTicker();
                bindEvents();
            }
        };

        var setElements = function() {
            obj.app = new PIXI.Application({
                view: document.getElementById('tinting')
            });

            obj.dudes = [];
            obj.totalDudes = 20;

            obj.dudeBoundsPadding = 100;
            obj.dudeBounds = new PIXI.Rectangle(-obj.dudeBoundsPadding,
                -obj.dudeBoundsPadding,
                obj.app.screen.width + obj.dudeBoundsPadding * 2,
                obj.app.screen.height + obj.dudeBoundsPadding * 2);

            // Sprite
            obj.addSprite = obj.section.querySelector('#addSprite');
            obj.removeSprite = obj.section.querySelector('#removeSprite');
            obj.removeAllSprite = obj.section.querySelector('#removeAllSprite');

            // Ticker
            obj.addTicker = obj.section.querySelector('#addTicker');
            obj.removeTicker = obj.section.querySelector('#removeTicker');
            obj.startTicker = obj.section.querySelector('#startTicker');
            obj.stopTicker = obj.section.querySelector('#stopTicker');
        };

        var bindEvents = function() {
            if (obj.addSprite) obj.addSprite.addEventListener('click', onClickAddSprite);
            if (obj.removeSprite) obj.removeSprite.addEventListener('click', onClickRemoveSprite);
            if (obj.removeAllSprite) obj.removeAllSprite.addEventListener('click', onClickRemoveAllSprite);

            if (obj.addTicker) obj.addTicker.addEventListener('click', onClickAddTicker);
            if (obj.removeTicker) obj.removeTicker.addEventListener('click', onClickRemoveTicker);
            if (obj.startTicker) obj.startTicker.addEventListener('click', onClickStartTicker);
            if (obj.stopTicker) obj.stopTicker.addEventListener('click', onClickStopTicker);
        };

        var setSprite = function() {
            for (var i = 0; i < obj.totalDudes; i++) {
                var dude = PIXI.Sprite.from('/content/images/dude1.png');
            
                dude.anchor.set(0.5);
                dude.scale.set(0.5 + (Math.random() * 0.3));
                dude.x = Math.random() * obj.app.screen.width;
                dude.y = Math.random() * obj.app.screen.height;
            
                dude.tint = Math.random() * 0xFFFFFF;
                dude.direction = Math.random() * Math.PI * 2;
                dude.turningSpeed = Math.random() * 0.8;
                dude.speed = 2 + (Math.random() * 2);
            
                obj.dudes.push(dude);
                obj.app.stage.addChild(dude);
            }
        };

        var tickerAnimation = function() {
            for (var i = 0; i < obj.dudes.length; i++) {
                var dude = obj.dudes[i];
                dude.direction += dude.turningSpeed * 0.01;
                dude.x += Math.sin(dude.direction) * dude.speed;
                dude.y += Math.cos(dude.direction) * dude.speed;
                dude.rotation = -dude.direction - Math.PI / 2;

                if (dude.x < obj.dudeBounds.x) {
                    dude.x += obj.dudeBounds.width;
                } else if (dude.x > obj.dudeBounds.x + obj.dudeBounds.width) {
                    dude.x -= obj.dudeBounds.width;
                }

                if (dude.y < obj.dudeBounds.y) {
                    dude.y += obj.dudeBounds.height;
                } else if (dude.y > obj.dudeBounds.y + obj.dudeBounds.height) {
                    dude.y -= obj.dudeBounds.height;
                }
            }
        };

        var setTicker = function() {
            obj.app.ticker.add(tickerAnimation);
        };

        var onClickAddSprite = function() {
            var dude = PIXI.Sprite.from('/content/images/dude1.png');

            dude.anchor.set(0.5);
            dude.scale.set(0.5 + (Math.random() * 0.3));
            dude.x = Math.random() * obj.app.screen.width;
            dude.y = Math.random() * obj.app.screen.height;
        
            dude.tint = Math.random() * 0xFFFFFF;
            dude.direction = Math.random() * Math.PI * 2;
            dude.turningSpeed = Math.random() * 0.8;
            dude.speed = 2 + (Math.random() * 2);

            obj.dudes.push(dude);
            obj.app.stage.addChild(dude);
        };

        var onClickRemoveSprite = function() {
            var child = obj.app.stage.children;
            var leng = obj.app.stage.children.length - 1;
            obj.dudes.pop();
            obj.app.stage.removeChild(child[leng]);
        };

        var onClickRemoveAllSprite = function() {
            var leng = obj.app.stage.children.length;
            obj.app.stage.removeChildren(0, leng);
            obj.dudes = [];
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

    pixi.component.tinting.init();
})();