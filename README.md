# Document Verification Application

This appication can be used to verify the authenticity of a document. The application lets the user upload a document for the purpose of verifying it. Any other person
including the uploader of the document can verify the authenticity of any pdf document.
The application uses a smart contract to store the hash of documents. This hash is obtained by running the file through a cryptographic encryption algorithm. A custom
signature is also added to the metadata of the pdf file at the time of uploading. The signature and the document of the Hash are the parameters used for verification of 
the pdf file.
The verification process can have three different outcomes based on three different scenarios which are as follows:
1)The file had never been uploaded
2)The file had been uploaded but ha been tampered with.
3)The file is authentic i.e. the file had been uploaded previously and has not been tampered with.

# To run the application on your local system:

git clone ""
Go to the root folder and "npm init"
Now go to the backend folder that is inside the root folder and "npm init"

In the backend folder "node app-doc.js" to start the backend server on localhost.
In the root folder "npm start" to start the front end on local host

# Using the application
For uploading a document, redirect to the upload page using the link present on the home page. Upload a pdf document and enter a name for the file that is being 
uploaded. Upon completion of the uploading process a window alert will notify the user about the same. For verifying any document: upload that document on the
verification page that is the same as the "Home page" of the application. The "My documents" page shows all the documents that have been uploaded by the address with which the user is logged in to the application.
