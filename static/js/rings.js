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


function Node(position, velocity, size, width, color) {
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


var Manager = function () {
        this.initialize();
}

Manager.prototype = {
    canvas     : document.getElementById('rings'),
    context    : this.canvas.getContext('2d'),
    rings      : [],
    background : null,

    initialize: function () {
        window.requestAnimationFrame = window.requestAnimationFrame       ||
                                       window.webkitRequestAnimationFrame ||
                                       window.mozRequestAnimationFrame    ||
                                       window.msRequestAnimationFrame     ||
                                       window.oRequestAnimationFrame      ||
                                       function(callback) {
                                           window.setTimeout(callback, 1000 / 60);
                                       };

        this.canvas.width            = SETTINGS.CANVAS.WIDTH;
        this.canvas.height           = SETTINGS.CANVAS.HEIGHT;
        this.canvas.style.background = SETTINGS.CANVAS.BACKGROUND;

        window.addEventListener('resize', function() {
            this.canvas.width  = width  = window.innerWidth;
            this.canvas.height = height = window.innerHeight;
        });

        this.background = this.context.createRadialGradient(
            SETTINGS.CANVAS.WIDTH / 2, 0, SETTINGS.CANVAS.WIDTH / 2,
            SETTINGS.CANVAS.WIDTH / 2, 0, 0
        );
        this.background.addColorStop(.0, SETTINGS.CANVAS.BACKGROUND.INNER);
        this.background.addColorStop(.9, SETTINGS.CANVAS.BACKGROUND.OUTER);

        for (var i = 0; i < SETTINGS.RINGS.COUNT; i++) {
            this.rings.push(this.createRandomNode());
        }
    },

    createRandomNode: function () {
        var position = new Vector3d(Math.random() * this.canvas.width, Math.random() * this.canvas.height + this.canvas.height, Math.random() * SETTINGS.RINGS.DEPTH.MAX + 1),
            velocity = new Vector3d(0, -(SETTINGS.RINGS.VELOCITY / position.z), 0),
            size     = SETTINGS.RINGS.RADIUS / position.z,
            width    = size * .4,
            color    = SETTINGS.RINGS.COLORS[Math.floor(Math.random() * SETTINGS.RINGS.COLORS.length)];

        return new Node(position, velocity, size, width, color);
    },

    clear: function () {
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.context.globalCompositeOperation = 'lighter';
        this.context.fillStyle = this.background;
        this.context.fillRect(0, 0, this.canvas.width, this.canvas.height);
    },

    drawAndUpdate: function () {
        for (var i = 0; i < this.rings.length; i++) {
            var ring = this.rings[i];

            this.context.beginPath();

            this.context.strokeStyle = ring.color;
            this.context.lineWidth   = ring.width;

            this.context.arc(ring.position.x, ring.position.y, ring.size, 0, 2 * Math.PI, true);
            this.context.stroke();

            this.context.closePath();

            ring.move();

            if (ring.position.y < 0 - ring.size - ring.width) {
                this.rings[i] = this.createRandomNode();
            }
        }
    },

    loop: function () {
        this.clear();
        
        this.drawAndUpdate();

        window.requestAnimationFrame(this.loop, null);
    }
};

var manager = new Manager();
manager.loop();
