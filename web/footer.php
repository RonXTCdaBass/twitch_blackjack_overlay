<?php
// footer
// Made by: RonXTCdaBass
// Year:    2023
// still incomplete ;)
// but working fine
?>
<!doctype html>
<html lang="en">
<head>
    <meta charset="utf-8">
    <script src="./js/jquery-3.6.0.min.js"></script>
    <script src="./js/bootstrap.bundle.js"></script>
    <link rel="stylesheet" href="./css/style-tw_clear.css">


    <link rel="icon" type="image/ico" href="../favicon.ico">

<script type="text/javascript">
function showPopup() {
var divElem = document.getElementById('popup-container');
var overlayElem = document.getElementById('popup-overlay');
var contentElem = document.getElementById('popup-content');
overlayElem.style.display = 'block';
divElem.style.display = 'block';
}
$(document).ready();
</script>
<script>
    $(document).ready(function () {

        // Check if any input fields have changed
        $(":text,textarea,:checkbox,input[type=range]").on('change', function (e) {
            $("#overlaylink").addClass("hide");
        });				
				
        document.getElementById("generate_button").addEventListener("click", function (e) {
            let mainAccount = document.getElementById("mainAccount").value;
            if (!mainAccount) {
                alert('Twitch username is not set');
            }
            //build overlay url
            if (mainAccount) {
                let srcURL = window.location.protocol + "//" + window.location.host + window.location.pathname;
                let fullUrl = srcURL + "game.php?channel=" + mainAccount + "";
                fullUrl = fullUrl.replace("footer.php", "index.php");
                document.getElementById("overlaylink").classList.remove("hide");
                document.getElementById("overlaylink").innerHTML = "<center><p><b>Add this link as a browser source in OBS. <br>" +
                    "<a href='" + fullUrl + "' target='_blank'>" + fullUrl + "</a></b></p></center>";
            }
        });
    });
</script>
<style>
/* Popup */
#popup-overlay {
display: block;
position: absolute;
z-index: 2000;
opacity: 0.7;
top: 0;
bottom: 0;
background: transparent;
width: 99%;
height: 99%;
}
.popup-container {
font-family: Helvetica, Arial, freesans, sans-serif;
display: block;
position: absolute;
z-index: 2100;
top: 50%;
left: 50%;
width: 420px;
margin-left: -250px; /*Half the value of width to center div*/
margin-top: -100px; /* Half the value of height to center div*/
background: #ccc;
background: url('./img/linkgen_table.jpg');
border-radius: 10px;
padding: 10px;
}
.popup-content {
padding: 2px;
height: auto;
margin: 10px;
width: 90%;
}
</style>
</head>
<style>
    .hide {
        display: none;
    }
</style>
<body>

<center> <pre id="pretext"></pre></center><div id="popup-overlay"></div><div id="popup-container" class="popup-container">

<div class="popup-content">
            <h3 class="h4">Twitch Overlay Link Generator</h3>
<hr>
    <div class="form-label">
        <label for="mainAccount">Twitch Account</label>
        <input type="text" id="mainAccount" class="form-control">
    <button class="btn" id="generate_button" type="button">Generate Overlay Link</button>
    </div><hr>
    <div id="overlaylink" class="hide"></div>
</div>
</div>

</body></html>