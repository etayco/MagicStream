import Hls from 'hls.js'
import { useState, useEffect, useRef, useCallback } from 'react'
import Controls from './Controls'

// function asTime(t) {
//   t = Math.round(t)
//   const s = t % 60
//   const m = Math.round(t / 60)

//   return two(m) + ':' + two(s)
// }

// function two(s) {
//   s += ''
//   if (s.length < 2) s = '0' + s
//   return s
// }

const VIDEO_CONTROLS_FADE_DURATION = 3000

// const ORIENTATIONS = {
//   landscape: 'landscape',
//   portrait: 'portrait',
// }

// const markers = [
//   {
//     id: 1,
//     time: 1000,
//     color: '#ffc837',
//     title: 'Marker 1',
//   },
//   {
//     id: 2,
//     time: 6000,
//     color: '#ffc837',
//     title: 'Marker 2',
//   },
// ]

export default function VideoPlayer() {
  // const [orientation, setOrientation] = useState()

  // const [toggleButtonText, setToggleButtonText] = useState('play')
  // const [position, setPosition] = useState('00:01')
  // const [duration, setDuration] = useState('00:25')
  // const [scrubValue, setScrubValue] = useState('0')
  // const [scrubMax, setScrubMax] = useState('25')

  // const [isVideoControlsHidden, setIsVideoControlsHidden] = useState(true)

  const [videoDuration, setVideoDuration] = useState()
  const [catchupData, setCatchupData] = useState([])
  const [markers, setMarkers] = useState([])

  const isReady = useRef(false)
  const videoRef = useRef()
  const video2Ref = useRef()
  const progressRef = useRef()

  useEffect(() => {
    videoRef.current.addEventListener('durationchange', (e) => {
      setVideoDuration(e.currentTarget.duration)
    })
  }, [])

  useEffect(() => {
    fetch('https://platform-uat.clipro.tv/Catchup/799948', {
      credentials: 'include',
      mode: 'no-cors',
    })
      // Promise.resolve()
      // .then((response) => response.json())
      .then((response) => {
        const catchupData = [
          {
            start_time: 2965.157596,
            end_time: 2975.076055,
            rating: 2,
            action_name: 'Short Goal',
            team_name: 'Spain',
            player_name: '',
            is_primary: true,
          },
          {
            start_time: 4040.119253,
            end_time: 4051.003187,
            rating: 3,
            action_name: 'Short Goal',
            team_name: 'Spain',
            player_name: 'Sarabia',
            is_primary: true,
          },
          {
            start_time: 6209.841642,
            end_time: 6220.966014,
            rating: 3,
            action_name: 'Short Goal',
            team_name: 'Spain',
            player_name: 'Azpilicueta',
            is_primary: true,
          },
        ]

        setCatchupData(catchupData)
        // }

        // console.log(response)

        const markers = catchupData.map((catchup, index) => ({
          id: index,
          time: catchup.start_time,
          color: '#ffc837',
          title: 'Marker 1',
        }))

        setMarkers(markers)
      })
  }, [])

  useEffect(() => {
    window.addEventListener(
      'deviceorientation',
      (event) => {
        // console.log(event)
        // console.log(window.screen.orientation)

        const {
          orientation: { type },
        } = window.screen

        if (type === 'landscape-primary' || type === 'landscape-secondary') {
          // setOrientation(ORIENTATIONS.landscape)
        } else if (type === 'portrait-primary' || type === 'portrait-secondary') {
          // setOrientation(ORIENTATIONS.portrait)
        }
      },
      true,
    )
  }, [])

  useEffect(() => {
    const videoSrc =
      // 'https://wscplaylistappprod.azureedge.net/Playlist.m3u8?stream=streamid=439454,startindex=0,source=0'
      // 'https://wscplaylistappprod.azureedge.net/Playlist.m3u8?stream=streamid=438317,startindex=0,source=0'
      'https://wsc-playlist-app-uat.azurewebsites.net/Playlist.m3u8?stream=streamid=619366,startindex=0,source=0'
    const videoSrc2 =
      'https://wscplaylistappprod.azureedge.net/Playlist.m3u8?stream=streamid=428193,startindex=0,source=0'

    if (Hls.isSupported()) {
      const hls = new Hls()
      hls.loadSource(videoSrc)
      hls.attachMedia(videoRef.current)

      const hls2 = new Hls()
      hls2.loadSource(videoSrc2)
      hls2.attachMedia(video2Ref.current)
    }

    // HLS.js is not supported on platforms that do not have Media Source
    // Extensions (MSE) enabled.
    //
    // When the browser has built-in HLS support (check using `canPlayType`),
    // we can provide an HLS manifest (i.e. .m3u8 URL) directly to the video
    // element through the `src` property. This is using the built-in support
    // of the plain video element, without using HLS.js.
    //
    // Note: it would be more normal to wait on the 'canplay' event below however
    // on Safari (where you are most likely to find built-in HLS support) the
    // video.src URL must be on the user-driven white-list before a 'canplay'
    // event will be emitted; the last video event that can be reliably
    // listened-for when the URL is not on the white-list is 'loadedmetadata'.
    else if (videoRef.current.canPlayType('application/vnd.apple.mpegurl')) {
      videoRef.current.src = videoSrc

      video2Ref.current.src = videoSrc2
    }
  }, [])

  useEffect(() => {
    // togglePlay.addEventListener('click', function () {
    //   if (ready) {
    //     if (videoRef.current.paused) {
    //       if (videoRef.current.ended) {
    //         videoRef.current.currentTime = 0
    //         video2Ref.current.currentTime = 0
    //       }
    //       video2Ref.current.currentTime = videoRef.current.currentTime
    //       videoRef.current.play()
    //       setToggleButtonText('pause')
    //     } else {
    //       videoRef.current.pause()
    //       setToggleButtonText('play')
    //     }
    //   }
    // })

    function seek() {
      // setScrubValue((video2Ref.current.currentTime = videoRef.current.currentTime))

      video2Ref.current.currentTime = videoRef.current.currentTime
    }

    videoRef.current.addEventListener('seeking', seek)
    videoRef.current.addEventListener('seeked', seek)

    // function seek2() {
    //   // setScrubValue((videoRef.current.currentTime = video2Ref.current.currentTime))
    // }

    // video2Ref.current.addEventListener('seeking', seek2)
    // video2Ref.current.addEventListener('seeked', seek2)

    videoRef.current.addEventListener('play', function () {
      video2Ref.current.play()
    })

    // video2Ref.current.addEventListener('play', function () {
    //   videoRef.current.play()
    // })

    videoRef.current.addEventListener('pause', function () {
      video2Ref.current.pause()
    })

    // video2Ref.current.addEventListener('pause', function () {
    //   videoRef.current.pause()
    // })

    videoRef.current.addEventListener('timeupdate', function (e) {
      // setPosition(asTime(videoRef.current.currentTime))
      // setScrubValue(videoRef.current.currentTime)

      const duration = e.currentTarget.duration
      const percentage = (100 / duration) * e.currentTarget.currentTime
      progressRef.current.value = percentage
      progressRef.current.innerHTML = percentage + '% played'
    })

    // video2Ref.current.addEventListener('timeupdate', function () {
    //   setPosition(asTime(video2Ref.current.currentTime))
    //   setScrubValue(video2Ref.current.currentTime)
    // })

    videoRef.current.addEventListener('ended', function () {
      // setToggleButtonText('play')
    })

    // video2Ref.current.addEventListener('ended', function () {
    //   setToggleButtonText('play')
    // })

    videoRef.current.addEventListener('canplay', function () {
      videoRef.current.muted = true
      isReady.current = true
      // setDuration(asTime(videoRef.current.duration))

      // setScrubMax(videoRef.current.duration)
    })

    // video2Ref.current.addEventListener('canplay', function () {
    //   video2Ref.current.muted = true
    //   isReady.current = true
    //   setDuration(asTime(video2Ref.current.duration))

    //   setScrubMax(video2Ref.current.duration)
    // })
  }, [])

  // function onToggleButtonClick() {
  //   if (isReady.current) {
  //     if (videoRef.current.paused) {
  //       if (videoRef.current.ended) {
  //         videoRef.current.currentTime = 0
  //         video2Ref.current.currentTime = 0
  //       }
  //       video2Ref.current.currentTime = videoRef.current.currentTime
  //       videoRef.current.play()
  //       setToggleButtonText('pause')
  //     } else {
  //       videoRef.current.pause()
  //       setToggleButtonText('play')
  //     }
  //   }
  // }

  // function onScrubChange(event) {
  //   const scrubValue = parseInt(event.target.value)
  //   setScrubValue(scrubValue)

  //   console.log('scrubValue', scrubValue / 60)

  //   videoRef.current.currentTime = scrubValue
  //   video2Ref.current.currentTime = scrubValue
  // }

  function handleMarkerClick(marker) {
    videoRef.current.currentTime = marker['time']
    video2Ref.current.currentTime = marker['time']

    // alert(`Marker ${marker.id} clicked!`)
  }

  const mouseMoveTimeout = useRef(null)

  const fadeOutControls = useCallback(() => {
    if (mouseMoveTimeout.current) {
      clearTimeout(mouseMoveTimeout.current)
      mouseMoveTimeout.current = null
    }

    // setIsVideoControlsHidden(false)

    mouseMoveTimeout.current = setTimeout(() => {
      // setIsVideoControlsHidden(true)
    }, VIDEO_CONTROLS_FADE_DURATION)
  }, [])

  useEffect(() => {
    return () => {
      clearTimeout(mouseMoveTimeout.current)
    }
  }, [])

  function handleMouseMove() {
    fadeOutControls()
  }

  function handleProgressClick(e) {
    const x =
      e['clientX'] - progressRef.current.getBoundingClientRect().left + document.body.scrollLeft

    const percentage = (x * progressRef.current.max) / progressRef.current.offsetWidth

    videoRef.current.currentTime = (percentage / 100) * videoRef.current.duration
  }

  function handleLiveClick() {}

  async function handleScuClick() {
    for (const catchup of catchupData) {
      await new Promise((resolve, reject) => {
        videoRef.current.play()
        setVideoCurrentTime(catchup.start_time)

        const stopVideoAfter = (catchup.end_time - catchup.start_time) * 1000 //* 1000, because Timer is in ms

        setTimeout(() => {
          // videoRef.current.stop()

          resolve()
        }, stopVideoAfter)
      })
    }
  }

  function setVideoCurrentTime(time) {
    videoRef.current.currentTime = time
  }

  return (
    <div className="App">
      <div
        style={{ position: 'relative', paddingBottom: '25px', display: 'inline' }}
        onMouseMove={handleMouseMove}
      >
        <video
          ref={videoRef}
          style={
            {
              // display: orientation === ORIENTATIONS.landscape ? '' : 'none',
            }
          }
          controls
          playsInline
        ></video>

        <video
          ref={video2Ref}
          style={
            {
              // display: orientation === ORIENTATIONS.portrait ? '' : 'none',
            }
          }
          controls
          playsInline
        ></video>

        {/* {!isVideoControlsHidden && ( */}
        <Controls
          markers={markers}
          onMarkerClick={handleMarkerClick}
          duration={videoDuration}
          progressRef={progressRef}
          onProgressClick={handleProgressClick}
          onLiveClick={handleLiveClick}
          onScuClick={handleScuClick}
        />
        {/* )} */}
      </div>

      {/* <p id="controls">
        <button onClick={onToggleButtonClick}>{toggleButtonText}</button>
        <span>{position}</span> / <span>{duration}</span>
        <input type="range" value={scrubValue} max={scrubMax} onChange={onScrubChange} />
      </p> */}

      {/* <div>{orientation}</div> */}
    </div>
  )
}
