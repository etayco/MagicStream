import './UserInteraction.css'
import { useState } from 'react'

export default function UserInteraction({ eventId, isYesNo, title }) {
  const [pointA, setPointA] = useState(1)
  const [pointB, setPointB] = useState(1)

  let precentA = Math.round((pointA / (pointA + pointB)) * 100)
  let precentB = Math.round((pointB / (pointA + pointB)) * 100)

  return (
    <div className="user-interaction-container">
      <div className="user-interaction-title">{title}</div>
      <div>
        <div className="container" style={{ gridTemplateColumns: `${precentA}% ${precentB}%` }}>
          <div className="left" onClick={addleft}>
            <div className="text">
              <span className="option-title">YES</span>
              <br />
              <span className="option-size">{precentA}%</span>
            </div>
          </div>
          <div className="right" onClick={addright}>
            <div className="text">
              <span className="option-title">NO</span>
              <br />
              <span className="option-size">{precentB}%</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )

  function addleft() {
    setPointA(pointA + 1)
  }

  function addright() {
    setPointB(pointB + 1)
  }
}
