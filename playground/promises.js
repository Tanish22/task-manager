const add = (a, b) => {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve(a * b)
        }, 2000);
    })
}

// add(6, 2).then((sum) => {
//     console.log(sum);

//     add(sum, 10).then((sum2) => {
//         console.log(sum2);
        
//     }).catch((error) => {
//         console.log(error);        
//     })
// }).catch((error) => {
// console.log(error);
// })


        //  PROMISE CHAINING

add(2, 2).then((sum) => {
    console.log(sum);
    
    return add(sum, 10)
}).then((sum2) => {
    console.log(sum2);    
}).catch((error) => {
    console.log(error);    
})