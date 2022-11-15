import React, { useEffect, useState } from 'react'

import './App.css';
import axios from 'axios';

import { useWeb3React } from "@web3-react/core"

function Docs() {

    const account = useWeb3React();
    const Acc = account.account;

    let [blockUrl, setBlockUrl] = useState();

    let [myData, setMyData] = useState([]);


    async function data() {
        console.log('Function', Acc)
        const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: { Acc }
        };
        await handleAxios();
    }

    async function handleAxios() {
        console.log('Handle Axios');
        const res = await axios.post('/viewDocument', { Acc });
        setMyData(res.data)
    }
    console.log("The ARRAY:", myData);


    useEffect(() => {
        async function handleData() {
            await data();
        }
        handleData()
        setBlockUrl(blockUrl = "https://goerli.etherscan.io/tx/")

    }, [Acc])


    function convertDate(a) {
        var theDate = new Date(Date.parse(a));
        return (theDate.toLocaleString());
    }

    return (
        <div className="row02">
            <table id='uploads'>
                <tr>
                    <th>Date</th>
                    <th>FileName</th>
                    <th></th>
                    <th></th>
                </tr>
                {myData.map((val, key) => {
                    return (
                        <tr key={key}>
                            <td>{convertDate(val.date)}</td>
                            <td>{val.FileName}</td>
                            <td><a href={val.uri} target='_blank' rel="noreferrer" >View</a></td>
                            <td><a href={blockUrl + val.txHash} target='blank' rel="noreferrer">See Transaction</a> </td>
                        </tr>
                    )
                })}
            </table>
        </div>
    )
}
export default Docs