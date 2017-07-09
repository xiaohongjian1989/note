var express = require('express');
var router = express.Router();
var Note = require('../model/note.js');

// 获取所有的note或者登陆的用户
router.get('/note', function(req, res, next) {
    var opts = {raw: true}
    if(req.session && req.session.user){
      	opts.where = {uid:req.session.user.id }
    }
	console.log(req.session);
    Note.findAll(opts).then(function(notes) {
      	res.send({
			  status: 0, 
			  data: notes
			});
    }).catch(function(){
      	res.send({ 
			status: 1,
			errorMsg: '数据库异常'
		});
    });
});

// 新增
router.post('/notes/add', function(req, res, next) {
	if (!req.session.user) {
		return res.send({
			status: 1,
			errorMsg: '请先登陆'
		});
	}
	var uid = req.session.user.id;
	var note = req.body.note;

	Note.create({
		text: note,
		uid: uid
	}).then(function () {
		res.send({
			status: 0
		});
	}).catch(function () {
		res.send({
			status: 1,
			errorMsg: '数据库出错'
		});
	});
});


router.post('/notes/edit', function(req, res, next) {
	if (!req.session.user) {
		return res.send({
			status: 1,
			errorMsg: '请先登陆'
		});
	}

	var uid = req.session.user.id;
	Note.update({text: req.body.note}
				,{where:{id: req.body.id, uid: uid}
	}).then(function () {
		res.send({
			status: 0
		});
	}).catch(function () {
		res.send({
			status: 1,
			errorMsg: '数据更新出错'
		});
	});
});

router.post('/notes/delete', function(req, res, next) {
	if (!req.session.user) {
		return res.send({
			status: 1,
			errorMsg: '请先登陆'
		});
	}

	var uid = req.session.user.id;
	Note.destroy({
		where: {id: req.body.id, uid: uid}
	}).then(function () {
		res.send({
			status: 0
		});
	}).catch(function () {
		res.send({
			status: 1,
			errorMsg: '删除数据出错'
		});
	});
});

module.exports = router;