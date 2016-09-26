CKEDITOR.plugins.add('filemanager', {
    init: function (editor) {
        editor.ui.addButton('FileManager',
            {
                label: 'My New Plugin',
                command: 'OpenFileManager',
                icon: CKEDITOR.plugins.getPath('filemanager') + 'icon.png'
            });
        editor.addCommand('OpenFileManager', {exec: openFileManager});
    }
});
function openFileManager(e) {
    window.open(CONTEXT_PATH + '/ckeditor/fileBrowser?targetType=CKEDITOR&targetId=' + menuId, 'MyWindow', 'width=800,height=700,scrollbars=no,scrolling=no,location=no,toolbar=no');
}