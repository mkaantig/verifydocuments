'use strict';

const BusinessNetworkConnection = require('composer-client').BusinessNetworkConnection;

// Adds institute user to the participant registry
async function addParticipantUser() {
    let businessNetworkConnection = new BusinessNetworkConnection();

    try {
        await businessNetworkConnection.connect('admin@certify-document');
        let participantRegistry = await businessNetworkConnection.getParticipantRegistry('org.certify.documents.participant.CERDOCUser');
        let factory = businessNetworkConnection.getFactory();
        let participant = factory.newResource('org.certify.documents.participant', 'CERDOCUser', 'muzaffertig');
        participant.fName = 'Muzaffer';
        participant.lName = 'Tig';
        participant.participantType = 'USER';
        let concept = factory.newConcept('org.certify.documents.participant', 'Contact');
        concept.country = 'Turkey';
        concept.city = 'Istanbul';
        concept.email = 'muzaffertig@gmail.com';
        participant.contact = concept;
        await participantRegistry.add(participant);
        await businessNetworkConnection.disconnect();
    } catch(error) {
        console.error(error);
        process.exit(1);
    }
}

// Adds institute participant to the participant registry
async function addParticipantInstitute() {
    let businessNetworkConnection = new BusinessNetworkConnection();

    try {
        await businessNetworkConnection.connect('admin@certify-document');
        let participantRegistry = await businessNetworkConnection.getParticipantRegistry('org.certify.documents.participant.CERDOCInstitute');
        let factory = businessNetworkConnection.getFactory();
        let participant = factory.newResource('org.certify.documents.participant', 'CERDOCInstitute', 'neu');
        participant.fName = 'Muzaffer';
        participant.lName = 'Tig';
        participant.participantType = 'INSTITUTE';
        let concept = factory.newConcept('org.certify.documents.participant', 'Contact');
        concept.country = 'Cyprus';
        concept.city = 'Nicosia';
        concept.email = 'neu@neu.edu.tr';
        participant.contact = concept;
        await participantRegistry.add(participant);
        await businessNetworkConnection.disconnect();
    } catch(error) {
        console.error(error);
        process.exit(1);
    }
}

addParticipantUser();
addParticipantInstitute();