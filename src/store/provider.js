/* eslint-disable react/prop-types */
import { Provider } from 'react-redux'
import { store } from '.'
import { persistStore } from 'redux-persist'
import { PersistGate } from 'redux-persist/integration/react'

export const ReduxProvider = ({ children }) => {
    const persistor = persistStore(store)

    return (
        <Provider store={store}>
            <PersistGate persistor={persistor}>{children}</PersistGate>
        </Provider>
    )
}
