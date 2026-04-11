import { Dimensions } from 'react-native';

const { width, height } = Dimensions.get('window');

export const calculateNextPosition = (pos, vel, size) => {
    let { x, y} = pos;
    let { vx, vy } = vel;

    // New potential position
    x += vx;
    y += vy;

    // Horizontal Bounce (Left/Right edges)
    if (x <= 0 || x + size >= width) {
        vx = -vx; // Reverse horizontal direction
    }

    return {
        newPos: { x, y },
        newVel: { vx, vy }
    };
};