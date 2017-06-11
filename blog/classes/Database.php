<?php

class Database {

    private $host = 'localhost';
    private $user = 'dturner';
    private $pass = 'zj6Xcm15';
    private $dbname = 'dturner';

    private $dbh;
    private $error;
    private $stmt;

    public function __construct() {
        $dns = 'mysql:host=' . $this->host . ';dbname=' . $this->dbname;
        $options = array(
            PDO::ATTR_PERSISTENT => true,
            PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION
        );
        try {
            $this->dbh = new PDO($dns, $this->user, $this->pass, $options);
        }
        catch(PDOException $e) {
            $this->error = $e->getMessage();
            echo $this->error;
        }
    }

    public function query($query) {
        $this->stmt = $this->dbh->prepare($query);
    }

    public function execute($values = []) {
        return $this->stmt->execute($values);
    }

    public function fetchAll($values = []) {
        $this->stmt->execute($values);
        return $this->stmt->fetchAll(PDO::FETCH_ASSOC);
    }

    public function fetch($values = []) {
        $this->stmt->execute($values);
        return $this->stmt->fetch();
    }

    public function lastInsertId() {
        return $this->dbh->lastInsertId();
    }
}