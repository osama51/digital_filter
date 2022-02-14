document.getElementById("chart").style.resize = "both";
        var amp = Array(50861).fill(0.0);
        var time = Array(50861).fill(0.0);
        var newamp = Array(50861).fill(0.0);
        let flag = 0;
        let apply = false;
        let accumulator = [];
        amp[0] = amp[1];
        time[0] = 0;

        //var total = Array(10000).fill(0.0);
      $(document).ready(function() {
          
        $('#files').bind('change', handleFileSelect);
        document.getElementById("files").onclick = handleFile;
        document.getElementById("apply").onclick = apply_filter;
                
        $.ajax({
          type: "GET",
          url: "filteredemg2.csv",
          dataType: "text",
          success: function(data) {preparedata(data);}
       });
        
      });

      function handleFile(){
        $('#files').bind('change', handleFileSelect);
      }
      function handleFileSelect(evt) {
        var files = evt.target.files; // FileList object
        var file = files[0];

        // read the file metadata
        // var output = ''
        //     output += '<span style="font-weight:bold;">' + escape(file.name) + '</span><br />\n';

        // read the file contents
        readFile(file); //case 1

        flag = 1;
        // post the results
        //$('#list').append(output);
      }

      function apply_filter(){
        eel.apply_filter()
        apply = true;
      }

      function openfiltered(){
        //eel.difference_equ_z(amp);
        eel.dfilter(amp);
        var fetcher = 0;
        console.log("openfiltered")

        for (i = 0; i>100; i++){
          console.log(fetcher);
          fetcher++;
        }
        $.ajax({
          type: "GET",
          url: "filteredemg.csv",
          dataType: "text",
          success: function(data) {preparedata(data);}
        });
      }
      
      function preparedata(data){        
        newfile = new Blob([data], {
          type: 'text/csv; charset=utf-8;' 
      });
        readnewFile(newfile);

        console.log('counter', 2, amp.slice((2),((2)+8)))
      }

      function readFile(file) {
        
        var reader = new FileReader();
        reader.readAsText(file);
        reader.onload = function(event){
          var csv = event.target.result;
          var data = $.csv.toArrays(csv);
          //var html = '';
          if (data[0][0] > 0.001){
            divider = 1000;
          }else{divider=1}
          for(var row in data) {
            time[row] = data[row][0]*divider;
            amp[row] = data[row][1]*1;
          }
        };
        reader.onerror = function(){ alert('Unable to read ' + file.fileName); };
      }

      function readnewFile(file) {
        //console.log(file)
        var reader = new FileReader();
        reader.readAsText(file);
        reader.onload = function(event){
          var csv = event.target.result;
          var data = $.csv.toArrays(csv);
          //console.log(data)
          //var html = '';
          // newamp = data;
          for(var row in data) {
            newamp[row] = data[row][0];
          }
        };
        // console.log(newamp)
        reader.onerror = function(){ alert('Unable to read ' + file.fileName); };
      }

      var layout3 = {
        title: 'Original Signal',
        xaxis: {
          title: 'Time',
          titlefont: {
            family: 'Arial, sans-serif',
            size: 12,
            color: 'black'
          },
          showticklabels: true,
          tickangle: 'auto',
          tickfont: {
            //family: 'Old Standard TT, serif',
            size: 10,
            //color: 'black'
          },
        },
        yaxis: {
          title: 'EMG Signal (V)',
          titlefont: {
            family: 'Arial, sans-serif',
            size: 12,
            color: 'black'
          },
          showticklabels: true,
          tickfont: {
            size: 10,
          },
        }
      };

      var layout4 = {
        title: 'Filtered Signal',
        xaxis: {
          title: 'Time',
          titlefont: {
            family: 'Arial, sans-serif',
            size: 12,
            color: 'black'
          },
          showticklabels: true,
          tickangle: 'auto',
          tickfont: {
            //family: 'Old Standard TT, serif',
            size: 10,
            //color: 'black'
          },
        },
        yaxis: {
          title: 'EMG Signal (V)',
          titlefont: {
            family: 'Arial, sans-serif',
            size: 12,
            color: 'black'
          },
          showticklabels: true,
          tickfont: {
            size: 10,
          },
        }
      };
      

      Plotly.newPlot('chart',[{
          y: [],
          x: [],

          type:'scatter',
          
      }], layout3);

      Plotly.relayout('chart',{
              xaxis: {
                range: [-1,2]
              }
            });

      Plotly.newPlot('chart2',[{
          y: [],
          x: [],
          
          type:'line'
      }], layout4);

      Plotly.relayout('chart2',{
              xaxis: {
                range: [-1,2]
              }
            });
      var cnt = 0;
          let filter_samples = 8;
      setInterval( function(){
        var slider = document.getElementById("myRange");
        const new_filter_samples = slider.value*1;
        const samples = 100;
        data = amp.slice((samples*cnt),((samples*cnt)+new_filter_samples));
        firstindex = (samples*cnt);
        seecondindex = ((samples*cnt)+new_filter_samples);
        // if (data.length < Math.max(zeros.length,poles.length)){
        //   accumulator += data;
        //   if(accumulator > Math.max(zeros.length,poles.length)){
        //     eel.dfilter(accumulator, apply);
        //     accumulator.length = 0
        //   }
        // }else{eel.dfilter(data, apply);}
        eel.dfilter(data, apply);
        //apply = false;
        $.ajax({
          type: "GET",
          url: "filteredemg.csv",
          dataType: "text",
          success: function(data) {preparedata(data);}
        });

        //let newsignal = 0;
        if (flag){
          Plotly.extendTraces('chart',{ y:[amp.slice((samples*cnt),(samples*cnt+samples))], x:[time.slice((samples*cnt),((samples*cnt)+samples))]}, [0]);
          cnt++;
          if(cnt > 20 && cnt < 10000) {
            Plotly.relayout('chart',{
              xaxis: {
                range: [time[samples*cnt-(20*samples)], time[samples*cnt]]
              }
            });
          }
          if (filter_samples/samples < cnt){
            Plotly.extendTraces('chart2',{ y:[newamp.slice((0),(filter_samples))], x:[time.slice((firstindex,seecondindex))]}, [0]);
              console.log('TIME', time[new_filter_samples*cnt-(20*new_filter_samples)]- time[new_filter_samples*cnt])
          if(cnt > 21 && cnt < 10000) {
            Plotly.relayout('chart2',{
              xaxis: {
                range: [time[new_filter_samples*cnt-(21*new_filter_samples)], time[new_filter_samples*cnt]]
              }
            });
          }
        }
      }
      filter_samples = new_filter_samples;
      },1000);