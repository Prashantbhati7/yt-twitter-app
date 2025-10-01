class ApiError extends Error{
    constructor(statuscode,message="something went wrong !! ",errors=[],stack=""){
        super(message);
        this.statuscode=statuscode;
        this.errors = errors;
        this.data = null;
        this.message=message;
        this.success=false;


        if (stack){                     // For Production can ignore for now 
            this.stack = stack
        }else {
            Error.captureStackTrace(this,this.constructor);
        }
    }
};

export {ApiError}
