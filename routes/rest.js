
var models = require('../models'),
    async  = require('async');

exports.getEntities = function (req, res) {

    var model = req.model;

    var c = {
        criteria : {},
        offset : req.query.offset || 0,
        limit  : req.query.limit || 20
    }

    model.find(c.criteria)
        .limit(c.limit)
        .skip(c.offset)
        .exec(function (err, items) {
            if (err) {
                res.send(500, {
                    status: 500,
                    type : 'Internal Server Error',
                    message : '' + err
                });
            } else {
                res.send(200, {items : items, offset: c.offset, limit: c.limit});
            }
        });
}

exports.postEntities = function (req, res) {  //create a new entity
    
    var model = req.model;

    model.save(req.body.item, function (err, item) {
        if (err) {
            res.send(500, {
                status: 500,
                type : 'Internal Server Error',
                message : '' + err
            });
        } else {
            res.send(201, {item : item});
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
            res.send(200, item);
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
            res.send(200, item);
        }
    });
}

exports.putEntity = function (req, res) {  
    
    var model = req.model;

    model.findByIdAndUpdate(req.params.id, req.body, function (err, item) {
        if (err) {
            res.send(500, {status:500, type : 'Internal Server Error', message: 'Fail to delete entity ' + req.params.id});
        } else {
            res.send(200, item);
        }
    });
}
