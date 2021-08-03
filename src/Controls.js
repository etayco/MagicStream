import Marker from './Marker'
import './Controls.css'

export default function Controls({
  markers,
  duration,
  onMarkerClick,
  progressRef,
  onProgressClick,
  onLiveClick,
  onScuClick,
}) {
  return (
    <div className="react-video-controls">
      <div style={{ display: 'flex' }}>
        <div className="progress-wrap">
          <progress ref={progressRef} value="0" max="100" onClick={onProgressClick}>
            0% played
          </progress>

          {markers.map((marker, index) => {
            return (
              <Marker
                key={index}
                marker={marker}
                duration={duration}
                onMarkerClick={onMarkerClick}
              />
            )
          })}
        </div>

        <button className="live-button" onClick={onLiveClick}>
          LIVE
        </button>
      </div>

      <div style={{ display: 'flex' }}>
        <button onClick={onScuClick}>SCU</button>
      </div>
    </div>
  )
}
