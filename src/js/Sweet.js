
(function(window){
	'use strict';
	
	function define_sweet () {
		
		var Sweet = {
			data: {
				values: {},
				story: [],
				intro: {},
				inventory: []
			},
			ready: {
				values: false,
				story: false,
				intro: false,
				inventory: false
			},
			started: false,
			choices: [],
			debug: false
		};
		
		Sweet._logMessage = function (msg) {
			console.log(" \n  ><s><  " + msg + "\n ");
		};
		
		Sweet._debug = function (msg) {
			if (Sweet.debug) Sweet._logMessage('[debug] ' + msg);
		};
		
		Sweet.start = function () {
			if (!Sweet.started) {
				var narrative = document.getElementById('sw-narrative');
				narrative.innerHTML = '';
				Sweet.started = true;
				Sweet._logMessage("Sweet has started!");
				Sweet._startBranch(Sweet.data.intro);
			} else {
				Sweet._logMessage("Sweet may not be started again");
			}
		};
		
		Sweet._startDisplay = function (branch) {
			var narrative = document.getElementById('sw-narrative');
			if (typeof branch.title == 'string') {
				Sweet._appendTitle(branch.title);
			}
			if (typeof branch.text == 'string') {
				Sweet._appendNarrative(branch.text);
			} else if (branch.text != null && branch.text.constructor === Array) {
				for (var i = 0; i < branch.text.length; i++) {
					var para = branch.text[i];
					Sweet._appendNarrative(para);
				}
			} else if (typeof branch.text != 'undefined') {
				console.error("Only strings or arrays of strings allowed for the text property!");
				console.log(branch);
				return false;
			}
			var choices = document.getElementById('sw-choices');
			choices.innerHTML = '';
			Sweet.choices = branch.choices != null ? branch.choices : [];
			for (var i = 0; i < Sweet.choices.length; i++) {
				var choice = Sweet.choices[i];
				if (Sweet._checkCondition(choice)) {
					var choiceTag = document.createElement('div');
					choiceTag.setAttribute('class', 'sw-choice');
					choiceTag.setAttribute('onclick', 'Sweet._startBranch(Sweet.choices[' + i + '])');
					choiceTag.appendChild(document.createTextNode(Sweet._formatText(choice.choice)));
					choices.appendChild(choiceTag);
				}
			}
		};
		
		Sweet._checkCondition = function (branch) {
			if (typeof branch.condition == "function") {
				return branch.condition();
			} else if (typeof branch.condition == "string") {
				if (branch.condition.substr(0, 7) == "has no ") {
					var value = branch.condition.substr(7).replace(" ", "-");
					return (Sweet.v.has(value) ? false : true);
				} else if (branch.condition.substr(0, 4) == "has ") {
					var value = branch.condition.substr(4).replace(" ", "-");
					return Sweet.v.has(value);
				} else {
					console.error("String conditions must have either 'has <item>' or 'has no <item>'");
				}
			} else if (typeof branch.condition == 'undefined') {
				return true;
			} else {
				console.error("Only function or string is allowed for conditions.");
			}
		};
		
		Sweet._appendNarrative = function (text, title) {
			var narrative = document.getElementById('sw-narrative');
			if (text.substr(0, 1) == "<") {
				var node = narrative.lastChild;
				node.appendChild(document.createTextNode(Sweet._formatText(" " + text.substr(1))));
			} else {
				var node = document.createElement('p');
				node.appendChild(document.createTextNode(Sweet._formatText(text)));
				narrative.appendChild(node);
			}
		};
		
		Sweet._appendTitle = function (title) {
			var narrative = document.getElementById('sw-narrative');
			var titleNode = document.createElement('p');
			titleNode.setAttribute('class', 'title');
			titleNode.appendChild(document.createTextNode(Sweet._formatText(title)));
			narrative.appendChild(titleNode);
		}
		
		Sweet._startBranch = function (branch) {
			Sweet._debug("starting branch: " + (branch.tag != null ? branch.tag : "tagless"))
			Sweet.currentBranch = branch;
			Sweet.nextBranch = null;
			Sweet._startAction(branch);
			Sweet._startDisplay(branch);
			Sweet._startNext(branch);
			Sweet._debug("next branch: " + ((Sweet.nextBranch != null && Sweet.nextBranch.tag != null) ? Sweet.nextBranch.tag : "tagless"));
		};
		
		Sweet._startAction = function (branch) {
			if (branch.action != null) {
				if (typeof branch.action == "function") {
					Sweet.actionValues = branch.action();
				} else if (typeof branch.action == "string") {
					var aType = branch.action.substr(0, 5);
					var aValue = branch.action.substr(5).replace(" ", "-");
					if (aType == "give ") {
						Sweet.v.give(aValue);
					} else if (aType == "take ") {
						Sweet.v.take(aValue);
					} else {
						console.error("Only actions give, take or branch redirect is permitted!");
						return false;
					}
				} else {
					console.error("Type " + (typeof branch.action) + " is not supported" + (branch.tag != null ? " at branch tag: " + branch.tag : "") + "!");
					return false;
				}
			}
		};
		
		Sweet._formatText = function (text) {
			var valueReg = new RegExp(/v\{([\w\-])+(\|?[\w\s\.\,\:\;\-\!\?]*)(\|?[\w\s\.\,\:\;\-\!\?]*)\}/g);
			var replaceReg = new RegExp(/v\{([\w\-])+(\|?[\w\s\.\,\:\;\-\!\?]*)(\|?[\w\s\.\,\:\;\-\!\?]*)\}/);
			var dataReg = new RegExp(/(?!v\{)([\w\-])+(?=\|?[\w\s\.\,\:\;\-\!\?]*\|?[\w\s\.\,\:\;\-\!\?]*\})/g);
			var inserts = text.match(valueReg);
			if (inserts == null) return text;
			for (var i = 0; i < inserts.length; i++) {
				var insert = inserts[i];
				var insertData = insert.replace(/(v\{|\})/g, "").split(/\|/g);
				var valueItem = Sweet.data.values[insertData[0]];
				if (typeof valueItem == 'boolean') {
					if (insertData[1] != null) {
						if (insertData[2] != null) {
							text = text.replace(replaceReg, Sweet.data.values[insertData[0]] ? insertData[1] : insertData[2]);
						} else {
							text = text.replace(replaceReg, Sweet.data.values[insertData[0]] ? insertData[1] : "");
						}
					} else {
						var item = Sweet.v.get(insertData[0]);
						text = text.replace(replaceReg, item != null ? item.name : insertData[0]);
					}
				} else if (typeof valueItem == 'object') {
					console.error('Only boolean, string and number types allowed as values');
					text = text.replace(replaceReg, "");
				} else if (typeof valueItem == 'undefined') {
					var item = Sweet.v.get(insertData[0]);
					text = text.replace(replaceReg, insertData[2] != null ? insertData[2] : (typeof item != 'undefined' ? item.name : insertData[0]));
				} else {
					text = text.replace(replaceReg, valueItem);
				}
			}
			return text.replace(/( )+/g, " ");
		};
		
		Sweet._startNext = function (branch) {
			var next = branch['next'];
			Sweet._debug('startNext = ' + next);
			if (next != null) {
				if (branch.choices != null) {
					console.error("You cannot have choices AND a next branch action in the same branch!");
					return false;
				}
				for (var i = 0; i < Sweet.data.story.length; i++) {
					var branch = Sweet.data.story[i];
					if (branch.tag != null && branch.tag.match(next)) {
						Sweet.nextBranch = branch;
						Sweet._startBranch(branch);
						return true;
					}
				}
				console.error('Branch ' + next + ' not found!');
				return false;
			}
		};
		
		Sweet._autosave = function () {
			// TODO: store data in cookies
		};
		
		Sweet.v = {
			add: function (label, value) {
				Sweet.data.values[label] = value;
			},
			give: function (label) {
				Sweet.data.values[label] = true;
			},
			take: function (label) {
				Sweet.data.values[label] = false;
			},
			has: function (label) {
				return (Sweet.data.values[label] != null ? Sweet.data.values[label] : false);
			},
			get: function (label) {
				for (var i = 0; i < Sweet.data.inventory.length; i++) {
					var item = Sweet.data.inventory[i];
					if (item.id == label) {
						return item;
					}
				}
			},
			remove: function (label) {
				Sweet.data.values[label] = null;
			}
		};
		
		/*****************
		* Values methods
		*****************/
		
		Sweet.set = function (label, value) {
			Sweet.data.values[label] = value;
		};
		
		Sweet.give = function (label) {
			Sweet.data.values[label] = true;
		};
		
		Sweet.take = function (label) {
			Sweet.data.values[label] = false;
		};
		
		Sweet.has = function (label) {
			return (Sweet.data.values[label] != null ? Sweet.data.values[label] : false);
		};
		
		Sweet.get = function (label) {
			for (var i = 0; i < Sweet.data.inventory.length; i++) {
				var item = Sweet.data.inventory[i];
				if (item.id == label) {
					return item;
				}
			}
		};
		
		Sweet.remove = function (label) {
			Sweet.data.values[label] = null;
		};
		
		/*****************
		* Ready methods
		*****************/
		
		Sweet.intro = function (obj) {
			Sweet.data.intro = obj;
			Sweet._ready('intro');
		};
		
		Sweet.story = function (obj) {
			Sweet.data.story = obj;
			Sweet._ready('story');
		};
		
		Sweet.inventory = function (obj) {
			Sweet.data.inventory = obj;
			Sweet._ready('inventory');
		};
		
		Sweet.values = function (obj) {
			Sweet.data.values = obj;
			Sweet._ready('values');
		};
		
		Sweet._ready = function (part) {
			Sweet.ready[part] = true;
			if (Sweet.ready.intro &&
					Sweet.ready.story &&
					Sweet.ready.inventory &&
					Sweet.ready.values) {
				Sweet.start();
			}
		};
		
		return Sweet;
	}
	
	if(typeof Sweet === 'undefined') {
		window.Sweet = define_sweet();
	} else {
		console.log("Sweet already defined.");
	}
	
})(window);
