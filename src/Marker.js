import React from 'react'
import './Controls.css'

export default function Marker(props) {
  const { marker, duration, onMarkerClick } = props
  const { time, color, title } = marker
  const id = String(marker.id)

  const getPosition = () => {
    if (duration) {
      const percent = time <= duration ? time / duration : 1
      return `calc(${percent * 100}% - 2px)`
    }
    return '-9999px'
  }

  return (
    <i
      id={id}
      className="react-video-marker"
      title={title}
      style={{
        background: color,
        left: getPosition(),
      }}
      onClick={() => {
        onMarkerClick(marker)
      }}
    />
  )
}
