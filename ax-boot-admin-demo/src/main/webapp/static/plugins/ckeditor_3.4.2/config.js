/*
Copyright (c) 2003-2010, CKSource - Frederico Knabben. All rights reserved.
For licensing, see LICENSE.html or http://ckeditor.com/license
*/
CKEDITOR.editorConfig = function(config) {
    // Define changes to default configuration here. For example:
    // config.language = 'fr';
    // config.uiColor = '#AADC6E';

    config.toolbar = 'Basic';

    config.skin = 'v2';
    //config.toolbar = 'Full';

    filebrowserImageUploadUrl: '/UploadImage';

    config.font_names =
    '맑은고딕/malgun gothic;' +
    '돋음/돋음;' +
    '고딕/고딕;' +
    '바탕/바탕;' +
    '궁서/궁서;' +
    config.font_names;

    config.toolbar_Full =
    [
        ['Source', '-', 'Save', 'NewPage', 'Preview', '-', 'Templates'],
        ['Cut', 'Copy', 'Paste', 'PasteText', 'PasteFromWord', '-', 'Print', 'SpellChecker', 'Scayt'],
        ['Undo', 'Redo', '-', 'Find', 'Replace', '-', 'SelectAll', 'RemoveFormat'],
        ['Form', 'Checkbox', 'Radio', 'TextField', 'Textarea', 'Select', 'Button', 'ImageButton', 'HiddenField'],
        ['BidiLtr', 'BidiRtl'],
        '/',
        ['Bold', 'Italic', 'Underline', 'Strike', '-', 'Subscript', 'Superscript'],
        ['NumberedList', 'BulletedList', '-', 'Outdent', 'Indent', 'Blockquote', 'CreateDiv'],
        ['JustifyLeft', 'JustifyCenter', 'JustifyRight', 'JustifyBlock'],
        ['Link', 'Unlink', 'Anchor'],
        ['Image', 'Flash', 'Table', 'HorizontalRule', 'Smiley', 'SpecialChar', 'PageBreak'],
        '/',
        ['Styles', 'Format', 'Font', 'FontSize'],
        ['TextColor', 'BGColor'],
        ['Maximize', 'ShowBlocks', '-', 'About']
    ];

    config.toolbar_CollabraCustomized =
    [
        ['Bold', 'Italic', 'Underline', 'Strike'],
	    ['TextColor', 'BGColor'],
        ['JustifyLeft', 'JustifyCenter', 'JustifyRight', 'JustifyBlock'],
        ['NumberedList', 'BulletedList'],
        ['Undo', 'Redo', 'Find', 'Replace', 'Smiley', 'SpecialChar', 'Rule', 'Table', 'Image', 'Source'], '/',
	    ['Styles', 'Format', 'Font', 'FontSize'], ['SpellChecker', 'Preview']
    ];

    config.toolbar_Default =
    [
        ['Bold', 'Italic', 'Underline', 'Strike'],
	    ['TextColor', 'BGColor'],
        ['JustifyLeft', 'JustifyCenter', 'JustifyRight', 'JustifyBlock'],
        ['NumberedList', 'BulletedList'],
        ['Undo', 'Redo', 'Find', 'Replace', 'Smiley', 'SpecialChar', 'Rule', 'Table', 'Image', 'Source'], '/',
	    ['Styles', 'Format', 'Font', 'FontSize'], ['SpellChecker', 'Preview']
    ];

    config.toolbar_Basic =
    [
        ['Font', 'FontSize', 'Bold', 'Italic', 'Underline', 'Strike'],
	    ['TextColor', 'BGColor'],
        ['JustifyLeft', 'JustifyCenter', 'JustifyRight', 'JustifyBlock'],
        ['NumberedList', 'BulletedList'],
        ['Undo', 'Redo', 'Find', 'Replace', 'Smiley', 'SpecialChar', 'Rule', 'Table', 'Image', 'Preview', 'Source']
    ];



};