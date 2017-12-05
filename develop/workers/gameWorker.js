'use strict';

const gameWorker = new class GameWorker {
	constructor(eventBus) {
		this.bus = eventBus;
		this.queue = [];
		this.stepIndicator = true;
	}

	getUserID(data) {
		this.userID = data.userID;
		this.figureType = this.detectFigureByUserID(this.userID);
		const request = {
			func: 'figureType',
			figureType: this.figureType
		};

		return request;
	}

	winOrLose(data) {
		let win = false;
		const finishArray = data.field.field;
		this.result = this.findMaxFiguresCount(this.countFigure(finishArray));
		if (this.result === this.figureType) { win = true; }
		let request = {
			func: 'winnerOrLooser',
			win: win
		};

		return request;
	}

	stepEnable(data) {
		let array = data.array;
		const fieldSize = array.length;
		let x = data.x;
		let z = data.z;
		let reqArray = [];
		for (let i = 0; i < fieldSize; i++) {
			for (let j = 0; j < fieldSize; j++) {
				if (!(Math.abs(i - x) >= 3 ||
						Math.abs(j - z) >= 3 ||
						array[i][j] !== 0 )) {
					let coord = {
						x: i,
						z: j
					};
					reqArray.push(coord);
				}
			}
		}
		const request = {
			func: 'stepEnable',
			arrayAfterStep: reqArray
		};

		return request;
	}

	startArray(data) {
		this.fieldSize = data.game.field.maxX;
		this.arrayOfField = data.game.field.field;
		this.gamers = data.game.gamers;
		this.countPlayers = this.gamers.length;

		this.fullStep();
	}

	step(data) {
		this.queue.push(data);
	}

	fullStep() {
		if (typeof this.queue !== 'undefined' && this.queue !== null &&
			this.queue.length > 0 && this.stepIndicator
		) {
			this.stepIndicator = false;
			const response = this.queue.shift();
			const src = response.step.src;
			const dst = response.step.dst;
			let figureForPaint = [];
			let step = {
				src: response.step.src,
				dst: response.step.dst
			};
			let vector = {
				x: 0,
				z: 0,
			};
			let clone = false;

			vector.x = dst.x - src.x;
			vector.z = dst.z - src.z;

			if (Math.abs(dst.x - src.x) <= 1 && Math.abs(dst.z - src.z) <= 1) {
				clone = true;
				this.arrayOfField[dst.x][dst.z] = this.arrayOfField[src.x][src.z];
			} else {
				this.arrayOfField[dst.x][dst.z] = this.arrayOfField[src.x][src.z];
				this.arrayOfField[src.x][src.z] = 0;
			}

			for (let i = 0; i < this.fieldSize; i++) {
				for (let j = 0; j < this.fieldSize; j++) {
					// Первые два условия проверяют, что перебираемая в цикле клетка находится вплотную к заданной.
					if (Math.abs(i - dst.x) <= 1 &&
						Math.abs(j - dst.z) <= 1) {
						// Затем идет проверка, что на этой клетке есть фигура и что она отлична от той, которая совершила ход.
						if (this.arrayOfField[i][j] !== 0 &&
							this.arrayOfField[i][j] !== this.arrayOfField[dst.x][dst.z]) {
							// Если там стоит вражеская фигура, то ее цвет меняется на цвет той, которая совершила ход.
							let figure = {
								x: i,
								z: j,
								color: this.arrayOfField[dst.x][dst.z]
							};
							figureForPaint.push(figure);
							// И затем в массив клеток вносятся соответствующие изменения по фигурам.
							this.arrayOfField[i][j] = this.arrayOfField[dst.x][dst.z];
						}
					}
				}
			}

			const request = {
				func: 'coordinatesForStep',
				vector: vector,
				clone: clone,
				step: step,
				figureForPaint: figureForPaint
			};

			this.stepIndicator = true;

			self.postMessage(request);
		}

		setTimeout(this.fullStep.bind(this), 1000);
	}

	countFigure(array) {
		const countFigure = [];
		for (let i = 0; i < this.countPlayers; i++) {
			countFigure[i] = 0;
		}
		for (let i = 0; i < this.fieldSize; i++) {
			for (let j = 0; j < this.fieldSize; j++) {
				if (array[i][j] > 0) {
					countFigure[array[i][j] - 1]++;
				}
			}
		}
		return countFigure;
	}

	findMaxFiguresCount(array) {
		let max = 0;
		let maxI = 0;
		for (let i = 0; i < array.length; i++) {
			if (array[i] > max) {
				max = array[i];
				maxI = i;
			}
		}
		return maxI;
	}

	detectFigureByUserID(userID) {
		for (let i = 0; i < this.gamers.length; i++) {
			if (this.gamers[i].userID === userID) {
				return i;
			}
		}
	}
};


self.onmessage = (workerRequest) => {
	let data = workerRequest.data;
	let workerResponse;
	switch (`${data.code}`) {
		case '204':
			workerResponse = gameWorker.winOrLose(data);
			break;
		case '215':
			workerResponse = gameWorker.stepEnable(data);
			break;
		case '200':
			gameWorker.startArray(data);
			break;
		case '112':
			workerResponse = gameWorker.getUserID(data);
			break;
		case '201':
			gameWorker.step(data);
			break;
		default:
			console.log('Error');
	}
	if (workerResponse !== undefined)
		self.postMessage(workerResponse);
};