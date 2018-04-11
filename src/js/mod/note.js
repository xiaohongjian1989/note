require('less/note.less');

var Toast = require('./toast.js').Toast;
var Event = require('./event.js');

function Note(opts) {
    this.initOpts(opts);
    this.createNote();
    this.setStyle();
    this.bindEvent();
}

Note.prototype = {
    colors: [
        ['#ea9b35', '#efb04e'],
        ['#dd598b', '#e672a2'],
        ['#eee34b', '#f2eb67'],
        ['#c24226', '#d15a39'],
        ['#c1c341', '#d0d25c'],
        ['#3f78c3', '#5591d2']
    ],

    defaultOpts: {
        id: "",
        $ct: $('#content').length > 0 ? $('#content') : $('body'),
        content: 'input here'
    },

    initOpts: function (opts) {
        this.opts = $.extend({}, this.defaultOpts, opts || {});
        if (this.opts.id) {
            this.id = this.opts.id;
        }
    },

    createNote: function () {
        var tpl =  '<div class="note">'
                    + '<div class="note-head"><span class="delete">&times;</span></div>'
                    + '<div class="note-ct" contenteditable="true"></div>'
                +'</div>';
        this.$note = $(tpl);
        this.$note.find('.note-ct').html(this.opts.content);
        this.opts.$ct.append(this.$note);
        if(!this.id) {
            this.$note.css({left: '2px', top: '550px'});
        }
    },

    setStyle: function () {
        var color = this.colors[Math.floor(Math.random() * 6)];
        this.$note.find('.note-head').css('background-color', color[0]);
        this.$note.find('.note-ct').css('background-color', color[1]);
    },
    setLayout: function () {
        var self = this;
        if (self.clk) {
            clearTimeout(self.clk)
        }

        self.clk = setTimeout(function () {
            Event.fire('eaterfall')
        }, 100);
    },

    bindEvent: function () {
        var self = this,
            $note = self.$note,
            $noteHead = $note.find('.note-head'),
            $noteCt = $note.find('.note-ct'),
            $delete = $note.find('.delete');

        $delete.on('click', function () {
            self.delete();
        });        

        $noteCt.on('focus', function () {
            if($noteCt.html() == 'input here') {
                $noteCt.html('');
            }
            $noteCt.data('before', $noteCt.html());
        }).on('blur paste', function () {
            if ($noteCt.data('before') != $noteCt.html()) {
                $noteCt.data('before', $noteCt.html());
                self.setLayout();
                if (self.id) {
                    self.edit($noteCt.html());
                } else {
                    self.add($noteCt.html());
                }
            }
        });

        $noteHead.on('mousedown', function (e) {
            var evtX = e.pageX - $note.offset().left,
                evtY = e.pageY - $note.offset().top;

            $note.addClass('draggable').data('evtPos', {x: evtX, y: evtY});
        }).on('mouseup', function () {
            $note.removeClass('draggable').removeData('evtPos');
        });

        $('body').on('mousemove', function(e){
            $('.draggable').length && $('.draggable').offset({
                top: e.pageY - $('.draggable').data('evtPos').y,    // 当用户鼠标移动时，根据鼠标的位置和前面保存的距离，计算 dialog 的绝对位置
                left: e.pageX - $('.draggable').data('evtPos').x
            });

        });
    },

    edit: function (msg) {
        var self = this;
        $.ajax({
            url: '/api/notes/edit',
            type: 'POST',
            data: {
                id: self.id,
                note: msg
            }.done(function (ret) {
                if (ret.status === 0) {
                    Toast('编辑成功');
                    console.log('更新成功');
                } else {
                    Toast(ret.errorMsg);
                }
            })
        });
    },

    add: function (msg) {
        console.log('add...');
        var self = this;
        $.ajax({
            url: '/api/notes/add',
            type: 'POST',
            data: {
                note: msg
            }
        }).done(function (ret) {
            if (ret.status === 0) {
                Toast('添加成功');
            } else {
                Toast(ret.errorMsg);
            }
        })
    },
    delete: function(){
        if (!this.id) {
            this.$note.remove();
        }
        var self = this;
        $.ajax({
            url: '/api/notes/delete',
            type: 'POST',
            data: {
                id: this.id
            }
        }).done(function (ret) {
            if(ret.status === 0){
                    Toast('删除成功');
                    self.$note.remove();
                    Event.fire('waterfall')
                }else{
                    Toast(ret.errorMsg);
                }
        });    
    }
};

module.exports.Note = Note;