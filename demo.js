let canvas = document.querySelector('canvas'),
    world = new World(canvas, 100, 0, 100, -200);

function addObject(world, object) {
    object.forEach(poly => {
        let pointIndices = [...Array(poly.length).keys()].map(i => i + world.points.length);
    
        poly.forEach(point => {
            world.addPoint(point[0], point[1], point[2]);
        });
        
        world.addPoly(...pointIndices);
    });
}

addObject(world, [
    [[-100,  200,    0], [ 100,  200,    0], [ 100,  200, 200], [-100,  200,  200]],
    [[ 100,  200,    0], [ 100,    0,    0], [ 100,    0, 200], [ 100,  200,  200]],
    [[ 100,    0,    0], [-100,    0,    0], [-100,    0, 200], [ 100,    0,  200]],
    [[-100,    0,    0], [-100,  200,    0], [-100,  200, 200], [-100,    0,  200]]
]);
addObject(world, [
    [[ -50,   50,   50], [  50,   50,   50], [   0,  150, 100]],
    [[  50,   50,   50], [  50,   50,  150], [   0,  150, 100]],
    [[  50,   50,  150], [ -50,   50,  150], [   0,  150, 100]],
    [[ -50,   50,  150], [ -50,   50,   50], [   0,  150, 100]]
]);

let activeKey = null;

document.addEventListener('keydown', key => { activeKey = key.code }, false);
document.addEventListener('keyup',   key => { activeKey = null     }, false);

(function render() {
    switch (activeKey) {
        case 'ArrowLeft':
            world.pos.x -= 10;
            break;
        case 'ArrowRight':
            world.pos.x += 10;
            break;
        case 'ArrowUp':
            world.pos.z += 10;
            break;
        case 'ArrowDown':
            world.pos.z -= 10;
            break;
        case 'KeyW':
            world.pos.y += 10;
            break;
        case 'KeyS':
            world.pos.y -= 10;
            break;
        case 'KeyA':
            world.rot.x = ((world.rot.x - 1) + 360) % 360;
            break;
        case 'KeyD':
            world.rot.x = ((world.rot.x + 1) + 360) % 360;
            break;
        case 'KeyR':
            world.rot.y = ((world.rot.y - 1) + 360) % 360;
            break;
        case 'KeyF':
            world.rot.y = ((world.rot.y + 1) + 360) % 360;
            break;
    }
    
    document.querySelector('div').textContent = 
       `X: ${world.pos.x}
        Y: ${world.pos.y}
        Z: ${world.pos.z}
        
        X-rot: ${world.rot.x}
        Y-rot: ${world.rot.y}`;
    
    world.render();
    requestAnimationFrame(render);
})()