import React from 'react'
import { render } from 'react-dom'
import { combineEpics, createEpicMiddleware } from 'redux-observable'
import { createStore, applyMiddleware, combineReducers, compose } from 'redux'
import { Provider } from 'react-redux'
import thunk from 'redux-thunk'

import Header from './components/Header.jsx'
import { fetchUserEpic, users, notification } from './store.js'

const rootEpic = combineEpics(
  fetchUserEpic
)

export const rootReducer = combineReducers({
  users,
  notification,
})

const epicMiddleware = createEpicMiddleware()
const store = createStore(
  rootReducer,
  {},
  compose(
    applyMiddleware(thunk, epicMiddleware),
    window.devToolsExtension ? window.devToolsExtension() : f => f
  )
)
epicMiddleware.run(rootEpic)

render(
  <Provider store={store}>
    <Header/>
  </Provider>,
  document.getElementById('main')
)

