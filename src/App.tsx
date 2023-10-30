import { Canvas } from '@react-three/fiber'
import { Hud } from '@react-three/drei'
import { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { SkySphere } from './components/SkySphere'
import { AppProvider } from './context'
import { DeviceController } from './controllers/Device'
import { MenuController } from './controllers/Menu'
import { VideoPlayer } from './controllers/Video'
import { XR } from '@react-three/xr'
/**
 *
 * TODO:
 *
 *
 * vr menu controller
 * add floor
 * Implement site router: load and unload sites
 * ability to switch between "sites" by switching environment settings and network channels
 * video always faces user and stays same height: optional
 * maybe ability to manually move the screen?
 * view nodes on my network
 * option to join
 * animation: vibrate the wisp texture when audio is emitted
 * webcam video stream over network to peers
 * mobile touch controls
 * speech to text
 * text translation of any and all languages
 * mobile app and notifications
 * when someone joins your node
 * ability to mute other players
 *
 *
 */

export default function App() {
  const [pointerLock, setPointerLock] = useState(false)
  const location = useLocation()
  let navigate = useNavigate()

  useEffect(() => {
    // TODO:
    const podId = location.pathname.replace('/', '')
    console.log(podId)

    if (podId === '') {
      window.location.pathname = '/pod1'
    }

    return () => null
  }, [])

  return (
    <>
      <div
        style={{
          position: 'absolute',
          width: '100%',
          height: '100%',
          textAlign: 'center',
          justifySelf: 'center',
          backgroundColor: 'gray',
        }}
        onClick={() => setPointerLock(true)}>
        Click Anywhere To Start! / Right click and hold to open menu
      </div>
      {pointerLock ? (
        <Canvas>
          <Hud renderPriority={1}>
            <XR>
              <AppProvider location={location}>
                <SkySphere />
                <VideoPlayer />
                <MenuController navigate={navigate} />
                <DeviceController />
              </AppProvider>
            </XR>
          </Hud>
        </Canvas>
      ) : null}
    </>
  )
}
