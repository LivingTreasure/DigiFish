<!DOCTYPE html>

<html>

<head>
    <title>DigiFish</title>

    <style>
        body {
          background-color: black;
          overflow: hidden;
        }

    </style>

    <meta name="csrf-token" content="{{ csrf_token() }}">

    <script src="js/app.js"></script>

    <!--LIBRARIES -->
    <script src="//cdn.jsdelivr.net/npm/phaser@3.55.2/dist/phaser.min.js"></script>
    <script src="javascript/phaser-ui-tools.js"></script>

    <!--PREFABS -->
    <script src="prefabs/helper.js"></script>
    <script src="prefabs/Text.js"></script>

    <!--SCENES -->
    <script src="scenes/boot.js"></script>
    <script src="scenes/preload.js"></script>
    <script src="scenes/mainMap.js"></script>

    <!--SCRIPTS -->
    <script src="javaScript/app.js"></script>
    <script src="javaScript/main.js"></script>

</head>

<body>
    <div id="phaser-app"></div>
    
</body>
</html>