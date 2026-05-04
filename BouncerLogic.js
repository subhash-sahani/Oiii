import { Dimensions } from 'react-native';

const { width, height } = Dimensions.get('window');

export const calculateNextPosition = (pos, vel, size) => {
    let { x, y } = pos;
    let { vx, vy } = vel;

    // 1. Predict next position
    let nextX = x + vx;
    let nextY = y + vy;

    // 2. Horizontal Bounce (Left/Right)
    if (nextX <= 0) {
        vx = Math.abs(vx); // Force move right
        nextX = 0;
    } else if (nextX + size >= width) {
        vx = -Math.abs(vx); // Force move left
        nextX = width - size;
    }

    // 3. Vertical Bounce (Top/Bottom) - CRITICAL ADDITION
    if (nextY <= 0) {
        vy = Math.abs(vy); // Force move down
        nextY = 0;
    } else if (nextY + size >= height) {
        vy = -Math.abs(vy); // Force move up
        nextY = height - size;
    }

    return {
        newPos: { x: nextX, y: nextY },
        newVel: { vx, vy }
    };
};