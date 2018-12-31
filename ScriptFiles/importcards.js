'use strict';


const bnUtil = require('./bn-connection-util');
const participantNamespace = 'org.certify.documents.participant';
const userNamespace = 'CERDOCUser';
const instituteNamespace = 'CERDOCInstitute';


const IdCard = require('composer-common').IdCard;
const BusinessNetworkCardStore = require('composer-common').BusinessNetworkCardStore;
const businessNetworkCardStore = new BusinessNetworkCardStore();

// Change card name for populating participants
bnUtil.cardName = 'admin@certify-document';

bnUtil.connect(main);

function main(error) {
    if (error){
        console.log(error);
        process.exit(1)
    }

    let connectionProfile =  { 'name': 'hlfv1',
                               'x-type': 'hlfv1',
			                   'x-commitTimeout': 300,
			                   'version': '1.0.0',
			                   'client': {
				                    'organization': 'Org1',
				                    'connection': {
                                                    'timeout': 
                                                        {
                                                            'peer':
                                                                {
                                                                    'endorser':300,
                                                                    'eventHub':300,
                                                                    'eventReg':300
                                                                }
                                                        }
				                                    }
                                        },
                            'orderer':300,
                        }
    const metadata = {
        userName: "muzaffertig",
        version: 1,
        enrollmentSecret: "",
        businessNetwork: "certify-document"
    };

    const idCardData = new IdCard(metadata, connectionProfile);
    const idCardName = businessNetworkCardStore.getDefaultCardName(idCardData);
    return bnUtil.connection.importCard(idCardName, idCardData).then(()=>{
        console.log("First card Successfully Imported!!!");

        const metadata = {
            userName: "neu",
            version: 1,
            enrollmentSecret: "",
            businessNetwork: "certify-document"
        };

        let connectionProfile =  { 'name': 'hlfv1',
        'x-type': 'hlfv1',
        'x-commitTimeout': 300,
        'version': '1.0.0',
        'client': {
              'organization': 'Org1',
              'connection': {
                  'timeout': 
                      {
                          'peer':
                              {
                                  'endorser':300,
                                  'eventHub':300,
                                  'eventReg':300
                              }
                      }
                      }
          },
          'orderer':300,
      }

        const idCardData = new IdCard(metadata, connectionProfile);
        console.log(idCardData);
        const idCardName = businessNetworkCardStore.getDefaultCardName(idCardData);
        return bnUtil.connection.importCard(idCardName, idCardData).then(()=>{
            console.log("Second card Successfully Imported!!!");

            bnUtil.disconnect();
        }).catch((error)=>{
            console.log(error);
            bnUtil.disconnect();
        });
    });
}

// DB name composerchannel_certify-document