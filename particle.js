const Particle = class {
    constructor(options = {x, y, radius, color}) {
        Object.assign(this, options);
        this.friction = 0.99;
        this.alpha = 1;
    }
    
    update() {
        this.alpha -= 0.01;
        this.x += this.velocity.x;
        this.y += this.velocity.y;
    }

    draw(context) {
        context.save()
        context.globalAlpha = this.alpha;
        context.beginPath();
        context.arc(this.x, this.y, this.radius, 0, 2 * Math.PI, false);
        context.fillStyle = this.color;
        context.fill();
        context.restore();
    }
}