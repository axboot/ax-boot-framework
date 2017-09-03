<?php
if (preg_match('/(?i)msie [5-9]/', $_SERVER['HTTP_USER_AGENT'])) {

} else {
    header('Content-Type: application/json');
}

$file_server_path = realpath(__FILE__);
$server_path = str_replace(basename(__FILE__), "", $file_server_path);

$upload_dir = $_SERVER["DOCUMENT_ROOT"] . $_POST["uploadedPath"];
$file = $_POST["saveName"];

if (is_file($upload_dir . '/' . $file)) {
    unlink($upload_dir . '/' . $file);
    echo '{
        "result":"ok", 
        "msg":""
    }';
} else {
    echo '{
        "result": "ok", 
        "msg": "' . '파일을 찾을 수 없습니다.' . $upload_dir . '"
    }';
}

?>