<?php

class User {

    public $id;
    public $firstname;
    public $lastname;
    public $email;
    public $url;

    public function __construct($id = null, $firstname = null, $lastname = null, $email = null, $url = null) {
        $this->id = $id;
        $this->firstname = $firstname;
        $this->lastname = $lastname;
        $this->email = $email;
        $this->url = $url;
    }

}