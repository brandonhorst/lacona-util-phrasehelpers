var expect = require('chai').expect;
var lutil = require('..');

describe('substrings', function () {
	it('returns all substrings (no split)', function() {
		var input = 'asdf';
		var substrings = lutil.substrings(input)

		expect(substrings).to.have.length(4);
		expect(substrings[0]).to.equal('a');
		expect(substrings[1]).to.equal('as');
		expect(substrings[2]).to.equal('asd');
		expect(substrings[3]).to.equal('asdf');
	});

	it('returns all substrings (split)', function () {
		var input = 'a simple test';
		var substrings = lutil.substrings(input, /( )/);

		expect(substrings).to.have.length(3);
		expect(substrings[0]).to.equal('a');
		expect(substrings[1]).to.equal('a simple');
		expect(substrings[2]).to.equal('a simple test');
	});
});
