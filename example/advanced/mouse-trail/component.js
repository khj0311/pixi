;(function() {
    'use strict';

    window.pixi = window.pixi || {};
    window.pixi.component = window.pixi.component || {};

    pixi.component.mouseTrail = (function() {
        var obj = {};

        var init = function() {
            obj.section = document.querySelector('.pixi-mouse-trail');

            if (!!obj.section) {
                setElements();
                setHistoryArray();
                setRopePoint();
                setTicker();
            }
        };

        var setElements = function() {
            obj.app = new PIXI.Application({
                view: document.getElementById('mouseTrail'),
                backgroundColor: 0x1099bb
            });

            obj.trailTexture = PIXI.Texture.from('/content/images/trail.png');

            // History
            obj.historyX = [];
            obj.historyY = [];
            obj.historySize = 20;

            obj.ropeSize = 100;
            obj.points = [];
            obj.rope = null;
        };

        var setHistoryArray = function() {
            for (var i = 0; i < obj.historySize; i++) {
                obj.historyX.push(0);
                obj.historyY.push(0);
            }
        };

        var setRopePoint = function() {
            for (var i = 0; i < obj.ropeSize; i++) {
                obj.points.push(new PIXI.Point(0, 0));
            }
            obj.rope = new PIXI.SimpleRope(obj.trailTexture, obj.points);
            obj.rope.blendmode = PIXI.BLEND_MODES.ADD;
            obj.app.stage.addChild(obj.rope);
        };

        var setTicker = function() {
            obj.app.ticker.add(function() {
                var mousePosition = obj.app.renderer.plugins.interaction.mouse.global;

                obj.historyX.pop();
                obj.historyX.unshift(mousePosition.x);
                obj.historyY.pop();
                obj.historyY.unshift(mousePosition.y);

                for (var i = 0; i < obj.ropeSize; i++) {
                    var point = obj.points[i];
                    var interX = cubicInterPolation(obj.historyX, i / obj.ropeSize * obj.historySize);
                    var interY = cubicInterPolation(obj.historyY, i / obj.ropeSize * obj.historySize);

                    point.x = interX;
                    point.y = interY;
                }
            });
        };

        var clipInput = function(k, array) {
            if (k < 0) k = 0;
            if (k > array.length - 1) k = array.length - 1;
            return array[k];
        };

        var getTangent = function(k, factor, array) {
            return factor * (clipInput(k + 1, array) - clipInput(k - 1, array)) / 2;
        };

        var cubicInterPolation = function(array, t, tangentFactor) {
            if (tangentFactor == null) tangentFactor = 1;

            var k = Math.floor(t);
            var m = [getTangent(k, tangentFactor, array), getTangent(k + 1, tangentFactor, array)];
            var p = [clipInput(k, array), clipInput(k + 1, array)];
            t -= k;

            var t2 = t * t;
            var t3 = t * t2;
            return (2 * t3 - 3 * t2 + 1) * p[0] + (t3 - 2 * t2 + t) * m[0] + (-2 * t3 + 3 * t2) * p[1] + (t3 - t2) * m[1];
        };

        return {
            init: init
        }
    })();

    pixi.component.mouseTrail.init();
})();