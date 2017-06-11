<?php
require_once('../connect.php');
?>
<!DOCTYPE html>
<html>
<head>
    <title>Rap Battle</title>
    <script src="../js/ServerSocket.js"></script>
    <link rel="stylesheet" href="../css/style.css">
</head>
<body>
<div class="header">
    <a href="../index.php">Home</a>
    <a href="../profile/index.php">Profile</a>
    <a href="../create/index.php">Create</a>
    <a href="../search/index.php">Search</a>
    <a href="../login/index.php">Login</a>
</div>
<div class="content">
    <div>
        <table class="battle" align="center" style="width: 70%">
            <tbody id="battle-content"></tbody>
        </table>
    </div>
    <input type="hidden" id="token" value="<?php echo $_GET['t'];?>">
</div>
<script>
    var socket = new ServerSocket('http://'+location.host+'/', 8001);
    socket.init(function() {
        socket.connect();
        socket.receive('init', function() {
            var token = document.cookie.replace(/(?:(?:^|.*;\s*)token\s*\=\s*([^;]*).*$)|^.*$/, "$1");
            socket.send('init_client', {token: token, login: true});
        });
        socket.receive('kick_client', function() {
            location.href = "../index.php";
        });
        socket.receive('redirect_client', function(data) {
            location.href = data.url;
        });
        socket.receive('init_client', function() {
            var token = document.getElementById("token").value;
            socket.send('join_audience', {token: token});
        });
        socket.receive('output_battle', function(data) {
            document.getElementById("battle-content").innerHTML = "";
            var bars = data.bars;
            for(var i = 0; i < bars.length; i++) {
                var bar = bars[i];
                var name = bar.name + ":";
                if(i != 0 && bars[i-1].name == bar.name) name = "";
                if(bar.host) document.getElementById("battle-content").innerHTML += "<tr class='battle host'><td class='line'>" + name.toUpperCase() + " " + bar.string + "</td><td class='rating'>" + bar.rating + "</td><td class='upvote' onclick='upvote(" + i + ")'></td><td class='downvote' onclick='downvote(" + i + ")'></td></tr>";
                else document.getElementById("battle-content").innerHTML += "<tr class='battle opponent'><td class='line'>" + name.toUpperCase() + " " + bar.string + "</td><td class='rating'>" + bar.rating + "</td><td class='upvote' onclick='upvote(" + i + ")'></td><td class='downvote' onclick='downvote(" + i + ")'></td></tr>";
                document.body.scrollTop = 999999999;
            }
        });
    });

    function upvote(index) {
        var token = document.getElementById("token").value;
        socket.send('upvote_battle', {index: index, token: token});
    }

    function downvote(index) {
        var token = document.getElementById("token").value;
        socket.send('downvote_battle', {index: index, token: token});
    }
</script>
</body>
</html>