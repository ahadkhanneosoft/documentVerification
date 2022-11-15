import React, { useEffect } from 'react'
import { Button, Card } from "react-bootstrap";
import { injected } from "./Connectors"
import { useWeb3React } from "@web3-react/core"

import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link
} from "react-router-dom";

import './App.css'

import User from './User.js'
import Check from './Check.js'
import Docs from './Docs.js'

export const MetaMaskProvider = () => {
  const { activate, account, active, deactivate } = useWeb3React();

    async function connect() {
        try {
          await activate(injected)
          localStorage.setItem('isWalletConnected', true)
        } catch (error) {
        }
    }

    async function disconnect() {
        try {
          deactivate()
          localStorage.setItem('isWalletConnected', false)
        } catch (error) {
          console.log(error)
        }
    }

  useEffect(() => {
    const connectWalletOnPageLoad = async () => {
        
        if (localStorage?.getItem('isWalletConnected') === 'true') {
            try {
                await activate(injected)
                localStorage.setItem('isWalletConnected', true)
            } 
            catch (error) {
                console.log(error)
            }
        }
    }
    // eslint-disable-next-line
    connectWalletOnPageLoad()
    localStorage.clear();
    // eslint-disable-next-line
}, [])



  return (
    <div className="App">
  
      {/* Header */}
      <header className="App-header">
        Document Verification
        <Button onClick={active?disconnect:connect} >{active?'Disconnect':'Connect to MetaMask'}</Button>

      </header>


      <div className='row01'>

        <Card className="text-center">
          <Card.Header>
            <strong>Address: </strong>
            {account}
          </Card.Header>
        </Card>

      </div>

      <div className='row02'>
        <Router>
        <div>
          <nav>
              <ul>
                <Link to="/">Home</Link>
              </ul>
              <ul>
                <Link to="/upload">Upload</Link>
              </ul>
              {
                active?
                <span>
                  <ul>
                    <Link to="/myDocs">My documents</Link>
                  </ul>
                </span>:
                <span></span>
              }   
          </nav>

          <Switch>

            <Route path="/upload">
              <User/>
            </Route>

            <Route path="/myDocs">
              <Docs/>
            </Route>

            <Route path="/">
              <Check/>
            </Route>
                         
          </Switch>
        </div>
      </Router>        

      </div>


      <div className="App-footer">
        Neosoft Technologies pvt. ltd.
      </div>
        
    </div>
  )
} 