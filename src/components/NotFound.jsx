import React from 'react'
import '../styles/_form.scss';
import { Link } from 'react-router-dom'
import '../styles/_food-basket.scss';

export function NotFound() {
  return (
    <div className="route-container">
      <div className="unified-container">
        <div className="container-for-not-found">
          <h1>404</h1>
          <h4>Not Found</h4>
          <div><Link to="/" className="link-to-choose-day-in-calendar">Back</Link></div>
        </div>
      </div>
    </div>
  )
}
