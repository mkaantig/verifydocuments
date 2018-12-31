'use strict';

// Constant values - change as per your needs
const documentNamespace = "org.certify.documents.document";
const participantNamespace = "org.certify.documents.participant";
const instituteParticipantType = "CERDOCInstitute";
const userParticipantType = "CERDOCUser";
const transactionType = "CreateDocument";

// 1. Connect to certify-document
const bnUtil = require('./bn-user-connection-util');
bnUtil.connect(main);

function main(error){
    // Check for error
    if (error) {
        console.log(error);
        process.exit(1);
    }

    // 2. Get the Business Network Definition
    let bnDef = bnUtil.connection.getBusinessNetwork();
    console.log("2. Received Definition from Runtime: ", bnDef.getName(), " ", bnDef.getVersion());

    // 3. Get the factory
    let factory = bnDef.getFactory();

    // 4. Create an instance of transaction
    let options = {
        generate: false,
        includeOptionalFields: false,
    }
    let documentId = generateDocumentId();
    let transaction = factory.newTransaction(documentNamespace, transactionType, documentId, options);
    
    // 5. Set up the properties of the transaction object
    transaction.setPropertyValue('hashingResult', 'FBAE6949D5C83FD1C277244BC7A4032624CB712FF39B7E287847E8326C41FE16');
    transaction.setPropertyValue('instituteId', 'xjtlu');
    transaction.setPropertyValue('documentType', 'UNIVERSITYDEGREE');
    transaction.setPropertyValue('yearGiven', '2013');
    transaction.setPropertyValue('documentNo', '1718927');
    //transaction.setPropertyValue('ownerId', bnUtil.clientName);
    //transaction.setPropertyValue('state', 'PENDING');
    //let ownerRelationship = factory.newRelationship(participantNamespace, userParticipantType, bnUtil.clientName);
    //transaction.setPropertyValue('owner', ownerRelationship);
    //let instituteRelationship = factory.newRelationship(participantNamespace, instituteParticipantType, 'XJTLU');
    //transaction.setPropertyValue('relatedInstitute', instituteRelationship);

    // 6. Submit the transaction
    return bnUtil.connection.submitTransaction(transaction).then((res)=>{
        console.log("6. Transaction Submitted/Processed Successfully!!!");

        bnUtil.disconnect();
    }).catch((error)=>{
        console.log(error);

        bnUtil.disconnect();
    });
}

// Generates documentId by creating a random string value which has a 16 length of characters. 
function generateDocumentId() {
    
    let documentId = new String("");
    let x, y, i;
 
     for (i = 0; i < 16; i++) {
         x = Math.floor(Math.random()*2);
         if (x === 0) {
             y = Math.floor(Math.random()*10);
             documentId += y.toString();
         } else {
             y = Math.floor(Math.random() * 26) + 97;
             documentId += String.fromCharCode(y);
         }
     }

 return documentId;

}