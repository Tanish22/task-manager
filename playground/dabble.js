const add = (a, b) => {
    // return new Promise((resolve, reject) => {
    //     setTimeout(() => {
    //         resolve(a + b);
    //     }, 2000);
    // })
    resolve
}

const doWork = async () => {
    const sum = await add(2, 2);
    const sum1 = await add(sum, 2);
    const sum2 = await add(sum1, 2);
    const sum3 = await add(sum2, 2);
    const sum4 = await add(sum3, 2);
    
return sum4;    
}

doWork().then((result) => {
    console.log(result);    
}).catch((error) => {
    console.log(error);
})
