import { Sky, OrbitControls, useAspect, Text, Html } from '@react-three/drei'
import { useFrame } from '@react-three/fiber'
import { useRef } from 'react'
export const Greeting = ({ position, message }: { position: any; message: string }) => {
  const text = useRef<any>(null!)

  useFrame(() => (text.current.rotation.y += 0.01))

  return (
    <Text ref={text} position={position} fontSize={1} color="#111" castShadow>
      {message}
    </Text>
  )
}
