import { createConnection } from 'net'
import { useEffect, useRef, useState, useContext } from 'react'
import { ObjectSpaceNormalMap } from 'three'
import { NetworkContext } from '../context/NetworkContext'

/**
 *
 * This controller will keep track of all audio webrtc connections between players
 * When a player joins, they attempt to call every player near them up to a certain amount
 * Whenever a player is called, it accepts if it has slots left open
 *
 */

export const VoiceChat = () => {
  const { channel, channelId, connectedClients } = useContext(NetworkContext)
  const [myStream, setMyStream] = useState(null)
  let audioRef = useRef(new Audio())
  const constraints = {
    audio: true,
    video: false,
  }

  const [connections, setConnections] = useState({})
  const [audioPlayers, setAudioPlayers] = useState({})

  const audioPlayer = () => {
    const audio = document.createElement('audio')
    audio.crossOrigin = 'Anonymous'
    audio.volume = 1

    audio.autoplay = true
    return audio
  }

  useEffect(() => {
    init()
    channel.on('receiveCandidate', (data) => {
      console.log('received', data)
    })
  }, [])

  useEffect(() => {
    console.log()
    const otherClients = connectedClients.filter((c) => c !== channel.id)

    otherClients
      .map((c) => {
        if (Object.keys(connections).includes(c)) return null
        createConnection(c, setConnections)
      })
      .filter((c) => !c)

    console.log(otherClients)
  }, [connectedClients])

  useEffect(() => {
    // if (!myStream) return
    console.log('connections', connections)
  }, [connections])

  const createConnection = (clientId, setConnections) => {
    const audioTracks = myStream.getAudioTracks()

    // create a connection with every client

    console.log('clients', connectedClients)

    const configuration = {
      iceServers: [
        { urls: 'stun:stun1.l.google.com:19302' },
        { urls: 'stun:stun2.l.google.com:19302' },
        { urls: 'stun:stun3.l.google.com:19302' },
        { urls: 'stun:stun4.l.google.com:19302' },
      ],
    }
    const pc = new RTCPeerConnection(configuration)
    pc.onicecandidate = ({ candidate }) => {
      if (candidate) {
        channel.emit('sendCandidate', { candidate, from: channel.id })
      }
    }

    pc.onnegotiationneeded = async () => {
      try {
        await pc.setLocalDescription(await pc.createOffer())
        // Send the offer to the other peer.
        console.log('sending offer')

        channel.emit('sendOffer', { desc: pc.localDescription })
      } catch (err) {
        console.error(err)
      }
    }
    audioTracks.forEach((track) => pc.addTrack(track, myStream))

    registerPeerConnectionListeners(pc)

    // console.log('connection', pc)
    let updatedConnections = connections
    updatedConnections[clientId] = pc
    console.log('updated', updatedConnections)

    setConnections(() => updatedConnections)
  }

  const errorMsg = (msg, error) => {
    // const errorElement = document.querySelector('#errorMsg')
    // errorElement.innerHTML += `<p>${msg}</p>`
    console.log(msg)
    if (typeof error !== 'undefined') {
      console.error(error)
    }
  }

  const handleSuccess = (stream) => {
    // const audio = document.querySelector('audio')

    console.log('Got stream with constraints:', constraints)
    // console.log(`Using audio device: ${audioTracks[0].label}`)
    setMyStream(stream)
    // window.stream = stream // make variable available to browser console
    // audioRef.current.srcObject = stream

    // now we need to make a connection to another client and send the stream
  }

  const registerPeerConnectionListeners = (pc) => {
    return pc
  }

  const handleError = (error) => {
    if (error.name === 'OverconstrainedError') {
      const v = constraints.video
      errorMsg(`The resolution  px is not supported by your device.`, error)
    } else if (error.name === 'NotAllowedError') {
      errorMsg(
        'Permissions have not been granted to use your camera and ' +
          'microphone, you need to allow the page access to your devices in ' +
          'order for the demo to work.',
        error,
      )
    }
    errorMsg(`getUserMedia error: ${error.name}`, error)
  }

  const init = async () => {
    // const stream = await navigator.mediaDevices.getUserMedia(constraints)

    try {
      const stream = await navigator.mediaDevices.getUserMedia(constraints)
      handleSuccess(stream)
    } catch (e) {
      handleError(e)
    }
  }

  return <>{/* <audio ref={audioRef} src={''} /> */}</>
}
