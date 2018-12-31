'use-strict';

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

    return bnUtil.connection.issueIdentity(participantNamespace+'.'+userNamespace+'#muzaffertig', 'muzaffertig').then((result)=>{
        console.log("User Identity Issued Successfully!!!");

        return bnUtil.connection.issueIdentity(participantNamespace+'.'+instituteNamespace+'#neu','neu');
    }).then(()=>{

        console.log("Institute Identity Issued Successfully!!!");
        bnUtil.disconnect();
    }).catch((error)=>{
        console.log(error);
        bnUtil.disconnect();
    })
}
