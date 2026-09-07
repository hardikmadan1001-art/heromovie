import React, { useEffect } from 'react';
import { useStore } from '../../store/useStore';
import { Scene1 } from './Scene1';
import { Scene2 } from './Scene2';
import { Scene3 } from './Scene3';
import { Scene4 } from './Scene4';
import { Scene5 } from './Scene5';
import { Scene6 } from './Scene6';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export const IronmanPath: React.FC = () => {
  const { setSceneIndex, sceneIndex } = useStore();

  useEffect(() => {
    const scenes = ['scene1', 'scene2', 'scene3', 'scene4', 'scene5', 'scene6'];
    
    scenes.forEach((scene, index) => {
      ScrollTrigger.create({
        trigger: 'body',
        start: `${index * 100}vh top`,
        onEnter: () => setSceneIndex(index),
        onEnterBack: () => setSceneIndex(index),
      });
    });
  }, [setSceneIndex]);

  return (
    <>
      {sceneIndex === 0 && <Scene1 />}
      {sceneIndex === 1 && <Scene2 />}
      {sceneIndex === 2 && <Scene3 />}
      {sceneIndex === 3 && <Scene4 />}
      {sceneIndex === 4 && <Scene5 />}
      {sceneIndex === 5 && <Scene6 />}
    </>
  );
};
