import React from 'react'

class StudyChat extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            stream: false
        }
        //bind methods
        this.showFace = this.showFace.bind(this)
        this.setupPC = this.setupPC.bind(this)
        this.showFriend = this.showFriend.bind(this)
        this.handleConnection = this.handleConnection.bind(this)
        this.handleConnectionChange = this.handleConnectionChange.bind(this)
    }

    componentWillMount() {
        this.setupPC()
    }
    componentDidMount() {
        this.showFace()
    }
    
    //define methods
    showFace() {
        navigator.mediaDevices.getUserMedia({audio: true, video:true})
        .then(stream => {
            document.getElementById('yourVideo').srcObject = stream
            console.log(this.state.pc)
            // console.log(pc)
            // this.state.pc.addStream(stream)
        })
        
    }
    
    setupPC() {
        // pc.addEventListener('addStream', () => console.log('added a stream!'))
        // this.setState({pc: pc})
        var servers = {'iceServers': [{'urls': 'stun:stun.services.mozilla.com'}, {'urls': 'stun:stun.l.google.com:19302'}, {'urls': 'turn:numb.viagenie.ca','credential': 'webrtc','username': 'websitebeaver@mail.com'}]}
        var pc = new RTCPeerConnection(servers)
        // pc.ontrack = (event) => document.getElementById('friendVideo').srcObject = event.streams[0]
        pc.addEventListener('icecandidate', this.handleConnection)
        pc.addEventListener('iceconnectionstatechange', this.handleConnectionChange)
        this.setState({pc: pc})
    }

    handleConnection(event) {
        const peerConnection = event.target;
        const iceCandidate = event.candidate;

        if (iceCandidate) {
            const newIceCandidate = new RTCIceCandidate(iceCandidate);
            const otherPeer = getOtherPeer(peerConnection);
            
            otherPeer.addIceCandidate(newIceCandidate)
                .then(() => {
                    handleConnectionSuccess(peerConnection);
                 }).catch(err => console.log(err))
        }
    }

    handleConnectionChange() {
        //
    }
    
    showFriend() {
        this.state.pc.createOffer(offerOptions) //look at what these options entail
        .then(offer => {
            let newPC = this.state.pc;
            newPC.setLocalDescription(offer)
            this.setState({pc: newPC}, () => console.log(offer))
        })
    }
    
    //render
    render() {
        return (
            <div>
                <video id="yourVideo" autoPlay muted></video>
                <video id="friendVideo" autoPlay></video>

                <button onClick = {() => this.showFriend()}>call</button>
            </div>
        )
    }
}

export default StudyChat