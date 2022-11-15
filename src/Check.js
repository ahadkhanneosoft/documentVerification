import React, { useEffect, useState } from 'react'
import CryptoJS from 'crypto-js';
import './App.css'

import verifyABI from './abiVerify.json'
import Web3 from 'web3';

import { useWeb3React } from "@web3-react/core"
import axios from 'axios';

import { PDFDocument } from 'pdf-lib';


function Check(){


    const web3 = new Web3(window.ethereum);
    const verifyAdd = '0xEA8c383E49F54f3649627874952287943058Ec01'
    const Contract = new web3.eth.Contract(verifyABI, verifyAdd);
    const account = useWeb3React();
    const Acc = account.account;

    let [hash,setHash] = useState("");
    let [msg,setMsg] = useState("");
    let [validMsg,setValidMsg] = useState("");
    let [blockNumber, setBlockNumber] = useState("");
    let [uri,setUri] = useState("");
    let [index, setIndex] = useState("");

    let [file,setfile] = useState(null);

    let [myData, setMyData] = useState([]);

    // Fetch data from DB and copy to array

    async function data() {
        // await Acc;
        

        console.log('Function',Acc)
        const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
        };
       await handleAxios();
                
    }

    async  function handleAxios(){
        console.log('Handle Axios');
            const res=await axios.post('/getDocument',{});
            setMyData( res.data )
        } 
    
        useEffect(() => {
            async function handleData(){ 
            await data();
            }
            handleData()
        }, [])

    // UPLOAD File

   async function Upload(e) {

        const secretkey = CryptoJS.SHA256(process.env.REACT_APP_SECRET_KEY);
        const buffer = await file.arrayBuffer();
        const pdfDoc = await PDFDocument.load(buffer, 
            {
                updateMetadata: false,
            })
        console.log( await pdfDoc.getAuthor() ) 

        if(pdfDoc.getAuthor() == "Neosoft"){

        const fileReader = new FileReader();
        fileReader.addEventListener("loadend", (evt) => {

            if (evt.target.readyState === FileReader.DONE) {
                const Hash = CryptoJS.SHA256(fileReader.result);
                setHash (hash = Hash.toString())

                Contract.methods.files(hash).call().then(function(Result){
                    console.log(Result.id);
                    if (Result.id <= 0){
                        setMsg(msg="Tampered");
                        // setValidMsg(validMsg="Couldn't read key data from file")
                        console.log(msg);
                    }
                    else{
                        setMsg(msg="Valid Document");
                        console.log(msg);

                        if(myData.find(t=>t.hash==Result.hash)){
                            setBlockNumber(blockNumber=myData.find(t=>t.blockNumber).blockNumber)
                            console.log(blockNumber)

                            setUri(uri=myData.find(t=>t.uri).uri)
                        }
                        

                        web3.eth.getBlock(blockNumber).then(function(Res){
                            var date = new Date(Res.timestamp*1000);
                            setValidMsg(msg="This document was issued by "+Result.fileOwner+" on "
                            +date)  ;
                        })
                    }   
            })
        }
    });
        fileReader.readAsDataURL(file);
            
        }
        else{
            setMsg(msg="Invalid Document");
            setValidMsg(validMsg="Couldn't read key data from file")
            console.log(msg);
        }
            
   }
    return(
        <div className="row02">
            <h1>Verify</h1>
            <input type="file" onChange={(e) =>setfile(e.target.files[0])} required />
            <br></br>
            <button type='submit' onClick={Upload}>Upload</button>
            <h3>{msg}</h3>
            <p>{validMsg}</p>
            {/* <a href={uri} target='_blank'>View</a> */}
        </div>
        
    )
}

export default Check