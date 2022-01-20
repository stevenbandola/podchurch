import { useEffect, useRef, useState, useContext } from "react";
import { NetworkContext } from "../context/NetworkContext";
// import Peer from 'simple-peer'

export const VoiceChat = () => {
  const { channel, channelId } = useContext(NetworkContext);

  const connectionRef = useRef(null);

  const initialCall = { id: "" };

  const [peers, setPeers] = useState({});
  const [calls, setCalls] = useState({});

  // when a client joins, they see a list of existing connections and request calls with them
  // when a client joins, everyone else in the room requests a call with the new user
  // no response calls are required

  // add new peer
  // remove peer

  //

  const [theirVideo] = useState(() => {
    const vid = document.createElement("audio");
    vid.crossOrigin = "Anonymous";
    vid.volume = 1;

    vid.autoplay = true;
    return vid;
  });

  useEffect(() => {
    console.log("peers", peers);
  }, [peers]);

  useEffect(() => {
    // setMe(channel.id)

    try {
      let myStream = null;
      navigator.mediaDevices
        .getUserMedia({ video: false, audio: true })
        .then((stream) => {
          myStream = stream;
        });
      channel.on("clientConnected", (clientId) => {
        console.log("client connected", clientId);
        console.log("requesting call with", clientId);
        // requestCall(clientId, channel.id, myStream)
      });

      channel.on("callRequested", (data) => {
        console.log("call requested", data);
        // acceptCall(data, channel.id, myStream)
      });
    } catch (error) {}
  }, []);

  const requestCall = (clientId, channelId, stream) => {
    console.log("request stream", stream);
    try {
      //   const peer = new Peer({
      //     initiator: true,
      //     trickle: false,
      //     stream: stream,
      //   });
      //   peer.on("signal", (signal) => {
      //     const payload = {
      //       clientId: clientId,
      //       signal: signal,
      //       from: channelId,
      //     };
      //     console.log("from inside request signal", payload);
      //     channel.emit("requestCall", payload);
      //   });
      //   peer.on("stream", (stream) => {
      //     console.log("on stream requested", stream);
      //     theirVideo.srcObject = stream;
      //     theirVideo.play();
      //     // add peer to peers array
      //     console.log(theirVideo);
      //   });
      //   peer.on("close", () => {
      //     console.log("closing");
      //     theirVideo.pause();
      //     theirVideo.srcObject = null;
      //     peer.destroy();
      //     // remove peer from peers array
      //   });
      //   const _peers = peers;
      //   _peers[clientId] = peer;
      //   setPeers(_peers);
      //   // use peer id to select a peer from the peers array (if it can find itself)
      //   channel.on("callAccepted", (payload) => {
      //     console.log("on call accepted", payload.signal);
      //     console.log(peers, payload.from);
      //     peers[payload.from].signal(payload.signal);
      //     // peer.signal(signal)
      //   });
      //   return () => peer.destroy();
    } catch (error) {}
  };

  const acceptCall = (data, channelId, stream) => {
    try {
      // console.log("accept", stream);
      // const peer = new Peer({
      //   initiator: false,
      //   trickle: false,
      //   stream: stream,
      // });
      // peer.on("signal", (data) => {
      //   console.log("from inside accept signal", channelId);
      //   channel.emit("acceptCall", { signal: data, from: channelId });
      // });
      // peer.on("stream", (stream) => {
      //   console.log("on stream accepted", stream);
      //   theirVideo.srcObject = stream;
      //   theirVideo.play();
      //   console.log(theirVideo);
      // });
      // peer.on("close", () => {
      //   console.log("closing");
      //   theirVideo.pause();
      //   theirVideo.srcObject = null;
      //   peer.destroy();
      // });
      // peer.signal(data.signal);
      // // setPeers({ ...peers, clientId: peer })
      // return () => peer.destroy();
    } catch (error) {}
  };

  return <></>;
};
