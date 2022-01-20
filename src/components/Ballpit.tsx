export const BallPit = () => {
  const polarRandom = () => (0.5 - Math.random()) * 2
  const randomRange = (min: number, max: number) => min + (Math.random() * max - min)
  const polarRange = (min: number, max: number) => min + (polarRandom() * max - min)

  const colors: string[] = ['#25282F', '#314469', '#236C8E', '#F0E5E1', '#D2AD93', '#DB7C2F', '#CD6961']

  const pickRandom = (arr: any) => arr[Math.floor(Math.random() * arr.length)]

  const Ball = (props: any) => {
    return (
      <mesh {...props}>
        <sphereBufferGeometry args={[randomRange(0.1, 0.3), 12, 12]} attach="geometry" />
        <meshBasicMaterial color={pickRandom(colors)} attach="material" />
      </mesh>
    )
  }
  return (
    <group>
      {new Array(512).fill(0).map((v, i) => {
        return <Ball key={`${i}-ball`} position={[polarRange(1, 10), polarRange(1, 10), polarRange(1, 3)]} />
      })}
    </group>
  )
}
