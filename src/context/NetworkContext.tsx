import { geckos } from '@geckos.io/client'
import { useStore, useThree } from '@react-three/fiber'
import { useXR } from '@react-three/xr'
import { createContext, useEffect, useState, useContext } from 'react'
import { AppContext } from '.'
import { VoiceChat } from '../controllers/VoiceChat'

export const NetworkContext = createContext(null)

export const NetworkProvider = ({ children }) => {
  const [channel] = useState(
    // geckos({ port: 443, url: 'https://webrtc.podchur.ch' }),
    geckos({ port: 4444, url: 'http://localhost' }),
  )

  const [channelId, setChannelId] = useState('')
  const [connectedClients, setConnectedClients] = useState([])
  const { camera } = useThree()
  const { player } = useXR()
  const { pod, podHistory, loadPod, location } = useContext(AppContext)

  // let userRole = 'guest'
  let userRole = 'admin'

  useEffect(() => {
    channel.onConnect((error) => {
      if (error) {
        console.log(error)

        return
      }
      setChannelId(channel.id)
      console.log('connected to server')
      const podId = location.pathname.replace('/', '')

      loadPod(podId)
      movePlayer()
    })

    channel.onDisconnect(() => {
      if (channel) channel.close()
    })

    channel.on('clientConnected', (payload: any) => {
      // create a connection for each client that doesnt exist yet and isnt yourself

      setConnectedClients(payload.clients)
    })

    return () => {
      if (channel) channel.close()
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    // unload the old pod
    // load the new pod

    if (!pod.id || !channel) return
    const podId = location.pathname.replace('/', '')
    loadPod(podId)

    // console.log('location changed', podId)
  }, [location])

  useEffect(() => {
    if (!pod.id || !channel) return

    if (podHistory.length > 1) {
      // console.log('pod switched from ' + podHistory[1].id + ' to ' + pod.id)
      // console.log('leaving', podHistory[1])

      channel.emit('leavePod', { podId: podHistory[1].id })
    }

    // console.log('network content pod id changed', pod)
    channel.emit('joinPod', { podId: pod.id })

    // console.log(podHistory)
  }, [pod.id])

  /**
   *
   * Move Player
   * move the player in their pod
   *
   */

  const updateMedia = (payload) => {
    // TODO: typify and simplify sync code

    if (userRole === 'admin') {
      // console.log('updating media', payload)

      channel.emit('updateMedia', payload)
    }
  }

  const movePlayer = () => {
    const payload = {
      podId: pod.id,
      client: {
        id: channel.id,
        position: player.position,
        quaternion: camera.quaternion,
      },
    }
    // console.log(payload)

    channel.emit('movePlayer', payload)
  }

  return (
    <NetworkContext.Provider value={{ channel, movePlayer, updateMedia, channelId, connectedClients }}>
      <VoiceChat />
      {children}
    </NetworkContext.Provider>
  )
}

export const useNetwork = () => useContext(NetworkContext)
