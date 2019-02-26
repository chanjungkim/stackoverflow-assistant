const TAP_SIZE = 4;

$(function () {
    $(document).on('keydown', "#wmd-input", function (e) {
        console.log('keydown called: e.which: ' + e.which);
        var code = e.keyCode || e.which;

        switch (code) {
            case 9:
                e.preventDefault();
                if (!isTextSelected($('#wmd-input')[0])) {
                    console.log("not selected: ");
                    var text = $("#wmd-input").val();
                    var caret_pos = getCaret(this);

                    console.log('Tab pressed, pos: ' + caret_pos + "/" + text.length);
                    console.log(text);

                    var beforeText = text.substring(0, caret_pos);
                    var afterText = text.substring(caret_pos, text.length);
                    text = beforeText + "\t" + afterText;
                    $('#wmd-input').val(text);
                    setCaretToPos(this, caret_pos + 1);
                    return;
                } else {
                    console.log("selected: ");
                    var selectionStart = $('#wmd-input').prop('selectionStart');
                    var selectionEnd = $('#wmd-input').prop('selectionEnd');
                    var text = $('#wmd-input').val();
                    var beforeText = text.substring(0, selectionStart);
                    var afterText = text.substring(selectionEnd, text.length);
                    var selectedText = text.substring(selectionStart, selectionEnd);
                    var arrayOfSelectedLines = selectedText.split('\n');
                    var newText = "";

                    console.log("selectionStart: " + selectionStart + ", selectionEnd: " + selectionEnd + ", text.length: " + text.length);
                    for (var i = 0; i < arrayOfSelectedLines.length; i++) {
                        console.log("item: " + arrayOfSelectedLines[i]);
                        newText += "\t" + arrayOfSelectedLines[i];
                        if (i < arrayOfSelectedLines.length - 1) {
                            newText += "\n";
                        }
                    }

                    $('#wmd-input').val(beforeText + newText + afterText);
                    $('#wnd-input').selectRange(selectionStart + 1, selectionEnd + 1);
                    // setCaretToPos(this, caret_pos + 1);
                    return;
                }
                break;
            case 88:
                break;
        }
    });
});

function getCaret(node) {
    console.log(JSON.stringify(node, null, 2));

    if (node.selectionStart) return node.selectionStart;
    else if (!document.selection) return 0;
    //node.focus();
    var c = "\001";
    var sel = document.selection.createRange();
    var txt = sel.text;
    var dul = sel.duplicate();
    var len = 0;
    try {
        dul.moveToElementText(node);
    } catch (e) {
        return 0;
    }
    sel.text = txt + c;
    len = (dul.text.indexOf(c));
    sel.moveStart('character', -1);
    sel.text = "";
    return len;
}

function setCaretToPos(input, pos) {
    setSelectionRange(input, pos, pos);
}

function setSelectionRange(input, selectionStart, selectionEnd) {
    if (input.setSelectionRange) {
        input.focus();
        input.setSelectionRange(selectionStart, selectionEnd);
    } else if (input.createTextRange) {
        var range = input.createTextRange();
        range.collapse(true);
        range.moveEnd('character', selectionEnd);
        range.moveStart('character', selectionStart);
        range.select();
    }
}

function isTextSelected(input) {
    var startPos = input.selectionStart;
    var endPos = input.selectionEnd;
    var doc = document.selection;

    if (doc && doc.createRange().text.length != 0) {
        return true;
    } else if (!doc && input.value.substring(startPos, endPos).length != 0) {
        return true;
    }
    return false;
}

$.fn.selectRange = function (start, end) {
    $(this).each(function () {
        var el = $(this)[0];

        if (el) {
            el.focus();

            if (el.setSelectionRange) {
                el.setSelectionRange(start, end);

            } else if (el.createTextRange) {
                var range = el.createTextRange();
                range.collapse(true);
                range.moveEnd('character', end);
                range.moveStart('character', start);
                range.select();

            } else if (el.selectionStart) {
                el.selectionStart = start;
                el.selectionEnd = end;
            }
        }
    });
};