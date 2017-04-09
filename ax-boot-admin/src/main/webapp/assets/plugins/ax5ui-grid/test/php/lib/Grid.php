<?php

/**
 * User: user
 * Date: 2016-09-30
 * Time: 오전 10:02
 */
class Grid
{
    public $target;
    public $header;
    public $body;
    public $columns;
    public $page;
}

class Header
{
    public $align;
    public $columnHeight;
}

class Body
{
    public $align;
    public $columnHeight;
    public $onClick;
}

class Column
{
    public $key;
    public $label;
    public $formatter;
    public $align;
    public $width;
    public $enableFilter;
    public $editor;
    public $columns;
}

class Page
{
    public $navigationItemCount;
    public $height;
    public $display;
    public $firstIcon;
    public $prevIcon;
    public $nextIcon;
    public $lastIcon;
    public $onChange;
}