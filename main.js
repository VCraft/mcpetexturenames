"use strict";
var requiredFilesLeft = 4;
var terrainImg, itemImg, terrainMeta, itemMeta;
function loadHandler() {
	terrainImg = new Image();
	terrainImg.onload = loadedFile;
	terrainImg.src = "terrain-atlas.png";
	itemImg = new Image();
	itemImg.onload = loadedFile;
	itemImg.src = "items-opaque.png";
	var terrainMetaRequest = new XMLHttpRequest();
	terrainMetaRequest.onload = function() {
		terrainMeta = JSON.parse(terrainMetaRequest.responseText);
		loadedFile();
	};
	terrainMetaRequest.open("GET", "terrain.meta");
	terrainMetaRequest.send();
	var itemMetaRequest = new XMLHttpRequest();
	itemMetaRequest.onload = function() {
		itemMeta = JSON.parse(itemMetaRequest.responseText);
		loadedFile();
	};
	itemMetaRequest.open("GET", "items.meta");
	itemMetaRequest.send();
}

function loadedFile() {
	requiredFilesLeft--;
	if (requiredFilesLeft <= 0) {
		buildTable();
	}
}

function buildTable() {
	var mainTable = document.createElement("table");
	var divider = document.createElement("tr");
	divider.innerHTML = "<td>BLOCKS</td>";
	mainTable.appendChild(divider);
	for (var i = 0; i < terrainMeta.length; i++) {
		buildTableRow(mainTable, "terrain-atlas.png", terrainMeta[i]);
	}
	divider = document.createElement("tr");
	divider.innerHTML = "<td>ITEMS</td>";
	mainTable.appendChild(divider);
	for (var i = 0; i < itemMeta.length; i++) {
		buildTableRow(mainTable, "items-opaque.png", itemMeta[i]);
	}
	document.body.appendChild(mainTable);
}

function buildTableRow(mainTable, fileName, meta) {
	for (var i = 0; i < meta.additonal_textures.length + 1; i++) { //Note the misspelling
		var rowElem = document.createElement("tr");
		var texDat = i == 0? meta.uv: meta.additonal_textures[i - 1];
		var nameCellElem = document.createElement("td");
		nameCellElem.textContent = meta.name + ", " + i;
		var picCellElem = document.createElement("td");
		buildPicCell(picCellElem, texDat, fileName, 4);
		rowElem.appendChild(nameCellElem);
		rowElem.appendChild(picCellElem);
		mainTable.appendChild(rowElem);
	}
}

function buildPicCell(picCellElem, uv, fileName, scale) {
	var x1 = uv[0];
	var y1 = uv[1];
	var x2 = uv[2];
	var y2 = uv[3];
	var imgWidth = uv[4];
	var imgHeight = uv[5];
	var sx = Math.floor(imgWidth * x1 + 0.5);
	var sy = Math.floor(imgHeight * y1 + 0.5);
	var width = Math.floor(imgWidth * x2 + 0.5) - sx;
	var height = Math.floor(imgHeight * y2 + 0.5) - sy;
	picCellElem.style.backgroundImage = "url(" + fileName + ")";
	picCellElem.style.width = (scale * width) + "px";
	picCellElem.style.height = (scale * height) + "px";
	picCellElem.style.backgroundSize = (scale * imgWidth) + "px " + (scale * imgHeight) + "px";
	picCellElem.style.backgroundPosition = (scale * -1 * sx) + "px " + (scale * -1 * sy) + "px";
	picCellElem.className = "pixelated pic-cell";
}
window.onload = loadHandler;
