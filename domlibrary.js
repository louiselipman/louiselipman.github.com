function addClassesIds(object, classes, ids) {
	if (classes != null) {
		for (i in classes) {
			object.className += classes[i];
		}
	}
	if (ids != null) {
		for (i in ids) {
			object.id += ids[i];
		}
	}
}

function addContainer(tag, object, classes, ids) {
	var container = document.createElement(tag);
	addClassesIds(container, classes, ids);
	object.appendChild(container);
	return container;
}

function addText(tag, object, str, classes, ids) {
	var text = document.createElement(tag);
	text.innerHTML = str;
	addClassesIds(text, classes, ids);
	object.appendChild(text);
	return text;
}

function addLink(object, str, url, classes, ids) {
	var link = document.createElement("a");
	link.setAttribute("href", url);
	link.innerHTML = text;
	addClassesIds(link, classes, ids);
	object.appendChild(link);
	return link;
}

function addImg(object, url, alt, classes, ids) {
	var img = new Image();
	img.src = url;
	img.alt = alt;
	$(img).load(function() {
		addClassesIds(img, classes, ids);
		object.insertBefore(img, object.length);
	});
	return img;
}	

function addCell(row, rowSpan, colSpan, classes, ids) {
	var cell = document.createElement("td");
	if (rowSpan > 1) {
		cell.rowSpan = rowSpan;
	}
	if (colSpan > 1) {
		cell.colSpan = colSpan;
	}
	addClassesIds(cell, classes, ids);
	row.appendChild(cell);
	return cell;
}

function getAjax(url) {
	var request;
	try {
		request = new XMLHttpRequest();
	} catch (otherBrowser) {
		try {
			request = new ActiveXObject("Msxml2.XMLHTTP");
		} catch (notMsxml) {
			try {
				request = new ActiveXObject("Microsoft.XMLHTTP");
			} catch (noAjax) {
				// do more here!!!
				alert("Error creating the request object: AJAX does not seem to be supported.");
				return;
			}
		}
	}
	request.onreadystatechange = function() {
		if (request.readyState == 4 && request.status == 200) {
			str = JSON.parse(request.responseText);
			init();
		} else if (request.ReadySate == 4) {
			alert("Sorry, but the database could not be accessed this time. Please try refreshing your browser.");
		}
	}
	request.open("GET", url);
	request.send();
}

function init() {
	for (i in str) {
		convert(str[i], str[i].object);
	}
}	
		
function convert(child, parent) {
	convertObjectStr(child, parent);
	if (child.type == "container") {
		var container = addContainer(child.tag, child.object, child.classes, child.ids);
		for (i in child.children) {
			convert(child.children[i], container);
		}
	} else if (child.type == "text") {
		addText(child.tag, child.object, child.str, child.classes, child.ids);
	} else if (child.type == "link") {
		addLink(child.object, child.str, child.url, child.classes, child.ids);
	} else if (child.type == "cell") {
		var cell = addCell(child.object, child.rowSpan, child.colSpan, child.classes, child.ids);
		for (i in child.children) {
			convert(child.children[i], cell);
		}
	} else if (child.type == "img") {
		addImg(child.object, child.url, child.alt, child.classes, child.ids);
	}
}

function convertObjectStr(child, parent) {
	if (child.object == "this") {
		child.object = parent;
	} else if (child.object.charAt(0) == "#") {
		child.object = document.getElementById(child.object.slice(1, child.object.length));
	} else if (child.object.charAt(0) == ".") {
		child.object = document.getElementsByTagName(child.object.slice(1, child.object.length))[0];
	}
}