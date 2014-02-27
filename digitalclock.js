function DigitalClock(el, size) {
	this._el = el;
	this._size = size;
}

DigitalClock.prototype._timer = null;

DigitalClock.prototype.initialise = function() {
	var canvas = document.createElement('canvas');
	canvas.height = this._size * 0.38;
	canvas.width = this._size;
	this._canvas = canvas;
	this._context = canvas.getContext('2d');
	this._el.appendChild(canvas);
	
	this._el.style.width = this._size + 'px';
	this._el.style.height = (this._size * 0.38) + 'px';
	
	this._background = this._background || "rgba(5,5,5,1)";
	this._foreground = this._foreground || "rgba(139,0,0,1)";
	this._shadow = this._shadow || "rgba(238,0,0,1)";
	this._shadowNumber = this._shadowNumber || "rgba(139,105,105, 0.1)";
	
	// base width 460
	
	this._blockWidth = this._size * 0.017; //8
	this._blockHeight = this._size * 0.14; //64
	
	this._shadowBlur = this._size * 0.02; //10
	
	this._leftOffset = this._size * 0.04; //20
	this._leftTopOffset = this._size * 0.06; //28
	this._rightOffset = this._size * 0.2; //92
	
	this._topOffset = this._size * 0.02; //10
	this._bottomOffset = this._size * 0.34; //158
	this._topMiddleOffset = this._size * 0.04; //20
	this._topBottomOffset = this._size * 0.18; //84
	this._bottomMiddleOffset = this._size * 0.2; //92
	
	this._blinkLeftOffset = this._size * 0.49; //225
	this._blinkTopOffset = this._size * 0.11; //50
	this._blinkBottomOffset = this._size * 0.25; //116
	
	this._secondDigitOffset = this._size * 0.22; //100
	this._thirdDigitOffset = this._size * 0.52; //238
	this._fourthDigitOffset = this._size * 0.74; //338
	
	this._tick();
	return this;
};

DigitalClock.prototype.withNumberShadows = function() {
	this._numberShadow = true;
	return this;
}

DigitalClock.prototype.with24Hour = function() {
	this._24hour = true;
	return this;
};

DigitalClock.prototype.withColors = function(background, foreground, shadow, shadowNumber) {
	this._background = background;
	this._foreground = foreground;
	this._shadow = shadow;
	this._shadowNumber = shadowNumber;
	return this;
};

DigitalClock.prototype.withFrame = function() {
	var elStyle = this._el.style;
	elStyle.borderWidth = this._size * 0.024 + 'px';
   	elStyle.borderStyle = 'solid';
   	elStyle.borderColor = '#999 #666 #333 #CCC';
	return this;
};

DigitalClock.prototype._drawNumber = function(number, offset, shadow) {
	var ctx = this._context,
		shape = DigitalClock.numbers[number],
		top  = this._top;
	// center
	ctx.beginPath();
	ctx.fillStyle = shadow ? this._shadowNumber : this._foreground;
	ctx.shadowBlur = shadow ? 0 : this._shadowBlur;
	ctx.shadowColor = this._shadow;
	
	if (shape[0]) {
		// top
		ctx.fillRect(offset + this._leftTopOffset,this._topOffset,this._blockHeight,this._blockWidth);
	}
	
	if (shape[1]) {
		// top-left
		ctx.fillRect(offset + this._leftOffset,this._topMiddleOffset,this._blockWidth,this._blockHeight);
	}
	
	if (shape[2]) {
		// top-right
		ctx.fillRect(offset + this._rightOffset,this._topMiddleOffset,this._blockWidth,this._blockHeight);
	}
	
	if (shape[3]) {
		// top-bottom
		ctx.fillRect(offset + this._leftTopOffset,this._topBottomOffset,this._blockHeight,this._blockWidth);
	}
	
	if (shape[4]) {
		// bottom-left
		ctx.fillRect(offset + this._leftOffset,this._bottomMiddleOffset,this._blockWidth,this._blockHeight);
	}
	
	if (shape[5]) {
		// bottom-right
		ctx.fillRect(offset + this._rightOffset,this._bottomMiddleOffset,this._blockWidth,this._blockHeight);
	}
	
	if (shape[6]) {
		// bottom-bottom
		ctx.fillRect(offset + this._leftTopOffset,this._bottomOffset,this._blockHeight,this._blockWidth);
	}
	ctx.fill();
	ctx.closePath();
};

