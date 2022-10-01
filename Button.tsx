import React from 'react';
import {
  Canvas,
  Fill,
  useSharedValueEffect,
  useValue,
  rrect,
  rect,
  RoundedRect,
  Mask,
  Path,
  Group,
  useTouchHandler,
  BackdropBlur,
  BlurMask,
  useComputedValue,
  RadialGradient,
  vec,
  Text,
  useFont,
  runSpring,
} from '@shopify/react-native-skia';
import { SensorType, useAnimatedSensor } from 'react-native-reanimated';
import { SpringConfig } from '@shopify/react-native-skia/lib/typescript/src/animation/spring/types';

const springConfig = {
  stiffness: 50,
  damping: 700,
} as SpringConfig;

type Props = {
  size: { width: number; height: number };
  text: string;
};

const Button = ({ size, text }: Props) => {
  const { width, height } = size;

  const buttonRect = rect(0, 0, width, height);
  const buttonClip = rrect(buttonRect, 35, 35); // think about dynamic radius

  const y = useValue(0),
    x = useValue(0),
    defaultRoll = useValue(0),
    defaultPitch = useValue(0),
    opacity = useValue(0.1);

  const { sensor } = useAnimatedSensor(SensorType.ROTATION, { interval: 10 });

  const touchHandler = useTouchHandler({
    onStart: () => {
      runSpring(opacity, 0.3, springConfig);
    },
    onEnd: () => {
      runSpring(opacity, 0.1, springConfig);
    },
  });

  useSharedValueEffect(() => {
    if (defaultRoll.current === 0) {
      defaultRoll.current = sensor.value.roll;
    }
    if (defaultPitch.current === 0) {
      defaultPitch.current = sensor.value.pitch;
    }
    const pitch = sensor.value.roll - defaultRoll.current;
    const roll = sensor.value.pitch - defaultPitch.current;

    x.current = width / 2 - 80 + pitch * 50;
    y.current = height / 2 - 60 + roll * 50;
  }, sensor);

  const font = useFont(require('./assets/fonts/SF-Pro-Extended-Medium.ttf'), 26);

  const transform = useComputedValue(
    () => [{ translateX: x.current }, { translateY: y.current }, { scale: 1.7 }],
    [y, x],
  );
  return (
    <Canvas style={size} onTouch={touchHandler}>
      <Fill color='black' />
      <RoundedRect rect={buttonClip} color='#121212' />
      <Mask
        mask={
          <Group>
            <RoundedRect rect={buttonClip} color='#121212' />
          </Group>
        }
        mode={'alpha'}>
        <Group opacity={opacity}>
          <Group
            blendMode={'src'}
            transform={[
              { translateX: width / 2 - 120 },
              { translateY: height / 2 - 33 },
              { scale: 1.9 },
            ]}>
            <Path
              path={
                'M68.4587 -25.686C68.4587 -25.686 104.053 -15.9293 101.607 7.46199C98.2402 39.6565 24.1481 84.9206 24.1481 84.9206C24.1481 84.9206 -2.7895 39.0067 14.7638 33.8074C81.9277 13.9133 68.4587 -25.686 68.4587 -25.686Z'
              }
              color='#4AAE96'
            />
            <BlurMask blur={14} />
          </Group>
          <Group
            blendMode={'src'}
            transform={[
              { translateX: width / 2 - 90 },
              { translateY: height / 2 - 15 },
              { scale: 1.7 },
            ]}>
            <Path
              path='M68.5769 9.69627C68.5769 9.69627 55.9978 43.9755 68.5769 59.8075C85.8902 81.5979 144 59.8075 144 59.8075L144 9.69627L68.5769 9.69627Z'
              color='#8D6EB5'
            />
            <BlurMask blur={14} />
          </Group>
        </Group>
        <Group transform={transform} blendMode='colorDodge'>
          <Path
            path={
              'M-9.96617 -24.8047C-9.96617 -24.8047 2.60044 -17.0815 12.105 -10.1267C25.1865 -0.554396 23.061 19.9916 23.061 19.9916C23.061 19.9916 -3.83272 31.6175 -3.73098 23.4533C-3.38593 -4.23744 -9.96617 -24.8047 -9.96617 -24.8047Z'
            }
            color='#CAA978'
          />
          <Path
            path='M23.6668 14.2977C23.6668 14.2977 18.5143 -5.87744 10.1819 0.833274C-1.28629 10.0695 14.475 34.0601 14.475 34.0601C14.475 34.0601 26.0181 32.0184 28.7308 27.4665C31.764 22.3766 23.6668 14.2977 23.6668 14.2977Z'
            color='#D67C4A'
          />
          <BlurMask blur={17} />
        </Group>
      </Mask>
      <BackdropBlur blur={1000} clip={buttonClip} invertClip={true} />
      <RoundedRect
        rect={buttonClip}
        color='#7B6CA6'
        style={'stroke'}
        strokeWidth={2}
        blendMode={'colorDodge'}>
        <RadialGradient
          colors={['#C68E6F', '#7B6CA6']}
          r={1}
          c={vec(0, 0)}
          origin={vec(0, 0)}
          transform={[
            { translateX: 27 },
            { translateY: 45 },
            { rotate: -23.6 },
            { scaleX: 112.4 },
            { scaleY: 274.75 },
          ]}
        />
      </RoundedRect>
      {font && (
        <Text
          text={text}
          color={'white'}
          font={font}
          x={width / 2 - font.getTextWidth(text) / 2}
          y={height / 2 + 10}
        />
      )}
    </Canvas>
  );
};

export default Button;
