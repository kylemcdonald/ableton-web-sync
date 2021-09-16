inlets = 1;
outlets = 1;

var messages = 0;
var period = 10;
var previousState = 0;

function msg_int(currentState) {
	if (messages == period || currentState != previousState) {
		messages = 0;
		outlet(0, 'bang');
	}
	previousState = currentState;
	messages++;
};