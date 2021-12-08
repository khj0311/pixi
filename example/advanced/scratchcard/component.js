;(function() {
    'use strict';

    window.pixi = window.pixi || {};
    window.pixi.component = window.pixi.component || {};

    pixi.component.scratchcard = (function() {
        var obj = {};

        var init = function() {
            obj.section = document.querySelector('.pixi-scratchcard');

            if (!!obj.section) {
                setElements();
                setBrush();
                setLoader();
                bindEvents();
            }
        };

        var setElements = function() {
            obj.app = new PIXI.Application({
                view: document.getElementById('scratchcard')
            });

            obj.dragging = false;
            obj.renderTexture = null;
            obj.renderTextureSprite = null;
        };

        var setBrush = function() {
            obj.brush = new PIXI.Graphics();
            obj.brush.beginFill(0xffffff);
            obj.brush.drawCircle(0, 0, 50);
            obj.brush.endFill();
        };

        var setLoader = function() {
            obj.app.loader.add('bg1', '/content/images/bg_crayon1.jpg');
            obj.app.loader.add('bg2', '/content/images/bg_crayon2.jpg');
            obj.app.loader.load(setScratchCard);
        };

        var setScratchCard = function(loader, resources) {
            var background = new PIXI.Sprite(resources.bg1.texture);
            obj.app.stage.addChild(background);
            background.width = obj.app.screen.width;
            background.height = obj.app.screen.height;

            var imageToReveal = new PIXI.Sprite(resources.bg2.texture);
            obj.app.stage.addChild(imageToReveal);
            imageToReveal.width = obj.app.screen.width;
            imageToReveal.height = obj.app.screen.height;

            obj.renderTexture = PIXI.RenderTexture.create(obj.app.screen.width, obj.app.screen.height);
            obj.renderTextureSprite = new PIXI.Sprite(obj.renderTexture);
            obj.app.stage.addChild(obj.renderTextureSprite);
            imageToReveal.mask = obj.renderTextureSprite;

            obj.app.stage.interactive = true;
            obj.app.stage.on('pointerdown', pointerDown);
            obj.app.stage.on('pointerup', pointerUp);
            obj.app.stage.on('pointermove', pointerMove);
        };

        var bindEvents = function() {

        };

        var pointerMove = function(event) {
            if (obj.dragging) {
                obj.brush.position.copyFrom(event.data.global);
                obj.app.renderer.render(obj.brush, obj.renderTexture, false, null, false);
            }
        };

        var pointerDown = function(event) {
            obj.dragging = true;
            pointerMove(event);
        };

        var pointerUp = function(event) {
            obj.dragging = false;
        };

        return {
            init: init
        }
    })();

    pixi.component.scratchcard.init();
})();