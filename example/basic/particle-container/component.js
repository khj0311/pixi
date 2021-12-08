;(function() {
    'use strict';

    window.pixi = window.pixi || {};
    window.pixi.component = window.pixi.component || {};

    pixi.component.particleContainer = (function() {
        var obj = {};

        var init = function() {
            obj.section = document.querySelector('.pixi-particle-container');

            if (!!obj.section) {
                setElements();
                setMaggots();
                setTicker();
                bindEvents();
            }
        };

        var setElements = function() {
            obj.app = new PIXI.Application({
                view: document.getElementById('particleContainer'),
                width: 800,
                height: 800
            });

            obj.container = new PIXI.ParticleContainer(100, {
                scale: true,
                position: true,
                rotation: true,
                uvs: true,
                alpha: true
            });

            obj.app.stage.addChild(obj.container);

            obj.maggots = [];
            obj.maggotBoundsPadding = 100;
            obj.maggotBounds = new PIXI.Rectangle(
                -obj.maggotBoundsPadding,
                -obj.maggotBoundsPadding,
                obj.app.screen.width + obj.maggotBoundsPadding * 2,
                obj.app.screen.height + obj.maggotBoundsPadding * 2,
            );

            obj.tick = 0;

            // Sprite
            obj.addSprite = obj.section.querySelector('#addSprite');
            obj.removeSprite = obj.section.querySelector('#removeSprite');
            obj.removeSomeSprite = obj.section.querySelector('#removeSomeSprite');
        };

        var setMaggots = function() {
            for (var i = 0; i < 10; i++) {
                createSprite();
            }
        };

        var setTicker = function() {
            obj.app.ticker.add(tickerAnimation);
        };

        var tickerAnimation = function() {
            for (var i = 0; i < obj.maggots.length; i++) {
                var maggot = obj.maggots[i];
                maggot.scale.y = 0.95 + Math.sin(obj.tick + maggot.offset) * 0.05;
                maggot.direction += maggot.turningSpeed * 0.01;
                maggot.x += Math.sin(maggot.direction) * (maggot.speed * maggot.scale.y);
                maggot.y += Math.cos(maggot.direction) * (maggot.speed * maggot.scale.y);
                maggot.rotation = -maggot.direction + Math.PI;

                if (maggot.x < obj.maggotBounds.x) {
                    maggot.x += obj.maggotBounds.width;
                } else if (maggot.x > obj.maggotBounds.x + obj.maggotBounds.width) {
                    maggot.x -= obj.maggotBounds.width;
                }

                if (maggot.y < obj.maggotBounds.y) {
                    maggot.y += obj.maggotBounds.height;
                } else if (maggot.y > obj.maggotBounds.y + obj.maggotBounds.height) {
                    maggot.y -= obj.maggotBounds.height;
                }
            }

            obj.tick += 0.1;
        };

        var bindEvents = function() {
            if (obj.addSprite) obj.addSprite.addEventListener('click', onClickAddSprite);
            if (obj.removeSprite) obj.removeSprite.addEventListener('click', onClickRemoveSprite);
        };

        var createSprite = function() {
            var maggot = PIXI.Sprite.from('/content/images/maggot_tiny.png');
            maggot.anchor.set(0.5);
            maggot.scale.set(0.8 + Math.random() * 0.3);
            maggot.x = Math.random() * obj.app.screen.width;
            maggot.y = Math.random() * obj.app.screen.height;
            maggot.tint = Math.random() * 0x808080;
            maggot.direction = Math.random() * Math.PI * 2;
            maggot.turningSpeed = Math.random() - 0.8;
            maggot.speed = (2 + Math.random() * 2) * 0.2;
            maggot.offset = Math.random() * 100;
            obj.maggots.push(maggot);
            obj.container.addChild(maggot);
        };

        var onClickAddSprite = function() {
            createSprite();
        };

        var onClickRemoveSprite = function() {
            var child = obj.container.children;
            var leng = obj.container.children.length - 1;
            obj.maggots.pop();
            obj.container.removeChild(child[leng]);
        };

        return {
            init: init
        }
    })();

    pixi.component.particleContainer.init();
})();