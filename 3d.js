class World {
    constructor(posX = 0, posY = 0, posZ = 0, rotX = 0, rotY = 0) {
        this.pos = {
            x:  posX,
            y:  posY,
            z:  posZ,
            rx: rotX,
            ry: rotY
        };
        
        this.points = { array: [] }
        this.points.add = (x, y, z) => this.points.array.push({ x: x, y: y, z: z });
        this.points.edit = (i, pos) => {
            if (pos.x) this.points.array[i].x = pos.x;
            if (pos.y) this.points.array[i].y = pos.y;
            if (pos.z) this.points.array[i].z = pos.z;
        };
        
        this.polys = { array: [] }
        this.polys.add = (...indices) => this.polys.array.push(indices);
        this.polys.remove = i => this.polys.array.splice(i, 1);
    }
    
    static rot = {
        x: (x, y, a) => Math.cos(a) * x - Math.sin(a) * y,
        y: (x, y, a) => Math.cos(a) * y + Math.sin(a) * x
    };
    
    render(canvas) {
        let ctx = canvas.getContext('2d');
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        for (let poly of this.polys.array) {
            let coords = [];
            
            poly.forEach(i => {
                let ox = this.points.array[i].x - this.pos.x, tx = 0,
                    oy = this.points.array[i].y - this.pos.y, ty = 0,
                    oz = this.points.array[i].z - this.pos.z, tz = 0;
                    
                tx = World.rot.x(ox, oy, this.pos.rx);
                ty = World.rot.y(ox, oy, this.pos.rx);
                ox = tx; oy = ty;
    
                ty = World.rot.x(oy, oz, this.pos.ry);
                tz = World.rot.y(oy, oz, this.pos.ry);
                oy = ty; oz = tz;
                
                if (oy > 0) {
                    oy /= Math.min(canvas.width, canvas.height);
                    
                    coords.push({
                        x: ox / oy + canvas.width / 2,
                        y: canvas.height / 2 - oz / oy
                    });
                }
            });
            
            if (coords.length > 0) {
                ctx.beginPath();
                ctx.moveTo(coords[0].x, coords[0].y);
                
                for (let i = 0; i < coords.length; i++)
                    ctx.lineTo(coords[(i + 1) % coords.length].x, coords[(i + 1) % coords.length].y);
                
                ctx.closePath();
                ctx.stroke();
            }
        }
    }
}