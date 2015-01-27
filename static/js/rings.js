var SETTINGS = {
    RINGS: {
        COLORS: ['#AA3939', '#AA7239', '#AA8C39', '#AAA239', '#84A136', '#2D882D', '#265B6A', '#323776', '#4D2C73', '#802B67'],
        RADIUS: 16,
        COUNT: 256,
        VELOCITY: 5,
        DEPTH: {
            MIN: 1,
            MAX: 20
        }
    },
    CANVAS: {
        BACKGROUND: {
            INNER : '#202020',
            OUTER : '#20282A'
        },
        WIDTH: window.innerWidth,
        HEIGHT: window.innerHeight
    }
};

var canvas  = document.getElementById('rings'),
    context = canvas.getContext('2d'),
    rings   = [];

var bgGradient = context.createRadialGradient(
    SETTINGS.CANVAS.WIDTH / 2, 0, SETTINGS.CANVAS.WIDTH / 2,
    SETTINGS.CANVAS.WIDTH / 2, 0, 0
);
bgGradient.addColorStop(.0, SETTINGS.CANVAS.BACKGROUND.INNER);
bgGradient.addColorStop(.9, SETTINGS.CANVAS.BACKGROUND.OUTER);


var Vector3d = function (x, y, z) {
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


var Node = function (position, velocity, size, width, color) {
    this.position = position || new Vector3d();
    this.velocity = velocity || new Vector3d();
    this.size     = size     || 1;
    this.width    = width    || 1;
    this.color    = color    || '#FFFFFF';
}

Node.prototype = {
    move: function() {
        this.position.increment(this.velocity);
    }
};


function createRandomNode() {
    var position = new Vector3d(Math.random() * canvas.width, Math.random() * canvas.height + canvas.height, Math.random() * SETTINGS.RINGS.DEPTH.MAX + 1),
        velocity = new Vector3d(0, -(SETTINGS.RINGS.VELOCITY / position.z), 0),
        size     = SETTINGS.RINGS.RADIUS / position.z,
        width    = size * .4,
        color    = SETTINGS.RINGS.COLORS[Math.floor(Math.random() * SETTINGS.RINGS.COLORS.length)];

    return new Node(position, velocity, size, width, color);
}


function clear() {
    context.clearRect(0, 0, canvas.width, canvas.height);
    context.globalCompositeOperation = 'lighter';
    context.fillStyle = bgGradient;
    context.fillRect(0, 0, canvas.width, canvas.height);
}


function drawAndUpdate() {
    for (var i = 0; i < rings.length; i++) {
        var ring = rings[i];

        context.beginPath();

        context.strokeStyle = ring.color;
        context.lineWidth   = ring.width;

        context.arc(ring.position.x, ring.position.y, ring.size, 0, 2 * Math.PI, true);
        context.stroke();

        context.closePath();

        ring.move();

        if (ring.position.y < 0 - ring.size - ring.width)
            rings[i] = createRandomNode();
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

    canvas.width            = SETTINGS.CANVAS.WIDTH;
    canvas.height           = SETTINGS.CANVAS.HEIGHT;
    canvas.style.background = SETTINGS.CANVAS.BACKGROUND;

    window.addEventListener('resize', function() {
        canvas.width  = width  = window.innerWidth;
        canvas.height = height = window.innerHeight;
    });

    for (var i = 0; i < SETTINGS.RINGS.COUNT; i++)
        rings.push(createRandomNode());
})();


(function loop() {
    clear();
    drawAndUpdate();
    queue(loop);
})();
