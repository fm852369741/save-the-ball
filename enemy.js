const Enemy = class {
    constructor(options = {x, y, radius, color}) {
        Object.assign(this, options);
    }
    
    update() {
        this.x += this.velocity.x;
        this.y += this.velocity.y;
    }

    draw(context) {
        context.beginPath();
        context.arc(this.x, this.y, this.radius, 0, 2 * Math.PI, false);
        context.fillStyle = this.color;
        context.fill();
    }
}