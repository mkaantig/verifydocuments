'use strict';

// Need the card store instance
// const AdminConnection = require('composer-admin').AdminConnection;

const bnUtil = require('./bn-connection-util');
const participantNamespace = 'org.certify.documents.participant';
const userNamespace = 'CERDOCUser';
const instituteNamespace = 'CERDOCInstitute';

// Change card name for populating participants
bnUtil.cardName = 'admin@certify-document';

bnUtil.connect(main);

function main(error) {
    if (error){
        console.log(error);
        process.exit(1)
    }

    // 2. Get the participant registry
    return bnUtil.connection.getParticipantRegistry(participantNamespace+"."+userNamespace).then((registry)=>{
        console.log('1. Received Registry: ', registry.id);

        addUser(registry);
        return bnUtil.connection.getParticipantRegistry(participantNamespace+"."+instituteNamespace);
    }).then((registry)=>{
        console.log('2. Received Registry: ', registry.id);
        
        addInstitute(registry);
    }).catch((error)=>{
        console.log(error);
    });
}

function addUser(registry){
    const bnDef = bnUtil.connection.getBusinessNetwork();
    const factory = bnDef.getFactory();

    let participant = factory.newResource(participantNamespace, userNamespace, 'muzaffertig');
    participant.fName = 'Muzaffer';
    participant.lName = 'Tig';
    participant.participantType = 'USER';
    let concept = factory.newConcept('org.certify.documents.participant', 'Contact');
    concept.country = 'Turkey';
    concept.city = 'Istanbul';
    concept.email = 'muzaffertig@gmail.com';
    participant.contact = concept;

    return registry.add(participant).then(()=>{
        console.log('Participant User Added Successfully!!!');
        bnUtil.disconnect();
    }).catch((error)=>{
        console.log(error);
        bnUtil.disconnect();
    });
}

function addInstitute(registry){
    const bnDef = bnUtil.connection.getBusinessNetwork();
    const factory = bnDef.getFactory();

    let participant = factory.newResource(participantNamespace, instituteNamespace, 'neu');
    participant.name = "Near East University";
    participant.instituteType = "UNIVERSITY";
    participant.participantType = 'INSTITUTE';
    let concept = factory.newConcept('org.certify.documents.participant', 'Contact');
    concept.country = 'Cyprus';
    concept.city = 'Nicosia';
    concept.email = 'neu@neu.edu.tr';
    participant.contact = concept;

    return registry.add(participant).then(()=>{
        console.log('Participant Institute Added Successfully!!!');
        bnUtil.disconnect();
    }).catch((error)=>{
        console.log(error);
        bnUtil.disconnect();
    });
}
