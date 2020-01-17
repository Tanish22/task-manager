const add = (a, b) => {
     return new Promise((resolve, reject) => {
         setTimeout(() => {
           if (a < 0 || b < 0) {
              reject("nos shld b pos");
           }
           resolve(a + b);
         }, 2000);         
     });     
}

const doSomething = async () => {
    const sum1 = await add(1, 2);
    const sum2 = await add(sum1, 2);
    const sum3 = await add(sum2, -2);

    return sum3;
}

doSomething().then((result) => {
    console.log(result);    
}).catch((error) => {
    console.log(error);    
})