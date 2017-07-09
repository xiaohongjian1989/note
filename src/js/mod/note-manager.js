var Toast = require('./toast.js').Toast;
var Note = require('./note.js').Note;
var Event = require('./event.js');

var NotManager = (function () {

    function load() {
        $.ajax({
            url: '/api/note',
            type: 'GET'
        }).done(function (ret) {
            if (ret.status === 0) {
                $.each(ret.data, function(index, value) {
                    new Note({
                        id: value.id,
                        content: value.text
                    });
                });
                Event.fire('waterfall');
            } else {
                Toast(ret.errorMsg);
            }
        }).fail(function () {
            Toast('网络异常');
        });
    }

    function add() {
        new Note();
    }

    return {
        load: load,
        add: add
    }
})();

module.exports = NotManager;