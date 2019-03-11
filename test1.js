

window.onload=init;


function init()
{
    new Drag("#drg");



    this.titleColor =
        new PickColor("cp1", "Цвет меню", "accentedColor", "img/icons/close.png", "img/icons/ok.png",
                      "img/icons/minus.png");

    U.addListener("#title", "dblclick", function()
    {
        self.titleColor.pick();
    });

}