const Immutable = require("immutable");

let error1 = Immutable.fromJS({
	name: ["This field is required", "Another error"],
	age: ["Only numeric characters are allowed"]
});

let solution1 = Immutable.fromJS({
	name: "This field is required. Another error.",
	age: "Only numeric characters are allowed."
});

let error2 = Immutable.fromJS({
	name: {
		first: ["Only alphanumeric characters are allowed"],
		last: ["Only alphanumeric characters are allowed"]
	},
	names: [
		{},
		{
			first: ["Only alphanumeric characters are allowed"],
			last: ["Only alphanumeric characters are allowed"]
		},
		{}
	]
});

let solution2 = (error = {
	name: "Only alphanumeric characters are allowed.",
	names: "Only alphanumeric characters are allowed."
});

const error3 = Immutable.fromJS({
	name: ["This field is required"],
	age: ["This field is required", "Only numeric characters are allowed"],
	urls: [
		{},
		{},
		{
			site: {
				code: ["This site code is invalid"],
				id: ["Unsupported id"]
			}
		}
	],
	url: {
		site: {
			code: ["This site code is invalid"],
			id: ["Unsupported id"]
		}
	},
	tags: [
		{},
		{
			non_field_errors: ["Only alphanumeric characters are allowed"],
			another_error: ["Only alphanumeric characters are allowed"],
			third_error: ["Third error"]
		},
		{},
		{
			non_field_errors: [
				"Minumum length of 10 characters is required",
				"Only alphanumeric characters are allowed"
			]
		}
	],
	tag: {
		nested: {
			non_field_errors: ["Only alphanumeric characters are allowed"]
		}
	}
});

const concatErrors = (err, result, ...rest) => {
	err.entrySeq().forEach(e => {
		console.log(e[0], "e");
		if (rest.includes(e[0])) {
			result[e[0]] = recurseWithPreserve(e[1].toJS(), [e[0]], [], err);
		} else {
			result[e[0]] = recurseNoPreserve(e[1].toJS(), [e[0]], "", err);
		}
	});
	console.log(result, "result");
	return Immutable.fromJS(result);
};

const recurseNoPreserve = (input, inputNames, errors, immutableObj) => {
	if (ArrOfStrings(input) && Array.isArray(input)) {
		//console.log(input.join(". ") + ".", "input");
		return input.join(". ") + ".";
	} else if (JSON.stringify(input) === "{}") {
		return;
	} else {
		//console.log(input, 'input asdfasdf')
		if (Array.isArray(input)) {
			for (let i = 0; i < input.length; i++) {
				//console.log(input[i], 'lookokokok')
				if (JSON.stringify(input[i]) !== "{}") {
					//console.log(errors, 'shouldnot  be an array')
					if (
						!errors.includes(
							recurseNoPreserve(input[i], inputNames, errors, immutableObj)
						)
					) {
						console.log(errors, "errors before push");
						errors += recurseNoPreserve(input[i], inputNames, errors, immutableObj)
					}
				}
			}
			return errors;
		} else {
			for (let key in input) {
				if (input[key]) {
					console.log(errors, "errors in object e");
					if (
						!errors.includes(
							recurseNoPreserve(input[key], inputNames, errors, immutableObj)
						)
					) {
						errors +=recurseNoPreserve(input[key], inputNames, errors, immutableObj)
					}
				}
			}
			return errors;
		}
	}
};

const recurseWithPreserve = (input, inputNames, errors, immutableObj) => {
	return;
};

const ArrOfStrings = arr => {
	for (let i = 0; i < arr.length; i++) {
		if (typeof arr[i] !== "string") {
			return false;
		}
	}
	return true;
};

console.log(concatErrors(error3, {}), "end");
