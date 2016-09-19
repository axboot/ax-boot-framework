var jsonPretty = (function(){
	function render (key, value, indent) {
		var text = '', i;

		indent = indent || 0;

		if (Array.isArray(value)) {
			for (i = 0; i < indent; i++) {
				text += " ";
			}

			if (key !== null) {
				text += "\"" + key + "\": ";
			}

			text += "[\n";

			for (var i = 0; i < value.length; i++) {
				text += render(null, value[i], indent + 2);
				if (i < value.length - 1) {
					text += ",";
				}
				text += "\n";
			}

			for (i = 0; i < indent; i++) {
				text += " ";
			}
			text += "]";
		} else if (value !== null && typeof value === 'object' && value.toString() === '[object Object]') {
			for (i = 0; i < indent; i++) {
				text += " ";
			}

			if (key !== null) {
				text += "\"" + key + "\": ";
			}

			text += "{\n";

			var keys = Object.keys(value);
			for (var i = 0; i < keys.length; i++) {
				text += render(keys[i], value[keys[i]], indent + 2);
				if (i < keys.length - 1) {
					text += ",";
				}
				text += "\n";
			}

			for (i = 0; i < indent; i++) {
				text += " ";
			}
			text += "}";
		} else if (typeof value === 'number' || typeof value === 'boolean') {
			for (i = 0; i < indent; i++) {
				text += " ";
			}
			if (key !== null) {
				text += "\"" + key + "\": ";
			}

			if (typeof value === 'number') {
				text += Number(value);
			} else {
				text += value ? 'true' : 'false';
			}

			text += "";
		} else {
			for (i = 0; i < indent; i++) {
				text += " ";
			}
			if (key !== null) {
				key = key.replace(/\"/g, "\\\"");
				text += "\"" + key + "\": ";
			}

			if (value === null) {
				text += "null";
			} else if (value === undefined) {
				text += "undefined";
			} else {
				value = value.replace(/\"/g, "\\\"");
				text += '"' + value + '"';
			}

			text += "";
		}

		return text;
	}

	function format (obj) {
		if (typeof obj === 'object') {
			return render(null, obj);
		}
	}

	return format;
})();