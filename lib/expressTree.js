'use strict';

const treePrint = require('tree-printer');

// tree array to hold our data
const treeArr = [];

/**
 * Starting point of this module
 * @param localApp - an expressjs instance,  eg 'var app = exopress();', so 'app' is the input.
 */

function printRoutes(localApp) {
    if(localApp._router){
        localApp._router.stack.forEach((middleware) => {

            _routeCheck(middleware);
    });
        treePrint(treeArr);
        // jf.writeFile('treeArr.json', treeArr)
    } else {

    }

}



function _routeCheck(handler,treePos){
    if(!handler) return
    let newTreePos = {};
    let tmpNewTreeObj;
    
    if(handler.name === 'router') { // router middleware
        const regEx = /\w{2,}/
        const routePath = handler.regexp.toString().match(regEx)[0];


        // first level child
        if(!treePos) {
            tmpNewTreeObj = {name:routePath, children:[]};
            treeArr.push(tmpNewTreeObj)

            newTreePos =  treeArr[treeArr.indexOf(tmpNewTreeObj)];
        }
        //  not first level
        else {
            tmpNewTreeObj = {name:routePath, children:[]};
            treePos.children.push(tmpNewTreeObj)

            newTreePos =  treePos.children[treePos.children.indexOf(tmpNewTreeObj)];
        }


        handler.handle.stack.forEach(function (newHandler) {
            _routeCheck(newHandler,newTreePos);
        });

    } else if(handler.route) {

        // first level child
        if(!treePos) {
            tmpNewTreeObj = {name:handler.route.path};
            treeArr.push(tmpNewTreeObj)
        }
        //  not first level
        else {
            tmpNewTreeObj = {name:handler.route.path};
            treePos.children.push(tmpNewTreeObj)
        }

    }
}


module.exports = {
    printRoutes
};
