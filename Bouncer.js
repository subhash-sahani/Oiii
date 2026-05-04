import React, { useEffect, useRef } from 'react';
import { Animated, Dimensions, Image, StyleSheet } from 'react-native';
import { calculateNextPosition } from './BouncerLogic';

const { width, height } = Dimensions.get('window');

const Bouncer = ({ imageSource, size = 100 }) => {
    const posX = useRef(new Animated.Value(0)).current;
    const posY = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        let vx = 4;
        let vy = 4;
        let currX = 0;
        let currY = 0;

        const move = () => {
            const { newPos, newVel } = calculateNextPosition(
                { x: currX, y: currY },
                { vx, vy },
                size
            );

            currX = newPos.x;
            currY = newPos.y;
            vx = newVel.vx;
            vy = newVel.vy;

            posX.setValue(currX);
            posY.setValue(currY);

            animationFrameId = requestAnimationFrame(move);
        };

        let animationFrameId = requestAnimationFrame(move);
        return () => cancelAnimationFrame(animationFrameId);
    }, [size, posX, posY]);

    return (
        <Animated.View
            style={[
                styles.bouncerContainer,
                {
                    left: posX,
                    top: posY,
                    width: size,
                    height: size,
                }
            ]}
        >
            <Image
                source={imageSource}
                style={{ width: size, height: size, resizeMode: 'contain' }}
            />
        </Animated.View>
    );
};

const styles = StyleSheet.create({
    bouncerContainer: {
        position: 'absolute',
        zIndex: 9999,
    },
});

export default Bouncer;