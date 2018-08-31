import React from 'react'
import { connect } from 'react-redux'
import { fetchUser, toggleFakeLoading } from '../store.js'

function Header({ fetchUser, users, notification, toggleFakeLoading }) {
  let name
  const { isLoading } = notification
  return (
    <div>
      <h2>hello world too</h2>
      <input onChange={e => name = e.target.value}/>
      <button onClick={() => fetchUser(name)}>Fetch</button>
      <button onClick={toggleFakeLoading} disabled={isLoading}>
        { isLoading ? 'Loading' : 'Load' }
      </button>
      { users && <pre>{JSON.stringify(users, null, 2)}</pre> }
    </div>
  )
}

function mapStateToProps(state) {
  return {
    users: state.users,
    notification: state.notification,
  }
}

export default connect(mapStateToProps, { fetchUser, toggleFakeLoading })(Header)
