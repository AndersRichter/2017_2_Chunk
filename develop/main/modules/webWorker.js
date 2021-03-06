'use strict';
import eventBus from './eventBus';


export default class webWorker {
	constructor() {
		if (window.Worker) {
			this.bus = eventBus;
			this.worker = new Worker('./worker.js');
			console.log('web worker constructor');
			this.gameHandler();
			this.workerCallbacks();
		} else { console.log('no workers'); }
	}


	gameHandler() {
		this.bus.on('createGame', (data) => {
			this.worker.postMessage(data);
		});
		this.bus.on('connectGame', (data) => {
			this.worker.postMessage(data);
		});
		this.bus.on('getGameInfo', (data) => {
			this.worker.postMessage(data);
		});
		this.bus.on('workerMessage', (workerRequest) => {
			this.worker.postMessage(workerRequest);// принимает массив аргументов
		});
		// how to use it?
		// const workerRequest = {
		// 	code: 123,
		// 	message: 'bla bla bla'
		// };
		// this.bus.emit('workerMessage', data)
	}


	workerCallbacks() {
		this.worker.onmessage = (workerResponse) => { // возвращает не массив ха - ха!
			const data = workerResponse.data;
			console.log(data);
			this.bus.emit(`workerCode${data.code}`, (data));
		};

		this.bus.on('workerClose', () => {
			this.worker.close();
		});
	}


	getFullGameList() {
		const data = JSON.stringify({
			code: '111',
		});
		this.worker.send(data);
	}


	subscribeNewGameNode() {
		const data = JSON.stringify({
			code: '106',
		});
		this.worker.send(data);
	}
}
