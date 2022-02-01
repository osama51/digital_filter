var http = require('http');

a = [];
b = [];
wf = [0,1,2,3,4];
wp = [];
h_phase = [];
h_dB = [0,1,1.5,2,3];

$.getScript("draggable.js", function() {
    for (var i = 0; i < poles.length; i++){
        a[i] = math.complex((poles[i].x-150)/120,(poles[i].y-150)/120)
    }
    for (var i = 0; i < zeros.length; i++){
        b[i] = math.complex((zeros[i].x-150)/120,(zeros[i].y-150)/120)
    }
    wf, h_dB = eel.plot_freqz(b,a);
    wp, h_phase =eel.plot_phasez(b,a);
 });

 Plotly.newPlot('chart3',[{
    y: [h_dB],
    x: [wf],
    
    type:'scatter'
}]);

Plotly.relayout('chart3',{
        xaxis: {
          range: [0,3.2]
        }
      });

var cnt = 0;
setInterval(function(){

    Plotly.extendTraces('chart3',{ y:[h_dB], x:[wf]}, [0]);
    
},20);