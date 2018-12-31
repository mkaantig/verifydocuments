'use strict';

// Need the card store instance
const AdminConnection = require('composer-admin').AdminConnection;

// Used as the card for all calls
const cardNameForPeerAdmin = "PeerAdmin@hlfv1";
const cardNameForNetworkAdmin = "admin@certify-document";
const appName = "certify-document";

// 1. Create Admin Connection object for the fabric
var walletType = { type: 'composer-wallet-filesystem' }
const adminConnection = new AdminConnection(walletType);

// 2. Initiate a connect as PeerAdmin
return adminConnection.connect(cardNameForPeerAdmin).then(function(){
    console.log("Peer Admin Connected Successfully!!!");
    // Display the name and version of the network app
    listBusinessNetwork();
}).catch((error)=>{
    console.log(error);
});

// Extracts information about the network
function listBusinessNetwork() {
    // 3. List the network apps
    adminConnection.list().then((networks)=>{
        console.log("Successfully retrieved the deployed Networks: ", networks);

        networks.forEach((businessNetwork) => {
            console.log('Deployed business network', businessNetwork);
        });
        // 4. Disconnect
        adminConnection.disconnect();
        reconnectAsNetworkAdmin();
    }).catch((error)=>{
        console.log(error);
    });
}

// Ping the network
function reconnectAsNetworkAdmin() {
    // 5. Reconnect with the card
    return adminConnection.connect(cardNameForNetworkAdmin).then(function(){
        console.log("Network Admin Connected Successfully!!!");

        // 6. Ping the BNA
        adminConnection.ping(appName).then(function(response){
            console.log("Ping response from " + appName + " :" + response);
            // 7. Disconnect
            adminConnection.disconnect();
        }).catch((error)=>{
            console.log(error);
        });
    });
}