/*
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

'use strict';

/* global getCurrentParticipant getParticipantRegistry getFactory emit */

/**
 * Create Document
 * @param {org.certify.documents.document.CreateDocument} documentData - document to be created
 * @transaction
 */

async function createDocument(documentData) {
   
  // Checks for year given - if it is in the future, throws an error
  let yearNow = new Date().getFullYear();
  let yearGiven = new Date(documentData.yearGiven).getFullYear();
  if (yearGiven > yearNow) {
        throw new Error("Year-given can not be in the future");
  }
  
  // Getting the asset registry
  const registry = await getAssetRegistry('org.certify.documents.document.Document');
  
  // Gets factory so that we can call its methods
  let factory = getFactory();
  let NS = 'org.certify.documents.document';
  
  // Generates a unique documentId
  let documentId = generateDocumentId();
  
  // Creates a document with newly generated documentId
  let document = factory.newResource(NS, 'Document', documentId);
  
  // Assigning all input values to the newly created document
  document.documentType = documentData.documentType;
  if (!documentData.documentNo) document.documentNo = documentData.documentNo;
  document.yearGiven = documentData.yearGiven;
  
  // Checks the hashing algorithm is valid or not
  documentData.hashingResult = documentData.hashingResult.toLowerCase();
  if (!checkHash(documentData.hashingResult)){
  	throw new Error ('Invalid hashing code - The hashing code that you have entered doesnt meet with the conditions of a sha256 hashed algorithm');
  } else {
  document.hashingResult = documentData.hashingResult;
  }
  
  document.state = 'PENDING';
  
  // Checks if the given institute exists on the system
  const participantRegistry = await getParticipantRegistry('org.certify.documents.participant.CERDOCInstitute');
  let check = await participantRegistry.exists(documentData.instituteId);
  if (!check) {
      	 console.log('false');
     	 throw new Error ('There is no such an institute on the network');
  }
  
  // Creating the relationship according to given instituteId
  let relationshipInstitute = factory.newRelationship('org.certify.documents.participant', 'CERDOCInstitute', documentData.instituteId);
  document.relatedInstitute = relationshipInstitute;
  document.instituteId = relationshipInstitute.getIdentifier()

  // getCurrentParticipant as a Resource
  const user = getCurrentParticipant();
  if (!user) {
    throw new Error('A participant/certificate mapping does not exist.');
  } else {
  	console.log('return from getCurrentParticipant is' + user);
  }
  
  // Assigning the currentParticipant to the owner
  document.owner = user;
  
  document.ownerId = user.getIdentifier()

  // Emitting the event
  
  let event = factory.newEvent(NS, 'DocumentCreated');
  event.documentId = documentId;
  event.hashingResult = document.hashingResult;
  emit(event); 
  
  
  // Add the document to the registry
  await registry.add(document);
  
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
 
// Checks the hashing code if it is valid or invalid
 function checkHash(hashCode) {
  
   // Checks if the hashCode length is 64
   if (hashCode.length !== 64) return false;  
   
   // Checks if the hashCode is hex or not
   let re = /[0-9A-Fa-f]{64}/g;
   return re.test(hashCode);
   
 }

/* global getCurrentParticipant getParticipantRegistry getFactory emit */

/**
 * Evaluate Document
 * @param {org.certify.documents.document.EvaluateDocument} documentData - document to be evaluated
 * @transaction
 */

async function evaluateDocument(documentData){
  
  // Get the current institutes resource
  const currentInstitute = getCurrentParticipant();
  
  const registry = await getAssetRegistry('org.certify.documents.document.Document');
  
  let document = await registry.get(documentData.documentId);
  if (!document) throw new Error("There is no such a document with documentId(" + documentData.documentId + ") on the system");
  
  console.log(currentInstitute.getIdentifier());
  console.log(document.relatedInstitute.getIdentifier());
  // Checks if the institute is the same one
  if (document.relatedInstitute.getIdentifier() !== currentInstitute.getIdentifier()) throw new Error("This file is not related with your institute!");
  
  if (documentData.hashingResult !== '') {
    	if (documentData.hashingResult === document.hashingResult) {
        	document.state = "APPROVED";
  		} else {
         	document.state = "REFUSED"; 
        }
  } else {
   		document.state = "REFUSED"; 
  }
  
  // Emitting the event
  let factory = getFactory();
  let event = factory.newEvent('org.certify.documents.document', 'DocumentEvaluated');
  event.documentId = document.documentId;
  event.hashingResult = document.hashingResult;
  event.state = document.state;
  emit(event); 
  
  await registry.update(document);
  
}
