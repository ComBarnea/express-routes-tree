'use strict';

const treePrint = require('treeify');
const fs        = require('fs');
// tree array to hold our data
const treeObj = [];

/**
 * Starting point of this module
 * @param localApp - an expressjs instance,  i.e 'var app = exopress();', so 'app' is the input.
 */

function printRoutes(localApp,fileName) {
    if(localApp._router){
        localApp._router.stack.forEach((middleware) => {

            _routeCheck(middleware, treeObj);
        });
        if(!fileName){
            console.log(treePrint.asTree(treeObj));

        } else {
            fs.writeFile(`${fileName}.tree`, treePrint.asTree(treeObj));
        }

    } else {
        console.log('###\texpress-routes-tree')
        console.log('###\tthe object supplied is not an express instance')
    }
}


/**
 * Recursive function to build needed object for tree visualisation
 * @param handler - handler object representing middlware, route or any other relevant express object
 * @param treePos - current position to work on
 * @private
 */
function _routeCheck(handler,treePos){
    if(!handler) return;

    if(handler.name === 'router') { // router middleware
        const regEx = /\w{2,}/; // string unwanted regex from original string
        const routePath = handler.regexp.toString().match(regEx)[0];

        treePos[routePath] = {};

        const newTreePos =  treePos[routePath];

        handler.handle.stack.forEach(function (newHandler) {
            _routeCheck(newHandler,newTreePos);
        });

    } else if(handler.route) { // end route

        Object.keys(handler.route.methods).forEach((key) => {
            treePos[`${key.toUpperCase()} ${handler.route.path}`] = {};
        });
    }
}


module.exports = {
    printRoutes
};
