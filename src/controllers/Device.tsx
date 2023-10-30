import { PointerLockControls } from '@react-three/drei'
import { useFrame, useThree } from '@react-three/fiber'
import { Controllers, useController, useXR, useXREvent } from '@react-three/xr'
import { useEffect, useState } from 'react'
import { browserName } from 'react-device-detect'
import { DesktopFlyController } from '../components/LocomotionController/DesktopFlyController'
import { VRFlyControls } from '../components/LocomotionController/VRFlyControls'
import { useNetwork } from '../context/NetworkContext'
import { useScene } from '../context/SceneContext'
import { emit, on } from '../utils/events'
import { Group } from 'three'
export const DeviceController = () => {
  const [isPressingA, setIsPressingA] = useState(false)
  const [isPressingB, setIsPressingB] = useState(false)

  const InputControls = () => {
    const { isPresenting } = useXR()

    if (isPresenting) {
      return <VRControls />
    }

    switch (browserName) {
      case 'Chrome':
        return <BrowserControls />

      default:
        return <VRControls />
    }
  }

  const BrowserControls = () => {
    const { movePlayer } = useNetwork()
    const { player } = useXR()
    const { camera } = useThree()
    // const cameraGroup = new Group().add(camera)
    const cameraGroup = player
    const handleMouseDown = (event) => {
      switch (event.which) {
        case 1:
          break
        case 2:
          break
        case 3:
          emit('showMenu', { pointer: cameraGroup })
          break
        default:
          break
      }
    }
    const handleMouseUp = (event) => {
      switch (event.which) {
        case 1:
          break

        case 2:
          break

        case 3:
          emit('forceSelection', { pointer: cameraGroup })
          break
        default:
          break
      }
    }

    useEffect(() => {
      on('mousedown', (e) => {
        handleMouseDown(e)
      })
      on('mouseup', (e) => {
        handleMouseUp(e)
      })
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    return (
      <>
        <DesktopFlyController movePlayer={movePlayer} />
        <PointerLockControls onChange={movePlayer} />
      </>
    )
  }

  const VRControls = () => {
    const { movePlayer } = useNetwork()
    const { isPlaying, setIsPlaying } = useScene()
    const controller = useController('right')

    useXREvent('squeezestart', (event) => {
      emit('showMenu', { pointer: controller?.controller })
    })

    useXREvent('squeezeend', (event) => {
      emit('forceSelection', { pointer: controller?.controller })
    })

    // Button Press Listeners
    useFrame(() => {
      // TODO expand to include both controllers
      if (controller?.inputSource?.gamepad) {
        if (controller?.inputSource?.gamepad.buttons[4].value === 1 && !isPressingA) {
          setIsPressingA(true)
          if (!isPlaying) {
            emit('setVideoPlayback', 'playing')
            setIsPlaying(true)
          } else {
            emit('setVideoPlayback', 'paused')
            setIsPlaying(false)
          }
        }

        if (controller?.inputSource?.gamepad.buttons[4].value === 0 && isPressingA) {
          setIsPressingA(false)
        }

        if (controller?.inputSource?.gamepad.buttons[5].value === 1 && !isPressingB) {
          setIsPressingB(true)
          emit('showMenu', { pointer: controller?.controller })
        }

        if (controller?.inputSource?.gamepad.buttons[5].value === 0 && isPressingB) {
          setIsPressingB(false)
          emit('forceSelection', { pointer: controller?.controller })
        }
      }
    })

    return (
      <>
        <Controllers />
        <VRFlyControls movePlayer={movePlayer} />
      </>
    )
  }

  const MobileControls = () => {
    return <></>
  }

  return (
    <>
      <InputControls />
    </>
  )
}
