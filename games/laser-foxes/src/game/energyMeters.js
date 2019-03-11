function EnergyMeter() {
    this._energy = this._starting;

    if (this._energy == 0) {
        this._nextRegen = this._regenFirst;
    }
    else {
        this._nextRegen = this._regenAfter;
    }
}

EnergyMeter.prototype.maxEnergy = 8;
EnergyMeter.prototype._maxRegen = 5;

EnergyMeter.prototype._regenFirst = 120;
EnergyMeter.prototype._regenAfter = 60;

EnergyMeter.prototype._starting = 3;

EnergyMeter.prototype._unlimitedDuration = 0;

EnergyMeter.prototype.energy = function () {
    return this._energy;
};

EnergyMeter.prototype.full = function () {
    return this.energy() == this.maxEnergy;
};

EnergyMeter.prototype.avail = function (amount) {
    return (amount <= this._energy || this._unlimitedDuration > 0 );
};

EnergyMeter.prototype.use = function (amount) {
    amount = typeof amount !== 'undefined' ? amount : 1;
    console.assert(this.avail(amount));

    if (this._unlimitedDuration == 0)
        this._energy -= amount;
};

EnergyMeter.prototype.add = function (amount) {
    amount = typeof amount !== 'undefined' ? amount : 1;
    this._energy += amount;
    this._energy = Math.min(this._energy, this.maxEnergy);
};

EnergyMeter.prototype.setUnlimited = function(duration) {
    this._unlimitedDuration = duration;
    this._energy = this.maxEnergy;
}

EnergyMeter.prototype.tick = function (info) {
    if (this._nextRegen == info.frame) {
        if (this.energy() < this._maxRegen) {
            this.add()
        }

        if (this.energy() == 0) {
            this._nextRegen = info.frame + this._regenFirst
        }
        else {
            this._nextRegen = info.frame + this._regenAfter
        }
    }

    if (this._unlimitedDuration > 0)
        --this._unlimitedDuration;
};


exports.EnergyMeter = EnergyMeter;
