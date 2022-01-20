import { useThree } from '@react-three/fiber'
import { useXR } from '@react-three/xr'
import { createContext, useEffect, useState, useContext } from 'react'
import { Vector3 } from 'three'
import { Text } from '@react-three/drei'
import { Players } from '../components/Players'

export const SceneContext = createContext(null)

export const SceneProvider = ({ children }) => {
  const [menuState, setMenuState] = useState({ radial: 'closed', origin: new Vector3() })
  const [isPlaying, setIsPlaying] = useState(false)
  const [debug, setDebug] = useState('')
  // video elements
  // sky globe
  // scene loader

  const { player, isPresenting } = useXR()
  const { camera } = useThree()

  useEffect(() => {
    player.position.set(-100, 0, 0)
    camera.rotateY(-Math.PI / 2)
    camera.position.set(0, 0, 0)
    camera.far = 100000
    camera.updateProjectionMatrix()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    if (!isPresenting) return
    setTimeout(() => {
      player.children[2].name = 'rightController'
      player.children[5].name = 'leftController'
    }, 200)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isPresenting])

  return (
    <SceneContext.Provider value={{ menuState, setMenuState, isPlaying, setIsPlaying, debug, setDebug }}>
      <Text fontSize={20} position={new Vector3(0, 0, 40)}>
        {debug}
      </Text>
      <Players />
      {children}
    </SceneContext.Provider>
  )
}

export const useScene = () => useContext(SceneContext)
