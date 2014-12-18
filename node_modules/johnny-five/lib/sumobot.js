module.exports = function(five) {
  return function() {
    function Sumobot(opts) {

      this.center = opts.center || 90;

      if (typeof opts.right === "number") {
        opts.right = new five.Servo({
          board: opts.board,
          pin: opts.right,
          type: "continuous"
        });
      }

      if (typeof opts.left === "number") {
        opts.left = new five.Servo({
          board: opts.board,
          pin: opts.left,
          type: "continuous"
        });
      }

      this.servos = {
        right: opts.right,
        left: opts.left
      };

      this.speed = opts.speed === undefined ? 0 : opts.speed;
    }

    Sumobot.prototype.fwd = function(speed) {
      speed = typeof speed === "undefined" ? this.speed : speed;

      this.speed = speed;

      this.servos.right.ccw(speed);
      this.servos.left.cw(speed);

      return this;
    };

    Sumobot.prototype.rev = function(speed) {
      speed = typeof speed === "undefined" ? this.speed : speed;

      this.speed = speed;

      this.servos.right.cw(this.speed);
      this.servos.left.ccw(this.speed);

      return this;
    };

    Sumobot.prototype.stop = function() {
      this.servos.left.stop();
      this.servos.right.stop();
    };

    [
      "right",
      "left"

    ].forEach(function(dir) {
      Sumobot.prototype[dir] = function() {
        var speed = this.speed - 0.25;
        var method = dir === "right" ? "cw" : "ccw";

        this.servos.right[method](speed);
        this.servos.left[method](speed);

        return this;
      };
    });

    return Sumobot;
  }();
};