DigitalClock.prototype._tick = function() {
	var now = new Date();
	var ctx = this._context;
	var x = 0;
	var y = 0;
	var hours = now.getHours();
	var minutes = now.getMinutes();
	var firstHourDigit, secondHourDigit, firstMinuteDigit, secondMinuteDigit;
	
	if (!this._24hour) {
		hours = hours % 12 || 12;
	}
	firstHourDigit = Math.floor(hours / 10);
	secondHourDigit = hours - 10 * firstHourDigit;
	firstMinuteDigit = Math.floor(minutes / 10);
	secondMinuteDigit = minutes - 10 * firstMinuteDigit;
	
	ctx.clearRect(0, 0, this._size, this._size);
	
	ctx.beginPath();
	ctx.fillStyle = this._background;
	ctx.fillRect(0,0,this._size, this._size);
	ctx.fill();
	ctx.closePath();
	
	// hours
	if (this._numberShadow) {
		this._drawNumber(8, 0, true);
		this._drawNumber(8, this._secondDigitOffset, true);
	}
	this._drawNumber(firstHourDigit, 0);
	this._drawNumber(secondHourDigit, this._secondDigitOffset);
	
	ctx.beginPath();
	ctx.fillStyle = this._shadowNumber;
	ctx.fillRect(this._blinkLeftOffset,this._blinkTopOffset,this._blockWidth, this._blockWidth);
	ctx.fillRect(this._blinkLeftOffset,this._blinkBottomOffset,this._blockWidth, this._blockWidth);
	ctx.fill();
	ctx.closePath();
	
	if (!this._blink) {
		ctx.beginPath();
		ctx.fillStyle = this._foreground;
		ctx.fillRect(this._blinkLeftOffset,this._blinkTopOffset,this._blockWidth, this._blockWidth);
		ctx.fillRect(this._blinkLeftOffset,this._blinkBottomOffset,this._blockWidth, this._blockWidth);
		ctx.shadowBlur = this._shadowBlur;
		ctx.shadowColor = this._shadow;
		ctx.fill();
		ctx.closePath();
	}
	
	// minutes
	if (this._numberShadow) {
		this._drawNumber(8, this._thirdDigitOffset, true);
		this._drawNumber(8, this._fourthDigitOffset, true);
	}
	this._drawNumber(firstMinuteDigit, this._thirdDigitOffset);
	this._drawNumber(secondMinuteDigit, this._fourthDigitOffset);
	
	// hange blink state
	this._blink = !this._blink;
	
	// set document title
	document.title = 'Digital Clock - ' + hours + ':' + minutes;
	
	this._timer = window.setTimeout(this._tick.bind(this), 500);
};

DigitalClock.prototype.destroy = function() {
	window.clearTimeout(this._timer);
	this._el.removeChild(this._canvas);
	return this;
};

DigitalClock.numbers = {
	0: [1,1,1,0,1,1,1],
	1: [0,0,1,0,0,1,0],
	2: [1,0,1,1,1,0,1],
	3: [1,0,1,1,0,1,1],
	4: [0,1,1,1,0,1,0],
	5: [1,1,0,1,0,1,1],
	6: [1,1,0,1,1,1,1],
	7: [1,0,1,0,0,1,0],
	8: [1,1,1,1,1,1,1],
	9: [1,1,1,1,0,1,1]
}

