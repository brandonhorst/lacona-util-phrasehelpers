function substrings(inputString, splitOn) {
	var length;
	var i;
	var result = [];
	var inputs;

	if (splitOn) {
		inputs = inputString.split(splitOn);
		for (i = 0, l = inputs.length; i < l; i += 2) {
			result.push(inputs.slice(0, i + 1).join(''));
		}
	} else {
		for (i = 0, l = inputString.length; i < l; i++) {
			result.push(inputString.slice(0, i + 1));
		}
	}

	return result;
}

module.exports = {
	substrings: substrings
};
