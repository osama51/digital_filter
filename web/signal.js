document.getElementById("chart").style.resize = "both";
        var amp = Array(50861).fill(0.0);
        var time = Array(50861).fill(0.0);
        var newamp = Array(50861).fill(0.0);
        let flag = 0;
        amp[0] = amp[1];
        time[0] = 0;

        //var total = Array(10000).fill(0.0);
      $(document).ready(function() {
          
        $('#files').bind('change', handleFileSelect);
        $.ajax({
          type: "GET",
          url: "emg.csv",
          dataType: "text",
          success: function(data) {preparedata(data);}
       });
        
      });


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

      function openfiltered(){
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
          
          for(var row in data) {
            time[row] = data[row][0]*1000;
            amp[row] = data[row][1]*1000;
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
          title: 'EMG Signal (mV)',
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
          title: 'EMG Signal (mV)',
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
                range: [-1,500]
              }
            });

      Plotly.newPlot('chart2',[{
          y: [],
          x: [],
          
          type:'line'
      }], layout4);

      Plotly.relayout('chart2',{
              xaxis: {
                range: [-1,500]
              }
            });
              

      var cnt = 0;
      var fetcher = 0;
      

      setInterval( function(){
        if (fetcher>200){

          $.ajax({
            type: "GET",
            url: "filteredemg.csv",
            dataType: "text",
            success: function(data) {preparedata(data);}
         });
         fetcher = 0;
        }

      //   newfile = new Blob([data], {
      //     type: 'text/csv; charset=utf-8;' 
      // });
      //   readnewFile(newfile);

      

        //let newsignal = 0;
        if (flag){
          Plotly.extendTraces('chart',{ y:[amp.slice((8*cnt),(8*cnt+8))], x:[time.slice((8*cnt),(8*cnt+8))]}, [0]);
          
          if(cnt > 250 && cnt < 10000) {
            Plotly.relayout('chart',{
              xaxis: {
                range: [time[8*cnt-2000], time[8*cnt]]
              }
            });
          }
          if (fetcher >50){
            
            eel.difference_equ_z(amp);
            fetcher = 0;
          }
          fetcher++;
          console.log(fetcher)
          //if (fetcher > 299 ){
            // if (newsignal != 0){
              // console.log("IM INNNNNNN ")
              // fetcher = 0;
              //console.log(newsignal)
              
              Plotly.extendTraces('chart2',{ y:[newamp.slice((8*cnt),(8*cnt+8))], x:[time.slice((8*cnt),(8*cnt+8))]}, [0]);
              cnt++;
          if(cnt > 250 && cnt < 10000) {
            Plotly.relayout('chart2',{
              xaxis: {
                range: [time[8*cnt-2000], time[8*cnt]]
              }
            });
          }
            
          
        }
      },1);