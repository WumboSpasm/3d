let world = new World(0, -80, 0, 0),
    vel = { default: 8, x: 0, y: 0, z: 0, rx: 0, ry: 0 },
    fps = { last: performance.now(), dif: 0, mult: 0 };

function addObject(world, object) {
    object.forEach(poly => {
        let pointIndices = [...Array(poly.length).keys()].map(i => i + world.points.array.length);
    
        poly.forEach(point => {
            world.points.add(point[0], point[1], point[2]);
        });
        
        world.polys.add(...pointIndices);
    });
}

addObject(world, [
    [[ -20,  20, -20], [  20,  20, -20], [  20,  20,  20], [ -20,  20,  20]],
    [[  20,  20, -20], [  20, -20, -20], [  20, -20,  20], [  20,  20,  20]],
    [[  20, -20, -20], [ -20, -20, -20], [ -20, -20,  20], [  20, -20,  20]],
    [[ -20, -20, -20], [ -20,  20, -20], [ -20,  20,  20], [ -20, -20,  20]]
]);
addObject(world, [
    [[ -10, -10, -10], [  10, -10, -10], [   0,   0,  10]],
    [[ -10,  10, -10], [ -10, -10, -10], [   0,   0,  10]],
    [[  10,  10, -10], [ -10,  10, -10], [   0,   0,  10]],
    [[  10, -10, -10], [  10,  10, -10], [   0,   0,  10]]
]);

(function gameLoop() {
    let now  = performance.now();
    fps.dif  = now - fps.last;
    fps.last = now;
    fps.mult = fps.dif / 60;
    
    world.pos.x += World.rot.x(vel.x, vel.y, -world.pos.rx) * fps.mult;
    world.pos.y += World.rot.y(vel.x, vel.y, -world.pos.rx) * fps.mult;
    world.pos.z  = world.pos.z + (vel.z * fps.mult);
    world.pos.rx = ((world.pos.rx + (vel.rx * fps.mult)) + (Math.PI * 2)) % (Math.PI * 2);
    world.pos.ry = ((world.pos.ry + (vel.ry * fps.mult)) + (Math.PI * 2)) % (Math.PI * 2);
    
    let canvas = document.querySelector('#world');
    
    if (canvas.width  != canvas.scrollWidth)
        canvas.width   = canvas.scrollWidth;
    if (canvas.height != canvas.scrollHeight)
        canvas.height  = canvas.scrollHeight;
    
    document.querySelector('#debug').textContent =
       `FPS: ${Math.trunc(1000 / fps.dif)}
        X: ${Math.trunc(world.pos.x * 10) / 10}
        Y: ${Math.trunc(world.pos.y * 10) / 10}
        Z: ${Math.trunc(world.pos.z * 10) / 10}
        RX: ${Math.trunc(world.pos.rx * (180 / Math.PI))}
        RY: ${Math.trunc(world.pos.ry * (180 / Math.PI))}`
    
    world.render(canvas);
    requestAnimationFrame(gameLoop);
})()

document.addEventListener('keydown', key => {
    if (!key.repeat) {
        switch (key.code) {
            case 'ArrowLeft':  vel.rx = -vel.default * (Math.PI / 180); break;
            case 'ArrowRight': vel.rx =  vel.default * (Math.PI / 180); break;
            case 'ArrowUp':    vel.y  =  vel.default; break;
            case 'ArrowDown':  vel.y  = -vel.default; break;
            case 'KeyW':       vel.z  =  vel.default; break;
            case 'KeyS':       vel.z  = -vel.default; break;
            case 'KeyA':       vel.x  = -vel.default; break;
            case 'KeyD':       vel.x  =  vel.default; break;
            case 'KeyR':       vel.ry = -vel.default * (Math.PI / 180); break;
            case 'KeyF':       vel.ry =  vel.default * (Math.PI / 180); break;
        }
    }
});
document.addEventListener('keyup', key => {
    switch (key.code) {
        case 'ArrowLeft':  vel.rx = Math.max(vel.rx, 0); break;
        case 'ArrowRight': vel.rx = Math.min(vel.rx, 0); break;
        case 'ArrowUp':    vel.y  = Math.min(vel.y,  0); break;
        case 'ArrowDown':  vel.y  = Math.max(vel.y,  0); break;
        case 'KeyW':       vel.z  = Math.min(vel.z,  0); break;
        case 'KeyS':       vel.z  = Math.max(vel.z,  0); break;
        case 'KeyA':       vel.x  = Math.max(vel.x,  0); break;
        case 'KeyD':       vel.x  = Math.min(vel.x,  0); break;
        case 'KeyR':       vel.ry = Math.max(vel.ry, 0); break;
        case 'KeyF':       vel.ry = Math.min(vel.ry, 0); break;
    }
});