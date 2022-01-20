import { Html } from "@react-three/drei";
import { useLoader } from "@react-three/fiber";

import { Suspense, useEffect, useRef, useState, useContext } from "react";
import { BackSide, Mesh, MeshBasicMaterial, TextureLoader } from "three";
import { AppContext } from "../context";

export const SkySphere = () => {
  const { pod } = useContext(AppContext);
  const [textures, setTextures] = useState([]);

  const InvertSphere = (props) => {
    const [image] = useState<string>(
      props.pod.sphereUrl
        ? props.pod.sphereUrl
        : "https://i.postimg.cc/43xkRVwB/church2.jpg"
    );

    const meshRef = useRef<Mesh>();
    const materialRef = useRef<MeshBasicMaterial>();
    const texture = useLoader(TextureLoader, image);

    useEffect(() => {
      return cleanup();
    }, []);

    const cleanup = () => {
      texture.dispose();
    };

    useEffect(() => {
      materialRef.current.map = texture;
      materialRef.current.needsUpdate = true;
    }, [props.pod.id]);

    return (
      <mesh ref={meshRef}>
        <sphereGeometry attach="geometry" args={[500, 500, 500]} />
        <meshBasicMaterial
          ref={materialRef}
          attach="material"
          side={BackSide}
        />
      </mesh>
    );
  };

  const Fallback = () => (
    <Html>
      <p>Loading...</p>
    </Html>
  );

  return (
    <Suspense fallback={<Fallback />}>
      <InvertSphere pod={pod} textures={textures} setTextures={setTextures} />
    </Suspense>
  );
};
