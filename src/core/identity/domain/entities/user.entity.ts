export default class User {
    private _id:string;
    private _name: string;
    private _email:string;
    private _password:string;

    constructor(id:string, name:string,email:string,password:string){

        if(!email) throw new Error('Email can not be empty')

        if(!name) throw new Error('Name can not be empty')    

        if(!password) throw new Error('Password can not be empty')    

        this._id = id,
        this._email = email,
        this._name = name,
        this._password = password
    }

    get id(){
        return this._id
    }

    get email(){
        return this._email
    }
    
    get name(){
        return this._name
    }

}