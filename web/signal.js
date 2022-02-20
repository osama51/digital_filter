document.getElementById("chart").style.resize = "both";
        // var amp = Array(50861).fill(0.0);
        // var time = Array(50861).fill(0.0);
        // var newamp = Array(50861).fill(0.0);
        var amp = [];
        var time = [];
        var newamp = [];
        let flag = 0;
        let apply = false;
        var applied = 0;
        let accumulator = [];
        var filteredjs = []; 
        filteredjs.length = 0;
        // amp[0] = amp[1];
        // time[0] = 0;

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
        applied += 1; 
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
      }

      function readFile(file) {
        
        var reader = new FileReader();
        reader.readAsText(file);
        reader.onload = function(event){
          var csv = event.target.result;
          var data = $.csv.toArrays(csv);
          //var html = '';
          if (data[0][0] > 0.001){
            multiplier = 1000; //in case of an EMG/ECG signal
          }else{multiplier=1}
          for(var row in data) {
            time.push(data[row][0]*1);
            amp.push(data[row][1]*1);
          }
        };
        reader.onerror = function(){ alert('Unable to read ' + file.fileName); };
      }

      function readnewFile(file) {
        var reader = new FileReader();
        reader.readAsText(file);
        reader.onload = function(event){
          var csv = event.target.result;
          var data = $.csv.toArrays(csv);
          newamp.length = 0;
          for(var row in data) {
            newamp.push(data[row][0]*1.0);
          }
        };
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
        },
        margin: {
          l: 50,
          r: 50,
          b: 50,
          t: 50,
          pad: 4
        },
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
        },
        margin: {
          l: 50,
          r: 50,
          b: 50,
          t: 50,
          pad: 4
        },
      };
      

      Plotly.newPlot('chart',[{
          y: [],
          x: [],
          type:'scatter',
      }], layout3);

      Plotly.relayout('chart',{
              xaxis: {
                range: [-1,1000]
              }
            });

      Plotly.newPlot('chart2',[{
          y: [],
          x: [],
          type:'line'
      }], layout4);

      Plotly.relayout('chart2',{
              xaxis: {
                range: [-1,1000]
              }
            });
      var cnt = 0;
      let filter_samples = 61;
      let fetched = [];
      var x = true;
      setInterval( async function(){
        var slider = document.getElementById("myRange");
        const new_filter_samples = slider.value*1 + 11;
        const samples = 50;
        data = amp.slice((samples*cnt),((samples*cnt)+ 61));
        firstindex = (samples*cnt)-new_filter_samples;
        seecondindex = ((samples*cnt));

        eel.dfilter(data, apply);

        $.ajax({
          type: "GET",
          url: "filteredemg.csv",
          dataType: "text",
          success: function(data) {preparedata(data);}
        });

        var last_element = filteredjs.length - 1;

        // console.log('FIRST:', newamp[0], 'LAST:', newamp[newamp.length-1])
        // console.log('MIN:',Math.min(...filteredjs.slice(((filteredjs.length-1)- 700),(filteredjs.length - 1))),'MAX:',
        // Math.max(...filteredjs.slice(((filteredjs.length- 1)- 700),(filteredjs.length - 1))));
        // console.log(filteredjs);

        for(let n = 0; n < newamp.slice((11),(filter_samples)).length; n++){
          if(apply){
            filteredjs.push(newamp.slice((11),(filter_samples))[n]*1.0);
          };
        };
        if (flag){
          Plotly.extendTraces('chart',{ 
            y:[amp.slice((samples*cnt),(samples*cnt+samples))], 
            x:[time.slice((samples*cnt),((samples*cnt)+samples))]}, [0]);
            if(cnt > 10 && cnt < 200) {
              Plotly.relayout('chart',{
                xaxis: {
                  range: [time[samples*cnt-(10*samples)], time[samples*cnt]]
                }
              });
            }
            cnt++;

            Plotly.extendTraces('chart2',{
            y:[newamp.slice((11),(filter_samples))], 
            x:[time.slice((firstindex,seecondindex))]}, [0]);

            if(cnt > 11 && cnt < 200) {
          Plotly.relayout('chart2',{
            xaxis: {
              range: [time[(new_filter_samples-11)*cnt-(11*(new_filter_samples-11))], time[(new_filter_samples-11)*cnt]]
            },
            yaxis: {
              range: [
                Math.min(...filteredjs.slice(((filteredjs.length-1)- 700),(filteredjs.length - 1))) - 1,
                Math.max(...filteredjs.slice(((filteredjs.length- 1)- 700),(filteredjs.length - 1))) + 1] 
                // The Math.min() function actually expects a series of numbers, 
                // but it doesn't know how to handle an actual array, so it is blowing up.
                // You can resolve this by using the spread operator '...'

          }});

          }
        }
      },1000);