import { useContext, useEffect, useState } from 'react'
import { BoxBufferGeometry, MeshNormalMaterial, Quaternion, Vector3 } from 'three'
import { NetworkContext } from '../context/NetworkContext'
import { Text } from '@react-three/drei'

const UserWrapper = ({ position, quaternion, id }) => {
  if (!position) return

  return (
    <mesh
      position={new Vector3(position.x, position.y, position.z)}
      quaternion={new Quaternion(quaternion._x, quaternion._y, quaternion._z, quaternion._w)}
      geometry={new BoxBufferGeometry(10, 10, 10)}
      material={new MeshNormalMaterial()}>
      <Text
        outlineColor="white"
        outlineWidth={0.1}
        position={[0, 7, -4]}
        rotation={[0, 3.14, 0]}
        fontSize={1}
        color="black"
        anchorX="center"
        anchorY="middle">
        {id}
      </Text>
    </mesh>
  )
}

export const Players = () => {
  const { channel } = useContext(NetworkContext)
  const [clients, setClients] = useState([])

  useEffect(() => {
    channel.on('syncClients', (clients) => {
      // console.log(clients, channel)

      const newClients = clients
      Object.keys(clients)
        .filter((clientKey) => clientKey === channel.id)
        .map((clientKey) => {
          delete newClients[clientKey]
          return null
        })

      if (newClients.length > 0) {
        setClients(newClients)
        return
      }
      setClients(clients)
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    // console.log(clients)
  }, [clients])

  return (
    <>
      {Object.keys(clients).map((clientKey) => {
        const { position, quaternion } = clients[clientKey]
        return <UserWrapper key={clientKey} id={clientKey} position={position} quaternion={quaternion} />
      })}
    </>
  )
}
