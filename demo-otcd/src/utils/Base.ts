class Base{
    public project:string

    static instance:Base

    static create(){
        if(!Base.instance) Base.instance = new Base()
        return Base.instance
    }

    private constructor() {
        this.project = ''
    }

}

//注：此实例必须全局唯一
export const base = Base.create();