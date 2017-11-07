'use strict';
import Cell from './cell.js';

const sideOfCube = 90;
const sideOfCanvas = 850;
const indent = 150;
const maxMove = 3;
const brightOn = 1;
const brightOff = 0;
const figureIndentX = 5;
const figureIndentY = -65;

/**
 * Класс для работы с игровым полем
 * @module Field
 */
export default class Field {
	/**
	 * @param {number} count - длина стороны поля
	 * @param {HTMLElement} canvas - HTML элемент для рисования
	 * @param {EventBus} eventBus - объект класса для работы с событиями
	 * @constructor
	 */
	constructor(count, canvas, eventBus) {
		this.count = count;
		const imgUrl = [];
		imgUrl.push('images/cube.png');
		imgUrl.push('images/cubeBr.png');
		imgUrl.push('images/whitch90-130.png');
		imgUrl.push('images/jack90-130.png');

		const imgs = [];
		let ok = 0;

		this.canvasForCubes = canvas.canvasForCubes;
		this.canvasForFigure = canvas.canvasForFigure;
		this.winDiv = canvas.winDiv;
		this.bus = eventBus;

		for (let i = 0; i < imgUrl.length; i++) {
			const img = new Image();
			imgs.push(img);
			img.onload = function () {
				ok++;
				if (ok >= imgUrl.length) {
				}
			};
			img.src = imgUrl[i];
		}
		this.massOfUrl = [];
		this.massOfUrl = imgs;

		this.arrayOfFigures = [];
		for (let i = 0; i < imgUrl.length; i++) {
			this.arrayOfFigures[i] = 0;
		}

		this.arrayOfCubes = this.setCoordinatesOnField();
	}

	/**
	 * Задание начальных координат и других параметров поля
	 * @return {*} cubes [] - массив ячеек поля
	 */
	setCoordinatesOnField() {
		const startOfFieldX = sideOfCanvas / 2 - sideOfCube / 2;
		const startOfFieldY = indent + (sideOfCanvas - indent - sideOfCube * this.count) / 2;
		const cubes = [];
		for (let i = 0; i < this.count; i++) {
			cubes[i] = [];
		}
		let diff = 0;
		for (let i = 0; i < this.count; i++) {
			let x = startOfFieldX + diff;
			let y = startOfFieldY + diff;
			for (let j = 0; j < this.count; j++) {
				cubes[i][j] = new Cell();
				cubes[i][j].setFigure(0);
				cubes[i][j].setBrightness(0);
				cubes[i][j].setId(i, j);
				cubes[i][j].setCoordinates(x, y);
				x -= sideOfCube / 2 + 2;
				y += sideOfCube / 2 + 2;
			}
			diff += sideOfCube / 2 + 2;
		}
		return cubes;
	}

	/**
	 * Рисует поле
	 */
	drawField() {
		for (let i = 0; i < this.count; i++) {
			for (let j = 0; j < this.count; j++) {
				const br = this.arrayOfCubes[i][j].brightness;
				this.canvasForCubes.drawImage(
					this.massOfUrl[br],
					this.arrayOfCubes[i][j].x,
					this.arrayOfCubes[i][j].y);
			}
		}
	}

	/**
	 * Очищает поле
	 */
	clearField() {
		this.canvasForCubes.clearRect(0, 0, sideOfCanvas, sideOfCanvas);
	}

	/**
	 * Метод для поиска ячейки по id
	 * @return {*} arrayOfCubes[][] - ячейка поля
	 */
	findById(idx, idy) {
		for (let i = 0; i < this.count; i++) {
			for (let j = 0; j < this.count; j++) {
				if (this.arrayOfCubes[i][j].idx === idx && this.arrayOfCubes[i][j].idy === idy) {
					return this.arrayOfCubes[i][j];
				}
			}
		}
	}

	/**
	 * Сбрасывает массив фигур
	 */
	resetArrayOfFigure() {
		for (let i = 0; i < this.arrayOfFigures.length; i++) {
			this.arrayOfFigures[i] = 0;
		}
	}

	/**
	 * Присвоение фигуры ячейке
	 * @param {number} idx - id ячейки по оси x
	 * @param {number} idy - id ячейки по оси y
	 * @param {number} num - номер фигуры
	 */
	setFigure(idx, idy, num) {
		this.findById(idx, idy).setFigure(num);
		this.arrayOfFigures[num]++;
	}

