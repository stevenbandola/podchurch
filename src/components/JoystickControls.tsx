import { useFrame } from '@react-three/fiber'
import { useController, useXR } from '@react-three/xr'
import { Vector2, Vector3 } from 'three'

const controllerDir = new Vector2()
const controllerDir3 = new Vector3()
const joystickDir = new Vector2()

export const SmoothLocomotion = (props: any) => {
  const { player } = useXR()
  const controller = useController(props.hand)
  useFrame((_, delta) => {
    if (controller?.inputSource?.gamepad) {
      const playerSpeed = 4
      const [, , ax, ay] = controller.inputSource.gamepad.axes
      joystickDir.set(ax, ay)
      controller.controller.getWorldDirection(controllerDir3)
      controllerDir.set(controllerDir3.x, -controllerDir3.z).normalize()

      player.position.x += controllerDir.cross(joystickDir) * delta * playerSpeed
      player.position.z -= controllerDir.dot(joystickDir) * delta * playerSpeed
    }
  })
  return null
}
