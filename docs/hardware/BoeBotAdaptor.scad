//$fn = 300;

PiSupportH = 10;
PiSupportD = 8;

PiSupportScrew = 3;
tolerance = 0.2;

module PiStud(){
difference(){
    
cylinder(d = PiSupportD, h = PiSupportH , center = true);
cylinder(d = PiSupportScrew+tolerance,h = PiSupportH , center = true);
   
}
}


module PiSupport2(){
        linear_extrude(height = 6, center = true, convexity = 10, twist = 0, slices = 20, scale = 1.0) hull(){circle(r=3/2-tolerance, center = true); translate([15.5-3-2*tolerance,0,0])   circle(r=3/2-tolerance,center = true);}
translate([15.5-10-3,0,0])difference(){

cube([10,20,3]);

translate([5,11,+PiSupportH/2])cylinder(d = PiSupportD+tolerance, h = PiSupportH , center = true);
}

}
PiSupport2();