	/**
	 * Отображение количества фигур у игроков
	 * @param {*} arrayOfPlayers [] - массив с данными по игрокам
	 */
	drawCountOfFigure(arrayOfPlayers) {
		this.canvasForCubes.fillStyle = 'white';
		this.canvasForCubes.font = 'bold 20px sans-serif';
		const x = 60;
		let y = 30;
		const diff = 40;
		this.canvasForCubes.clearRect(0, 0, 400, 200);

		for (let i = 0; i < arrayOfPlayers.players.length; i++) {
			this.canvasForCubes.fillText(arrayOfPlayers.players[i].username + " : " + this.arrayOfFigures[i + 2], x, y);
			this.canvasForCubes.drawImage(this.massOfUrl[i + 2], x - diff, y - diff / 2 - 10, 35, 45);
			y += diff;
		}
		this.canvasForCubes.fillText("Ходит игрок : " + arrayOfPlayers.players[arrayOfPlayers.currentPlayerID].username, x, y);
	}

	/**
	 * Обработка события "конец игры"
	 * @param {number} playerID - id игрока
	 */
	gameOver(playerID) {
		let win = false;
		if (this.arrayOfFigures[playerID + 2] > this.arrayOfFigures[playerID + 3]) {
			win = true;
		}
		this.bus.emit('endOfGame', win);
	}

	/**
	 * Удаление фигуры из ячейки
	 * @param {number} idx - id ячейки по оси x
	 * @param {number} idy - id ячейки по оси y
	 */
	deleteFigure(idx, idy) {
		this.findById(idx, idy).setFigure(0);
	}

	/**
	 * Рисует фигуру
	 * @param {number} idx - id ячейки по оси x
	 * @param {number} idy - id ячейки по оси y
	 */
	drawFigures(idx, idy) {
		this.canvasForFigure.drawImage(
			this.massOfUrl[this.findById(idx, idy).figure],
			this.findById(idx, idy).x + figureIndentX,
			this.findById(idx, idy).y + figureIndentY);
	}

	/**
	 * Рисует все фигуры
	 */
	drawAllFigures() {
		for (let i = 0; i < this.count; i++) {
			for (let j = 0; j < this.count; j++) {
				if (this.arrayOfCubes[i][j].figure > 1) {
					this.drawFigures(i, j);
				}
			}
		}
	}

	/**
	 * Удаляет все фигуры
	 */
	deleteAllFigure() {
		for (let i = 0; i < this.count; i++) {
			for (let j = 0; j < this.count; j++) {
				this.deleteFigure(i, j);
			}
		}
		this.resetArrayOfFigure();
	}

	/**
	 * Очищает все фигуры
	 */
	clearFigures() {
		this.canvasForFigure.clearRect(0, 0, sideOfCanvas, sideOfCanvas);
	}

	/**
	 * Подсвечивает ячейки вокруг заданной
	 * @param {number} idx - id ячейки по оси x
	 * @param {number} idy - id ячейки по оси y
	 */
	brightCubes(idx, idy) {
		for (let i = 0; i < this.count; i++) {
			for (let j = 0; j < this.count; j++) {
				const idx2 = this.arrayOfCubes[i][j].idx;
				const idy2 = this.arrayOfCubes[i][j].idy;
				if (Math.abs(idx2 - idx) >= maxMove
					|| Math.abs(idy2 - idy) >= maxMove
					|| this.arrayOfCubes[i][j].figure !== 0
				) {
				} else {
					this.arrayOfCubes[i][j].setBrightness(brightOn);
				}
				this.findById(idx, idy).setBrightness(brightOff);
			}
		}
	}

	/**
	 * Убирает подсветку со всех ячеек
	 */
	deleteAllBrightCube() {
		for (let i = 0; i < this.count; i++) {
			for (let j = 0; j < this.count; j++) {
				this.arrayOfCubes[i][j].setBrightness(brightOff);
			}
		}
	}

	/**
	 * Расставляет фигуры по ячейкам согласно заданному массиву
	 * @param {number} array[] - массив с фигурами
	 */
	setFiguresByArray(array) {
		for (let i = 0; i < this.count; i++) {
			for (let j = 0; j < this.count; j++) {
				let model = 0;
				if (array[i][j] >= 0) {
					model = array[i][j] + 2;
					this.setFigure(i, j, model);
				}
			}
		}
	}

	/**
	 * Подготовка поля для начала игры
	 */
	startGame() {
		this.deleteAllFigure();
		this.clearFigures();
		this.deleteAllBrightCube();
		this.drawField();
	}

	/**
	 * Подсвечивает ячейки вокруг заданной и рисует обновленное поле
	 * @param {number} idx - id ячейки по оси x
	 * @param {number} idy - id ячейки по оси y
	 */
	bright(idx, idy) {
		this.deleteAllBrightCube();
		this.brightCubes(idx, idy);
		this.drawField();
	}

	/**
	 * Обработка хода
	 * @param {*} response - объект с новым состоянием игры
	 */
	stepProcessing(response) {
		this.deleteAllFigure();
		this.clearFigures();
		this.setFiguresByArray(response.arrayOfFigures);
		this.drawAllFigures();
		this.drawCountOfFigure(response);
		this.deleteAllBrightCube();
		this.drawField();
	}

}