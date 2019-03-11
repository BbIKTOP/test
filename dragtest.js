window.onload = run;

function run()
{
    var cpd = new Drag(".drg", null, null, null, false, true);

    console.log("User agent="+navigator.userAgent);

    var bd;
    bd = document.getElementById("makeDrag");
    if (bd)
    {
        bd.addEventListener("click", function ()
        {
            new Drag("#draginternal", null, null, null, false);
        })
    }
    bd = document.getElementById("makeDragBody");
    if (bd)
    {
        bd.addEventListener("click", function ()
        {
            new Drag("#draginternal", null, null, null, true);
        })
    }

    var btn = document.getElementById("btn");
    if (btn && btn != null)
    {
        btn.addEventListener("click", function ()
        {
            var txt = document.getElementById("txtfld");
            txt.value += "Clicked! ";
        });
    }
    var btn = document.getElementById("b1");
    if (btn && btn != null)
    {
        btn.addEventListener("click", function ()
        {
            var n1 = parseFloat(document.getElementById("ti1").value);
            var n2 = parseFloat(document.getElementById("ti2").value);
            document.getElementById("ti1").value = n1;
            document.getElementById("ti2").value = n2;
            document.getElementById("ti3").value = n1 + n2;
        });
    }
}


