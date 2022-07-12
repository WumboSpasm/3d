let canvas = document.querySelector('canvas'),
    world = new World(canvas, 0, 0, -400);

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
    [[-200,  200,    0], [ 200,  200,    0], [ 200,  200, 400], [-200,  200,  400]],
    [[ 200,  200,    0], [ 200, -200,    0], [ 200, -200, 400], [ 200,  200,  400]],
    [[ 200, -200,    0], [-200, -200,    0], [-200, -200, 400], [ 200, -200,  400]],
    [[-200, -200,    0], [-200,  200,    0], [-200,  200, 400], [-200, -200,  400]]
]);
addObject(world, [
    [[-100, -100,  100], [ 100, -100,  100], [    0,  100, 200]],
    [[ 100, -100,  100], [ 100, -100,  300], [    0,  100, 200]],
    [[ 100, -100,  300], [-100, -100,  300], [    0,  100, 200]],
    [[-100, -100,  300], [-100, -100,  100], [    0,  100, 200]]
]);

world.render();

document.addEventListener('keydown', key => {
    switch (key.code) {
        case 'ArrowLeft':
            world.pos.x -= 10;
            world.render();
            break;
        case 'ArrowRight':
            world.pos.x += 10;
            world.render();
            break;
        case 'ArrowUp':
            world.pos.z += 10;
            world.render();
            break;
        case 'ArrowDown':
            world.pos.z -= 10;
            world.render();
            break;
        case 'KeyW':
            world.pos.y += 10;
            world.render();
            break;
        case 'KeyS':
            world.pos.y -= 10;
            world.render();
            break;
        case 'KeyA':
            world.rot.x = (world.rot.x - 1) % 360;
            world.render();
            break;
        case 'KeyD':
            world.rot.x = (world.rot.x + 1) % 360;
            world.render();
            break;
        case 'KeyR':
            world.rot.y = (world.rot.y - 1) % 360;
            world.render();
            break;
        case 'KeyF':
            world.rot.y = (world.rot.y + 1) % 360;
            world.render();
            break;
        case 'KeyQ':
            world.rot.z = (world.rot.z - 1) % 360;
            world.render();
            break;
        case 'KeyE':
            world.rot.z = (world.rot.z + 1) % 360;
            world.render();
            break;
    }
});