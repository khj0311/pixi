;(function() {
    'use strict';

    window.pixi = window.pixi || {};
    window.pixi.component = window.pixi.component || {};

    pixi.component.slots = (function() {
        var obj = {};

        var init = function() {
            obj.section = document.querySelector('.pixi-slots');

            if (!!obj.section) {
                setElements();
                setLoader();
                setTicker();
                bindEvents();
            }
        };

        var setElements = function() {
            obj.app = new PIXI.Application({
                view: document.getElementById('slots'),
                backgroundColor: 0x1099bb
            });

            obj.reelWidth = 160;
            obj.symbolSize = 150;
            obj.running = false;
            obj.tweening = [];
            obj.reels = [];
        };

        var bindEvents = function() {

        };

        var setLoader = function() {
            obj.app.loader
                .add('/content/images/dude1.png', '/content/images/dude1.png')
                .add('/content/images/dude2.png', '/content/images/dude2.png')
                .add('/content/images/dude3.png', '/content/images/dude3.png')
                .add('/content/images/dude4.png', '/content/images/dude4.png')
                .load(onAssetsLoaded);
        };

        var setTicker = function() {
            obj.app.ticker.add(function() {
                var now = Date.now();
                var remove = [];
                for (var i = 0; i < obj.tweening.length; i++) {
                    var t = obj.tweening[i];
                    var phase = Math.min(1, (now - t.start) / t.time);

                    t.object[t.property] = lerp(t.propertyBeginValue, t.target, t.easing(phase));
                    if (t.change) t.change(t);
                    if (phase === 1) {
                        t.object[t.property] = t.target;
                        if (t.complete) t.complete(t);
                        remove.push(t);
                    }
                }

                for (var i = 0; i < remove.length; i++) {
                    obj.tweening.splice(obj.tweening.indexOf(remove[i]), 1);
                }
            });
        };

        var startPlay = function() {
            if (obj.running) return;
            obj.running = true;

            for (var i = 0; i < obj.reels.length; i++) {
                var r = obj.reels[i];
                var extra = Math.floor(Math.random() * 3);
                var target = r.position + 10 + i * 5 + extra;
                var time = 2500 + i * 600 + extra * 600;
                tweenTo(r, 'position', target, time, backout(0.5), null, i === obj.reels.length - 1 ? reelsComplete : null);
            }
        };
        
        var reelsComplete = function() {
            obj.running = false;
        };

        var onAssetsLoaded = function() {
            var slotTextures = [
                PIXI.Texture.from('/content/images/dude1.png'),
                PIXI.Texture.from('/content/images/dude2.png'),
                PIXI.Texture.from('/content/images/dude3.png'),
                PIXI.Texture.from('/content/images/dude4.png'),
            ];

            var reelContainer = new PIXI.Container();
            for (var i = 0; i < 5; i++) {
                var rc = new PIXI.Container();
                rc.x = i * obj.reelWidth;
                reelContainer.addChild(rc);

                var reel = {
                    container: rc,
                    symbols: [],
                    position: 0,
                    previousPosition: 0,
                    blur: new PIXI.filters.BlurFilter
                };

                reel.blur.blurX = 0;
                reel.blur.blurY = 0;
                rc.filters = [reel.blur];

                for (var j = 0; j < 4; j++) {
                    var symbol = new PIXI.Sprite(slotTextures[Math.floor(Math.random() * slotTextures.length)]);
                    symbol.y = j * obj.symbolSize;
                    symbol.scale.x = symbol.scale.y = Math.min((obj.symbolSize / symbol.width), obj.symbolSize / symbol.height);
                    symbol.x = Math.round((obj.symbolSize - symbol.width) / 2);
                    reel.symbols.push(symbol);
                    rc.addChild(symbol);
                }
                obj.reels.push(reel);
            }
            obj.app.stage.addChild(reelContainer);

            var margin = (obj.app.screen.height - (obj.symbolSize * 3)) / 2;
            reelContainer.y = margin;
            reelContainer.x = Math.round(obj.app.screen.width - (obj.reelWidth * 5));
            var top = new PIXI.Graphics();
            top.beginFill(0, 1);
            top.drawRect(0, 0, obj.app.screen.width, margin);
            var bottom = new PIXI.Graphics();
            bottom.beginFill(0, 1);
            bottom.drawRect(0, (obj.symbolSize * 3) + margin, obj.app.screen.width, margin);

            var style = new PIXI.TextStyle({
                fontFamily: 'Arial',
                fontSize: 36,
                fontStyle: 'italic',
                fontWeight: 'bold',
                fill: ['#76e776', '#eceda2'],
                stroke: '#4a1850',
                strokeThickness: 5,
                dropShadow: true,
                dropShadowColor: '#000000',
                dropShadowBlur: 4,
                dropShadowAngle: Math.PI / 6,
                dropShadowDistance: 6,
                wordWrap: true,
                wordWrapWidth: 440,
            });

            var playText = new PIXI.Text('Spin the wheels!', style);
            playText.x = Math.round((bottom.width - playText.width) / 2);
            playText.y = obj.app.screen.height - margin + Math.round((margin - playText.height) / 2);
            bottom.addChild(playText);

            var headerText = new PIXI.Text('PIXI CRAYON SLOTS!', style);
            headerText.x = Math.round((top.width - headerText.width) / 2);
            headerText.y = Math.round((margin - headerText.height) / 2);
            top.addChild(headerText);
        
            obj.app.stage.addChild(top);
            obj.app.stage.addChild(bottom);
        
            bottom.interactive = true;
            bottom.buttonMode = true;
            bottom.addListener('pointerdown', () => {
                startPlay();
            });

            obj.app.ticker.add((delta) => {
                for (var i = 0; i < obj.reels.length; i++) {
                    var r = obj.reels[i];
                    r.blur.blurY = (r.position - r.previousPosition) * 8;
                    r.previousPosition = r.position;

                    for (var j = 0; j < r.symbols.length; j++) {
                        var s = r.symbols[j];
                        var prevy = s.y;
                        s.y = ((r.position + j) % r.symbols.length) * obj.symbolSize - obj.symbolSize;
                        if (s.y < 0 && prevy > obj.symbolSize) {
                            s.texture = slotTextures[Math.floor(Math.random() * slotTextures.length)];
                            s.scale.x = s.scale.y = Math.min(obj.symbolSize / s.texture.width, obj.symbolSize / s.texture.height);
                            s.x = Math.round((obj.symbolSize - s.width) / 2);
                        }
                    }
                }
            });
        };

        var tweenTo = function(object, property, target, time, easing, onchange, oncomplete) {
            var tween = {
                object,
                property,
                propertyBeginValue: object[property],
                target,
                easing,
                time,
                change: onchange,
                complete: oncomplete,
                start: Date.now(),
            };

            obj.tweening.push(tween);
            return tween;
        };

        var lerp = function(a1, a2, t) {
            return a1 * (1 - t) + a2 * t;
        };

        var backout = function(amount) {
            return (t) => (--t * t * ((amount + 1) * t + amount) + 1);
        };

        return {
            init: init
        }
    })();

    pixi.component.slots.init();
})();