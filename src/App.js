import './App.css'
import { Web3ReactProvider } from '@web3-react/core'
import Web3 from 'web3'

function getLibrary(provider) {
  return new Web3(provider)
}

function App({ Component, pageProps }) {
  return (

    <div className="App"> 
        <Web3ReactProvider getLibrary={getLibrary}>
          <Component {...pageProps} />
        </Web3ReactProvider>
    </div>  
  )
}
export default App;
