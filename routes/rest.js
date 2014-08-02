
var models = require('../models'),
    async  = require('async');

var isMethodInternal = function () {
    var internals = ['find', 'count'];
    return function (m) {
        return internals.indexOf(m) > -1;
    }
}

var listEntities = function (model, req, res, opt2) {

    if (!model) {
        return res.send(400, {status: 400, type : 'Bad Request', message: 'entity name is invalid'});
    }

    var opt = opt2 || req.query; // take the opportunity to enhance opt
    console.log(opt);

    model.query(opt, function (err, items) {
        if (err) {
            console.error(err);
            return res.send(500, {status: 500, type : 'Internal Server Error', message : '' + err });
        }
        res.send(200, {result: items});
    });
}

exports.getEntities = function (req, res) {

    var model = req.model;

    var opt = JSON.parse(JSON.stringify(req.query));//clone
    if (opt.criteria) {
        try {
            opt.criteria = JSON.parse(opt.criteria);
        }catch (e) {
            res.send(400, {status: 400, type: 'Bad Request', message : 'Fail to parse parameter criteria'});
            return;
        }
    }

    if (opt.cmd) {
        var cmd = opt.cmd;
        delete opt.cmd; //not required to be passed to method
        model[cmd](opt, function (err, items) {
            if (err) {
                return res.send(500, {status: 500, type : 'Internal Server Error', message : '' + err });
            } 
            return res.send(200, {result : items});
        });
    } else {
        listEntities(req.model, req, res);
    }
}

exports.postEntities = function (req, res) {  //create a new entity
    
    var model = req.model;

    model.create(req.body, function (err, item) {
        if (err) {
            res.send(500, {
                status: 500,
                type : 'Internal Server Error',
                message : '' + err
            });
        } else {
            res.send(201, {result : item});
        }
    });
}

exports.delEntities = function (req, res) {  
    
    var model = req.model;

    res.send(500, {status:500, type : 'Internal Server Error', message: 'Not yet implemented'});
}

exports.putEntities = function (req, res) {  
    
    var model = req.model;

    res.send(500, {status:500, type : 'Internal Server Error', message: 'Not yet implemented'});
}

exports.getEntity = function (req, res) {  
    
    var model = req.model;

    model.findById(req.params.id, function (err, item) {
        if (err) {
            res.send(500, {
                status: 500,
                type : 'Internal Server Error',
                message : '' + err
            });
        } else if (!item) {
            res.send(404, {status: 404, type: 'Not Found', message : 'entity not found : ' + req.query.id});
        } else {
            res.send(200, {result: item});
        }
    });
}

exports.postEntity = function (req, res) {  
    
    var model = req.model;

    res.send(500, {status:500, type : 'Internal Server Error', message: 'Not yet implemented'});
}

exports.delEntity = function (req, res) {  
    
    var model = req.model;

    //TODO : remove or findByIdAndRemove ?
    model.findByIdAndRemove(req.params.id, function (err, item) {
        if (err) {
            res.send(500, {status:500, type : 'Internal Server Error', message: 'Fail to delete entity ' + req.params.id});
        } else {
            res.send(200, {result: item});
        }
    });
}

exports.putEntity = function (req, res) {  
    
    var model = req.model;

    model.findByIdAndUpdate(req.params.id, req.body, function (err, item) {
        if (err) {
            res.send(500, {status:500, type : 'Internal Server Error', message: 'Fail to update entity ' + req.params.id});
        } else {
            res.send(200, {result: item});
        }
    });
}
