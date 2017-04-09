<?php
/**
 * Database 기본 설정
 * User: user
 * Date: 2016-09-27
 * Time: 오전 11:21
 */

require_once 'vendor/autoload.php';

$db = Query(array(
    'type' => 'sqlite',
    'host' => '',
    'user' => '',
    'pass' => '',
    'port' => '',
    'database' => '',

    // Only required
    // SQLite or Firebird
    'file' => 'db/sample.db',

    // Optional paramaters
    'prefix' => '',     // Database table prefix
    'alias' => 'default'        // Connection name for the Query function
));