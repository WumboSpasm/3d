class World {
    constructor(canvas, scale = 100, xPos = 0, yPos = 0, zPos = 0, xRot = 0, yRot = 0) {
        this.canvas = canvas;
        this.scale  = scale;
        
        this.pos = {
            x: xPos,
            y: yPos,
            z: zPos,
        };
        this.rot = {
            x: xRot,
            y: yRot
        };
        
        this.points = [];
        this.polys  = [];
    }
    
    addPoint(x, y, z) { return this.points.push({ x: x, y: y, z: z }) }
    
    editPoint(index, pos) {
        if (pos.x) this.points[index].x = pos.x;
        if (pos.y) this.points[index].y = pos.y;
        if (pos.z) this.points[index].z = pos.z;
    }
    
    addPoly(...indices) { return this.polys.push(indices) }
    
    removePoly(index) { return this.polys.splice(index, 1) }
    
    static rotatePoint = {
        x(x, y, a) { return (x * Math.cos(Math.PI / 180 * a)) - (y * Math.sin(Math.PI / 180 * a)) },
        y(x, y, a) { return (x * Math.sin(Math.PI / 180 * a)) + (y * Math.cos(Math.PI / 180 * a)) }
    }
    
    render() {
        let ctx = this.canvas.getContext('2d');
        ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        for (let poly = 0; poly < this.polys.length; poly++) {
            let coords = [];
            
            this.polys[poly].forEach(index => {
                let offset = {
                    x: this.points[index].x - this.pos.x,
                    y: this.points[index].y - this.pos.y,
                    z: this.points[index].z - this.pos.z
                };
                
                let temp = { x: 0, y: 0, z: 0 };
                
                temp.x = World.rotatePoint.x(offset.x, offset.z, this.rot.x);
                temp.z = World.rotatePoint.y(offset.x, offset.z, this.rot.x);
                offset.x = temp.x;
                offset.z = temp.z;

                temp.z = World.rotatePoint.x(offset.z, offset.y, this.rot.y);
                temp.y = World.rotatePoint.y(offset.z, offset.y, this.rot.y);
                offset.z = temp.z;
                offset.y = temp.y;
                
                if (offset.z < -this.scale) return;
                offset.z  = (offset.z + this.scale) / Math.max(this.canvas.width, this.canvas.height);
                
                let screen = {
                    x: (offset.x / offset.z) + (this.canvas.width  / 2),
                    y: (offset.y / offset.z) + (this.canvas.height / 2),
                };
                
                coords.push({ x: screen.x, y: this.canvas.height - screen.y });
            });
            
            if (coords.length == 0) continue;
            
            ctx.beginPath();
            ctx.moveTo(coords[0].x, coords[0].y);
            
            for (let i = 0; i < coords.length; i++)
                ctx.lineTo(coords[(i + 1) % coords.length].x, coords[(i + 1) % coords.length].y);
            
            ctx.closePath();
            ctx.stroke();
        }
    }
}