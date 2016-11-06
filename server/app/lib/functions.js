    function rescale(x, in_min, in_max, out_min, out_max) {
        var output;
        output = (x - in_min) * (out_max - out_min) / (in_max - in_min) + out_min;
        //console.log(output);
        if (output < out_min) {
            output = out_min;
        } else if (output > out_max) {
            output = out_max;
        } else {
            //Nothing
        }

        return output

    }
  
   // exports ======================================================================
  //exports.timeStamp = timeStamp;
  exports.rescale = rescale;