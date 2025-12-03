export default class User {
    private id:string;
    private name: string;
    private email:string;
    private password:string;

    constructor(id:string, name:string,email:string,password:string){

        if(!email) throw new Error('Email can not be empty')

        if(!name) throw new Error('Name can not be empty')    

        if(!password) throw new Error('Password can not be empty')    

        this.id = id,
        this.email = email,
        this.name = name,
        this.password = password
    }

    getId(){
        return this.id
    }

    getEmail(){
        return this.email
    }
    
    getName(){
        return this.name
    }

}