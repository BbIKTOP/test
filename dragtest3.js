
window.onload=run;

function run()
{

    var txt="";

    txt=document.body.innerHTML;
    txt=txt.replace(/[ \t]+/gm, " </div><div class=\"drg\">");
    txt="<div class=\"drg\">"+txt+"</div>";

    document.body.innerHTML=txt;

    new Drag(".drg");
}


