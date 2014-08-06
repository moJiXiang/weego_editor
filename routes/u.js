var async   = require('async'),
    models  = require('../models'),
    log     = require('winston');
//user's resources

exports.tasks = function (req, res) {  // all tasks assigned to current user, paged

    var me = req.user;

    var iseditor = me.hasRole('en_editor') || me.hasRole('zh_editor');
    if (!iseditor) {
        return res.send(406, {result: []});//not acceptable : should be an editor to request such resources
    }

    var opt = JSON.parse(JSON.stringify(req.query)); //clone
    opt.editor_id = me.id;
    opt.en = me.hasRole('en_editor');
    opt.completed = false;

    models.Task.query(opt).exec(function (err, result) {
        if (err) return res.send(500, err);
        res.send(200, {result:result});
    });
}


