var AudioVisualizer = {
    constructorFunc: function () {
        window.AudioContext = window.AudioContext || window.webkitAudioContext || window.mozAudioContext;

            var audio = document.getElementById('audio');
            audio.volume = 0.5;
            var ctx = new AudioContext();
            var analyser = ctx.createAnalyser();
            var audioSrc = ctx.createMediaElementSource(audio);
            audioSrc.connect(analyser);
            analyser.connect(ctx.destination);

            console.log(analyser.frequencyBinCount);
            var canvas = document.getElementById('visualizer'),
                cwidth = 1,
                cheight = 4,
                meterWidth = 2, //width of the meters in the spectrum
                gap = 8; //gap between meters

            var radius = 140;

            ctx = canvas.getContext('2d'),
                gradient = ctx.createLinearGradient(0, 0, 0, 300);

            function renderFrame() {

                var cx = canvas.width / 2;
                var cy = canvas.height / 2;
                var maxBarNum = Math.floor((radius * 2 * Math.PI) / (cwidth + gap));
                var frequencyData = new Uint8Array(analyser.frequencyBinCount);
                analyser.getByteFrequencyData(frequencyData);
                var slicedPercent = Math.floor((maxBarNum * 25) / 100);
                var barNum = maxBarNum - slicedPercent;
                var freqJump = Math.floor(frequencyData.length / maxBarNum);
                ctx.clearRect(0, 0, canvas.width, canvas.height);

                for (var i = 0; i < barNum; i++) {
                    var alfa = (i * 2 * Math.PI ) / maxBarNum;
                    var beta = (3 * 45 - meterWidth) * Math.PI / 180;
                    var amplitude = frequencyData[i * freqJump];
                    var y = radius - (amplitude / 6 - cheight);
                    var h = amplitude / 3 + cheight;
                    ctx.beginPath();
                    ctx.save();
                    ctx.translate(cx + 2, cy + 2);
                    ctx.rotate(alfa - beta);
                    ctx.shadowOffsetX = 3;
                    ctx.shadowOffsetY = 3;
                    ctx.shadowBlur = 10;
                    ctx.shadowColor = '#ffffff';
                    ctx.fillStyle = '#ffffff';
                    ctx.fillRect(0, y, meterWidth, h);
                    ctx.restore();
                    ctx.closePath();
                }
                requestAnimationFrame(renderFrame);
            }

            renderFrame();
            // console.log(ctx.fillStyle);


    },

    getRandomColor: function () {
        var colors = [
            '#0256c4',
            '#0013e9',
            '#4f70c4'
        ];
//        var letters = '0123456789ABCDEF';
//        var color = '#';
//        for (var i = 0; i < 6; i++ ) {
//            color += letters[Math.floor(Math.random() * 16)];
//        }
        var rndm = colors[Math.floor(colors.length * Math.random())];
        return rndm;
    },

    buttonPlay: function () {
        document.getElementById('play').onclick = function () {
            var audio = document.getElementById('audio');
            if(audio.paused == true){
                audio.play();
            }else{
                audio.pause();
            }
        };
    },

    currentTimeShow: function () {
        var audio = document.getElementById('audio');
        setInterval(function () {

            document.getElementById('currentTime').innerHTML = audio.currentTime.toString().toHHMMSS();
            document.getElementById('duration').innerHTML = audio.duration.toString().toHHMMSS();

        },30);

        String.prototype.toHHMMSS = function () {
            var sec_num = parseInt(this, 10); // don't forget the second param
            var hours   = Math.floor(sec_num / 3600);
            var minutes = Math.floor((sec_num - (hours * 3600)) / 60);
            var seconds = sec_num - (hours * 3600) - (minutes * 60);

            if (hours   < 10) {hours   = "0"+hours;}
            if (minutes < 10) {minutes = "0"+minutes;}
            if (seconds < 10) {seconds = "0"+seconds;}
            return hours+':'+minutes+':'+seconds;
        }
    },

    volumeControl: function () {
        var audio = document.getElementById('audio');
        document.getElementById('volumeControl').addEventListener('input', function () {
            var val = document.getElementById('volumeControl').value;
            audio.volume = val / 100;
        });
    },

   playBtnAnimation: function () {
       var playing = false;
       $('svg').click(function() {
           playing = !playing;
           var animation = playing ? 'stop' : 'play';
           $('#animate_to_' + animation).get(0).beginElement();
       });
   },

    progressBar: function () {
        setInterval(function () {
        var audio = document.getElementById('audio');
        var elapsedTime = Math.round(audio.currentTime);
        var canvas = document.getElementById('progressBar');


            if(canvas.getContext) {
                var ctx = canvas.getContext('2d');
                ctx.clearRect(0, 0, canvas.width, canvas.height);
                ctx.fillStyle = "rgba(10,100,255, 0.3)";
                var fWidth = (elapsedTime / audio.duration) * (canvas.width);
                console.log(fWidth);
                if(fWidth > 0) {
                    ctx.fillRect(0, 0, fWidth, canvas.height);
                }
            }
        }, 50);

    },

    displayTrackName: function () {
        var audio = document.getElementById('audio');
        console.log(audio.attributes.src.value);
        document.getElementById('trackName').innerHTML = audio.attributes.src.value;
    },

    changeTrack: function () {

        $('#audioFile').on('change', function (e) {
            console.log(this.files[0]);
            var file = URL.createObjectURL(this.files[0]);
            $('#audio').attr('src', file);
            $('#trackName').html(this.files[0].name);
        })

    },

    init: function () {
        this.constructorFunc();
        this.getRandomColor();
        this.buttonPlay();
        this.currentTimeShow();
        this.volumeControl();
        this.playBtnAnimation();
        this.progressBar();
        this.displayTrackName();
        this.changeTrack();
    }
};



window.onload = function (){
    AudioVisualizer.init();
};


