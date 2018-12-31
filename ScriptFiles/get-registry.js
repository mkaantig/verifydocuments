'use strict';

const bnUtil = require('./bn-user-connection-util');

// This creates the business network connection object
// and calls connect() on it. Calls the callback method
// 'main' with error
bnUtil.connect(main);

// This gets invoked after the promise for connect is
// resolved. Error has value if there was an error in connect()
function main(error){
    
    // Check for the connection error
    if (error){
        console.log(error);
        process.exit(1);
    }

    // 2. Get All asset registries...arg true = include system registry
    bnUtil.connection.getAllAssetRegistries(false).then((registries)=>{
        console.log("Registries");
        console.log("===========");
        printRegistry(registries);
        // 3. Get all participant registries
        return bnUtil.connection.getAllParticipantRegistries(false);
    }).then((registries)=>{
        printRegistry(registries);

        // 4. Get all the transaction registries
        return bnUtil.connection.getAllTransactionRegistries();
    }).then((registries)=>{
        printRegistry(registries);

        // 5. Get the Historian registry
        return bnUtil.connection.getHistorian();
    }).then((registry)=>{
        console.log("Historian Registry: ", registry.registryType, " ", registry.id);

        // 6. Get the identity Registry
        return bnUtil.connection.getIdentityRegistry();
    }).then((registry)=>{
        console.log("Identity Registry: ", registry.registryType, " ", registry.id);

        bnUtil.connection.disconnect();
    }).catch((error)=>{
        console.log(error);
        bnUtil.connection.disconnect();
    });

}

// Utility function to print information about the registry
function printRegistry(registryArray) {
    registryArray.forEach((registry)=>{
        console.log(registry.registryType, " ", registry.id);
    });
}
