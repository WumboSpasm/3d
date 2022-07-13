class World {
    constructor(canvas, xPos = 0, yPos = 0, zPos = 0, xRot = 0, yRot = 0, zRot = 0) {
        this.canvas = canvas;
        this.pos = {
            x: xPos,
            y: yPos,
            z: zPos,
        };
        this.rot = {
            x: xRot,
            y: yRot,
            z: zRot
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
                
                offset.x = (offset.x * Math.cos(Math.PI / 180 * this.rot.x)) - (offset.z * Math.sin(Math.PI / 180 * this.rot.x));
                offset.z = (offset.x * Math.sin(Math.PI / 180 * this.rot.x)) + (offset.z * Math.cos(Math.PI / 180 * this.rot.x));
                
                offset.z = (offset.z * Math.cos(Math.PI / 180 * this.rot.y)) - (offset.y * Math.sin(Math.PI / 180 * this.rot.y));
                offset.y = (offset.z * Math.sin(Math.PI / 180 * this.rot.y)) + (offset.y * Math.cos(Math.PI / 180 * this.rot.y));
                
                offset.x = (offset.x * Math.cos(Math.PI / 180 * this.rot.z)) - (offset.y * Math.sin(Math.PI / 180 * this.rot.z));
                offset.y = (offset.x * Math.sin(Math.PI / 180 * this.rot.z)) + (offset.y * Math.cos(Math.PI / 180 * this.rot.z));
                
                if (offset.z <= 0) return;
                offset.z /= Math.min(this.canvas.width, this.canvas.height);
                
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