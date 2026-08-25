import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { useGLTF } from '@react-three/drei';

export default function RobotModel() {
  const group = useRef();
  
  // 🚀 Load the model
  const { scene } = useGLTF('/models/robot_playground.glb');

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    
    if (group.current) {
      // 🔄 Manual Auto-rotate logic
      group.current.rotation.y += 0.005;

      // 🎈 Manual Floating logic (replaces the Float component)
      // This moves the robot up and down smoothly using a sine wave
      group.current.position.y = -1 + Math.sin(t * 1.5) * 0.1;
      
      // Optional: Add a slight tilt while floating
      group.current.rotation.z = Math.sin(t * 0.5) * 0.05;
    }
  });

  return (
    // We removed the <Float> tag to stop the warning
    <group ref={group} scale={[2, 2, 2]} position={[0, -1, 0]}>
      <primitive object={scene} />
    </group>
  );
}