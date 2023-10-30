import { useState } from 'react'

import { useFrame } from '@react-three/fiber'
import { Controllers, useXR, useXREvent } from '@react-three/xr'
import { Vector3 } from 'three'
import { Text } from '@react-three/drei'

// import { lerp } from 'three/src/math/MathUtils'

/**
 *
 * TODO
 * Ability to switch between active fly controllers
 * Maybe just use both as the same
 *
 */

export const VRFlyControls = (props) => {
  const { controllers, player, isPresenting } = useXR()
  const force = 5
  const drag: number = 0.98
  const [isAccelerating, setIsAccelerating] = useState({ right: false, left: false })
  const [newPosition] = useState(() => new Vector3())
  const [playerVelocity] = useState(() => new Vector3())
  const [debug] = useState('heyy')

  useFrame((renderer, delta) => {
    if (!isPresenting) return

    applyAcceleration(controllers)
    applyDragAndBrake()
    movePlayer(delta)
  })

  const applyDragAndBrake = () => {
    //apply minimum brake
    const velocitySum = Math.abs(playerVelocity.x) + Math.abs(playerVelocity.y) + Math.abs(playerVelocity.z)
    if (velocitySum < 1) {
      playerVelocity.set(0, 0, 0)
    }

    playerVelocity.multiplyScalar(drag)
  }

  const movePlayer = (delta: number) => {
    newPosition.set(
      player.position.x + playerVelocity.x * force * delta,
      player.position.y + playerVelocity.y * force * delta,
      player.position.z + playerVelocity.z * force * delta,
    )
    // TODO use this to update peer client movement
    // player.position.x = lerp(player.position.x, newPosition.x, delta)
    // player.position.y = lerp(player.position.y, newPosition.y, delta)
    // player.position.z = lerp(player.position.z, newPosition.z, delta)
    player.position.x = newPosition.x
    player.position.y = newPosition.y
    player.position.z = newPosition.z

    props.movePlayer(player)
  }
  const getMeanVector = (positions: Vector3[]) => {
    if (positions.length === 0) return new Vector3()
    let x = 0
    let y = 0
    let z = 0

    positions.map((pos) => {
      x += pos.x
      y += pos.y
      z += pos.z
      return null
    })
    return new Vector3(x / positions.length, y / positions.length, z / positions.length)
  }

  const applyAcceleration = (controllers) => {
    if (!controllers) return

    if (isAccelerating.right && isAccelerating.left) {
      const averageVector = getMeanVector([
        new Vector3(0, 0, -0.5).applyQuaternion(controllers[0].controller.quaternion),
        new Vector3(0, 0, -0.5).applyQuaternion(controllers[1].controller.quaternion),
      ])
      playerVelocity.addVectors(averageVector, playerVelocity)
    }

    if (isAccelerating.right) {
      playerVelocity.addVectors(
        new Vector3(0, 0, -1).applyQuaternion(controllers[0].controller.quaternion),
        playerVelocity,
      )
    }

    if (isAccelerating.left) {
      playerVelocity.addVectors(
        new Vector3(0, 0, -1).applyQuaternion(controllers[1].controller.quaternion),
        playerVelocity,
      )
    }
  }

  useXREvent('selectend', (event) => {
    if (event.controller.controller.name === 'rightController') {
      setIsAccelerating({ ...isAccelerating, right: false })
    }
    if (event.controller.controller.name === 'leftController') {
      setIsAccelerating({ ...isAccelerating, left: false })
    }
  })
  useXREvent('selectstart', (event) => {
    if (event.controller.controller.name === 'rightController') {
      setIsAccelerating({ ...isAccelerating, right: true })
    }
    if (event.controller.controller.name === 'leftController') {
      setIsAccelerating({ ...isAccelerating, left: true })
    }
  })
  return (
    <>
      <Text fontSize={1}>{debug}</Text>
      <Controllers />
    </>
  )
}
