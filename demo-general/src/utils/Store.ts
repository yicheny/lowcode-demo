class Store{
  private store: Storage; //做一层存储代理，方便替换，后期如果需要放到数据库，也方便处理
  private dict: Map<string, any>; //将数据放到内存中，极大提升IO速度

  constructor() {
      this.store = localStorage
      this.dict = new Map();
  }

  public get(key: string){
      if(!this.dict.get(key)) this.dict.set(key,safeParse(this.store.getItem(key)))
      return this.dict.get(key)
  }

  public set(key:string,data:any){
      this.dict.set(key,data)
      this.store.setItem(key,JSON.stringify(data))
  }

  public delete(key:string){
      this.dict.delete(key)
      this.store.removeItem(key)
  }

  public clear(){
      this.dict.clear();
      this.store.clear();
  }
}

function safeParse(d:any){
  if(typeof d === 'string') return JSON.parse(d)
  return null;
}

export const store = new Store();
export const LOGIN_KEY = 'login_info'
export const SCHEMA_ACTIVE_KEY = 'schema_active'
export const SCENARIO_NAME = "general"
