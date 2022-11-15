import React, { useState } from 'react'
import axios from 'axios';

import Web3 from 'web3';
import CryptoJS from 'crypto-js';
import { useWeb3React } from "@web3-react/core"
import { PDFDocument } from 'pdf-lib';
import './App.css';
import verifyABI from './abiVerify.json'
require('dotenv').config()

function User(){

    const web3 = new Web3(window.ethereum);
    const account = useWeb3React()
    const verifyAdd = '0xEA8c383E49F54f3649627874952287943058Ec01'
    const Contract = new web3.eth.Contract(verifyABI, verifyAdd);

    const { active } = useWeb3React();

    // #1 File owner, #4 URI, #6 Date

    let [msg,setMsg] = useState("")
    let [hash,setHash] = useState(""); // #3
    let [txHash,setTXhash] = useState("");
    let [_uri,setUri] = useState(""); // #5

    let [file,setfile] = useState(null);
    let [bn,setBn]=useState();

    let [fileName, setFileName]= useState(""); // #2

    let [fileContents, setFileContents] = useState()

    let Acc=account.account;
    const REACT_APP_PINATA_API_KEY = "524b9ffab33a65f33ae2"
    const REACT_APP_PINATA_API_SECRET = "9e5e381e60309d643ac4e552a8d80932fb779965d3862f89144d42460f014fd3"

    const sendFileToIPFS = async (e) => {

        if (file) {
            try {

                const formData = new FormData();
                formData.append("file", file);

                const resFile = await axios({
                    method: "post",
                    url: "https://api.pinata.cloud/pinning/pinFileToIPFS",
                    data: formData,
                    headers: {
                        'pinata_api_key': `${REACT_APP_PINATA_API_KEY}`,
                        'pinata_secret_api_key': `${REACT_APP_PINATA_API_SECRET}`,
                        "Content-Type": "multipart/form-data"
                    },
                });

                const url = `https://gateway.pinata.cloud/ipfs/${resFile.data.IpfsHash}`;
                setUri(_uri = url)
             console.log(_uri); 


            } catch (error) {
                console.log("Error sending File to IPFS: ")
                console.log(error)
            }
        }
    }

    
    async function post() {
        const mydata ={
            "FileOwner": account.account ,	
            "FileName": fileName,
          "hash": hash,
          "txHash": txHash,
          "blockNumber": bn,
        "uri": _uri
        }

    const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(mydata)
        };
        fetch('http://localhost:5000/uploadDocument', requestOptions)
            .then(response => response)
            .then(data => console.log("res : ",data));
    }

    async function fileToBlob(){
        if (file.type != "application/pdf")
        {
            setMsg(msg="Only pdf format allowed")
            return
        }
        const buffer = await file.arrayBuffer();
        const pdfDoc = await PDFDocument.load(buffer, {
          updateMetadata: false,
        })
        console.log( await pdfDoc.getAuthor() ) 
        await pdfDoc.setAuthor("Neosoft")
        var sub = await pdfDoc.getAuthor() 
        console.log("AUTHOR",sub);
        const pdfBytes = await pdfDoc.save()
        console.log(pdfBytes) 
        var blob = new Blob([pdfBytes], { type: "application/pdf" });
        uploadFile(blob);
    }
    async function uploadFile(blob) {
            
            const fileReader = new FileReader();
            fileReader.addEventListener("loadend", (evt) => {
                if (evt.target.readyState === FileReader.DONE) {
                    const Hash = CryptoJS.SHA256(fileReader.result);
                    console.log(fileReader.result);
                    console.log("This is 2",file);
                    setHash (hash = Hash.toString())
    
                    Contract.methods.files(hash).call().then(function(Result){
                        console.log(hash)
                        console.log(Result)
                        console.log(Result.id);
                        if (Result.id > 0){
                            setMsg(msg="Document already exists");
                            console.log(msg);
                        }
                        else{
                            setMsg(msg="Uploading document...");
                            console.log(msg);
                            Contract.methods.store(hash,Acc).send({from:Acc})
                            .on('receipt',async function(receipt){
                                await sendFileToIPFS();
                                alert("File uploaded successfully \nTransaction Hash: "+receipt.transactionHash+
                            "\nBlock Number: "+receipt.blockNumber)
                                // console.log(receipt.blockNumber)
                                setTXhash(txHash=receipt.transactionHash)
                                setBn(bn=receipt.blockNumber)
                                // doc.set(hash, bn); 
                                setMsg(msg="Document uploaded successfully")
                                post();
                            
                                var url = URL.createObjectURL(blob);
                                console.log('url', url)
                                let alink = document.createElement('a')
                                alink.href = url
                                alink.download = 'SamplePDF.pdf'
                                alink.click();
                            });
                        }
                        console.log(msg);
                    })
                }                
            });
        fileReader.readAsDataURL(blob);
    }
    return(
        <div className="row02">
            <h1>Upload</h1>

            <input type="text" placeholder="file name" value={fileName} 
            onChange={(e) => setFileName(e.target.value)} required/>  
            
            <br></br>

            <input type="file" accept="application/pdf" onChange={(e) =>setfile(e.target.files[0])} required/>
            <br></br>
            {
                active?
                <span><button type='submit' onClick={fileToBlob}>Download</button></span>:
                <span><button disabled onClick={uploadFile}>Download</button>
                    <h5>Connect wallet to upload file</h5>
                </span>   
            }
            <p>{msg}</p>
        </div>
    )
}

export default User


