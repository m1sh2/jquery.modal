
// jQuery.Modal plugin

(function(factory, jQuery) {

    if (typeof define === 'function' && define.amd) {
        define(['jquery'], factory);
    } else if (typeof exports === 'object') {
        module.exports = factory(require('jquery'));
    } else {
        factory(jQuery);
    }

}(function($, window) {
  $.fn.Modal = function(message) {

    var _modal = this;
    var act = 'open',
      text,
      title = '',
      width = 350,
      ok = 'Ok',
      proportion = [50, 50];

    if (typeof message === 'undefined') {
      act = 'open';
      message = '';
    } else if (message == 'close' || message == 'reset') {
      act = message;
    } else if (message.hasOwnProperty('act') && typeof message.act !== 'undefined') {
      act = message.act;
    }

    function Options(a) {
      var o = $(a).attr('options');
      o = JSON.parse(o);
      _modal(o);
    }

    function ModalContent() {
      if (typeof message === 'object') {
        // message = JSON.stringify(message);
        if (message.hasOwnProperty('title')) {
          title = message.title;
        }
        if (message.hasOwnProperty('width')) {
          width = message.width;
        }
        if (message.hasOwnProperty('proportion')) {
          proportion = message.proportion;
        }
        if (message.hasOwnProperty('ok')) {
          ok = message.ok;
        }

        if (typeof message.fields === 'object') {
          var fields = message.fields;
          var form = $('<form />');
          var field;
          var valigntitle = 'middle';

          for (var i = 0; i < fields.length; i++) {
            if (fields[i].hasOwnProperty('valigntitle')) {
              valigntitle = fields[i].valigntitle;
            }
            field = '<div class="modal-form-row">' +
              '<div class="modal-label" style="vertical-align: ' + valigntitle + ';">' +
              '<label>' + fields[i].title + '</label>' +
              (fields[i].subtitle ? '<small>' + fields[i].subtitle + '</small>' : '') +
              '</div>';
            switch (fields[i].type) {
              case 'html':
                field += '<div class="modal-input" id="' + fields[i].name + '">' +
                  (fields[i].value == undefined ? '' : fields[i].value) +
                  '</div>';
                break;
              case 'tags':
                field += '<div class="modal-input tags">' +
                  '<span class="button modal-addMedia"><i class="icon-plus"></i>Add field</span>' +
                  '<span class="button modal-selectMedia"><i class="icon-files-empty"></i>Select file</span>' +
                  '<span class="button modal-uploadMedia"><i class="icon-upload"></i>Upload file</span>' +
                  '<span class="button modal-previewMedia"><i class="icon-eye"></i>Preview</span>' +
                  '<div id="campaign_files"></div>' +
                  '<div class="modal-tag-row">' +
                  '<span class="button modal-removeMedia"><i class="icon-bin"></i></span>' +
                  '<textarea' +
                  ' name="' + fields[i].name + '"' +
                  (fields[i].required === true ? ' required ' : '') +
                  (fields[i].placeholder ? ' placeholder="' + fields[i].placeholder + '" ' : '') +
                  '>' + (fields[i].value == undefined ? '' : fields[i].value) +
                  '</textarea>' +
                  '</div>' +
                  '</div>';
                break;
              case 'textarea':
                field += '<div class="modal-input">' +
                  '<textarea' +
                  ' name="' + fields[i].name + '"' +
                  (fields[i].required === true ? ' required ' : '') +
                  (fields[i].placeholder ? ' placeholder="' + fields[i].placeholder + '" ' : '') +
                  '>' +
                  (fields[i].value == undefined ? '' : fields[i].value) +
                  '</textarea>' +
                  '</div>';
                break;
              case 'interval':
                field += '<div class="modal-input interval">';
                for (var j = 0; j < fields[i].names.length; j++) {
                  if (j > 0) {
                    field += '<span class="modal-delim">-</span>';
                  }
                  field += '<input' +
                    ' type="date"' +
                    ' name="' + fields[i].names[j] + '"' +
                    (fields[i].placeholder ? ' placeholder="' + fields[i].placeholder + '" ' : '') +
                    (fields[i].required === true ? ' required ' : '') +
                    '>';
                }
                field += '</div>';
                break;
              case 'checkboxes':
                field += '<div class="modal-input">';
                for (var j = 0; j < fields[i].names.length; j++) {
                  field += '<div class="checkbox-style">' +
                    '<input' +
                    ' type="checkbox"' +
                    ' name="' + fields[i].names[j] + '"' +
                    ' id="' + fields[i].names[j] + '"' +
                    (fields[i].values[j] === true ? ' checked="checked"' : '') +
                    (fields[i].placeholder ? ' placeholder="' + fields[i].placeholder + '" ' : '') +
                    ' value="">' +
                    '<label for="' + fields[i].names[j] + '">' + fields[i].titles[j] + '</label>' +
                    '</div>';
                }
                field += '</div>';
                break;
              default:
                field += '<div class="modal-input">' +
                  '<input' +
                  (fields[i].error === true ? ' class="error"' : '') +
                  (fields[i].placeholder ? ' placeholder="' + fields[i].placeholder + '" ' : '') +
                  ' type="' + fields[i].type + '"' +
                  ' name="' + fields[i].name + '"' +
                  (fields[i].required === true ? ' required ' : '') +
                  ' value="' + (fields[i].value == undefined ? '' : fields[i].value) + '"' +
                  '>' +
                  (fields[i].error === true && fields[i].errorMessage ? '<div class="error-message">' + fields[i].errorMessage + '</div>' : '') +
                  '</div>';
                break;
            }

            field += '</div>';
            form.append(field);

            form.find('.modal-label').width(proportion[0] + '%');
            form.find('.modal-input').width(proportion[1] + '%');
          };
          text = form;
        } else if (typeof message.text === 'object') {
          var textItem;
          var textTmp = $('<div>');
          var elTmp;
          for (var i in message.text) {
            textItem = message.text[i];
            elTmp = $('<' + textItem.tag + '>');
            for (var j in textItem.attr) {
              elTmp.attr(j, textItem.attr[j]);
            }
            elTmp.html(textItem.html);
            textTmp.append(elTmp);
          }
          text = textTmp;
        } else {
          text = message.text;
        }
      } else {
        text = message;
      }

      if (typeof message.fields === 'object') {
        text.append('<div class="modal-form-row btns">' +
          '<button type="submit" class="modal-ok button">' + ok + '</button>' +
          '&nbsp;' +
          '<a href="javascript:ModalClose()" class="modal-ok button">Cancel</a>' +
          '</div>');
        text.append('</div>');

        if (message.callback) {
          text.submit(function() {
            message.callback($(this));
            return false
          });
        }
        if (message.callbackFunc) {
          message.callbackFunc();
        }
      } else if (typeof text === 'string') {
        text += '</div>';
        text += '<div class="modal-form-row btns"><a href="javascript:ModalClose()" class="modal-ok button">' + ok + '</a></div>';
      }
    }

    function ModalEvents() {
      $('.modal-content [type="date"]').attr({
        'type': 'text',
        'placeholder': 'mm/dd/yyyy',
        'readonly': true
      }).addClass('input-date').datepicker();

      $('.modal-content .interval').each(function() {
        var from = $(this).find('.input-date:first-child');
        var to = $(this).find('.input-date:last-child');

        from.change(function() {
          fromCorrect($(this).val());
        }).datepicker("destroy").datepicker({
          minDate: new Date(),
          onClose: function(selectedDate) {
            to.datepicker("option", "minDate", selectedDate);
          }
        });

        to.change(function() {
          toCorrect($(this).val());
        }).datepicker("destroy").datepicker({
          minDate: new Date(),
          onClose: function(selectedDate) {
            from.datepicker("option", "maxDate", selectedDate);
          }
        });

        function fromCorrect(dt) {
          var now = new Date().getTime();
          var val = new Date(dt).getTime();
          var d = new Date();
          var dts = ((d.getMonth() + 1).toString().length == 1 ? '0' + (d.getMonth() + 1) : (d.getMonth() + 1)) + '/' + d.getDate() + '/' + d.getFullYear();
          if (now > val) {
            from.val(dts);
          }

          if (new Date(to.val()).getTime() < new Date(from.val()).getTime()) {
            d = new Date(to.val());
            dts = ((d.getMonth() + 1).toString().length == 1 ? '0' + (d.getMonth() + 1) : (d.getMonth() + 1)) + '/' + d.getDate() + '/' + d.getFullYear();
            from.val(dts);

          }
        }

        function toCorrect(dt) {
          var now = new Date().getTime();
          var val = new Date(dt).getTime();
          var d = new Date();
          var dts = ((d.getMonth() + 1).toString().length == 1 ? '0' + (d.getMonth() + 1) : (d.getMonth() + 1)) + '/' + d.getDate() + '/' + d.getFullYear();
          if (now > val) {
            to.val(dts);
          }

          if (new Date(to.val()).getTime() < new Date(from.val()).getTime()) {
            d = new Date(from.val());
            dts = ((d.getMonth() + 1).toString().length == 1 ? '0' + (d.getMonth() + 1) : (d.getMonth() + 1)) + '/' + d.getDate() + '/' + d.getFullYear();
            to.val(dts);

          }
        }
      });

      if (message.loaded) {
        message.loaded();
      }

      if (message.loadedFunc) {
        message.loadedFunc();
      }

      $('.modal').animate({ top: $(window).scrollTop() + 100 + 'px' }, 500, function() {

      });
    }

    function ModalConstruct() {
      ModalContent();

      var modal = '<div class="modal-bg" onclick="ModalClose()"></div>' +
        '<div class="modal" style="width: ' + width + 'px; margin-left: -' + (width / 2) + 'px;" data-options="' + Base64.encode(JSON.stringify(message)) + '">' +
        '<a href="javascript:ModalClose()" class="modal-close">&#10006;</a>';

      if (title !== '') {
        modal += '<div class="modal-title">' + title + '</div>';
      }

      modal += '<div class="modal-content"></div>';

      $('body').append(modal);
      $('.modal-content').html(text);

      ModalEvents();
    };

    function ModalClose() {
      $('.modal, .modal-bg').animate({ opacity: '0' }, 500, function() {
        $('.modal-bg').off();
        $('.modal').children().addBack().off();
        $('.modal, .modal-bg').remove();
      });
    }

    win.ModalClose = ModalClose;

    switch (act) {
      case 'close': {
        ModalClose();
        break;
      }
      case 'reset': {
        var options = JSON.parse(Base64.decode($('.modal').data('options')));
        $('.modal-bg').off();
        $('.modal').children().addBack().off();
        $('.modal, .modal-bg').remove();
        _modal(options);
        break;
      }
      case 'update': {
        ModalContent();
        $('.modal-content').html(text);
        if (title !== '') {
          if ($('.modal .modal-title').length > 0) {
            $('.modal .modal-title').html(title);
          } else {
            $('<div class="modal-title">' + title + '</div>').insertBefore('.modal .modal-content');
          }
        }
        ModalEvents();
        break;
      }
      case 'open':
      default: {
        if ($('.modal').length > 0) {
          modals.push(JSON.stringify(message));
          return false
        } else {
          ModalConstruct();
        }
        break;
      }
    }



    $(document).off().on('click', '[rel="modal"]', function(e) {
      e.preventDefault();
      e.stopPropagation();
      
      var a = $(this);
      var o = a.attr('options');
      if (typeof o === 'string') {
        o = JSON.parse(o);
        o.act = 'open';
      } else {
        o = a.title;
      }
      
      $('<div/>').Modal(o);
    });
  }

}, window.jQuery, window));
