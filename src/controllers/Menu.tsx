import { useFrame, useThree } from '@react-three/fiber'
import { useXR } from '@react-three/xr'
import { useContext, useEffect, useState } from 'react'
import {
  ArrowHelper,
  BackSide,
  CircleBufferGeometry,
  Color,
  Group,
  Mesh,
  MeshBasicMaterial,
  Quaternion,
  Raycaster,
  SphereBufferGeometry,
  Vector3,
} from 'three'
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader'
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry'
import { useScene } from '../context/SceneContext'
import { emit, on } from '../utils/events'
import Fira from '../fonts/Fira.json'
import { AppContext } from '../context'

/**
 *
 * TODO
 *
 *
 *
 * play with vertical menu
 * play with horizontal menu
 * use joystick to scroll and position to move pointer
 * ability to switch between fly controller and media controller
 *
 */

export const MenuController = (props) => {
  const { player, controllers } = useXR()
  const { camera } = useThree()
  const { menuState, setMenuState } = useScene()
  const { loadPod } = useContext(AppContext)

  const menuMaterial = new MeshBasicMaterial({ color: new Color('black'), transparent: true, opacity: 1 })
  const menuGeometry = new CircleBufferGeometry(4, 40)
  const menuMesh = new Mesh(menuGeometry, menuMaterial)
  menuMesh.name = 'menuMesh'

  const menuMeshGroup = new Group()
  menuMeshGroup.add(menuMesh)

  const menuSphereGeometry = new SphereBufferGeometry(20, 30, 30)
  const menuSphereMaterial = new MeshBasicMaterial({
    color: new Color('black'),
    transparent: true,
    opacity: 0.5,
    side: BackSide,
  })
  const menuSphereMesh = new Mesh(menuSphereGeometry, menuSphereMaterial)

  menuSphereMesh.name = 'menuSphereMesh'
  const menuButtons = new Group()

  const font = new FontLoader().parse(Fira)
  const textOptions = {
    font,
    size: 0.5,
    height: 1,
  }

  const playButtonGeometry = new TextGeometry('Play', textOptions)
  const fontMaterial = new MeshBasicMaterial({ color: new Color('white') })

  const playButtonMesh = new Mesh(playButtonGeometry, fontMaterial)
  playButtonMesh.position.z = playButtonMesh.position.z - 0.9
  playButtonMesh.position.y = playButtonMesh.position.y + 1.2
  playButtonMesh.position.x = playButtonMesh.position.x + 0.5

  const pauseButtonGeometry = new TextGeometry('Pause', textOptions)
  const pauseButtonMesh = new Mesh(pauseButtonGeometry, fontMaterial)
  pauseButtonMesh.position.z = pauseButtonMesh.position.z - 0.9
  pauseButtonMesh.position.y = pauseButtonMesh.position.y - 1.7
  pauseButtonMesh.position.x = pauseButtonMesh.position.x + 0.5

  const pod1ButtonGeometry = new TextGeometry('Taya', textOptions)

  const pod1ButtonMesh = new Mesh(pod1ButtonGeometry, fontMaterial)
  pod1ButtonMesh.position.z = pod1ButtonMesh.position.z - 0.9
  pod1ButtonMesh.position.y = pod1ButtonMesh.position.y + 1.2
  pod1ButtonMesh.position.x = pod1ButtonMesh.position.x - 3

  const pod2ButtonGeometry = new TextGeometry('Parallel', textOptions)
  const pod2ButtonMesh = new Mesh(pod2ButtonGeometry, fontMaterial)
  pod2ButtonMesh.position.z = pod2ButtonMesh.position.z - 0.9
  pod2ButtonMesh.position.y = pod2ButtonMesh.position.y - 1.7
  pod2ButtonMesh.position.x = pod2ButtonMesh.position.x - 3.3

  menuButtons.add(playButtonMesh)
  menuButtons.add(pauseButtonMesh)
  menuButtons.add(pod1ButtonMesh)
  menuButtons.add(pod2ButtonMesh)
  menuMeshGroup.add(menuButtons)

  const menuGroup = new Group()
  menuGroup.name = 'menuGroup'
  menuGroup.add(menuSphereMesh)
  menuGroup.add(menuMeshGroup)

  menuGroup.visible = false

  const [origin] = useState(() => new Vector3())
  const raycaster: Raycaster = new Raycaster()
  const pointerQuaternion: Quaternion = new Quaternion()

  const getRaycaster = (pointer) => {
    // If Desktop Mode
    if (pointer.userData?.name !== 'controller') {
      raycaster.set(pointer.position, new Vector3(0, 0, -1).applyQuaternion(camera.quaternion).normalize())
      return raycaster
    }

    // If VR Mode
    const pointerWorldPosition = new Vector3(0, 0, 0).addVectors(pointer.position, player.position)
    pointerQuaternion.set(pointer.quaternion._x, pointer.quaternion._y, pointer.quaternion._z, pointer.quaternion._w)

    const pointerWorldDirection = new Vector3(0, 0, -1).applyEuler(pointer.rotation)
    raycaster.set(pointerWorldPosition, pointerWorldDirection)

    return raycaster
  }
  const showMenu = (event) => {
    menuGroup.visible = true

    menuSphereMesh.geometry.scale(0.5, 0.5, 0.5)

    console.log('menuSphereMesh.geometry', menuSphereMesh.quaternion)

    const updatedQuaternion = menuSphereMesh.quaternion.setFromEuler(camera.rotation)

    console.log('menuSphereMesh.geometry', updatedQuaternion)
    menuSphereMesh.quaternion.set(updatedQuaternion.x, updatedQuaternion.y, updatedQuaternion.z, updatedQuaternion.w)
    const { pointer } = event.detail
    const raycaster = getRaycaster(pointer)
    const intersections = raycaster.intersectObject(menuSphereMesh)
    if (intersections.length === 0) return

    const point = new Vector3().subVectors(intersections[0].point, player.position)

    menuMeshGroup.position.copy(point)
    menuMeshGroup.lookAt(player.position)

    origin.set(point.x, point.y, point.z)
    setMenuState({ ...menuState, radial: 'open' })

    menuSphereMesh.geometry.scale(2, 2, 2)
  }

  const forceSelection = (event) => {
    const { pointer } = event.detail
    const raycaster = getRaycaster(pointer)

    const updatedQuaternion = menuSphereMesh.quaternion.setFromEuler(camera.rotation)
    menuSphereMesh.quaternion.set(updatedQuaternion.x, updatedQuaternion.y, updatedQuaternion.z, updatedQuaternion.w)
    const intersections = raycaster.intersectObject(menuSphereMesh)
    if (intersections.length === 0) return

    const point = new Vector3().subVectors(intersections[0].point, player.position)
    const travel = new Vector3().subVectors(origin, point)

    // TODO: eventually check to see if the ray intersects with a shape on the menu. That will be easier to maintain and expand upon.

    if (-travel.y > 0) {
      // upper

      if (travel.z < 0) {
        emit('setVideoPlayback', 'playing')
      }
      if (travel.z > 0) {
        loadPod('pod2')
      }
    }

    // lower
    if (-travel.y < 0) {
      if (travel.z < 0) {
        emit('setVideoPlayback', 'paused')
      }
      if (travel.z > 0) {
        loadPod('pod1')
      }
      // props.navigate('/pod1', { replace: true })
    }

    setMenuState({ ...menuState, radial: 'closed' })
    menuGroup.visible = false
  }

  useEffect(() => {
    player.add(menuGroup)

    on('showMenu', showMenu)
    on('forceSelection', forceSelection)

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useFrame(() => {
    if (menuState.radial !== 'open') return
  })

  // show pointer when menu opens
  let arrow: ArrowHelper
  useFrame(() => {
    if (menuState.radial === 'open' && controllers) {
      if (controllers.length === 0) return
      const controller = controllers[1].controller
      const pointerWorldDirection = new Vector3(0, 0, -1).applyQuaternion(controller.quaternion)
      const raycaster = new Raycaster(controller.position, pointerWorldDirection)

      if (!arrow) {
        arrow = new ArrowHelper(raycaster.ray.direction, raycaster.ray.origin, 100, Math.random() * 0xffffff)
        player.add(arrow)
        return () => player.remove(arrow)
      }

      arrow.setDirection(raycaster.ray.direction)
      arrow.position.set(raycaster.ray.origin.x, raycaster.ray.origin.y, raycaster.ray.origin.z)
    }
  })

  const Menu = () => {
    return (
      <>
        {/* <DreiText ref={playButtonRef} fontSize={40} color={new Color('white')} position={new Vector3(0, 0.2, -0.1)}>
          Play
        </DreiText> */}
      </>
    )
  }
  return <Menu />
}
