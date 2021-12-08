;(function() {
    'use strict';

    window.pixi = window.pixi || {};
    window.pixi.component = window.pixi.component || {};

    pixi.component.starwarp = (function() {
        var obj = {};

        var init = function() {
            obj.section = document.querySelector('.pixi-starwarp');

            if (!!obj.section) {
                setElements();
                createStars();
                setTicker();
                bindEvents();
            }
        };

        var setElements = function() {
            obj.app = new PIXI.Application({
                view: document.getElementById('starwarp')
            });
            obj.starTexture = PIXI.Texture.from('/content/images/star.png');

            obj.stars = [];
            obj.starAmount = 1000;
            obj.cameraZ = 0;
            obj.fov = 20;
            obj.baseSpeed = 0.025;
            obj.speed = 0;
            obj.warpSpeed = 0;
            obj.starStretch = 5;
            obj.starBaseSize = 0.05;

            setInterval(() => {
                obj.warpSpeed = obj.warpSpeed > 0 ? 0 : 1;
            }, 3000);
        };

        var createStars = function() {
            for (var i = 0; i < obj.starAmount; i++) {
                var star = {
                    sprite: new PIXI.Sprite(obj.starTexture),
                    x: 0,
                    y: 0,
                    z: 0
                };

                star.sprite.anchor.x = 0.5;
                star.sprite.anchor.y = 0.7;
                randomizeStar(star, true);
                obj.app.stage.addChild(star.sprite);
                obj.stars.push(star);
            }
        };

        var randomizeStar = function(star, initial) {
            star.z = initial ? Math.random() * 2000 : obj.cameraZ + (Math.random() * 1000) + 2000;

            var deg = Math.random() * Math.PI * 2;
            var distance = Math.random() * 50 + 1;
            star.x = Math.cos(deg) * distance;
            star.y = Math.sin(deg) * distance;
        };

        var setTicker = function() {
            obj.app.ticker.add(function(delta) {
                obj.speed += (obj.warpSpeed - obj.speed) / 20;
                obj.cameraZ += delta * 10 * (obj.speed + obj.baseSpeed);

                for (var i = 0; i < obj.starAmount; i++) {
                    var star = obj.stars[i];
                    if (star.z < obj.cameraZ) randomizeStar(star);

                    var z = star.z - obj.cameraZ;
                    star.sprite.x = star.x * obj.fov / z * obj.app.renderer.screen.width + obj.app.renderer.screen.width / 2;
                    star.sprite.y = star.y * obj.fov / z * obj.app.renderer.screen.width + obj.app.renderer.screen.height / 2;

                    var dxCenter = star.sprite.x - (obj.app.renderer.screen.width / 2);
                    var dyCenter = star.sprite.y - (obj.app.renderer.screen.height / 2);
                    var distanceCenter = Math.sqrt((dxCenter * dxCenter) + (dyCenter * dyCenter));
                    var distanceScale = Math.max(0, (2000 - z) / 2000);
                    star.sprite.scale.x = distanceScale * obj.starBaseSize;
                    star.sprite.scale.y = (distanceScale * obj.starBaseSize) + distanceScale * obj.speed * obj.starStretch * distanceCenter / obj.app.renderer.screen.width;
                    star.sprite.rotation = Math.atan2(dyCenter, dxCenter) + Math.PI / 2;
                }
            });
        };

        var bindEvents = function() {

        };

        return {
            init: init
        }
    })();

    pixi.component.starwarp.init();
})();