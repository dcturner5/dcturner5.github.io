<?php
require_once('../connect.php');

if(!isset($_GET['t'])) {
    header('location:../index.php');
}
?>
<!DOCTYPE html>
<html>
<head>
    <title>Battle</title>
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
<div class="content" style="display: none">
    <div>
        <table class="battle" align="center">
            <tbody id="battle-content"></tbody>
        </table>
        <table class="battle" align="center">
            <tbody>
            <tr class="battle">
                <td style="width: 92%;">
                    <input id="input" type="text" placeholder="Rap goes here" maxlength="128" onkeyup="if(event.keyCode == 13) submit()">
                </td>
                <td style="width: 8%;">
                    <input type="button" onclick="submit()" value="Enter">
                </td>
            </tr>
            </tbody>
        </table>
    </div>
    <input type="hidden" id="token" value="<?php echo $_GET['t'];?>">
</div>
<div class="wait">
    WAITING FOR OPPONENT
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
            socket.send('join_battle', {token: token});
        });
        socket.receive('start_battle', function() {
            document.getElementsByClassName("content")[0].style.display = "initial";
            document.getElementsByClassName("wait")[0].style.display = "none";
        });
        socket.receive('output_battle', function(data) {
            document.getElementById("battle-content").innerHTML = "";
            var bars = data.bars;
            for(var i = 0; i < bars.length; i++) {
                var bar = bars[i];
                var name = bar.name + ":";
                if(i != 0 && bars[i-1].name == bar.name) name = "";
                if(bar.host) document.getElementById("battle-content").innerHTML += "<tr class='battle host'><td class='line'>" + name.toUpperCase() + " " + bar.string + "</td><td class='rating'>" + bar.rating + "</td></tr>";
                else document.getElementById("battle-content").innerHTML += "<tr class='battle opponent'><td class='line'>" + name.toUpperCase() + " " + bar.string + "</td><td class='rating'>" + bar.rating + "</td></tr>";
                document.body.scrollTop = 999999999;
            }
        });
    });

    function submit() {
        var input = document.getElementById("input").value;
        document.getElementById("input").value = "";
        socket.send('input_battle', {string: input});
    }

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