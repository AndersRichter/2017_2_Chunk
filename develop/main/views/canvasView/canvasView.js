'use strict';
import CommonView from '../view/view';
import Block from '../../blocks/block/block.js';


/**
 * Класс секции игры
 * @module CanvasView
 */
export default class CanvasView extends CommonView {
	constructor(eventBus) {
		const canvas1 = Block.create('canvas', {width: '850', height: '850'}, [
			'canvasView__canvas', 'canvasView__canvas_position_backCanvas'
		], '');
		const canvas2 = Block.create('canvas', {width: '850', height: '850'}, [
			'canvasView__canvas', 'canvasView__canvas_position_frontCanvas'
		], '');
		const winDiv = Block.create('div', {}, ['canvasView__winDiv'], '');

		const connect = Block.create('button', {}, ['canvasView__webSocketButton'], 'Connect');

		const disconnect = Block.create('button', {}, ['canvasView__webSocketButton'], 'Disconnect');

		const sendMessage = Block.create('button', {}, ['canvasView__webSocketButton'], 'Send message');

		super([canvas1, canvas2, winDiv]);

		this.el.classList.add('canvasView');

		this.canvas1 = canvas1;
		this.canvas2 = canvas2;
		this.winDiv = winDiv;
		this.socket = {
			connect,
			disconnect,
			sendMessage
		};
		this.winDiv.hide();

		this.canvasForClicks = this.canvas2.el;
		this.canvasForCubes = this.canvas1.el.getContext('2d');
		this.canvasForFigure = this.canvas2.el.getContext('2d');

		this.eventBus = eventBus;
		this.eventBus.on('endOfGame', (win) => {
			if (win) {
				this.winDiv.setText('You win! =)');
			} else {
				this.winDiv.setText('You lose! =(');
			}
			this.winDiv.show();
		});

		this.hide();
	}
}
