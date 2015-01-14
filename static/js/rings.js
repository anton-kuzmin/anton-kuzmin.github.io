var canvas        = document.getElementById('rings'),
    context       = canvas.getContext('2d'),
    width         = window.innerWidth,
    height        = window.innerHeight,
    background    = '#202020',

    rings         = [],
    ringsColors   = ['#AA3939', '#AA7239', '#AA8C39', '#AAA239', '#84A136', '#2D882D', '#265B6A', '#323776', '#4D2C73', '#802B67'],
    ringsRadius   = 16,
    ringsCount    = 256,
    ringsVelocity = 5,
    ringsMaxDepth = 20;


function Vector3d(x, y, z) {
    this.x = x || 0;
    this.y = y || 0;
    this.z = z || 0;
}

Vector3d.prototype = {
    increment: function(vector) {
        this.x += vector.x;
        this.y += vector.y;
        this.z += vector.z;
    }
};


function Ring(position, velocity, radius, width, color) {
    this.position = position || new Vector3d();
    this.velocity = velocity || new Vector3d();
    this.radius   = radius   || 1;
    this.width    = width    || 1;
    this.color    = color    || '#FFFFFF';
}

Ring.prototype = {
    move: function() {
        this.position.increment(this.velocity);
    }
};


function createRandomRing() {
    var position = new Vector3d(Math.random() * canvas.width, Math.random() * canvas.height + canvas.height, Math.random() * ringsMaxDepth + 1),
        velocity = new Vector3d(0, -(ringsVelocity / position.z), 0),
        radius   = ringsRadius / position.z,
        width    = radius * .4,
        color    = ringsColors[Math.floor(Math.random() * ringsColors.length)];

    return new Ring(position, velocity, radius, width, color);
}


function clear() {
    context.clearRect(0, 0, canvas.width, canvas.height);
    context.globalCompositeOperation = 'lighter';
}


function drawAndUpdate() {
    for (var i = 0; i < rings.length; i++) {
        var ring = rings[i];

        context.beginPath();

        context.strokeStyle = ring.color;
        context.lineWidth   = ring.width;

        context.arc(ring.position.x, ring.position.y, ring.radius, 0, 2 * Math.PI, true);
        context.stroke();

        context.closePath();

        ring.move();

        if (ring.position.y < 0 - ring.radius - ring.width)
            rings[i] = createRandomRing();
    }
}


function queue(callback) {
    window.requestAnimationFrame(callback, null);
}


(function initialize() {
    window.requestAnimationFrame = window.requestAnimationFrame       ||
                                   window.webkitRequestAnimationFrame ||
                                   window.mozRequestAnimationFrame    ||
                                   window.msRequestAnimationFrame     ||
                                   window.oRequestAnimationFrame      ||
                                   function(callback) {
                                       window.setTimeout(callback, 1000 / 60);
                                   };

    canvas.width            = width;
    canvas.height           = height;
    canvas.style.background = background;

    window.addEventListener('resize', function() {
        canvas.width  = width  = window.innerWidth;
        canvas.height = height = window.innerHeight;
    });

    for (var i = 0; i < ringsCount; i++)
        rings.push(createRandomRing());
})();


(function loop() {
    clear();
    drawAndUpdate();
    queue(loop);
})();
