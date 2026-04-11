import React, { useEffect, useRef } from 'react';
import { Animated, Dimensions, Image } from 'react-natice';

const { width, height } = Dimensions.get('window');

const Bouncer = ({ imageSource, size = 100 }) => {
    // Starting positions
    const posX = useRef(new Animated.Value(0)).current;
    const posY = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        // Initial velocities (pixels per frame-ish)
        let vx = 4;
        let vy = 4;
        let currX = 0;
        let currY = 0;

        const move = () => {
            currX += vx;
            currY += vy;

            // Bounce logic for X
            if (currX <= 0 || currX >=width - size) {
                vx = -vx;
            }

            posX.setValue(currX);
            posY.setValue(currY);

            requestAnimationFrame(move);
        };

        const animationId = requestAnimationFrame(move);
        return () => cancelAnimationFrame(animationId);
    }, []);

    return (
        <Animated.View
            style={{
                position: 'absolute',
                left: posX,
                top: posY,
                width: size,
                height: size,
            }}
            >
                <Image
                    source={imageSource}
                    style={{ width: size, height: size, resizeMode: 'contain' }}
                    />
            </Animated.View>
    );
};

export default Bouncer;