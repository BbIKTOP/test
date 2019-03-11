window.onload = run;

function run()
{
    var divs = document.querySelectorAll(".browsersizes");

    new Drag(".browsersizes");

    for (i = 0; i < divs.length; i++)
    {
        var div = divs[i];

        var style = getComputedStyle(div);
        var rect = div.getBoundingClientRect();


        var str = "style: w=" + style.width + ", h=" + style.height +
            "<br>" +
            "rect: w=" + rect.width + ", h=" + rect.height +
            "<br>" +
            "offset: w=" + div.offsetWidth + ", h=" + div.offsetHeight +
            "<br>";
        div.innerHTML += str;

    }
}