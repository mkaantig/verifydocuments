'use strict';

const idCardClass = require('composer-common').IdCard;

let metadata = {version: 1, userName: 'muzaffertig',enrollmentSecret: "",businessNetwork: "certify-document"};
let connectionprofile =  { 'name': 'hlfv1',
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

const newIdCard = new idCardClass(metadata,connectionprofile);

newIdCard.toDirectory('/home/kaantig/.composer/cards/muzaffertig@certify-document').then(function(){
    console.log('new card created');
});




//{"name":"hlfv1","x-type":"hlfv1","x-commitTimeout":300,"version":"1.0.0","client":{"organization":"Org1","connection":{"timeout":{"peer":{"endorser":"300","eventHub":"300","eventReg":"300"},"orderer":"300"}$

//{"name":"hlfv1","type":"hlfv1","orderers":[{"url":"grpc://localhost:7050"}],"ca":{"url":"http://localhost:7054","name":"ca.org1.example.com"},"peers":[{"requestURL":"grpc://localhost:7051","eventURL":"grpc:$
