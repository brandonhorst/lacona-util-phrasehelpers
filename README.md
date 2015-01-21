lacona-util
===========

#OUTDATED

Utility functions for building [lacona](https://github.com/brandonhorst/lacona) phrases.

##`substrings(inputString)`

Returns an array of all substrings from the beginning: `[inputString[0], inputString[0..1], inputString[0..2]...]`

###Why to use it

When a `value` is used, the method specified by its `compute` property will be called for every possible input, and it is expected to call `data` with every possible string that this `value` is capable of handling. However, most of the time, it does not handle the full input, but just a portion of it.

Take this very basic phrase, for example.

	{
		scope: {
			integer0to99: function (inputString, data, done) {
				var intRegex = /^[1-9]?\d$/;
				if (inputString.match(intRegex)) {
					data({
						display: inputString,
						value: parseInt(inputString)
					});
				}
				done();
			}
		},

		schema: {
			name: 'bottlesOfBeer',
			root: {
				type: 'value',
				compute: 'integer0to99'
			}
		}
	};

We have a simple phrase which just matches a simple regex, and converts the value to an integer. It should match any non-negative 1 or 2-digit number.

- `0` :ok:
- `9` :ok:
- `42` :ok:
- `03` :no_entry_sign:

We could use it very easily with a sentence that only contains the `bottlesOfBeer` phrase.

However, we run into problems when this phrase is used in sequence with other phrases. Let's look at this sentence:

	{
		schema: {
			name: 'bottlesGame',
			root: [
				{
					type: 'bottlesOfBeer'
				},
				'bottles of beer on the wall'
			],
			sentence: true
		}
	}

Remember that an `Array` is shorthand for a `sequence` and a string is shorthand for a `literal`.

Let's say the user inputs the string `'99 bottles of beer on the wall'`. Lacona will attempt to parse this string with the `bottlesGame` sentence. The `sequence` will send the entire string to its first child: `bottlesOfBeer`. `bottlesOfBeer` will call `integer0to99`, still with the full string.

`integer0to99` will observe that `/^[1-9]?\d$/` does not match the string `'99 bottles of beer on the wall'`, and it will not send any data.

The solution is to attempt to parse every substring individually, and you can use `substrings`.

Let's modify our code to use `substrings`.

	integer0to99: function (inputString, data, done) {
		var intRegex = /^[1-9]?\d$/;
		var substrings = laconaUtil.substrings(inputString);
		var substring;
		var l = substrings.length;
		var i;

		for (i = 0; i < l; i++) {
			substring = substrings[i];
			if (.match(intRegex)) {
				data({
					display: substring,
					value: parseInt(substring)
				});
			}
		}
		done();
	}

In the example that we described, `substrings` will return an array that looks like this:

	[
		'9',
		'99',
		'99 ',
		'99 b',
		'99 bo',
		...
	]

`integer0to99` will call `data` for the only two inputs that match the regex: `'9'` and `'99'`. The `sequence` will consume those strings and attempt to match the `literal` value - `' bottles of beer on the wall'`. Only the second option will match, just as we desired.
