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

    <script>
        window.User = {
            id: {{ optional(auth()->user())->id }},
            name: "{{ optional(auth()->user())->name }}",
        }
    </script>

    <!--LIBRARIES -->
    <script src="https://cdn.jsdelivr.net/npm/axios/dist/axios.min.js"></script>
    <script src="//cdn.jsdelivr.net/npm/phaser@3.55.2/dist/phaser.min.js"></script>
    <script src="javascript/phaser-ui-tools.js"></script>

    <!--PREFABS -->
    <script src="prefabs/helper.js"></script>
    <script src="prefabs/Text.js"></script>

    <!--SCENES -->
    <script src="scenes/boot.js"></script>
    <script src="scenes/preload.js"></script>
    <script src="scenes/mainMap.js"></script>
    <script src="scenes/AquariumHouse.js"></script>
    <!--SCRIPTS -->
    <script src="javaScript/app.js"></script>
    <script src="javaScript/main.js"></script>

    <script>
        
    </script>
</head>

<body>
    <div id="phaser-app"></div>

</body>
</html>
