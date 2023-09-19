// エラー回避用のダミーファイル
export default function Page() {
    return <></>;
}

// 'use client';
// import { Canvas, useLoader } from '@react-three/fiber';
// import { OrbitControls } from '@react-three/drei';
// import { TextureLoader } from 'three';
// export default function Page() {
//     const earthMap = useLoader(TextureLoader, 'img/earth.jpg');
//     return (
//         <main style={{ width: '100%', height: '100%' }}>
//             <Canvas>
//                 <color attach="background" args={['#050505']} />
//                 <ambientLight intensity={3} />
//                 <OrbitControls minDistance={221} maxDistance={400} rotateSpeed={0.3} zoomSpeed={0.3} />
//                 <mesh castShadow position={[0, 0, 0]}>
//                     <sphereGeometry args={[200, 128, 64]} />
//                     <meshPhysicalMaterial map={earthMap} />
//                 </mesh>
//             </Canvas>
//         </main>
//     );
// }
