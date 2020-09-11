export const ACTION = 'MODIFY_URL';
export const SET_USER_INFO = "SET_USER_INFO";
//require('@babel/polyfill');

export default {
    add(){
       return new Promise((resolve,reject)=>{
           setTimeout(() => {
               resolve(Math.floor(Math.random()*100000));
           }, 100);
       })
    },
    sub(arr){
        if (arr.includes(9)) {
            return true;
        }
    }
    
};
