<?php
require 'Tag.php';
require 'User.php';

class Post {

    public $id;
    public $title;
    public $body;
    public $author;
    public $date;
    public $url;
    public $tags = [];

    public function __construct($id = null, $title = null, $body = null, $date = null, $url = null, $author_id = null) {
        $this->id = $id;
        $this->title = $title;
        $this->body = $body;
        $this->date = $date;
        $this->url = $url;

        $database = new Database();

        $database->query('SELECT id, firstname, lastname, email, url FROM `blog-users` WHERE id = ? LIMIT 1');
        $row = $database->fetch([$author_id]);
        $this->author = new User($row['id'], $row['firstname'], $row['lastname'], $row['email'], $row['url']);

        $database->query('SELECT t.id, t.name FROM `blog-posts` p LEFT JOIN `blog-posts_tags` pt ON p.id = pt.posts_id LEFT JOIN `blog-tags` t ON pt.tags_id = t.id WHERE p.id = ?');
        $rows = $database->fetchAll([$this->id]);
        foreach($rows as $row) {
            array_push($this->tags, new Tag($row['id'], $row['name']));
        }
    }

}