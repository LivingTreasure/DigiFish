var price = 'Price: ' + Math.floor((Math.random() * 100) + 1);
class Text {
    constructor(ctx, x, y, string, style, origin){
        this.ctx = ctx //contect, which scene it belongs to

        this.x = x;
        this.y = y;

        this.text = string;

        this.style = this.initStyle(style);
        this.origin = this.initOrigin(origin);

        this.obj = this.createText();
    }

    initStyle (key) {
        let style = {
            fontFamily : 'ClickPixel',
            fontSize : 10,
            color : '0xFFFFFF',
            align : 'center'
        };

        switch (key.toLowerCase()){
            case 'title':
                style.fontSize = 32;
                break;
            case 'userInterface':
                style.fontSize = 10;
                break;
        }

        return style;
    }

    initOrigin (origin) {
        if (typeof origin === 'number'){
            return {
                x : origin,
                y : origin

            };
        }
        else if (typeof origin === 'object'){
            return origin;
        }
        else {
            return {
                x : 0.5,
                y : 0.5
            };
        }

    }

    createText () {
        let obj = this.ctx.add.bitmapText(
            this.x,
            this.y,
            this.style.fontFamily,
            this.text,
            this.style.fontSize,
            this.style.align
        );

        obj.setOrigin(this.origin.x, this.origin.y);

        return obj;

    }

    destroy () {
        this.obj.destroy();

        this.obj = false;

    }

    setText (){
        this.text = ' ';
        this.obj.setText(' ');
    }

    setShop(){
        this.text = 'Shop';
        this.obj.setText('Shop');
    }

    setPrice(){
        this.fontSize = 8;
        this.text = price;
        this.obj.setText(price);
    }

    setX (x) {
        this.x = x;
        this.obj.setX(x);
    }

    setY (y) {
        this.y = y;
        this.obj.setY(y);
    }

    setOrigin (origin) {
        this.origin = this.initOrigin(origin);
        this.obj.setOrigin(origin);
    }

    setDepth (depth) {
        this.obj.setDepth(depth);
    }

    setScrollFactor (scrollX, scrollY) {
        this.obj.setScrollFactor(scrollX, scrollY);
    }

    getCenter () {
        return this.obj.getCenter();
    }

    getTopLeft () {
        return this.obj.getTopLeft();
    }

    getTopRight () {
        return this.obj.getTopRight();
    }

    getBottomLeft () {
        return this.obj.getBottomLeft();
    }

    getBottomRight () {
        return this.obj.getBottomRight();
    }

}